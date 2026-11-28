// UK-01c: speelt de oefenkaart VK en Ierland (Frankrijk-vorm) in Chromium met touch.
// Gebruik: node scripts/land/uk-ie-e2e.mjs [pad naar gebouwde html]  (standaard dist/vk-ierland/index.html)
// Leunt op de globals van het sjabloon: ITEMS, BYID, MAP, NODE, cur, test, grade, checkName.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const file = resolve(process.argv[2] || 'dist/vk-ierland/index.html');
const SIZES = [[1080, 810], [810, 1080], [1440, 900]];
const fails = []; const fail = m => { fails.push(m); console.log('FAIL', m); };
const b = await chromium.launch();

// In de pagina: een punt dat zeker bij het doel hoort (stip, midden van de lijn, of een punt diep in de vorm, binnen het kader)
const PROBE = `window.__probe = id => {
  const m = MAP.items[id], t = BYID[id].type, [, , W, H] = MAP.viewBox;
  if (t === 'stad') return [m.x, m.y];
  if (t === 'rivier' || t === 'meer') { const l = m.d.split('M')[1].split('L').map(p => p.split(' ').map(Number)); return l[Math.floor(l.length / 2)]; }
  if (inFill(id, m.lx, m.ly)) return [m.lx, m.ly];
  const bb = NODE[id].getBBox(); let best = null, bd = -1;
  const x0 = Math.max(0, bb.x), x1 = Math.min(W, bb.x + bb.width), y0 = Math.max(0, bb.y), y1 = Math.min(H, bb.y + bb.height);
  for (let i = 1; i < 40; i++) for (let j = 1; j < 40; j++) {
    const x = x0 + (x1 - x0) * i / 40, y = y0 + (y1 - y0) * j / 40; if (!inFill(id, x, y)) continue;
    let d = 0; while (d < 30 && [0, 1, 2, 3].every(k => inFill(id, x + Math.cos(k * Math.PI / 2) * (d + 1), y + Math.sin(k * Math.PI / 2) * (d + 1)))) d++;
    if (d > bd) { bd = d; best = [x, y]; }
  }
  return best;
};
window.__screen = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const s = p.matrixTransform(svg.getScreenCTM()); return [s.x, s.y]; };`;

async function tapItem(p, id) {
  // staat de plek buiten beeld (staand: paneel onder de kaart), dan eerst scrollen, zoals een leerling ook doet
  const [sx, sy] = await p.evaluate(id => { const [x, y] = __probe(id); let [, v] = __screen(x, y);
    if (v < 10 || v > innerHeight - 10) scrollBy(0, v - innerHeight / 2); return __screen(x, y); }, id);
  await p.touchscreen.tap(sx, sy); await p.waitForTimeout(40);
  if (await p.locator('#pick').isVisible()) {
    const btn = p.locator(`#pickBtns button[data-id="${id}"]`);
    if (await btn.count()) await btn.click(); else { await p.click('#pickX'); return 'picker zonder juiste keuze'; }
    await p.waitForTimeout(40);
  }
  return null;
}

