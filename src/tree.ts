import * as fs from "fs";
import * as path from "path";

/**
 * Represents a node in the directory tree.
 */
type TreeNode = {
  /** The name of the node. */
  name: string;
  /** The type of the node, either "file" or "directory". */
  type: "file" | "directory";
  /** The path of the node. */
  path: string;
  /** The children of the node, if it is a directory. */
  children?: TreeNode[];
};

/**
 * Recursively builds a tree structure representing the directory contents.
 *
 * @param rootPath - The path of the directory to build the tree from.
 * @param excludedPaths - A list of directory names or relative paths to exclude.
 * @returns A TreeNode representing the directory and its contents.
 */
function getDirectoryTree(
  rootPath: string,
  excludedPaths: string[] = [".git"],
): TreeNode {
  const tree = getSubDirectoryTree(rootPath, rootPath, excludedPaths);

  if (tree === null) {
    return {
      name: path.basename(rootPath),
      type: "directory",
      path: "",
      children: [],
    };
  }

  return tree;
}

function getSubDirectoryTree(
  dirPath: string,
  rootPath: string,
  excludedPaths: string[],
): TreeNode | null {
  const name = path.basename(dirPath);
  const stats = fs.statSync(dirPath);
  // We need the relative path so that the links in the generated HTML works for web servers.
  const relativePath = path.relative(rootPath, dirPath).replace(/\\/g, "/");

  const shouldExclude = excludedPaths.some((excludedPath) => {
    const normalizedExcludedPath = excludedPath.replace(/\\/g, "/");
    return (
      relativePath === normalizedExcludedPath ||
      relativePath.startsWith(`${normalizedExcludedPath}/`) ||
      name === normalizedExcludedPath
    );
  });

  if (shouldExclude) {
    return null;
  }

  if (stats.isDirectory()) {
    const node: TreeNode = { name, type: "directory", path: relativePath };
    const files = fs.readdirSync(dirPath);

    node.children = files
      .map((file) => {
        return getSubDirectoryTree(
          path.join(dirPath, file),
          rootPath,
          excludedPaths,
        );
      })
      .filter((child): child is TreeNode => child !== null);

    return node;
  }

  return { name, type: "file", path: relativePath };
}

export type { TreeNode };
export { getDirectoryTree };
