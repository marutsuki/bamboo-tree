import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { renderTemplate } from "./template.ts";
import type { TreeNode } from "./tree.ts";

function createTempDirectory(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "nice-tree-template-"));
}

test("renderTemplate resolves and writes HTML for a nested directory tree", async () => {
  const tempDirectory = createTempDirectory();
  const outputFile = path.join(tempDirectory, "dist", "index.html");
  const tree: TreeNode = {
    name: "Project",
    type: "directory",
    path: "",
    children: [
      {
        name: "docs",
        type: "directory",
        path: "docs",
        children: [
          {
            name: "guide.md",
            type: "file",
            path: "docs/guide.md",
          },
        ],
      },
      {
        name: "README.md",
        type: "file",
        path: "README.md",
      },
    ],
  };

  await assert.doesNotReject(() => renderTemplate(tree, outputFile));

  assert.ok(
    fs.existsSync(outputFile),
    "expected the rendered HTML file to exist",
  );

  const html = fs.readFileSync(outputFile, "utf8");
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<title>Project<\/title>/i);
  assert.match(html, /class="tree"/i);
  assert.match(html, /📁/);
  assert.match(html, /📄/);
  assert.match(html, /docs/);
  assert.match(html, /guide\.md/);
});

test("renderTemplate writes a sane HTML document for a single file node", async () => {
  const tempDirectory = createTempDirectory();
  const outputFile = path.join(tempDirectory, "index.html");
  const tree: TreeNode = {
    name: "package.json",
    type: "file",
    path: "package.json",
  };

  await assert.doesNotReject(() => renderTemplate(tree, outputFile));

  const html = fs.readFileSync(outputFile, "utf8");
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<title>package\.json<\/title>/i);
  assert.match(html, /package\.json/);
  assert.match(html, /📄/);
});
