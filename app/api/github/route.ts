import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { TemplateFolder, TemplateFile } from "@/modules/playground/lib/path-to-json";

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // It's recommended to use a token to avoid rate limiting
});

// Helper function to parse GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
}

// Recursive function to fetch repository contents
async function fetchRepoContents(owner: string, repo: string, path: string = ""): Promise<(TemplateFile | TemplateFolder)[]> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if (!Array.isArray(data)) {
    return [];
  }

  const contents: (TemplateFile | TemplateFolder)[] = [];

  for (const item of data) {
    if (item.type === "file") {
      const fileContentResponse = await octokit.repos.getContent({
        owner,
        repo,
        path: item.path,
      });

      // @ts-ignore-error
      const content = Buffer.from(fileContentResponse.data.content, "base64").toString("utf-8");
      
      const pathParts = item.name.split(".");
      const fileExtension = pathParts.pop() || "";
      const filename = pathParts.join(".");

      contents.push({
        filename,
        fileExtension,
        content,
      });
    } else if (item.type === "dir") {
      contents.push({
        folderName: item.name,
        items: await fetchRepoContents(owner, repo, item.path),
      });
    }
  }

  return contents;
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoUrl } = await req.json();
    const repoInfo = parseGitHubUrl(repoUrl);

    if (!repoInfo) {
      return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 });
    }

    const { owner, repo } = repoInfo;

    const items = await fetchRepoContents(owner, repo);

    const templateData: TemplateFolder = {
      folderName: repo,
      items,
    };

    // Create a new playground entry in the database
    const newPlayground = await db.playground.create({
      data: {
        title: repo,
        description: `GitHub repository: ${owner}/${repo}`,
        template: "GITHUB", // You might want to add GITHUB to your Templates enum
        userId: user.id,
        TemplateFile: {
          create: {
            content: JSON.stringify(templateData),
          },
        },
      },
    });

    return NextResponse.json(newPlayground);
  } catch (error) {
    console.error("Error fetching repository:", error);
    return NextResponse.json({ error: "Failed to fetch repository from GitHub" }, { status: 500 });
  }
}