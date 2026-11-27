// UK-01: beoordeling van geschreven antwoorden en tikken. Puur, zonder DOM (getest in scripts/land/uk-ie-check.test.mjs).
(function (root) {
  const clean = s => String(s || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
  const noAccents = s => clean(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  // Goed = letterlijk de naam of een expliciete variant; hoofdletters en spaties aan de randen tellen niet.
  // Accenten tellen wél (het blad eist foutloos schrijven): 'Belgie' is fout, met een hint.
  function checkWritten(input, item) {
    const ok = [item.name.nl, ...(item.aliases || [])];
    const a = clean(input);
    if (!a) return { ok: false, kind: 'empty' };
    if (ok.some(n => clean(n) === a)) return { ok: true };
    if (ok.some(n => noAccents(n) === noAccents(a))) return { ok: false, kind: 'accent' };
    if (ok.some(n => clean(n).replace(/[\s-]/g, '') === a.replace(/[\s-]/g, ''))) return { ok: false, kind: 'spacing' };
    if (ok.some(n => lev(clean(n), a) <= Math.max(1, Math.floor(clean(n).length / 5)))) return { ok: false, kind: 'close' };
    return { ok: false, kind: 'wrong' };
  }

  // Geometrie in kaartcoördinaten
  function inRing(x, y, ring) {
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  const inPoly = (x, y, poly) => inRing(x, y, poly[0]) && !poly.slice(1).some(h => inRing(x, y, h));
  function segDist(x, y, [x1, y1], [x2, y2]) {
    const dx = x2 - x1, dy = y2 - y1, l = dx * dx + dy * dy;
    const t = l ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / l)) : 0;
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
  }
  const lineDist = (x, y, line) => { let m = Infinity; for (let i = 1; i < line.length; i++) m = Math.min(m, segDist(x, y, line[i - 1], line[i])); return m; };
  function areaDist(x, y, t) {
    if (t.rings.some(p => inPoly(x, y, p))) return 0;
    let m = Infinity; for (const p of t.rings) m = Math.min(m, lineDist(x, y, p[0])); return m;
  }
  function dist(x, y, t) {
    if (t.kind === 'point') return Math.hypot(x - t.x, y - t.y);
    if (t.kind === 'line') return Math.min(...t.lines.map(l => lineDist(x, y, l)));
    return areaDist(x, y, t);
  }
  // Tolerantie in kaarteenheden; `px` = kaarteenheden per schermpixel.
  const TOL = { stad: 26, eiland: 16, regio: 16, gebergte: 4, land: 4, water: 8, rivier: 20, meer: 20 };
  const tolFor = item => TOL[item.subtype === 'meer' ? 'meer' : item.type] ?? 4;

  const group = it => it.type === 'stad' ? 'stad' : it.type === 'land' ? 'land' : (it.type === 'water' || it.type === 'rivier') ? 'water' : 'gebied';
  // Wat is er aangetikt? Meest specifiek eerst: stad, rivier/meer, eiland/streek/gebergte, land, water.
  const ORDER = ['stad', 'line', 'eiland', 'regio', 'gebergte', 'land', 'water'];
  function whatWasTapped(x, y, items, targets, px) {
    const cand = [];
    for (const it of items) {
      const t = targets[it.id]; if (!t) continue;
      const d = dist(x, y, t), tol = tolFor(it) * px;
      if (d <= tol) cand.push({ id: it.id, d, rank: ORDER.indexOf(t.kind === 'line' ? 'line' : it.type) });
    }
    cand.sort((a, b) => a.rank - b.rank || a.d - b.d);
    return cand.length ? cand[0].id : null;
  }
  // Is de tik goed voor `item`? Steden: binnen de tolerantie en geen andere stad dichterbij.
  function tapIsCorrect(x, y, item, items, targets, px) {
    const t = targets[item.id], d = dist(x, y, t);
    if (d > tolFor(item) * px) return false;
    if (item.type === 'stad') return !items.some(o => o.type === 'stad' && o.id !== item.id && dist(x, y, targets[o.id]) < d);
    // Net naast een vorm telt alleen als je niet precies op een ander gebied van dezelfde soort tikte (Skye ≠ Hebriden).
    if (d > 0) return !items.some(o => o.id !== item.id && group(o) === group(item) && targets[o.id] && targets[o.id].kind === 'area' && dist(x, y, targets[o.id]) === 0);
    return true;
  }
  const api = { group, checkWritten, whatWasTapped, tapIsCorrect, dist, inPoly, clean };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TopoCheck = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
