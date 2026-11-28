// Toetst een losse oefenkaart (één offline HTML-bestand met globals LES en MAP, zoals src/lands/fr/app/oefenkaart.html).
// Herbruikbaar per land: node scripts/land/oefenkaart-e2e.mjs <html> <aantal items> <titeltekst>
// Speelt met touch op 1080×810, 810×1080 en 1440×900: aanwijzen (alle items goed + per soort een fout),
// schrijven (strikte spelling), een volledige toets, voortgang na herladen, geen externe verzoeken, tikdoelen ≥ 44 px.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [fileArg, nArg, title] = process.argv.slice(2);
if (!fileArg || !nArg || !title) { console.error('Gebruik: node scripts/land/oefenkaart-e2e.mjs <html> <aantal items> <titeltekst>'); process.exit(2); }
const file = resolve(fileArg), N = Number(nArg);
const SIZES = [[1080, 810], [810, 1080], [1440, 900]];
const fails = []; const fail = m => { fails.push(m); console.log('FAIL', m); };
const b = await chromium.launch();

// Ankerpunt van een item (kaartcoördinaten) → schermpunt
const screenOf = (p, id) => p.evaluate(id => {
  { const r = svg.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) svg.scrollIntoView({ block: 'center' }); }
  const m = MAP.items[id], t = BYID[id].type; let x, y;
  if (t === 'rivier') { const l = RIV[id][0]; [x, y] = l[Math.floor(l.length / 2)]; }
  else if (m.x != null) [x, y] = [m.x, m.y]; else [x, y] = [m.lx, m.ly];
  const pt = svg.createSVGPoint(); pt.x = x; pt.y = y; const s = pt.matrixTransform(svg.getScreenCTM()); return [s.x, s.y];
}, id);
const curId = p => p.evaluate(() => cur);
async function tap(p, x, y, want) { // tikt; bij een keuzevenster het gewenste nummer (of het eerste)
  await p.touchscreen.tap(x, y); await p.waitForTimeout(60);
  if (await p.locator('#pick').isVisible()) {
    const btn = want ? p.locator(`#pickBtns button[data-id="${want}"]`) : p.locator('#pickBtns button').first();
    if (await btn.count()) await btn.tap(); else await p.locator('#pickX').tap();
    await p.waitForTimeout(60);
  }
}

const strip = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
async function runToets(p, w, h, accent) {
  await p.getByRole('button', { name: 'Toets' }).tap(); await p.locator('#go').tap();
  await p.waitForFunction(() => document.querySelector('#panel .muted')?.textContent.startsWith('Vraag 1 van'));
  let accId = null;
  if (accent) {
    // Alleen vragen die nog niet getoond zijn (index ≥ 1) worden herschikt. Schrijfvragen hebben een oneven index.
    accId = await p.evaluate(() => { const strip = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), has = id => strip(BYID[id].nl) !== BYID[id].nl;
      const odd = test.ids.findIndex((id, i) => i % 2 === 1 && has(id)); if (odd >= 0) return test.ids[odd];
      const j = test.ids.findIndex((id, i) => i >= 2 && has(id)); if (j < 0 || test.ids.length < 4) return null;
      [test.ids[3], test.ids[j]] = [test.ids[j], test.ids[3]]; return test.ids[3]; });
    if (!accId) { console.log(`${w}x${h}: geen item met accent, accentcontrole in de toets overgeslagen`); }
  }
  for (let k = 0; k < N; k++) {
    try { await p.waitForFunction(k => document.querySelector('#panel .muted')?.textContent.startsWith(`Vraag ${k + 1} van`), k, { timeout: 3000 }); }
    catch { fail(`${w}x${h}: toets toont vraag ${k + 1} niet`); return; }
    const id = await p.evaluate(() => test.ids[test.i]);
    if (await p.locator('#in').count()) {
      const nl = await p.evaluate(id => BYID[id].nl, id);
      await p.locator('#in').fill(id === accId ? strip(nl) : nl); await p.locator('#in').press('Enter');
      if (!accent) await p.locator('#in').press('Enter').catch(() => {}); } // dubbele Enter mag niet dubbel tellen
    else { const [x, y] = await screenOf(p, id); await tap(p, x, y, id); }
    try { await p.waitForFunction(k => !test || test.i > k, k, { timeout: 3000 }); } catch { fail(`${w}x${h}: toets bleef hangen bij ${id} (vraag ${k + 1})`); return; }
  }
  try { await p.waitForSelector('.result', { timeout: 3000 }); } catch { fail(`${w}x${h}: geen toetsuitslag`); return; }
  const res = await p.locator('.result').textContent();
  const exp = accId ? N - 1 : N, cijfer = (Math.max(1, Math.round((1 + 9 * exp / N) * 10) / 10)).toFixed(1).replace('.', ',');
  if (!res.includes(`${exp} / ${N}`) || !res.includes(cijfer)) fail(`${w}x${h}: toetsuitslag "${res}", verwacht ${exp} / ${N} en cijfer ${cijfer}`);
  if (accId) { const list = p.locator('.result ~ ul.items');
    if (!(await list.count()) || !(await list.textContent()).includes(await p.evaluate(id => BYID[id].nl, accId))) fail(`${w}x${h}: ${accId} staat niet bij 'Nog oefenen'`); }
}

