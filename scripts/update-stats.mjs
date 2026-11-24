import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fetchProfileStats } from "./lib/github.mjs";
import { renderStats } from "./lib/stats.mjs";
import { readConfig } from "./lib/utils.mjs";

const [configArg = "profile.config.json", outArg = "dist"] = process.argv.slice(2);
const config = readConfig(resolve(configArg));
const outDir = resolve(outArg);
const login = config.stats?.username || config.github;

if (!login) throw new Error("Missing stats.username (or github) in profile.config.json");

const data = await fetchProfileStats(login);
mkdirSync(join(outDir, "assets"), { recursive: true });
writeFileSync(join(outDir, "assets", "stats.svg"), renderStats(data), "utf8");

console.log(`stats.svg updated for ${login} — ${data.updates} events, ${data.activeDays} active days`);
