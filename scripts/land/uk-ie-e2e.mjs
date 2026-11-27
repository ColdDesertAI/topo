// UK-01 criteria 3, 5, 6, 7 en 9: speelt de gebouwde module in Chromium met touch.
// Gebruik: node scripts/land/uk-ie-e2e.mjs [pad naar gebouwde html]  (standaard dist/vk-ierland/index.html)
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const file = resolve(process.argv[2] || 'dist/vk-ierland/index.html');
const SIZES = [[1080, 810], [810, 1080], [1440, 900]];
const fails = []; const fail = m => { fails.push(m); console.log('FAIL', m); };
const b = await chromium.launch();

// Kaartcoördinaat → schermpunt; een punt binnen het doel kiezen
async function screenOf(p, id) {
  return p.evaluate(id => {
    const t = __topoUK.T[id]; let x, y;
    if (t.kind === 'point') [x, y] = [t.x, t.y];
    else if (t.kind === 'line') { const l = t.lines[0]; [x, y] = l[Math.floor(l.length / 2)]; }
    else [x, y] = t.label;
    const svg = document.querySelector('.mapwrap svg'), m = svg.getScreenCTM(), pt = svg.createSVGPoint();
    pt.x = x; pt.y = y; const s = pt.matrixTransform(m); return [s.x, s.y];
  }, id);
}
const nameToId = p => p.evaluate(() => { const n = document.querySelector('.prompt .target').textContent; return Object.values(__topoUK.BY).find(i => i.name.nl === n).id; });