for (const [w, h] of SIZES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], reqs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) reqs.push(r.url()); });
  await p.goto('file://' + file);
  if (!(await p.title()).includes(title)) fail(`${w}x${h}: titel bevat "${title}" niet`);
  const info = await p.evaluate(() => ({ n: ITEMS.length, ids: new Set(ITEMS.map(i => i.id)).size, geo: ITEMS.filter(i => !MAP.items[i.id]).map(i => i.id),
    cover: CH.flatMap(c => c.items).sort().join() === ITEMS.map(i => i.id).sort().join() }));
  if (info.n !== N || info.ids !== N) fail(`${w}x${h}: ${info.n} items / ${info.ids} uniek, verwacht ${N}`);
  if (info.geo.length) fail(`${w}x${h}: geen geometrie voor ${info.geo}`);
  if (!info.cover) fail(`${w}x${h}: hoofdstukken dekken niet elk item precies één keer`);

  // Aanwijzen: alle items goed via een echte tik
  await p.getByRole('button', { name: 'Aanwijzen' }).tap();
  let good = 0;
  for (let k = 0; k < N; k++) {
    const id = await curId(p); const [x, y] = await screenOf(p, id);
    await tap(p, x, y, id);
    const fb = await p.locator('#fb').getAttribute('class');
    if (fb.includes('good')) good++; else fail(`${w}x${h}: aanwijzen ${id} niet goed (${await p.locator('#fb').textContent()})`);
    await p.locator('#nx').tap();
  }
  // Per soort één bewuste fout via de echte flow: 'Weet ik niet' + 'Volgende' tot een item van die soort, dan op een ander item van dezelfde soort tikken
  const types = await p.evaluate(() => { const by = {}; for (const i of ITEMS) (by[i.type] ||= []).push(i.id); return Object.entries(by).filter(([, a]) => a.length > 1).map(([t]) => t); });
  let caught = 0;
  for (const t of types) {
    for (let g = 0; g < 4 * N && (await p.evaluate(() => BYID[cur].type)) !== t; g++) { await p.locator('#skip').tap(); await p.locator('#nx').tap(); }
    const ask = await curId(p);
    const other = await p.evaluate(ask => ITEMS.find(i => i.type === BYID[ask].type && i.id !== ask && !okFor(ask, i.id)).id, ask);
    const miss0 = await p.evaluate(() => S.miss);
    const [x, y] = await screenOf(p, other); await tap(p, x, y, other);
    const bad = (await p.locator('#fb').getAttribute('class')).includes('bad'), miss1 = await p.evaluate(() => S.miss);
    if (bad && miss1 === miss0 + 1) caught++; else fail(`${w}x${h}: tik op ${other} bij vraag ${ask}: fb ${bad ? 'fout' : 'GOED'}, fouten ${miss0}→${miss1}`);
    await p.locator('#nx').tap();
  }
  const pairs = types;

  // Schrijven: strikte vergelijker
  // Generiek: officiële naam en aliassen exact goed, hoofdletters/spaties vrij; zonder accenten = 'bijna' (telt niet in de toets);
  // een naam van een ander item = fout. Optioneel land-specifieke gevallen via SPELL_CASES (JSON: [[id, invoer, ok, exact], ...]).
  const extra = JSON.parse(process.env.SPELL_CASES || '[]');
  const spell = await p.evaluate(extra => {
    const out = [], strip = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    ITEMS.forEach((it, i) => {
      for (const a of [it.nl, ...it.aliases]) { const r = checkName(it.id, a); if (!(r.ok && r.exact)) out.push([it.id, a, r]);
        const r2 = checkName(it.id, ' ' + a.toUpperCase() + ' '); if (!(r2.ok && r2.exact)) out.push([it.id, a.toUpperCase(), r2]); }
      if (strip(it.nl) !== it.nl) { const r = checkName(it.id, strip(it.nl)); if (!(r.ok && !r.exact)) out.push([it.id, strip(it.nl), r]); }
      const o = ITEMS[(i + 1) % ITEMS.length]; const r = checkName(it.id, o.nl); if (r.ok) out.push([it.id, o.nl, r]);
    });
    for (const [id, v, ok, exact] of extra) { const r = checkName(id, v); if (r.ok !== ok || (ok && r.exact !== exact)) out.push([id, v, r]); }
    return out; }, extra);
  for (const [id, v, r] of spell) fail(`${w}x${h}: spelling ${id} "${v}" gaf ${JSON.stringify(r)}`);
  await p.getByRole('button', { name: 'Namen schrijven' }).tap();
  const sid = await curId(p); await p.locator('#in').fill(await p.evaluate(id => BYID[id].nl, sid)); await p.locator('#go').tap();
  if (!(await p.locator('#fb').getAttribute('class')).includes('good')) fail(`${w}x${h}: schrijven ${sid} niet goed`);

  // Toets ronde A: alles goed → N/N en cijfer 10,0
  await runToets(p, w, h, false);
  // Toets ronde B: één schrijfvraag met accent beantwoorden zonder accenten ('bijna') → telt fout: (N-1)/N, item bij 'Nog oefenen'
  await runToets(p, w, h, true);

  // Voortgang na herladen
  const before = await p.evaluate(() => S.good);
  await p.reload(); const after = await p.evaluate(() => S.good);
  if (!before || after !== before) fail(`${w}x${h}: voortgang ${before} → ${after} na herladen`);

  // Tikdoelen ≥ 44 px (knoppen in nav en paneel)
  for (const m of ['Leren', 'Aanwijzen', 'Namen schrijven', 'Toets']) {
    await p.getByRole('button', { name: m, exact: true }).tap(); await p.waitForTimeout(50);
    const small = await p.evaluate(() => [...document.querySelectorAll('nav button, .panel button, select')].filter(e => e.offsetParent && e.getBoundingClientRect().height < 44).map(e => e.textContent.trim()));
    if (small.length) fail(`${w}x${h} ${m}: tikdoel < 44 px: ${small}`);
  }
  if (errs.length) fail(`${w}x${h}: console-errors: ${errs}`);
  if (reqs.length) fail(`${w}x${h}: externe verzoeken: ${reqs}`);
  await p.screenshot({ path: `/tmp/oefenkaart-${w}x${h}.png` });
  console.log(`${w}x${h}: aanwijzen ${good}/${N}, fouten herkend ${caught}/${pairs.length}`);
  await ctx.close();
}
await b.close();
if (fails.length) { console.log(`oefenkaart-e2e: ${fails.length} FAIL`); process.exit(1); }
console.log('oefenkaart-e2e: OK');
