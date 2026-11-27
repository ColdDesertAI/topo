// UK-01c: bouwt de oefenkaart VK en Ierland tot één offline HTML-bestand, in dezelfde vorm als de
// Frankrijk-oefenkaart (sjabloon: src/lands/uk-ie/app/oefenkaart.html). Alleen de data verschilt.
// Gebruik: node scripts/land/uk-ie-build.mjs [uitvoer.html]   (standaard: dist/vk-ierland/index.html)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const land = join(root, 'src/lands/uk-ie');
const read = p => readFileSync(join(land, p), 'utf8');
const items = JSON.parse(read('items.draft.json')).items;
const route = JSON.parse(read('route.draft.json'));
const geo = JSON.parse(read('geo.json'));

// Kaartkader: het Mercator-kader van geo.json, onderaan iets ruimer zodat de Kanaaleilanden heel blijven.
const W = geo.projection.width, H = 1022;
const f = n => Math.round(n * 10) / 10;
const ringD = r => 'M' + r.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
const lineD = l => 'M' + l.map(([x, y]) => `${f(x)} ${f(y)}`).join('L');
const polysD = rings => rings.map(p => p.map(ringD).join('')).join('');

// Typen in de woorden van het sjabloon (Frankrijk): land -> buurland, zeeën -> zee, Loch Ness -> meer
const HOME = new Set(['engeland', 'schotland', 'wales', 'noord-ierland', 'ierland']);
const typeOf = i => i.type === 'land' ? 'buurland' : i.type === 'water' ? (i.subtype === 'meer' ? 'meer' : 'zee') : i.type;

const chapterOf = {};
route.chapters.forEach((c, n) => c.itemIds.forEach(id => { chapterOf[id] = n + 1; }));
const ord = c => /^\d+$/.test(c) ? +c : /[a-r]/.test(c) ? 100 + c.charCodeAt(0) : 300 + c.charCodeAt(0);
const sorted = [...items].sort((a, b) => ord(a.source.code) - ord(b.source.code));

const mapItems = {};
for (const i of sorted) {
  const t = geo.targets[i.id], type = typeOf(i);
  if (t.kind === 'point') mapItems[i.id] = { type, x: f(t.x), y: f(t.y) };
  else if (t.kind === 'line') mapItems[i.id] = { type, d: t.lines.map(lineD).join(''), lx: f(t.label[0]), ly: f(t.label[1]) };
  else mapItems[i.id] = { type, d: polysD(t.rings), lx: f(t.label[0]), ly: f(t.label[1]), ...(HOME.has(i.id) ? { home: 1 } : {}) };
}
const MAP = {
  schema: 1, land: 'uk-ie', viewBox: [0, 0, W, H],
  projectie: { soort: 'mercator', lon: geo.projection.lon, lat: geo.projection.lat, breedte: W, hoogte: geo.projection.height },
  context: {
    focus: '', // de thuislanden zijn zelf doel en krijgen de warme kleur
    land: geo.base.land.map(b => b.d).join(''),
    labels: [], lakes: geo.base.ness, rivers: '',
  },
  // net naast de Hebriden telt niet als je precies op Skye tikt, en andersom
  excl: { hebriden: ['skye'], skye: ['hebriden'] },
  parent: {},
  // alleen de plek van de naam schuift, nooit de plek zelf: [dx, dy, anker]
  lbl: {
    cardiff: [-16, 0, 'end'], bristol: [-4, 16, 'start'], liverpool: [-16, 0, 'end'], 'loch-ness': [-14, 8, 'end'],
    'schotse-hooglanden': [-6, 44, 'middle'], schotland: [0, 24, 'middle'], glasgow: [-16, 0, 'end'], theems: [-34, 12, 'middle'], denemarken: [12, 0, 'end'], 'straat-van-dover': [44, 14, 'middle'],
  },
  items: mapItems,
};
const LES = {
  items: sorted.map(i => ({
    id: i.id, code: i.source.code, nl: i.name.nl, en: i.name.en, type: typeOf(i), chapter: chapterOf[i.id],
    blad: `${i.source.column} › ${i.source.heading} › ${/^\d+$/.test(i.source.code) ? 'nr. ' : ''}${i.source.code}`,
    aliases: i.aliases || [],
  })),
  chapters: route.chapters.map((c, n) => ({ nr: n + 1, id: c.id, titel: c.title, blad: c.blad, items: c.itemIds })),
  rideTo: ['Londen', 'Edinburgh', 'Dublin', 'Cardiff', 'Belfast', 'Liverpool', 'Glasgow', 'Cork', 'Bristol', 'Aberdeen', 'Inverness'],
  accentVb: 'België',
};
const b64 = p => readFileSync(join(land, p)).toString('base64');
const SHEETS = { lijst: 'data:image/jpeg;base64,' + b64('bron/IMG_0909.jpg'), kaart: 'data:image/jpeg;base64,' + b64('bron/IMG_0913.jpg') };
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const html = read('app/oefenkaart.html')
  .replace('/*MAP*/', () => safe(JSON.stringify(MAP)))
  .replace('/*LES*/', () => safe(JSON.stringify(LES)))
  .replace('/*SHEETS*/', () => JSON.stringify(SHEETS))
  .replace('/*SHEET_LIJST*/', () => SHEETS.lijst)
  .replaceAll('/*IMG_NINO*/', () => 'data:image/webp;base64,' + b64('app/img/nino.webp'))
  .replace('/*IMG_VESPA*/', () => 'data:image/webp;base64,' + b64('app/img/vespa.webp'));
if (/\/\*[A-Z_]+\*\//.test(html)) throw new Error('placeholder niet vervangen');
const out = process.argv[2] || join(root, 'dist/vk-ierland/index.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`VK en Ierland: ${out} (${(html.length / 1e3).toFixed(0)} kB)`);
