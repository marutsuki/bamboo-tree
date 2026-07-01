import { renderTemplate } from "./template.ts";
import { getDirectoryTree } from "./tree.ts";

export type NiceTreeOptions = {
  root?: string;
};

const defaultOptions: Required<NiceTreeOptions> = {
  root: process.cwd(),
};

export function createNiceTree(options: NiceTreeOptions = {}): Promise<void> {
  const opts = { ...defaultOptions, ...options };

  console.info(`Creating a nice tree for directory: ${opts.root}`);

  const tree = getDirectoryTree(opts.root);

  return renderTemplate(tree, "tree.html");
}