for (const [w, h] of SIZES) {
  const tag = `${w}x${h}`;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], reqs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('request', r => { if (!/^(file|data):/.test(r.url())) reqs.push(r.url()); });
  await p.goto('file://' + file); await p.addScriptTag({ content: PROBE });
  const n = await p.evaluate(() => [ITEMS.length, LES.chapters.length, document.title]);
  if (n[0] !== 44 || n[1] !== 12 || !n[2].includes('VK en Ierland')) fail(`${tag}: ${n}`);

  // 1. Logica: elk item is op zijn eigen plek goed (direct of via het keuzevenster) en ligt in het kader
  const logic = await p.evaluate(() => ITEMS.map(it => { const pt = __probe(it.id); if (!pt) return [it.id, 'geen punt'];
    const [, , W, H] = MAP.viewBox; if (pt[0] < 0 || pt[1] < 0 || pt[0] > W || pt[1] > H) return [it.id, 'buiten kader'];
    const g = grade(it.id, pt[0], pt[1]); return g.ok === true || (g.ok === null && g.choices.includes(it.id)) ? null : [it.id, JSON.stringify(g)]; }).filter(Boolean));
  for (const [id, why] of logic) fail(`${tag}: ${id} niet aanwijsbaar (${why})`);

  // 2. Bewuste fouten en randgevallen
  const wrong = await p.evaluate(() => {
    const at = id => __probe(id), out = [];
    const no = (asked, on, label) => { const [x, y] = at(on), g = grade(asked, x, y); if (g.ok !== false) out.push(`${label}: ${JSON.stringify(g)}`); };
    no('wales', 'engeland', 'Engeland is geen Wales'); no('ierland', 'noord-ierland', 'Noord-Ierland is geen Ierland');
    no('hebriden', 'skye', 'Skye is geen Hebriden'); no('noordzee', 'ierse-zee', 'Ierse Zee is geen Noordzee');
    no('het-kanaal', 'keltische-zee', 'Keltische Zee is geen Kanaal'); no('frankrijk', 'belgie', 'België is geen Frankrijk');
    no('londen', 'norwich', 'Norwich is geen Londen'); no('theems', 'loch-ness', 'Loch Ness is geen Theems');
    // diep in een buurland, ook ver van het label, telt (wat je als land ziet, is dat land)
    for (const [id, x, y] of [['noorwegen', 960, 60], ['duitsland', 985, 900], ['frankrijk', 700, 1005], ['denemarken', 975, 560]]) {
      const g = grade(id, x, y); if (g.ok !== true) out.push(`${id} diep in het land: ${JSON.stringify(g)}`); }
    // naast elkaar liggende steden: keuzevenster, geen gok
    const [mx, my] = at('manchester'), [lx, ly] = at('liverpool'); const g = grade('manchester', (mx + lx) / 2, (my + ly) / 2);
    if (!(g.ok === null || g.ok === false)) out.push('Liverpool/Manchester halverwege gaf ' + JSON.stringify(g));
    return out;
  });
  for (const m of wrong) fail(`${tag}: ${m}`);

  // 3. Spelling (zelfde regels als Frankrijk): hoofdletters vrij; zonder accent "bijna" goed, in de toets fout
  const sp = await p.evaluate(() => {
    const c = (v, id) => JSON.stringify(checkName(id, v)), out = [];
    const want = [['Londen', 'londen', '{"ok":true,"exact":true}'], ['  londen ', 'londen', '{"ok":true,"exact":true}'], ['London', 'londen', '{"ok":false}'],
      ['België', 'belgie', '{"ok":true,"exact":true}'], ['Belgie', 'belgie', '{"ok":true,"exact":false}'], ['Kanaal', 'het-kanaal', '{"ok":true,"exact":true}'],
      ['het kanaal', 'het-kanaal', '{"ok":true,"exact":true}'], ['Orkneyeilanden', 'orkney', '{"ok":true,"exact":true}'], ['Orkney eilanden', 'orkney', '{"ok":true,"exact":true}'],
      ['Kingston upon Hull', 'hull', '{"ok":true,"exact":true}'], ['Edinburg', 'edinburgh', '{"ok":false}'], ['Noord-Ierland', 'noord-ierland', '{"ok":true,"exact":true}']];
    for (const [v, id, r] of want) if (c(v, id) !== r) out.push(`${v} -> ${c(v, id)}, verwacht ${r}`);
    return out;
  });
  for (const m of sp) fail(`${tag}: spelling ${m}`);

  // 4. Aanwijzen via de knoppen en echte touch: alle 44 goed. De vraag staat zonder scrollen in beeld.
  await p.click('nav [data-mode="wijs"]'); let good = 0;
  await p.evaluate(() => scrollTo(0, 0));
  const pb = await p.evaluate(() => document.querySelector('.prompt').getBoundingClientRect().bottom);
  if (pb > h) fail(`${tag}: vraag valt onder de vouw (${Math.round(pb)} > ${h})`);
  for (let i = 0; i < 44; i++) {
    const id = await p.evaluate(() => cur); const e = await tapItem(p, id); if (e) fail(`${tag}: aanwijzen ${id}: ${e}`);
    if (await p.locator('#fb.good').count()) good++; else fail(`${tag}: aanwijzen ${id}: ${await p.locator('#fb').textContent()}`);
    await p.click('#nx');
  }
  // 5. Namen schrijven: een goed, een bijna, een fout
  await p.click('nav [data-mode="schrijf"]');
  for (const kind of ['goed', 'bijna', 'fout']) {
    const it = await p.evaluate(() => BYID[cur]);
    const v = kind === 'goed' ? it.nl : kind === 'bijna' ? it.nl.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/ /g, '  ') + ' ' : 'Xyz';
    await p.fill('#in', v); await p.press('#in', 'Enter');
    const cls = await p.locator('#fb').getAttribute('class');
    if (kind === 'fout' ? !cls.includes('bad') : cls.includes('bad')) fail(`${tag}: schrijven ${kind} ${it.id}: ${cls}`);
    await p.click('#nx');
  }
  // 6. Toets: alles goed -> 44/44 en cijfer 10,0; daarna voortgang na herladen
  await p.click('nav [data-mode="toets"]'); await p.click('#go');
  for (let i = 0; i < 44; i++) {
    const [id, kind] = await p.evaluate(() => [test.ids[test.i], test.i % 2 ? 'schrijf' : 'wijs']);
    if (kind === 'wijs') { const e = await tapItem(p, id); if (e) fail(`${tag}: toets ${id}: ${e}`); }
    else { await p.fill('#in', await p.evaluate(id => BYID[id].nl, id)); await p.press('#in', 'Enter'); }
    await p.waitForTimeout(300);
  }
  const res = (await p.locator('.result').textContent()).replace(/\s+/g, ' ');
  if (!res.includes('44 / 44') || !res.includes('10,0')) fail(`${tag}: toets ${res}`);
  const before = await p.evaluate(() => S.good);
  await p.reload(); const after = await p.evaluate(() => S.good);
  if (after !== before || after < 44 + 44) fail(`${tag}: voortgang ${before} -> ${after}`);
  // 7. Tikdoelen ≥ 44 px, geen horizontale scroll
  const small = await p.evaluate(() => [...document.querySelectorAll('button,select,input')].filter(e => e.offsetParent && (e.getBoundingClientRect().height < 44)).map(e => e.textContent || e.id));
  if (small.length) fail(`${tag}: te kleine knoppen ${small}`);
  if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) fail(`${tag}: horizontale scroll`);
  if (errs.length) fail(`${tag}: console ${errs}`);
  if (reqs.length) fail(`${tag}: netwerk ${reqs}`);
  console.log(`${tag}: aanwijzen ${good}/44, toets ${res.match(/\d+ \/ \d+/)}`);
  await ctx.close();
}
await b.close();
if (fails.length) { console.log(`uk-ie-e2e: ${fails.length} fout(en)`); process.exit(1); }
console.log('uk-ie-e2e: OK');
