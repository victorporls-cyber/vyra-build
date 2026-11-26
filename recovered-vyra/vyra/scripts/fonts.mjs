// Embute as fontes do Google dentro do pacote do app (para funcionar sem internet).
// localizeFontCss: troca as URLs remotas do CSS por arquivos locais em fonts/.
import { createHash } from 'node:crypto';

export const FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap';

// Mantém só os conjuntos de caracteres usados em português (latin e latin-ext).
const KEEP = new Set(['latin', 'latin-ext']);

export function localizeFontCss(css) {
  const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
  const files = new Map(); // url remota -> nome local
  const out = [];
  for (const [, subset, block] of blocks) {
    if (!KEEP.has(subset)) continue;
    const m = /url\((['"]?)(https:\/\/[^)'"]+\.woff2)\1\)/.exec(block);
    if (!m) continue;
    const url = m[2];
    if (!files.has(url)) files.set(url, createHash('sha1').update(url).digest('hex').slice(0, 12) + '.woff2');
    out.push(block.replace(m[0], `url(${files.get(url)}) format('woff2')`).replace(/format\('woff2'\)\s*format\('woff2'\)/, "format('woff2')"));
  }
  return { css: out.join('\n'), files };
}
