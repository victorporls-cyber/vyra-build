// Prepara a pasta www/ que o Capacitor empacota dentro do APK.
// No APK os arquivos já vêm dentro do app, então o service worker e o
// cartão "Instalar app" são removidos da cópia, e as fontes são embutidas
// (assim o app mantém a mesma aparência sem internet).
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { FONTS_CSS_URL, localizeFontCss } from './fonts.mjs';

const files = ['manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const f of files) cpSync(f, `www/${f}`);

let html = readFileSync('index.html', 'utf8');
html = html.replace(/<!--PWA-FLAG-->[\s\S]*?<!--\/PWA-FLAG-->\n?/, '');
html = html.replace(/<!--PWA-REG-->[\s\S]*?<!--\/PWA-REG-->\n?/, '');

// Fontes: baixa uma vez, guarda em www/fonts e aponta o app para os arquivos locais.
const requireFonts = process.env.VYRA_REQUIRE_FONTS === '1';
try {
  const res = await fetch(FONTS_CSS_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141 Mobile Safari/537.36' },
  });
  if (!res.ok) throw new Error(`CSS das fontes: HTTP ${res.status}`);
  const { css, files: fontFiles } = localizeFontCss(await res.text());
  if (!fontFiles.size) throw new Error('nenhuma fonte encontrada no CSS');
  mkdirSync('www/fonts');
  for (const [url, name] of fontFiles) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`fonte ${url}: HTTP ${r.status}`);
    writeFileSync(`www/fonts/${name}`, Buffer.from(await r.arrayBuffer()));
  }
  writeFileSync('www/fonts/fonts.css', css + '\n');
  html = html.replace(/<link rel="preconnect"[^>]*fonts\.g[^>]*>\n?/g, '');
  html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts/fonts.css">');
  console.log(`fontes embutidas (${fontFiles.size} arquivos).`);
} catch (e) {
  if (requireFonts) { console.error('ERRO ao embutir fontes:', e.message); process.exit(1); }
  console.warn('AVISO: fontes não embutidas (' + e.message + '). O app usa as fontes do sistema sem internet.');
}

writeFileSync('www/index.html', html);
console.log('www/ pronta (sem service worker).');
