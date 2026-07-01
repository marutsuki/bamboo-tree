import { renderTemplate } from "./template.ts";
import { getDirectoryTree } from "./tree.ts";

export type NiceTreeOptions = {
  root?: string;
  outputFile?: string;
};

const defaultOptions: Required<NiceTreeOptions> = {
  root: process.cwd(),
  outputFile: "index.html",
};

export function createNiceTree(options: NiceTreeOptions = {}): Promise<void> {
  const opts = { ...defaultOptions, ...options };

  console.info(`Creating a nice tree for directory: ${opts.root}`);

  const tree = getDirectoryTree(opts.root);

  return renderTemplate(tree, opts.outputFile);
}
