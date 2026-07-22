import { cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const standalone = fileURLToPath(new URL("../.next/standalone/", import.meta.url));
const staticSource = fileURLToPath(new URL("../.next/static/", import.meta.url));
const staticTarget = fileURLToPath(new URL("../.next/standalone/.next/static/", import.meta.url));
const publicSource = fileURLToPath(new URL("../public/", import.meta.url));
const publicTarget = fileURLToPath(new URL("../.next/standalone/public/", import.meta.url));

if (existsSync(standalone) && existsSync(staticSource)) {
  mkdirSync(staticTarget, { recursive: true });
  cpSync(staticSource, staticTarget, { recursive: true });
}

if (existsSync(standalone) && existsSync(publicSource)) {
  cpSync(publicSource, publicTarget, { recursive: true });
}

console.log(`Prepared standalone runtime at ${standalone.replace(root, "")}`);
