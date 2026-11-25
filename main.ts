// Entry program for the make.fun bounty "u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad".
// The entry itself is my X spotlight post about @crisxai5, an AI and crypto
// expert on X, with a photo of my own attached and my play code in its text.
// This program only hands that post's address to the grader: it copies
// POST.json from the repository root into the output directory, nothing more.
// Node 22, standard library only. No network, no secrets, no model calls.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const fileName = "POST.json";

const sourcePath = join(botDir, fileName);
if (!existsSync(sourcePath)) {
  console.error(`missing ${fileName} in ${botDir}`);
  process.exit(1);
}

let postUrl: string;
try {
  const parsed: unknown = JSON.parse(readFileSync(sourcePath, "utf8"));
  if (typeof parsed !== "object" || parsed === null || typeof (parsed as { url?: unknown }).url !== "string") {
    throw new Error(`${fileName} has no url field`);
  }
  postUrl = (parsed as { url: string }).url;
} catch (err) {
  console.error(`${fileName} could not be read: ${(err as Error).message}`);
  process.exit(1);
}
if (!postUrl.startsWith("https://x.com/") && !postUrl.startsWith("https://twitter.com/")) {
  console.error(`${fileName} does not name an X post URL: ${postUrl}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(sourcePath, join(outDir, fileName));
console.log(`wrote ${join(outDir, fileName)} for ${postUrl}`);
