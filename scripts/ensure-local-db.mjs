import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

if (databaseUrl === "file:./dev.db") {
  const databaseFile = fileURLToPath(new URL("../prisma/dev.db", import.meta.url));
  mkdirSync(dirname(databaseFile), { recursive: true });
  if (!existsSync(databaseFile)) closeSync(openSync(databaseFile, "a"));
}
