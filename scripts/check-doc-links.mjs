#!/usr/bin/env node
// Linkchecker voor markdown-verwijzingen (BL-002). Alleen lezend: leest via git, nooit de werkmap.
// Gebruik: node scripts/check-doc-links.mjs [--rev <commit>]   (standaard HEAD)
// stdout: gebroken verwijzingen als TSV  bron<TAB>regel<TAB>klasse<TAB>doel<TAB>opgelost
// stderr: totaal <N>. Exitcode 0.
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const argv = process.argv.slice(2);
const ri = argv.indexOf('--rev');
const rev = ri >= 0 && argv[ri + 1] ? argv[ri + 1] : 'HEAD';

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 30 });

const files = git(['ls-tree', '-r', '--name-only', '-z', rev]).split('\0').filter(Boolean);
const blobs = new Set(files);
const dirs = new Set();
for (const f of files) {
  const parts = f.split('/');
  for (let i = 1; i < parts.length; i++) dirs.add(parts.slice(0, i).join('/'));
}
const exists = (p) => p === '' || blobs.has(p) || dirs.has(p);

// Klasse A: [..](doel) en ![..](doel); doel mag <doel> zijn of doel "titel"
const reA = /!?\[[^\]]*\]\(\s*(<[^>]*>|[^)\s]*)(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
// Klasse B: inline code die exact een repopad is
const reB = /`((?:docs|ops|scripts|src|assets|output|work-sync)\/[^`\s*<>{}|]+)`/g;

function resolveA(src, raw) {
  let t = raw.trim();
  if (t.startsWith('<') && t.endsWith('>')) t = t.slice(1, -1);
  if (t === '' || /^[a-z][a-z0-9+.-]*:/i.test(t) || t.startsWith('#')) return null;
  t = t.split('#')[0].split('?')[0];
  if (t === '') return null;
  try { t = decodeURIComponent(t); } catch { /* laat staan */ }
  let res;
  if (t.startsWith('/')) res = path.posix.normalize(t.slice(1));
  else res = path.posix.normalize(path.posix.join(path.posix.dirname(src), t));
  if (res === '..' || res.startsWith('../')) return { outside: true, res: path.posix.normalize(t) };
  res = res.replace(/\/+$/, '');
  return { res };
}

const out = [];
for (const src of files.filter((f) => f.endsWith('.md'))) {
  const text = git(['show', `${rev}:${src}`]);
  const lines = text.split('\n');
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^\s*(```+|~~~+)/.exec(line);
    if (m) {
      if (fence === null) fence = m[1][0];
      else if (m[1][0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;
    for (const a of line.matchAll(reA)) {
      const r = resolveA(src, a[1]);
      if (!r) continue;
      if (r.outside || !exists(r.res)) out.push([src, i + 1, 'A', a[1].replace(/^<|>$/g, ''), r.res]);
    }
    for (const b of line.matchAll(reB)) {
      let p = b[1].replace(/:\d+(-\d+)?$/, '').replace(/[.,;)]+$/, '');
      p = p.replace(/\/+$/, '');
      if (!exists(p)) out.push([src, i + 1, 'B', b[1], p]);
    }
  }
}
out.sort((x, y) => {
  const a = x.join('\t'), b = y.join('\t');
  return a < b ? -1 : a > b ? 1 : 0;
});
process.stdout.write(out.map((r) => r.join('\t')).join('\n') + (out.length ? '\n' : ''));
process.stderr.write(`totaal ${out.length}\n`);
