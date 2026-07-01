import { renderTemplate } from "./template.ts";
import { getDirectoryTree } from "./tree.ts";

export type NiceTreeOptions = Partial<{
  root: string;
  name: string;
  outputFile: string;
  exclude: string[];
}>;

const defaultOptions: Required<NiceTreeOptions> = {
  root: process.cwd(),
  name: "Directory",
  outputFile: "index.html",
  exclude: [".git"],
};

export function createNiceTree(options: NiceTreeOptions = {}): Promise<void> {
  const opts = { ...defaultOptions, ...options };

  console.info(`Creating a nice tree for directory: ${opts.root}`);

  const tree = getDirectoryTree(opts.root, opts.exclude);

  return renderTemplate(tree, opts.name, opts.outputFile);
}
