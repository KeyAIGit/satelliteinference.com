#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { generatePendingResult } from "../lib/pending-result.mjs";

export async function generatePendingResultFromFile(configPath) {
  const config = JSON.parse(await readFile(resolve(configPath), "utf8"));
  return generatePendingResult(config);
}

async function main() {
  const [, , configPath, outputPath] = process.argv;
  if (!configPath) {
    throw new TypeError("usage: generate-pending-result.mjs <workload-config.json> [output.json]");
  }
  const result = await generatePendingResultFromFile(configPath);
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) {
    await writeFile(resolve(outputPath), serialized, "utf8");
  } else {
    process.stdout.write(serialized);
  }
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? "")).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
