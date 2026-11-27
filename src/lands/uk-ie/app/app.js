// UK-01: oefenmodule Verenigd Koninkrijk en Ierland. Eén bestand, offline, zonder afhankelijkheden.
(function () {
  'use strict';
  const D = window.TOPO_UK, C = window.TopoCheck;
  const ITEMS = D.items.items, BY = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const CHAPTERS = D.route.chapters, G = D.geo, T = G.targets;
  const MW = G.projection.width, MH = G.projection.height;
  const KEY = 'topo-uk-ie-v1';
  const NS = 'http://www.w3.org/2000/svg';
  const app = document.getElementById('app');

  // ---------- opslag ----------
  let store = { items: {} };
  try { store = JSON.parse(localStorage.getItem(KEY)) || store; } catch (e) { /* privé-modus: alleen in geheugen */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
  const rec = id => (store.items[id] ||= { aanwijzen: 0, herkennen: 0, schrijven: 0 });
  function record(id, mode, ok) { const r = rec(id); r[mode] = ok ? Math.min(3, (r[mode] || 0) + 1) : 0; if (!ok) r.miss = (r.miss || 0) + 1; save(); }
  const known = id => { const r = store.items[id]; return !!r && r.aanwijzen >= 1 && r.schrijven >= 1; };
  const weak = () => ITEMS.filter(i => { const r = store.items[i.id]; return r && (r.miss || 0) > 0 && !known(i.id); });

  // ---------- hulp ----------
  const h = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'on') for (const [ev, fn] of Object.entries(v)) e.addEventListener(ev, fn);
      else if (k === 'class') e.className = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  };
  const s = (tag, attrs = {}) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const KIND = { stad: 'stad', eiland: 'eiland', gebergte: 'gebergte', regio: 'streek', land: 'land', rivier: 'rivier', water: 'water' };
  const kindOf = it => it.subtype === 'meer' ? 'meer' : it.subtype === 'oceaan' ? 'oceaan' : it.subtype === 'zeestraat' ? 'zeestraat' : it.type === 'water' ? 'zee' : KIND[it.type];
  const group = C.group;
  const DEZE = { stad: 'deze stad', eiland: 'dit eiland', gebergte: 'dit gebergte', streek: 'deze streek', land: 'dit land', rivier: 'deze rivier', meer: 'dit meer', zee: 'deze zee', oceaan: 'deze oceaan', zeestraat: 'deze zeestraat' };
  const PLURAL = new Set(['hebriden', 'kanaaleilanden', 'orkney', 'shetland']);
  const deze = it => PLURAL.has(it.id) ? 'deze eilanden' : DEZE[kindOf(it)] || 'dit';
  const heet = it => PLURAL.has(it.id) ? 'heten' : 'heet';
  const ringsD = rings => rings.map(p => p.map(r => 'M' + r.map(q => q.join(' ')).join('L') + 'Z').join('')).join('');
  function bboxOf(ids) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    for (const id of ids) {
      const t = T[id];
      if (t.kind === 'point') add(t.x, t.y);
      else if (t.kind === 'line') t.lines.forEach(l => l.forEach(([x, y]) => add(x, y)));
      else if (id === 'atlantische-oceaan' || id === 'noordzee' || id === 'noorwegen') add(...t.label);
      else t.rings.forEach(p => p[0].forEach(([x, y]) => add(x, y)));
    }
    return [x0, y0, x1, y1];
  }

  // ---------- kaart ----------
  function Map(container, opts) {
    const svg = s('svg', { role: 'img', 'aria-label': 'Kaart van het Verenigd Koninkrijk en Ierland' });
    const gZones = s('g'), gLand = s('g'), gWater = s('g'), gHi = s('g'), gDots = s('g'), gLbl = s('g'), gMark = s('g');
    svg.append(s('rect', { x: -2000, y: -2000, width: 5000, height: 5000, fill: G.base.sea }), gZones, gLand, gWater, gHi, gDots, gLbl, gMark);
    for (const b of G.base.land) {
      const p = s('path', { d: b.d, class: 'land', 'vector-effect': 'non-scaling-stroke', 'stroke-width': .8, 'data-id': b.id });
      p.style.fill = opts.neutral ? G.base.neutral : b.sheetFill;
      gLand.append(p);
    }
    const river = s('path', { d: G.base.thames, class: 'river', 'vector-effect': 'non-scaling-stroke', 'stroke-width': 2.2 });
    gWater.append(river);
    if (G.base.ness) gWater.append(s('path', { d: G.base.ness, class: 'lake' }));
    const dots = {};
    for (const it of ITEMS.filter(i => i.type === 'stad')) { const t = T[it.id]; dots[it.id] = s('circle', { cx: t.x, cy: t.y, class: 'dot', 'vector-effect': 'non-scaling-stroke', 'stroke-width': 1.5 }); gDots.append(dots[it.id]); }
    container.append(svg);

    let vb = [0, 0, MW, MH];
    const px = () => vb[2] / (svg.getBoundingClientRect().width || 1000);
    const k = () => Math.max(vb[2] / (svg.clientWidth || 1000), vb[3] / (svg.clientHeight || 1000));
    function apply() {
      svg.setAttribute('viewBox', vb.join(' '));
      const u = k();
      for (const c of Object.values(dots)) c.setAttribute('r', (c.classList.contains('hi') ? 9 : 6.5) * u);
      for (const t of gLbl.children) { t.setAttribute('font-size', 15 * u); t.setAttribute('stroke-width', 4 * u); }
      for (const t of gHi.querySelectorAll('.ring')) { t.setAttribute('r', 17 * u); t.setAttribute('stroke-width', 3 * u); }
      for (const t of gMark.children) { t.setAttribute('r', 10 * u); t.setAttribute('stroke-width', 2.5 * u); }
    }
    function fit(box, pad = .14) {
      let [x0, y0, x1, y1] = box; let w = x1 - x0, hh = y1 - y0;
      const min = 260; if (w < min) { x0 -= (min - w) / 2; w = min; } if (hh < min) { y0 -= (min - hh) / 2; hh = min; }
      x0 -= w * pad; y0 -= hh * pad; w *= 1 + 2 * pad; hh *= 1 + 2 * pad;
      const cw = svg.clientWidth || 800, ch = svg.clientHeight || 600, ar = cw / ch;
      if (w / hh < ar) { const nw = hh * ar; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ar; y0 -= (nh - hh) / 2; hh = nh; }
      vb = [x0, y0, w, hh]; apply();
    }
    let home = [0, 0, MW, MH];
    const setHome = b => { home = b; fit(b); };
    function zoomAt(f, cx, cy) {
      const nw = Math.min(MW * 1.6, Math.max(60, vb[2] / f)), r = nw / vb[2];
      vb = [cx - (cx - vb[0]) * r, cy - (cy - vb[1]) * r, nw, vb[3] * r]; apply();
    }
    const toMap = (clientX, clientY) => { const r = svg.getBoundingClientRect(), u = vb[2] / r.width; return [vb[0] + (clientX - r.left) * u, vb[1] + (clientY - r.top) * (vb[3] / r.height)]; };
    // aanraken: één vinger = slepen of tikken, twee vingers = knijpen
    const ptrs = new globalThis.Map(); let start = null, pinch = null;
    svg.addEventListener('pointerdown', e => { svg.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); if (ptrs.size === 1) start = { x: e.clientX, y: e.clientY, vb: vb.slice(), moved: false }; else { start && (start.moved = true); const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), vb: vb.slice() }; } });
    svg.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 2 && pinch) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); vb = pinch.vb.slice(); const [cx, cy] = toMap((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); zoomAt(d / pinch.d, cx, cy); return; }
      if (start && ptrs.size === 1) { const dx = e.clientX - start.x, dy = e.clientY - start.y; if (Math.hypot(dx, dy) > 8) start.moved = true; if (start.moved) { const u = start.vb[2] / svg.getBoundingClientRect().width; vb = [start.vb[0] - dx * u, start.vb[1] - dy * u, start.vb[2], start.vb[3]]; apply(); } }
    });
    const end = e => { const was = ptrs.has(e.pointerId); ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (was && e.type === 'pointerup' && ptrs.size === 0 && start && !start.moved && opts.onTap) { const [x, y] = toMap(e.clientX, e.clientY); opts.onTap(x, y, px()); } if (ptrs.size === 0) start = null; };
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    svg.addEventListener('wheel', e => { e.preventDefault(); const [x, y] = toMap(e.clientX, e.clientY); zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, x, y); }, { passive: false });
    const ctl = h('div', { class: 'mapctl' },
      h('button', { 'aria-label': 'Inzoomen', on: { click: () => zoomAt(1.4, vb[0] + vb[2] / 2, vb[1] + vb[3] / 2) } }, '+'),
      h('button', { 'aria-label': 'Uitzoomen', on: { click: () => zoomAt(1 / 1.4, vb[0] + vb[2] / 2, vb[1] + vb[3] / 2) } }, '−'),
      h('button', { 'aria-label': 'Terug naar beginbeeld', on: { click: () => fit(home) } }, '⌂'));
    container.append(ctl);
    new ResizeObserver(() => fit(home)).observe(container);

    function clear() { gHi.replaceChildren(); gLbl.replaceChildren(); gMark.replaceChildren(); gZones.replaceChildren(); river.classList.remove('hi'); Object.values(dots).forEach(d => d.classList.remove('hi')); apply(); }
    function highlight(id, cls = 'area-hi') {
      const t = T[id], it = BY[id];
      if (t.kind === 'point') { dots[id].classList.add('hi'); gHi.append(s('circle', { cx: t.x, cy: t.y, class: 'ring' })); }
      else if (t.kind === 'line') { if (id === 'theems') river.classList.add('hi'); gHi.append(s('circle', { cx: t.label[0], cy: t.label[1], class: 'ring' })); if (id === 'loch-ness') gHi.append(s('path', { d: G.base.ness, class: cls, 'vector-effect': 'non-scaling-stroke', 'stroke-width': 2 })); }
      else { const p = s('path', { d: ringsD(t.rings), class: it.type === 'water' ? 'zone hi' : cls, 'vector-effect': 'non-scaling-stroke', 'stroke-width': 2, 'fill-rule': 'evenodd' }); (it.type === 'water' ? gZones : gHi).append(p); }
      apply();
    }
    function label(id, text) {
      const t = T[id]; const [x, y] = t.kind === 'point' ? [t.x, t.y] : t.label;
      const el = s('text', { x, y, class: 'lbl', 'text-anchor': 'middle', dy: t.kind === 'point' ? '-0.9em' : '0.35em' }); el.textContent = text ?? BY[id].name.nl;
      gLbl.append(el); apply();
    }
    function mark(x, y) { gMark.append(s('circle', { cx: x, cy: y, class: 'tapmark' })); apply(); }
    return { svg, fit, setHome, clear, highlight, label, mark, px, zoomTo: (x, y, f) => zoomAt(f, x, y) };
  }

  // ---------- schermen ----------
  function home() {
    const n = ITEMS.filter(i => known(i.id)).length, w = weak();
    const chapterCard = ch => {
      const k = ch.itemIds.filter(known).length;
      return h('section', { class: 'chapter' },
        h('h3', {}, ch.title),
        h('p', { class: 'names' }, ch.itemIds.map(id => BY[id].name.nl).join(', ')),
        h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': k, 'aria-valuemax': ch.itemIds.length, 'aria-label': 'Gekend' }, h('i', { style: `width:${(100 * k) / ch.itemIds.length}%` })),
        h('div', { class: 'count' }, `${k} van ${ch.itemIds.length} gekend`),
        h('div', { class: 'modes' },
          h('button', { on: { click: () => play({ mode: 'leren', ids: ch.itemIds, title: ch.title }) } }, 'Leren'),
          h('button', { on: { click: () => play({ mode: 'aanwijzen', ids: ch.itemIds, title: ch.title }) } }, 'Aanwijzen'),
          h('button', { on: { click: () => play({ mode: 'herkennen', ids: ch.itemIds, title: ch.title }) } }, 'Herkennen'),
          h('button', { on: { click: () => play({ mode: 'schrijven', ids: ch.itemIds, title: ch.title }) } }, 'Schrijven')));
    };
    app.replaceChildren(h('div', { class: 'home' },
      h('h1', {}, 'Topografie Verenigd Koninkrijk en Ierland'),
      h('p', { class: 'sub' }, 'Oefenen voor de overhoring: aanwijzen, herkennen en foutloos schrijven. 44 plaatsen, gebieden en wateren.'),
      h('div', { class: 'overall' }, h('strong', {}, `${n} van 44 gekend`), h('span', { class: 'hint' }, ' (een keer goed aangewezen én goed geschreven)'),
        h('div', { class: 'bar' }, h('i', { style: `width:${(100 * n) / 44}%` }))),
      h('div', { class: 'big-actions' },
        h('button', { class: 'primary', on: { click: () => play({ mode: 'overhoring', ids: ITEMS.map(i => i.id), title: 'Proefoverhoring', neutral: true }) } }, 'Proefoverhoring', h('small', {}, 'Alle 44, op een grijze kaart. Met cijfer.')),
        h('button', { on: { click: () => play({ mode: 'leren', ids: ITEMS.map(i => i.id), title: 'Hele kaart' }) } }, 'Hele kaart bekijken', h('small', {}, 'Tik op een naam en zie waar het ligt.')),
        w.length ? h('button', { on: { click: () => play({ mode: 'mix', ids: w.map(i => i.id), title: 'Je fouten' }) } }, `Oefen je fouten (${w.length})`, h('small', {}, 'Aanwijzen en schrijven door elkaar.')) : null),
      h('h2', {}, 'Hoofdstukken'),
      h('div', { class: 'chapters' }, CHAPTERS.map(chapterCard)),
      h('h2', {}, 'Onthoud'),
      h('div', { class: 'facts' }, D.items.facts.map(f => h('p', {}, f.text))),
      h('div', { class: 'reset' }, h('button', { class: 'ghost', on: { click: () => { if (confirmReset()) { store = { items: {} }; save(); home(); } } } }, 'Voortgang wissen'))));
    window.scrollTo(0, 0);
  }
  let resetArmed = 0;
  function confirmReset() { if (Date.now() - resetArmed < 4000) return true; resetArmed = Date.now(); const b = document.querySelector('.reset button'); if (b) b.textContent = 'Nog een keer tikken om te wissen'; return false; }

  function play(cfg) {
    const items = cfg.ids.map(id => BY[id]);
    const mapEl = h('div', { class: 'mapwrap' }), panel = h('div', { class: 'panel' });
    app.replaceChildren(h('div', { class: 'play' }, mapEl, panel));
    let current = null, answered = false, onTap = null;
    const map = Map(mapEl, { neutral: !!cfg.neutral, onTap: (x, y, px) => onTap && onTap(x, y, px) });
    const fitIds = cfg.mode === 'overhoring' || cfg.ids.length > 20 ? null : cfg.ids;
    requestAnimationFrame(() => map.setHome(fitIds ? bboxOf(fitIds) : [60, 40, MW - 60, MH - 40]));
    const top = () => h('div', { class: 'top' }, h('button', { on: { click: home }, 'aria-label': 'Terug naar het overzicht' }, '← Terug'), h('div', { class: 'where' }, cfg.title));

    if (cfg.mode === 'leren') return learn();

    // vragenrij: elk item tot het een keer goed is; een fout komt 3 vragen later terug (niet in de overhoring)
    const exam = cfg.mode === 'overhoring';
    let queue = shuffle(items).map((it, i) => ({ it, mode: modeFor(it, i) }));
    const total = queue.length; let done = 0, right = 0; const wrong = [];
    function modeFor(it, i) { if (cfg.mode === 'mix' || exam) return i % 2 ? 'schrijven' : 'aanwijzen'; return cfg.mode; }
    next();

    function next() {
      map.clear(); answered = false; onTap = null;
      if (!queue.length) return finish();
      current = queue[0];
      const { it, mode } = current;
      const box = [];
      box.push(top(), h('div', { class: 'progress' }, exam ? `Vraag ${done + 1} van ${total}` : `${done} van ${total} goed`));
      if (mode === 'aanwijzen') {
        box.push(h('div', { class: 'prompt' }, h('p', { class: 'q' }, 'Wijs aan op de kaart:'), h('p', { class: 'target' }, it.name.nl), h('p', { class: 'kind' }, kindOf(it))));
        box.push(h('p', { class: 'hint' }, (it.type === 'water' ? 'Tik in het water.' : it.type === 'stad' ? 'Tik op de stip.' : 'Tik in het gebied.') + ' Inzoomen kan met twee vingers of met +.'));
        onTap = (x, y, px) => tapAnswer(x, y, px);
      } else {
        map.highlight(it.id);
        if (mode === 'herkennen') {
          const same = o => o.id !== it.id && group(o) === group(it);
          const pool = [...shuffle(items.filter(same)), ...shuffle(ITEMS.filter(o => same(o) && !cfg.ids.includes(o.id)))].slice(0, 3);
          const opts = shuffle([it, ...pool]);
          box.push(h('div', { class: 'prompt' }, h('p', { class: 'q' }, 'Kies het goede antwoord.'), h('p', { class: 'target' }, `Hoe ${heet(it)} ${deze(it)}?`), h('p', { class: 'kind' }, 'Het staat oranje op de kaart.')));
          box.push(h('div', { class: 'choices' }, opts.map(o => h('button', { 'data-id': o.id, on: { click: e => choose(o, e.currentTarget) } }, o.name.nl))));
        } else {
          const inp = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': 'Naam', enterkeyhint: 'done' });
          const form = h('form', { class: 'write', on: { submit: e => { e.preventDefault(); write(inp.value, inp); } } }, inp, h('button', { class: 'primary', type: 'submit' }, 'Klaar'));
          box.push(h('div', { class: 'prompt' }, h('p', { class: 'q' }, 'Schrijf de naam op.'), h('p', { class: 'target' }, `Hoe ${heet(it)} ${deze(it)}?`), h('p', { class: 'kind' }, 'Het staat oranje op de kaart. Schrijf het foutloos, met puntjes en accenten.')), form);
          setTimeout(() => inp.focus({ preventScroll: true }), 50);
        }
      }
      box.push(h('div', { class: 'fb' }));
      panel.replaceChildren(...box);
    }
    function feedback(ok, main, detail) {
      const fb = panel.querySelector('.fb');
      fb.replaceChildren(h('div', { class: 'feedback ' + (ok ? 'ok' : 'bad'), role: 'status' }, main, detail ? h('span', { class: 'detail' }, detail) : null),
        h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'primary', on: { click: advance } }, 'Volgende')));
      fb.querySelector('button.primary').focus({ preventScroll: true });
    }
    function settle(ok, mode) {
      answered = true; onTap = null; done += ok || exam ? 1 : 0; if (ok) right++;
      record(current.it.id, mode, ok);
      if (!ok) wrong.push(current.it);
    }
    function advance() {
      const c = queue.shift();
      if (c && !exam && !c.ok) queue.splice(Math.min(3, queue.length), 0, { it: c.it, mode: c.mode });
      next();
    }
    function tapAnswer(x, y, px) {
      if (answered) return;
      const it = current.it;
      if (it.type === 'stad') {
        const near = ITEMS.filter(o => o.type === 'stad').map(o => C.dist(x, y, T[o.id]) / px).sort((a, b) => a - b);
        if (near.length > 1 && near[1] < 26 && near[1] - near[0] < 10) { map.zoomTo(x, y, 2.5); const fb = panel.querySelector('.fb'); fb.replaceChildren(h('p', { class: 'hint', role: 'status' }, 'Hier liggen steden dicht bij elkaar. Ik zoom in: tik nog een keer.')); return; }
      }
      const ok = C.tapIsCorrect(x, y, it, ITEMS, T, px);
      current.ok = ok; settle(ok, 'aanwijzen');
      map.mark(x, y);
      if (ok) { map.highlight(it.id, 'area-ok'); map.label(it.id); feedback(true, 'Goed zo!'); if (!exam) setTimeout(() => current && current.it === it && answered && panel.isConnected && advance(), 1100); return; }
      const hit = C.whatWasTapped(x, y, ITEMS, T, px);
      map.highlight(it.id); map.label(it.id);
      if (hit && hit !== it.id) map.label(hit, BY[hit].name.nl);
      feedback(false, 'Niet goed.', (hit && hit !== it.id ? `Je tikte op ${BY[hit].name.nl}. ` : '') + `${it.name.nl} ligt op de oranje plek.`);
    }
    function choose(o, btn) {
      if (answered) return;
      const it = current.it, ok = o.id === it.id; current.ok = ok; settle(ok, 'herkennen');
      panel.querySelectorAll('.choices button').forEach(b => { b.disabled = true; if (b.dataset.id === it.id) b.classList.add('ok'); });
      if (!ok) btn.classList.add('bad');
      map.label(it.id);
      if (ok) { feedback(true, 'Goed zo!'); if (!exam) setTimeout(() => current && current.it === it && answered && panel.isConnected && advance(), 1000); }
      else feedback(false, 'Niet goed.', `Dit is ${it.name.nl}.`);
    }
    function write(val, inp) {
      if (answered) return;
      const it = current.it, r = C.checkWritten(val, it);
      if (r.kind === 'empty') { inp.focus(); return; }
      current.ok = r.ok; settle(r.ok, 'schrijven'); inp.disabled = true; inp.blur();
      map.label(it.id);
      if (r.ok) { feedback(true, 'Goed geschreven!'); if (!exam) setTimeout(() => current && current.it === it && answered && panel.isConnected && advance(), 1100); return; }
      const why = { accent: 'Bijna: let op de puntjes of het accent.', spacing: 'Bijna: let op de spaties.', close: 'Bijna: er zit een spelfout in.', wrong: '' }[r.kind];
      feedback(false, 'Niet goed.', `${why ? why + ' ' : ''}Het is: ${it.name.nl}`);
    }
    function finish() {
      map.clear();
      const cijfer = Math.max(1, Math.round((1 + 9 * right / total) * 10) / 10);
      const uniq = [...new globalThis.Map(wrong.map(i => [i.id, i])).values()];
      panel.replaceChildren(top(), h('div', { class: 'prompt result' },
        exam ? h('p', { class: 'q' }, 'Je proefoverhoring') : h('p', { class: 'q' }, 'Klaar met dit rondje!'),
        exam ? h('p', { class: 'score' }, `${right} / ${total}`) : h('p', { class: 'score' }, '★'),
        exam ? h('p', {}, `Dat is ongeveer een ${String(cijfer).replace('.', ',')}.`) : h('p', {}, uniq.length ? `${uniq.length} keer was het lastig. Die komen vaker terug.` : 'Alles in een keer goed!'),
        uniq.length ? h('div', {}, h('strong', {}, exam ? 'Fout:' : 'Lastig:'), h('ul', { class: 'mistakes' }, uniq.map(i => h('li', {}, i.name.nl)))) : null),
        h('div', { class: 'row' },
          uniq.length ? h('button', { class: 'primary', on: { click: () => play({ mode: 'mix', ids: uniq.map(i => i.id), title: 'Je fouten' }) } }, 'Oefen deze fouten') : null,
          h('button', { on: { click: () => play(cfg) } }, 'Nog een keer'),
          h('button', { on: { click: home } }, 'Overzicht')));
      uniq.forEach(i => map.label(i.id));
    }

    function learn() {
      let on = null;
      const show = id => {
        map.clear(); on = id; if (!id) return;
        map.highlight(id); map.label(id);
        panel.querySelectorAll('.learnlist button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
      };
      const list = h('div', { class: 'learnlist' }, items.map(it => h('button', { 'data-id': it.id, on: { click: () => show(on === it.id ? null : it.id) } },
        h('span', { class: 'code' }, it.source.code), h('span', {}, it.name.nl, h('br'), h('small', { class: 'hint' }, kindOf(it))))));
      panel.replaceChildren(top(), h('p', { class: 'hint' }, 'Tik op een naam om te zien waar het ligt, of tik op de kaart. De codes zijn die van je blad.'), list,
        h('div', { class: 'row' }, h('button', { class: 'primary', on: { click: () => play({ ...cfg, mode: 'aanwijzen' }) } }, 'Nu aanwijzen')));
      onTap = (x, y, px) => { const id = C.whatWasTapped(x, y, items, T, px); show(id); if (id) panel.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest' }); };
    }
  }

  home();
  window.__topoUK = { play, home, BY, T };
})();
