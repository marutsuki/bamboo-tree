#!/usr/bin/env node
import { Command } from "commander";
import { createNiceTree } from "./index.js";

const program = new Command();
program
  .option("--root <root>", "root directory for the tree", process.cwd())
  .option(
    "--name <name>",
    "name of the directory tree (default: Directory)",
    "Directory",
  )
  .option(
    "--output <output>",
    "output file for the rendered HTML",
    "index.html",
  )
  .option(
    "--exclude <exclude>",
    "comma-separated list of files/directories to exclude (default: .git)",
    ".git",
  )
  .parse(process.argv);

const options = program.opts();
createNiceTree({
  root: options.root,
  name: options.name,
  outputFile: options.output,
  exclude: options.exclude
    .split(",")
    .map((entry: string) => entry.trim())
    .filter(Boolean),
});
