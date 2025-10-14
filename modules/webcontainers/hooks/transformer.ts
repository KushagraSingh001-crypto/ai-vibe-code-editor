import { FileSystemTree } from '@webcontainer/api';
import { TemplateFolder, TemplateItem } from '@/modules/playground/lib/path-to-json';

// Define the structure for a file node locally
interface WebContainerFile {
  file: {
    contents: string | Uint8Array;
  };
}

/**
 * Recursively processes an array of template items (files and folders)
 * and converts them into the WebContainer FileSystemTree format.
 *
 * @param {TemplateItem[]} items - The array of files and folders to process.
 * @returns {FileSystemTree} The file system tree for the WebContainer.
 */
function processItems(items: TemplateItem[]): FileSystemTree {
  const fileSystem: FileSystemTree = {};

  for (const item of items) {
    if ("folderName" in item) {
      // It's a directory
      fileSystem[item.folderName] = {
        directory: processItems(item.items), // Recurse into the subdirectory
      };
    } else {
      // It's a file
      const fileName = `${item.filename}${item.fileExtension ? `.${item.fileExtension}` : ''}`;
      fileSystem[fileName] = {
        file: {
          contents: item.content,
        },
      } as WebContainerFile;
    }
  }
  return fileSystem;
}

/**
 * Transforms the root template folder structure into the format required
 * by the WebContainer's `mount` method.
 *
 * It takes the `items` from the root template folder and uses them to construct
 * the root of the virtual file system.
 *
 * @param {TemplateFolder} template - The root template folder object.
 * @returns {FileSystemTree} The complete file system tree.
 */
export function transformToWebContainerFormat(template: TemplateFolder): FileSystemTree {
  if (!template || !template.items) {
    return {};
  }
  // We process the `items` of the root folder, not the root folder itself,
  // to ensure its contents are mounted at the root of the container.
  return processItems(template.items);
}