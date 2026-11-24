import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fetchProfileStats } from "./lib/github.mjs";
import { renderHero } from "./lib/hero.mjs";
import { renderIcon, resolveIcon } from "./lib/icons.mjs";
import { renderRule } from "./lib/ornaments.mjs";
import { renderReadme } from "./lib/readme.mjs";
import { renderStats, renderStatsPlaceholder } from "./lib/stats.mjs";
import { readConfig } from "./lib/utils.mjs";

const [configArg = "profile.config.json", outArg = "dist"] = process.argv.slice(2);
const configPath = resolve(configArg);
const outDir = resolve(outArg);
const assetsDir = join(outDir, "assets");
const projectsDir = join(assetsDir, "projects");

const config = readConfig(configPath);

if (!config.name) throw new Error("profile.config.json must include a name");

mkdirSync(projectsDir, { recursive: true });

writeFileSync(join(outDir, "README.md"), renderReadme(config), "utf8");
writeFileSync(join(assetsDir, "hero.svg"), renderHero(config), "utf8");
writeFileSync(join(assetsDir, "rule.svg"), renderRule(), "utf8");

const icons = new Set((config.projects || []).map((project) => resolveIcon(project.icon)));
for (const icon of icons) {
  writeFileSync(join(projectsDir, `${icon}.svg`), renderIcon(icon), "utf8");
}

const login = config.stats?.username || config.github;
const statsPath = join(assetsDir, "stats.svg");

if (login) {
  try {
    const data = await fetchProfileStats(login);
    writeFileSync(statsPath, renderStats(data), "utf8");
    console.log(`stats      ${login} — ${data.updates} events, ${data.activeDays} active days`);
  } catch (error) {
    console.warn(`stats      skipped: ${error.message}`);
    if (!existsSync(statsPath)) writeFileSync(statsPath, renderStatsPlaceholder(login), "utf8");
  }
} else if (!existsSync(statsPath)) {
  writeFileSync(statsPath, renderStatsPlaceholder("PROFILE"), "utf8");
}

const relative = outDir.replace(process.cwd(), "").replace(/^[\\/]/, "");
console.log(`built      ${config.name} → ${relative || "."}`);
console.log(`           README.md, assets/hero.svg, assets/rule.svg, assets/stats.svg, ${icons.size} icon${icons.size === 1 ? "" : "s"}`);
