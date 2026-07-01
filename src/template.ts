import * as fs from "fs";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import type { TreeNode } from "./tree.ts";

const templatePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../templates/index.ejs",
);

function renderTemplate(
  data: TreeNode,
  name: string,
  outputFile: string,
): Promise<void> {
  // Re-order nodes so that directories come before files, for better visual representation in the HTML.
  data = sortTree(structuredClone(data));
  data = clearEmptyDirectories(data);
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { root: data, name }, (err, str) => {
      if (err !== null) {
        console.error(err);
        reject(err);
        return;
      }
      console.info(`Writing rendered template to ${outputFile}`);
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, str);
      resolve();
    });
  });
}

/**
 * Recursively sorts the tree nodes so that directories come before files, and sorts them alphabetically by name.
 *
 * @param node - The root node of the tree to sort.
 * @returns The sorted tree node.
 */
function sortTree(node: TreeNode): TreeNode {
  if (node.type === "directory" && node.children) {
    node.children.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "directory" ? -1 : 1;
    });
    node.children = node.children.map(sortTree);
  }
  return node;
}

function clearEmptyDirectories(node: TreeNode): TreeNode {
  if (node.type === "directory" && node.children) {
    node.children = node.children
      .map(clearEmptyDirectories)
      .filter(
        (child) =>
          child.type !== "directory" ||
          (child.children && child.children.length > 0),
      );
  }
  return node;
}

export { renderTemplate };
