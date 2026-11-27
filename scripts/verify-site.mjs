// Controleert de site-uitvoer in dist/ (na build-site.mjs). Faalt de build bij een kapotte verwijzing.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const must = f => assert(existsSync(join(dist, f)) && statSync(join(dist, f)).size > 0, 'Ontbreekt in dist: ' + f);

assert(html.includes('Waar gaan we vandaag naartoe?'), 'dist/index.html is niet het portal');
assert(!html.includes('../'), 'Portal verwijst buiten de site-root');
assert(html.includes("italy:'./italie/'") && html.includes('france:null'), 'Routecontract gewijzigd (Italië → ./italie/, Frankrijk nog geen route)');
for (const m of html.matchAll(/(?:src|srcset|href)="\.\/([^"#'+]+\.[a-z0-9]+)"/g)) must(m[1]);
for (const c of ['italy', 'france', 'spain', 'germany', 'netherlands']) for (const k of ['destination', 'hover']) must(`assets/nino-topo/v3-r2/destinations/${c}-${k}.webp`);
for (const f of ['it', 'fr', 'es', 'de', 'nl']) must(`assets/flags/${f}.svg`);
for (const i of JSON.parse(readFileSync(join(dist, 'site.webmanifest'), 'utf8')).icons) must(i.src.slice(2));
must('favicon.ico'); must('italie/index.html'); must('italie/print.html'); must('italie/printboek.pdf');
assert(/<title>[^<]*Italië/.test(readFileSync(join(dist, 'italie/index.html'), 'utf8')), 'dist/italie/index.html is niet de Italië-app');
const italieHtml = readFileSync(join(dist, 'italie/index.html'), 'utf8');
assert(!italieHtml.includes('TOPO_V3_PREVIEW') && !italieHtml.includes('niets wordt bewaard'), 'Demo-build op /italie/: voortgang zou niet bewaard worden');
// BL-037.3: the portal has no parents link anymore; the app still answers #uitleg.
assert(!html.includes('Voor ouders en leraren') && !html.includes('class="parents"'), 'Portal bevat nog de link "Voor ouders en leraren" (BL-037.3)');
if (italieHtml.includes('BEGIN TOPO V3')) assert(italieHtml.includes('setupV3Uitleg') && italieHtml.includes('Hoe werkt TOPO?'), '/italie/ (V3) mist de uitlegpagina');
// BL-036.9: /italie/ uses exactly the portal's favicon set, manifest and theme-color.
const head = h => h.slice(0, h.indexOf('</head>'));
// Only for the V3 web copy (split-site); the V2.0.2 rollback (SITE_ITALIE=v2) keeps its embedded favicon.
const isV3 = italieHtml.includes('BEGIN TOPO V3');
const iconTags = h => [...head(h).matchAll(/<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g)].map(m => m[0]).sort();
const portalIcons = iconTags(html).map(t => t.replace(/href="\.\//, 'href="/')), italieIcons = iconTags(italieHtml);
assert(portalIcons.some(t => t.includes('favicon-48.png')) && portalIcons.some(t => t.includes('apple-touch-icon-180.png')) && portalIcons.some(t => t.includes('/site.webmanifest')), 'Favicon-set incompleet');
if (isV3) {
  assert.deepEqual(italieIcons, portalIcons, '/italie/ heeft niet dezelfde favicon-set als het portal');
  const theme = h => head(h).match(/<meta name="theme-color" content="([^"]+)"/)?.[1];
  assert(theme(italieHtml) && theme(italieHtml) === theme(html), '/italie/ theme-color wijkt af van het portal');
  for (const t of italieIcons) must(t.match(/href="\/([^"]+)"/)[1]);
}
for (const f of ['favicon-16', 'favicon-32', 'favicon-48', 'apple-touch-icon-180', 'app-icon-192', 'app-icon-512']) must(`assets/nino-topo/v3-r3/brand/icons/${f}.png`);
if (isV3) must('italie/v2/index.html');
assert(html.includes('favicon-32.png') && html.includes('nino-welcome-r3.webp') && html.includes('logo-01-primary-r3-1.svg'), 'R3-merkassets niet aangesloten');
assert(html.includes('prefers-reduced-motion'), 'Reduced-motion ontbreekt');
const contrast = (a, b) => { const L = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); const [x, y] = [L(a), L(b)]; return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
for (const [fg, bg] of [['#1f1a33', '#9781D5'], ['#FFFFFF', '#5b45e0'], ['#FFFFFF', '#4a37b8']]) assert(html.includes(bg) && html.includes(fg === '#FFFFFF' ? 'color:#fff' : fg) && contrast(fg, bg) >= 4.5, 'Contrast te laag: ' + fg + ' op ' + bg);
// UK-01: oefenmodule VK en Ierland, los en offline
must('vk-ierland/index.html');
const ukHtml = readFileSync(join(dist, 'vk-ierland/index.html'), 'utf8');
assert(ukHtml.includes('Topo VK en Ierland') && ukHtml.includes('window.TOPO_UK'), '/vk-ierland/ is niet de VK-module');
assert(!/(?:src|href)="https?:/.test(ukHtml), '/vk-ierland/ laadt externe bestanden');
assert(!html.includes('vk-ierland'), 'Portal linkt naar /vk-ierland/ (pas na besluit Dennis)');
console.log('Site-check: OK');
