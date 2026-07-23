import { spawnSync } from "node:child_process";

const buildFallbacks = {
  DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/afrigate_build",
  DIRECT_URL: "postgresql://postgres:postgres@127.0.0.1:5432/afrigate_build",
  NEXT_PUBLIC_SUPABASE_URL: "https://build-placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "build-placeholder-publishable-key",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
};

const missing = [];
for (const [name, fallback] of Object.entries(buildFallbacks)) {
  if (!process.env[name]) {
    process.env[name] = fallback;
    missing.push(name);
  }
}

if (missing.length > 0) {
  console.warn(
    `[AfriGate build] Missing deployment environment variables: ${missing.join(", ")}. ` +
      "Using non-secret build placeholders so the public corporate site can compile. " +
      "Authentication, database writes and protected workspace features still require real production values.",
  );
}

const runner = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, args) {
  const result = spawnSync(runner, [command, ...args], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("prisma", ["generate"]);
run("next", ["build"]);
