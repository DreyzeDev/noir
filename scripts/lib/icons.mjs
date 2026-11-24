const GLYPHS = {
  terminal: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 24l8 8-8 8"/>
      <path d="M35 40h7"/>
    </g>`,
  neural: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="32" r="5.5"/>
      <path d="M28.1 28.1 22.5 22.5M35.9 28.1 41.5 22.5M28.1 35.9 22.5 41.5M35.9 35.9 41.5 41.5"/>
      <circle cx="32" cy="32" r="1.6" fill="#f2f2f2" stroke="none"/>
    </g>
    <g fill="#f2f2f2">
      <circle cx="20.5" cy="20.5" r="2.2"/>
      <circle cx="43.5" cy="20.5" r="2.2"/>
      <circle cx="20.5" cy="43.5" r="2.2"/>
      <circle cx="43.5" cy="43.5" r="2.2"/>
    </g>`,
  activity: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="17.5" r="4"/>
      <path d="M32 23v11"/>
      <path d="M32 26.5 22 33l-4-6"/>
      <path d="M32 26.5 42 33l4-6"/>
      <path d="M32 34 24 48"/>
      <path d="M32 34 40 48"/>
    </g>`,
  chat: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 19h24a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5H32l-8 6v-6h-4a5 5 0 0 1-5-5V24a5 5 0 0 1 5-5Z"/>
    </g>
    <g fill="#f2f2f2">
      <circle cx="26" cy="29.5" r="1.7"/>
      <circle cx="32" cy="29.5" r="1.7"/>
      <circle cx="38" cy="29.5" r="1.7"/>
    </g>`,
  send: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M47 17 17 29.5l12 4.5 2.5 12 6-8.5 9 5L47 17Z"/>
      <path d="M29 34l18-17"/>
    </g>`,
  mail: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="16" y="23" width="32" height="22" rx="4"/>
      <path d="m16 26 16 11 16-11"/>
    </g>
    <circle cx="47" cy="18" r="1.8" fill="#f2f2f2"/>`,
  code: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M26 23l-8 9 8 9"/>
      <path d="M38 23l8 9-8 9"/>
      <path d="M35 20l-6 24"/>
    </g>`,
  layers: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 17l15 9-15 9-15-9 15-9z"/>
      <path d="M17 34l15 9 15-9"/>
    </g>`,
  cube: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 16l15 8.5v15L32 48l-15-8.5v-15L32 16z"/>
      <path d="M17 24.5l15 8.5 15-8.5"/>
      <path d="M32 33v15"/>
    </g>`,
  bolt: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M35 16 22 35h9l-2 13 13-19h-9l2-13z"/>
    </g>`,
  globe: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="32" cy="32" r="15"/>
      <path d="M17 32h30"/>
      <path d="M32 17c6 5.5 6 24.5 0 30"/>
      <path d="M32 17c-6 5.5-6 24.5 0 30"/>
    </g>`,
  lock: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="23" y="29" width="18" height="14" rx="3.5"/>
      <path d="M27 29v-4a5 5 0 0 1 10 0v4"/>
    </g>`,
  spark: `
    <g fill="none" stroke="#f2f2f2" stroke-width="1.6" stroke-linejoin="round">
      <path d="M32 15.5l3.8 12.7L48.5 32l-12.7 3.8L32 48.5l-3.8-12.7L15.5 32l12.7-3.8L32 15.5z"/>
    </g>`,
};

export const ICON_NAMES = Object.keys(GLYPHS);

export function renderIcon(name) {
  const glyph = GLYPHS[name] || GLYPHS.code;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c1c1c"/>
      <stop offset="1" stop-color="#101010"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="63" height="63" rx="19" fill="url(#tile)" stroke="#ffffff" stroke-opacity="0.1"/>
  ${glyph}
</svg>
`;
}

export function resolveIcon(name) {
  return ICON_NAMES.includes(name) ? name : "code";
}
