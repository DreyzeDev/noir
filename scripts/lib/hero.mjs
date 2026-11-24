import { clamp, esc, truncate } from "./utils.mjs";

function normalizeBadge(badge) {
  if (!badge) return null;
  const value = typeof badge === "string" ? { text: badge } : badge;
  if (!value || !value.text) return null;
  return {
    text: String(value.text),
    color: value.color || "#34d399",
    dot: value.dot !== false,
  };
}

export function renderHero(config = {}) {
  const name = String(config.name || "Your name").trim();
  const role = String(config.role || "Software developer").toUpperCase();
  const tagline = (Array.isArray(config.tagline) ? config.tagline : [config.tagline])
    .filter(Boolean)
    .slice(0, 2)
    .map(String);
  const metaTop = truncate(config.meta?.top ?? `Profile / ${new Date().getFullYear()}`);
  const metaBottom = truncate(config.meta?.bottom ?? "Made in the dark");
  const badge = normalizeBadge(config.badge);
  const initial = String(config.mark || name.trim()[0] || "N").slice(0, 1).toUpperCase();

  const nameSize = Math.round(clamp(676 / Math.max(name.length * 0.6, 1), 32, 112));
  const nameTracking = clamp(-nameSize * 0.05, -6.5, -3.5);
  const longestLine = Math.max(...tagline.map((line) => line.length), 1);
  const taglineSize = Math.round(clamp(600 / Math.max(longestLine * 0.53, 1), 12, 19));

  const badgeText = badge ? truncate(badge.text.toUpperCase(), 32) : "";
  const badgeWidth = badge ? Math.round(clamp(62 + badgeText.length * 8.2, 190, 330)) : 0;
  const badgeMarkup = badge
    ? `
    <g class="rise d4">
      <rect x="64" y="294" width="${badgeWidth}" height="36" rx="18" fill="#151515" stroke="#ffffff" stroke-opacity="0.08"/>
      ${
        badge.dot
          ? `<circle cx="85" cy="312" r="4" fill="${esc(badge.color)}"/>
      <circle cx="85" cy="312" r="4" fill="${esc(badge.color)}" class="ping"/>`
          : ""
      }
      <text x="${badge.dot ? 99 : 86}" y="316" font-size="10" font-weight="700" letter-spacing="1.9" fill="#d4d4d4">${esc(badgeText)}</text>
    </g>`
    : "";

  const taglineMarkup = tagline
    .map(
      (line, index) =>
        `<text x="65" y="${244 + index * 28}" font-size="${taglineSize}" font-weight="${index === 0 ? 500 : 400}" fill="${index === 0 ? "#a6a6a6" : "#6b6b6b"}">${esc(line)}</text>`,
    )
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="380" viewBox="0 0 1200 380" role="img" aria-labelledby="heroTitle heroDesc">
  <title id="heroTitle">${esc(name)} — ${esc(role.toLowerCase())}</title>
  <desc id="heroDesc">Dark hero card with the ${esc(name)} wordmark, a short introduction, a status badge and a monogram mark.</desc>
  <defs>
    <linearGradient id="wordmark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#8f8f8f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.11"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sweepFill" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="dotFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000000"/>
      <stop offset="0.45" stop-color="#a0a0a0"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <pattern id="dotGrid" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="1.2" fill="#ffffff" fill-opacity="0.055"/>
    </pattern>
    <mask id="dotMask">
      <rect width="1200" height="380" fill="url(#dotFade)"/>
    </mask>
  </defs>

  <style>
    .rise { animation: rise .95s cubic-bezier(.2,.9,.3,1) both; }
    .d1 { animation-delay: .05s; }
    .d2 { animation-delay: .15s; }
    .d3 { animation-delay: .25s; }
    .d4 { animation-delay: .35s; }
    .breathe { animation: breathe 8s ease-in-out infinite; }
    .ping { animation: ping 2.8s cubic-bezier(.2,.6,.3,1) infinite; transform-origin: 85px 312px; transform-box: view-box; }
    .spin { animation: spin 40s linear infinite; transform-origin: 972px 190px; transform-box: view-box; }
    .spin-rev { animation: spin 58s linear infinite reverse; transform-origin: 972px 190px; transform-box: view-box; }
    .sweep { animation: sweep 11s cubic-bezier(.4,0,.25,1) 1.4s infinite; }
    @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes breathe { 0%, 100% { opacity: .7; } 50% { opacity: 1; } }
    @keyframes ping { 0% { opacity: .75; transform: scale(1); } 70%, 100% { opacity: 0; transform: scale(2.6); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes sweep { 0% { transform: translateX(-240px); } 55%, 100% { transform: translateX(1500px); } }
    @media (prefers-reduced-motion: reduce) {
      .rise, .breathe, .ping, .spin, .spin-rev, .sweep { animation: none !important; }
    }
  </style>

  <rect width="1200" height="380" rx="28" fill="#0a0a0a"/>
  <rect width="1200" height="380" rx="28" fill="url(#dotGrid)" mask="url(#dotMask)" opacity="0.55"/>
  <circle cx="972" cy="176" r="196" fill="url(#glow)" class="breathe"/>

  <g transform="rotate(14 600 190)" aria-hidden="true">
    <g class="sweep">
      <rect x="-120" y="-170" width="230" height="720" fill="url(#sweepFill)"/>
    </g>
  </g>

  <rect x="0.5" y="0.5" width="1199" height="379" rx="27.5" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
  <line x1="752" y1="64" x2="752" y2="316" stroke="#ffffff" stroke-opacity="0.06"/>

  <g font-family="Inter, 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    <g class="rise d1">
      <text x="64" y="96" font-size="11.5" font-weight="600" letter-spacing="3.6" fill="#8a8a8a">${esc(role)}</text>
    </g>

    <g class="rise d2">
      <text x="62" y="198" font-size="${nameSize}" font-weight="800" letter-spacing="${nameTracking.toFixed(1)}" fill="url(#wordmark)">${esc(name)}</text>
    </g>

    <g class="rise d3">
      ${taglineMarkup}
    </g>

    ${badgeMarkup}

    <g class="rise d3" aria-hidden="true">
      <circle cx="972" cy="190" r="146" fill="none" stroke="#ffffff" stroke-opacity="0.05"/>
      <circle cx="972" cy="190" r="86" fill="none" stroke="#ffffff" stroke-opacity="0.07"/>

      <g class="spin">
        <circle cx="972" cy="190" r="118" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-dasharray="1.5 8"/>
        <circle cx="972" cy="310" r="2.2" fill="#ffffff" fill-opacity="0.55"/>
      </g>

      <g class="spin-rev">
        <circle cx="972" cy="70" r="3" fill="#ffffff"/>
        <circle cx="972" cy="70" r="10" fill="#ffffff" fill-opacity="0.12"/>
      </g>

      <text x="972" y="192" text-anchor="middle" dominant-baseline="central" font-size="168" font-weight="250" fill="none" stroke="#f2f2f2" stroke-width="2" stroke-linejoin="round">${esc(initial)}</text>

      <text x="1136" y="66" text-anchor="end" font-size="9.5" font-weight="600" letter-spacing="2.4" fill="#6b6b6b">${esc(metaTop.toUpperCase())}</text>
      <text x="1136" y="318" text-anchor="end" font-size="9.5" font-weight="600" letter-spacing="2.4" fill="#6b6b6b">${esc(metaBottom.toUpperCase())}</text>
    </g>
  </g>
</svg>
`;
}
