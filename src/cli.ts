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
  .parse(process.argv);

const options = program.opts();
createNiceTree({
  root: options.root,
  name: options.name,
  outputFile: options.output,
});