for (const [w, h] of SIZES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], reqs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('request', r => { if (!r.url().startsWith('file:')) reqs.push(r.url()); });
  await p.goto('file://' + file);
  const chapters = await p.evaluate(() => [...document.querySelectorAll('.chapter')].length);
  if (chapters !== 12) fail(`${w}x${h}: ${chapters} hoofdstukken`);

  // 3. Aanwijzen: elk item goed; per hoofdstuk één bewuste fout op een ander item van dezelfde soort
  let good = 0, wrongCaught = 0, wrongTried = 0;
  for (let c = 0; c < 12; c++) {
    await p.evaluate(() => __topoUK.home());
    await p.locator('.chapter').nth(c).getByRole('button', { name: 'Aanwijzen' }).click();
    await p.waitForTimeout(150);
    const ids = await p.evaluate(c => window.TOPO_UK.route.chapters[c].itemIds, c);
    // eerste vraag: fout tikken
    const first = await nameToId(p);
    const other = await p.evaluate(([first, ids]) => { const g = window.TopoCheck.group, BY = __topoUK.BY; return ids.find(i => i !== first && g(BY[i]) === g(BY[first])); }, [first, ids]);
    if (other) {
      wrongTried++;
      const [x, y] = await screenOf(p, other); await p.touchscreen.tap(x, y);
      if ((await p.locator('.feedback.bad').count()) === 1) wrongCaught++; else fail(`${w}x${h}: tik op ${other} telde goed voor ${first}`);
      await p.getByRole('button', { name: 'Volgende' }).click();
    }
    for (let guard = 0; guard < 20; guard++) {
      if (await p.locator('.result').count()) break;
      const id = await nameToId(p);
      const [x, y] = await screenOf(p, id);
      const inView = await p.evaluate(([x, y]) => { const r = document.querySelector('.mapwrap').getBoundingClientRect(); const e = document.elementFromPoint(x, y); return x > r.left && x < r.right && y > r.top && y < r.bottom && !!e?.closest('svg') && !e.closest('.mapctl'); }, [x, y]);
      if (!inView) fail(`${w}x${h}: ${id} niet vrij aan te tikken`);
      await p.touchscreen.tap(x, y);
      if ((await p.locator('.feedback.ok').count()) === 1) good++; else fail(`${w}x${h}: ${id} goed getikt maar fout gerekend`);
      await p.getByRole('button', { name: 'Volgende' }).click();
    }
  }
  console.log(`${w}x${h}: aanwijzen ${good}/44 goed, ${wrongCaught}/${wrongTried} fouten herkend`);
  if (good !== 44) fail(`${w}x${h}: aanwijzen ${good}/44`);

  // 5. Herkennen en schrijven: één hoofdstuk volledig; leren opent
  await p.evaluate(() => __topoUK.home());
  await p.locator('.chapter').nth(5).getByRole('button', { name: 'Herkennen' }).click();
  for (let g = 0; g < 10 && !(await p.locator('.result').count()); g++) {
    const id = await p.evaluate(() => document.querySelector('.mapwrap .ring, .mapwrap .area-hi, .mapwrap .zone.hi') && null);
    // juiste knop = degene waarvan de naam bij het oranje doel hoort: vraag het de app
    const right = await p.evaluate(() => { const btns = [...document.querySelectorAll('.choices button')]; return btns.findIndex(b => document.querySelector(`.mapwrap path.area-hi`) && __topoUK.T[b.dataset.id] && __topoUK.T[b.dataset.id].rings && document.querySelector('.mapwrap path.area-hi').getAttribute('d').length === __topoUK.T[b.dataset.id].rings.map(p => p.map(r => 'M' + r.map(q => q.join(' ')).join('L') + 'Z').join('')).join('').length); });
    await p.locator('.choices button').nth(Math.max(0, right)).click();
    await p.getByRole('button', { name: 'Volgende' }).click();
  }
  if (!(await p.locator('.result').count())) fail(`${w}x${h}: herkennen niet afgerond`);
  await p.evaluate(() => __topoUK.home());
  await p.locator('.chapter').nth(0).getByRole('button', { name: 'Schrijven' }).click();
  for (let g = 0; g < 10 && !(await p.locator('.result').count()); g++) {
    const id = await p.evaluate(() => { const c = document.querySelector('.mapwrap circle.dot.hi'); return Object.values(__topoUK.T).length && Object.entries(__topoUK.T).find(([k, t]) => t.kind === 'point' && Math.abs(t.x - +c.getAttribute('cx')) < .01 && Math.abs(t.y - +c.getAttribute('cy')) < .01)[0]; });
    await p.locator('.write input').fill(await p.evaluate(id => __topoUK.BY[id].name.nl.toLowerCase(), id));
    await p.locator('.write input').press('Enter');
    if (!(await p.locator('.feedback.ok').count())) fail(`${w}x${h}: schrijven ${id} fout gerekend`);
    await p.getByRole('button', { name: 'Volgende' }).click();
  }
  if (!(await p.locator('.result').count())) fail(`${w}x${h}: schrijven niet afgerond`);
  // proefoverhoring: 44 vragen, alles fout beantwoorden → score 0/44 en 'Oefen deze fouten'
  await p.evaluate(() => __topoUK.home());
  await p.getByRole('button', { name: /Proefoverhoring/ }).click();
  for (let q = 0; q < 44; q++) {
    if (await p.locator('.write input').count()) { await p.locator('.write input').fill('xxx'); await p.locator('.write input').press('Enter'); }
    else { const r = await p.locator('.mapwrap').boundingBox(); await p.touchscreen.tap(r.x + 30, r.y + r.height - 30); }
    await p.getByRole('button', { name: 'Volgende' }).click();
  }
  const score = await p.locator('.result .score').textContent().catch(() => '');
  if (score !== '0 / 44') fail(`${w}x${h}: overhoring score '${score}'`);
  if (!(await p.getByRole('button', { name: 'Oefen deze fouten' }).count())) fail(`${w}x${h}: geen 'Oefen deze fouten'`);

  // 6. Voortgang na herladen
  await p.reload();
  const overall = await p.locator('.overall strong').textContent();
  if (!/^\d+ van 44 gekend$/.test(overall)) fail(`${w}x${h}: voortgang '${overall}'`);
  const weakBtn = await p.getByRole('button', { name: /Oefen je fouten/ }).count();
  if (!weakBtn) fail(`${w}x${h}: fouten niet bewaard na herladen`);

  // 7. UI: tekst niet afgesneden, ≥ 13 px, tikdoelen ≥ 44 px; op home en in een les
  for (const screen of ['home', 'les']) {
    if (screen === 'les') { await p.locator('.chapter').nth(2).getByRole('button', { name: 'Herkennen' }).click(); await p.waitForTimeout(100); }
    const bad = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll('body *')) {
        if (e.closest('svg') || !e.getClientRects().length) continue;
        const cs = getComputedStyle(e);
        const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (hasText && parseFloat(cs.fontSize) < 13) out.push('klein: ' + e.textContent.slice(0, 30));
        if (hasText && e.scrollWidth > e.clientWidth + 1 && cs.overflow !== 'visible') out.push('afgesneden: ' + e.textContent.slice(0, 30));
        if (e.tagName === 'BUTTON') { const r = e.getBoundingClientRect(); if (r.width < 44 || r.height < 44) out.push('klein tikdoel: ' + e.textContent.slice(0, 20)); }
      }
      if (document.documentElement.scrollWidth > innerWidth) out.push('horizontale scroll');
      return out;
    });
    bad.forEach(m => fail(`${w}x${h} ${screen}: ${m}`));
  }
  await p.screenshot({ path: `/tmp/uk-ie-${w}x${h}.png` });
  if (errs.length) fail(`${w}x${h}: console-errors ${errs.join(' | ')}`);
  if (reqs.length) fail(`${w}x${h}: netwerkverzoeken ${reqs.join(', ')}`);
  await ctx.close();
}
await b.close();
if (fails.length) { console.log(`uk-ie-e2e: ${fails.length} FAIL`); process.exit(1); }
console.log('uk-ie-e2e: OK');
