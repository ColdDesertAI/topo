// UK-01: bouwt de oefenmodule VK en Ierland tot één offline HTML-bestand.
// Gebruik: node scripts/land/uk-ie-build.mjs [uitvoer.html]   (standaard: dist/vk-ierland/index.html)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const land = join(root, 'src/lands/uk-ie');
const read = p => readFileSync(join(land, p), 'utf8');
const data = { items: JSON.parse(read('items.draft.json')), route: JSON.parse(read('route.draft.json')), geo: JSON.parse(read('geo.json')) };
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const html = read('app/index.html')
  .replace('/*CSS*/', () => read('app/app.css'))
  .replace('/*DATA*/', () => safe(JSON.stringify(data)))
  .replace('/*JS*/', () => safe(read('app/check.js') + '\n' + read('app/app.js')));
const out = process.argv[2] || join(root, 'dist/vk-ierland/index.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`VK en Ierland: ${out} (${(html.length / 1e3).toFixed(0)} kB)`);
