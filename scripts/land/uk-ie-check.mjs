// UK-01 criteria 1, 2 en 4: data volgens het blad, geografie plausibel, strikte spelling.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const L = new URL('../../src/lands/uk-ie/', import.meta.url);
const items = JSON.parse(readFileSync(new URL('items.draft.json', L))).items;
const route = JSON.parse(readFileSync(new URL('route.draft.json', L)));
const geo = JSON.parse(readFileSync(new URL('geo.json', L)));
await import(new URL('app/check.js', L)); // zet globalThis.TopoCheck (zelfde code als in de app)
const C = globalThis.TopoCheck;
const BY = Object.fromEntries(items.map(i => [i.id, i]));

// 1. Blad: 44 unieke ids; codes 1–18, a–r, A–H precies één keer; route dekt alles precies één keer
assert.equal(items.length, 44); assert.equal(new Set(items.map(i => i.id)).size, 44);
const codes = items.map(i => i.source.code).sort();
const want = [...Array.from({ length: 18 }, (_, i) => String(i + 1)), ...'abcdefghijklmnopqr', ...'ABCDEFGH'].sort();
assert.deepEqual(codes, want, 'codes wijken af van het blad');
const inRoute = route.chapters.flatMap(c => c.itemIds);
assert.deepEqual([...inRoute].sort(), items.map(i => i.id).sort(), 'route dekt niet elk item precies één keer');
assert.equal(inRoute.length, new Set(inRoute).size);
for (const c of route.chapters) assert.ok(c.itemIds.length >= 2 && c.itemIds.length <= 5, c.id);
const count = t => items.filter(i => i.type === t).length;
assert.deepEqual([count('stad'), count('land'), count('eiland'), count('water') + count('rivier')], [18, 11, 5, 8]);

// 2. Geometrie: elk item heeft een doel; steden liggen in het juiste land; vormen niet leeg
for (const i of items) assert.ok(geo.targets[i.id], 'geen geometrie: ' + i.id);
for (const i of items.filter(i => i.type === 'stad')) {
  const t = geo.targets[i.id], land = geo.targets[t.in];
  assert.ok(land.rings.some(p => C.inPoly(t.x, t.y, p)) || C.dist(t.x, t.y, land) < 3, `${i.id} ligt niet in ${t.in}`);
}
for (const [id, t] of Object.entries(geo.targets)) if (t.kind === 'area') {
  assert.ok(t.rings.length > 0, id);
  if (!['orkney', 'shetland', 'hebriden', 'kanaaleilanden'].includes(id)) assert.ok(C.dist(...t.label, t) === 0, 'label buiten vorm: ' + id);
}
// het blad: VK-delen en Ierland apart; Belfast niet in Ierland
assert.ok(!geo.targets.ierland.rings.some(p => C.inPoly(geo.targets.belfast.x, geo.targets.belfast.y, p)));
assert.equal(geo.sources.length, 3); for (const s of geo.sources) assert.match(s.sha256, /^[0-9a-f]{64}$/);

// 4. Schrijven is strikt
const ok = (s, id) => C.checkWritten(s, BY[id]).ok;
assert.ok(ok('Londen', 'londen')); assert.ok(ok('  londen ', 'londen')); assert.ok(!ok('London', 'londen'));
assert.ok(!ok('Belgie', 'belgie')); assert.equal(C.checkWritten('Belgie', BY.belgie).kind, 'accent'); assert.ok(ok('België', 'belgie'));
assert.ok(!ok('Edinburg', 'edinburgh')); assert.equal(C.checkWritten('Edinburg', BY.edinburgh).kind, 'close');
assert.ok(ok('Hull', 'hull')); assert.ok(ok('Kingston upon Hull', 'hull'));
assert.ok(ok('het kanaal', 'het-kanaal')); assert.ok(ok('Kanaal', 'het-kanaal'));
assert.ok(ok('Orkney eilanden', 'orkney')); assert.ok(ok('Orkneyeilanden', 'orkney'));
assert.ok(!ok('Theemz', 'theems')); assert.ok(!ok('', 'theems')); assert.equal(C.checkWritten('', BY.theems).kind, 'empty');
assert.ok(!ok('Noord Ierland', 'noord-ierland')); assert.ok(ok('Noord-Ierland', 'noord-ierland'));
console.log('uk-ie-check: OK (44 items, 12 hoofdstukken, geometrie en spelling)');
