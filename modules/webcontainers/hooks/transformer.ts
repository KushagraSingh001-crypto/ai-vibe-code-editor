// FILE: modules/webcontainers/hooks/transformer.ts
import { FileSystemTree } from '@webcontainer/api';
import { TemplateFolder, TemplateItem } from '@/modules/playground/lib/path-to-json';

function processItems(items: TemplateItem[]): FileSystemTree {
  const fileSystem: FileSystemTree = {};

  for (const item of items) {
    if ("folderName" in item) {
      fileSystem[item.folderName] = {
        directory: processItems(item.items),
      };
    } else {
      const fileName = `${item.filename}${item.fileExtension ? `.${item.fileExtension}` : ''}`;
      fileSystem[fileName] = {
        file: {
          contents: item.content,
        },
      };
    }
  }
  return fileSystem;
}

export function transformToWebContainerFormat(template: TemplateFolder): FileSystemTree {
  if (!template || !template.items) {
    return {};
  }
  // This version mounts the *contents* of the repo at the root.
  return processItems(template.items);
}