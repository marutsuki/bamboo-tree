import * as fs from "fs";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import type { TreeNode } from "./tree.ts";

const templatePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../templates/index.ejs",
);

function renderTemplate(data: TreeNode, outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, str) => {
      if (err !== null) {
        console.error(err);
        reject(err);
        return;
      }
      console.info(`Writing rendered template to ${outputFile}`);
      fs.writeFileSync(outputFile, str);
      resolve();
    });
  });
}

export { renderTemplate };
