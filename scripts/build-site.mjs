// Bouwt de site voor ninotopo.nl bovenop de bestaande build:
//   dist/            → portal (landkiezer)
//   dist/italie/     → de Italië-app (ongewijzigde uitvoer van `npm run build`)
// Draai na `npm run build`. Wijzigt niets aan de app zelf.
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const appHtml = existsSync(join(dist, 'index.html')) ? readFileSync(join(dist, 'index.html'), 'utf8') : '';
if (!/<title>[^<]*Italië/.test(appHtml) || appHtml.includes('Waar gaan we vandaag naartoe?')) throw new Error('Draai eerst `npm run build`: dist/index.html moet de Italië-app zijn (niet al omgezet).');

// 1. Italië-app naar /italie/
const italie = join(dist, 'italie');
rmSync(italie, { recursive: true, force: true });
mkdirSync(italie, { recursive: true });
for (const name of readdirSync(dist)) {
  if (['italie', 'assets', 'site.webmanifest', 'favicon.ico'].includes(name)) continue;
  renameSync(join(dist, name), join(italie, name));
}

// 1b. Welke Italië-versie live staat: SITE_ITALIE=v3 (Vercel-omgevingsvariabele) zet de V3-release op /italie/
//     en houdt V2.0.2 bereikbaar op /italie/v2/. Standaard (leeg of 'v2'): V2.0.2 op /italie/, geen V3.
//     Live zetten of terugdraaien = alleen deze variabele wijzigen en opnieuw deployen.
const which = (process.env.SITE_ITALIE || 'v2').toLowerCase();
if (!['v2', 'v3'].includes(which)) throw new Error('SITE_ITALIE moet v2 of v3 zijn, niet: ' + which);
if (which === 'v3') {
  const v3 = join(root, 'output/html/TOPO-V3-Italie.html');
  if (!existsSync(v3)) throw new Error('SITE_ITALIE=v3 maar de V3-release ontbreekt: draai TOPO_V3_RELEASE=1 node scripts/build-v3-preview.mjs');
  const v3html = readFileSync(v3, 'utf8');
  if (v3html.includes('TOPO_V3_PREVIEW') || v3html.includes('niets wordt bewaard')) throw new Error('V3-bestand is de demo, niet de release');
  mkdirSync(join(italie, 'v2'), { recursive: true });
  renameSync(join(italie, 'index.html'), join(italie, 'v2', 'index.html'));
  writeFileSync(join(italie, 'index.html'), v3html);
}
console.log('Italië op /italie/: ' + which.toUpperCase());

// 2. Portal naar de root, met paden voor de site-indeling
let html = readFileSync(join(root, 'portal/index.html'), 'utf8');
const before = html;
html = html.replaceAll('../assets/nino-topo/', './assets/nino-topo/').replace("italy:'../index.html'", "italy:'./italie/'");
if (html === before || html.includes('../')) throw new Error('Portal-paden niet volledig omgezet.');
writeFileSync(join(dist, 'index.html'), html);
cpSync(join(root, 'portal/site.webmanifest'), join(dist, 'site.webmanifest'));

// 3. Alleen de assets die het portal echt gebruikt
const used = new Set([...html.matchAll(/\.\/assets\/[A-Za-z0-9_\/.-]+\.(?:svg|webp|png|ico)/g)].map(m => m[0].slice(2)));
for (const c of ['italy', 'france', 'spain', 'germany', 'netherlands']) for (const k of ['destination', 'hover']) used.add(`assets/nino-topo/v3-r2/destinations/${c}-${k}.webp`);
for (const f of ['it', 'fr', 'es', 'de', 'nl']) used.add(`assets/flags/${f}.svg`);
for (const s of JSON.parse(readFileSync(join(root, 'portal/site.webmanifest'), 'utf8')).icons) used.add(s.src.slice(2));
rmSync(join(dist, 'assets'), { recursive: true, force: true });
for (const rel of used) {
  const from = rel.startsWith('assets/flags/') ? join(root, 'portal', rel) : join(root, rel);
  if (!existsSync(from)) throw new Error('Ontbrekend portal-asset: ' + rel);
  mkdirSync(dirname(join(dist, rel)), { recursive: true });
  cpSync(from, join(dist, rel));
}
cpSync(join(root, 'portal/assets/flags/LICENSE'), join(dist, 'assets/flags/LICENSE'));
cpSync(join(root, 'assets/nino-topo/v3-r3/brand/icons/favicon.ico'), join(dist, 'favicon.ico'));
console.log(`Site: dist/ (portal, ${used.size} assets) + dist/italie/ (app)`);
