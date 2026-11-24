import { esc, fmt } from "./utils.mjs";

const CELL = 12;
const GAP = 4;

function formatDay(iso, options) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

export function renderStats(data) {
  const { login, repos, followers, updates, activeDays, since, days, counts, generated } = data;
  const columns = Math.ceil(days.length / 7);
  const gridWidth = columns * CELL + (columns - 1) * GAP;
  const gridX = 1152 - gridWidth;
  const gridY = 94;
  const peak = Math.max(0, ...counts);
  const shades = ["#151515", "#2f2f2f", "#555555", "#8c8c8c", "#e9e9e9"];
  const levelOf = (count) => {
    if (!count) return 0;
    return Math.min(4, Math.max(1, Math.ceil((count / Math.max(peak, 1)) * 4)));
  };

  const cells = counts
    .map((count, index) => {
      const x = gridX + Math.floor(index / 7) * (CELL + GAP);
      const y = gridY + (index % 7) * (CELL + GAP);
      const day = days[index];
      return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${shades[levelOf(count)]}"><title>${count} event${count === 1 ? "" : "s"} on ${day}</title></rect>`;
    })
    .join("");

  const rangeLabel = `${formatDay(days[0], { month: "short", day: "numeric" }).toUpperCase()} — ${formatDay(days.at(-1), { month: "short", day: "numeric" }).toUpperCase()}`;
  const stamp = formatDay(generated, { month: "short", day: "numeric", year: "numeric" }).toUpperCase();

  const stat = (x, value, label) => `
    <text x="${x}" y="142" font-size="44" font-weight="700" letter-spacing="-1.5" fill="#f5f5f5">${esc(fmt.format(value))}</text>
    <text x="${x}" y="168" font-size="10" font-weight="600" letter-spacing="2" fill="#7d7d7d">${esc(label)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-labelledby="statsTitle">
  <title id="statsTitle">GitHub metrics for ${esc(login)}: ${fmt.format(repos)} public repositories, ${fmt.format(followers)} followers, ${fmt.format(updates)} public events and ${activeDays} active days in the last 90 days.</title>
  <defs>
    <radialGradient id="warm" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="300" rx="28" fill="#0a0a0a"/>
  <rect width="1200" height="300" rx="28" fill="url(#fade)"/>
  <circle cx="1120" cy="20" r="260" fill="url(#warm)"/>
  <rect x="0.5" y="0.5" width="1199" height="299" rx="27.5" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>

  <g font-family="Inter, 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    <text x="48" y="56" font-size="10.5" font-weight="600" letter-spacing="3" fill="#7d7d7d">GITHUB / LIVE METRICS</text>
    <text x="1152" y="56" text-anchor="end" font-size="10.5" font-weight="600" letter-spacing="3" fill="#7d7d7d">LAST 90 DAYS</text>

    ${stat(48, repos, "PUBLIC REPOS")}
    ${stat(222, followers, "FOLLOWERS")}
    ${stat(396, updates, "PUBLIC EVENTS")}
    ${stat(570, activeDays, "ACTIVE DAYS")}

    <text x="48" y="212" font-size="13" fill="#6f6f6f">Shipping since ${since}. Most work lives in private repositories.</text>

    <line x1="736" y1="84" x2="736" y2="226" stroke="#ffffff" stroke-opacity="0.06"/>
    <g>${cells}</g>
    <text x="${gridX}" y="${gridY + 7 * (CELL + GAP) + 16}" font-size="10" font-weight="600" letter-spacing="1.5" fill="#7d7d7d">${esc(rangeLabel)}</text>

    <line x1="48" y1="250" x2="1152" y2="250" stroke="#ffffff" stroke-opacity="0.06"/>
    <text x="48" y="274" font-size="10" font-weight="600" letter-spacing="1.8" fill="#666666">AUTO-UPDATED ${esc(stamp)}</text>
    <text x="1152" y="274" text-anchor="end" font-size="10" font-weight="600" letter-spacing="2.2" fill="#666666">${esc(String(login).toUpperCase())} / GITHUB</text>
  </g>
</svg>
`;
}

export function renderStatsPlaceholder(login) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-label="Stats waiting for the first sync">
  <rect width="1200" height="300" rx="28" fill="#0a0a0a"/>
  <rect x="0.5" y="0.5" width="1199" height="299" rx="27.5" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
  <g font-family="Inter, 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    <text x="48" y="56" font-size="10.5" font-weight="600" letter-spacing="3" fill="#7d7d7d">GITHUB / LIVE METRICS</text>
    <text x="48" y="140" font-size="34" font-weight="700" letter-spacing="-1" fill="#f5f5f5">Waiting for the first sync.</text>
    <text x="48" y="176" font-size="13" fill="#6f6f6f">Run the stats script with network access — or enable the included GitHub Action.</text>
    <line x1="48" y1="250" x2="1152" y2="250" stroke="#ffffff" stroke-opacity="0.06"/>
    <text x="48" y="274" font-size="10" font-weight="600" letter-spacing="2.2" fill="#666666">${esc(String(login || "PROFILE").toUpperCase())} / GITHUB</text>
    <text x="1152" y="274" text-anchor="end" font-size="10" font-weight="600" letter-spacing="2.2" fill="#666666">NOIR</text>
  </g>
</svg>
`;
}
