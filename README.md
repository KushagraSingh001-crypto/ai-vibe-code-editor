🚀 VibeCode Editor: An Intelligent, Web-Based Code Playground
VibeCode Editor is a next-generation, in-browser IDE built with Next.js, offering a complete development environment right in your web browser. Powered by WebContainers, it provides a live-running Node.js server, an interactive terminal, and a powerful AI assistant to supercharge your coding workflow. From instant project scaffolding to importing full GitHub repositories, VibeCode is designed to make coding more accessible, intelligent, and efficient.

✨ Key Features
⚡ In-Browser IDE: A feature-rich editor powered by Monaco Editor (the same editor as VS Code) with a full file explorer, tabs, and an interactive terminal.



🖥️ Live Previews: Run Node.js servers entirely within the browser thanks to WebContainers, giving you a real-time preview of your application as you code.


🧠 AI-Powered Assistant:

Code Suggestions: Get intelligent, context-aware code completions as you type.

AI Chat: A dedicated chat panel to review, debug, and optimize your code by conversing with an AI.


📂 Project Templates: Instantly create new coding playgrounds from a variety of pre-configured templates, including React, Next.js, Vue, Angular, Express, and Hono.

📦 GitHub Integration: Open and run any public GitHub repository directly in the editor by simply providing the URL.


👤 Authentication: Secure user authentication with NextAuth.js, supporting Google and GitHub providers.

📊 Project Dashboard: A personalized dashboard to manage all your projects, add new ones, and mark your favorites for quick access.

🛠️ Tech Stack
Framework: Next.js 15 (App Router with Turbopack) 

Language: TypeScript 

Styling: Tailwind CSS with shadcn/ui components 


Database: MongoDB with Prisma ORM 

Authentication: NextAuth.js (v5) 

In-Browser Environment: WebContainers API 

Editor: Monaco Editor 

Terminal: Xterm.js 

State Management: Zustand 

AI Backend: Ollama with codellama:7b model 


🏁 Getting Started
Follow these steps to set up and run the project on your local machine.

Prerequisites

Node.js (v18 or later)

npm, yarn, or pnpm

A running MongoDB instance

Ollama installed for AI features

1. Clone the Repository

Bash
git clone https://github.com/kushagrasingh001/crypto-ai-vibe-code-editor.git
cd crypto-ai-vibe-code-editor
2. Install Dependencies

Bash
npm install
3. Set Up Environment Variables

Create a file named .env in the root of the project and add the following variables.

Code snippet
# MongoDB Connection String
DATABASE_URL="your_mongodb_connection_string"

# NextAuth.js Secrets (generate a secret using `openssl rand -base64 32`)
AUTH_SECRET="your_nextauth_secret"

# GitHub Auth Provider
AUTH_GITHUB_ID="your_github_oauth_client_id"
AUTH_GITHUB_SECRET="your_github_oauth_client_secret"

# Google Auth Provider
AUTH_GOOGLE_ID="your_google_oauth_client_id"
AUTH_GOOGLE_SECRET="your_google_oauth_client_secret"

# GitHub Token (for importing repos)
# Create a personal access token with 'public_repo' scope
GITHUB_TOKEN="your_github_personal_access_token"
4. Set Up the Database

Generate the Prisma client and push the schema to your MongoDB database.

Bash
npx prisma generate
npx prisma db push
5. Set Up the AI Assistant (Ollama)

The AI features connect to a local Ollama instance.

Install and run Ollama by following the instructions on their website.

Pull the codellama:7b model, which is used by this project for chat and code completion.

Bash
ollama run codellama:7b
(Ensure Ollama is running before starting the application.)

6. Run the Development Server

Start the Next.js application.

Bash
npm run dev
Open http://localhost:3000 in your browser to see the application running.

Note: The WebContainer functionality requires a secure browser context. Ensure you are running on localhost or an HTTPS-enabled domain.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature).

Make your changes.

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.
