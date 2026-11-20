// BL-035.9 (laadtijd): makes the web copy of the Italy app light. Runs inside build-site.mjs on dist/italie/index.html
// only; the offline single-file builds (output/html/*, the iPad file) are not touched.
//  1. Every embedded data: URI (images, the font) becomes a file dist/italie/assets/<sha256-16>.<ext>; the HTML points
//     to "assets/<hash>.<ext>" (relative, so /italie/ and a preview URL both work). Same bytes = same name, so the
//     files are cached as immutable (vercel.json). Images then load only when a screen uses them.
//  2. Three code spots that only accepted data: URIs, or warmed all book art at idle, are adjusted for the web copy;
//     each must be found exactly once, or the build fails.
//  3. (BL-036.9) The embedded favicon links are replaced by exactly the portal's icon set, manifest and theme-color
//     (absolute paths, so /italie/ and /italie/v2/ both use the files in the site root).
//  4. A light loading state (TOPO + a lavender bar) instead of a white screen until the app is ready (html.v3Ready).
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const vespaSrc = fileURLToPath(new URL('../assets/v3/render/exports/vespa-rijdend-v3-168.webp', import.meta.url));
const EXT = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/svg+xml': 'svg', 'font/woff2': 'woff2', 'font/woff': 'woff' };

// The portal's head set (portal/index.html, paths made absolute): same icons, manifest and theme-color on /italie/.
const ICONS = '/assets/nino-topo/v3-r3/brand/icons/';
export const FAVICON_HEAD = '<meta name="theme-color" content="#FAFAF9">'
  + `<link rel="icon" href="${ICONS}favicon.ico" sizes="any">`
  + `<link rel="icon" type="image/png" sizes="32x32" href="${ICONS}favicon-32.png">`
  + `<link rel="icon" type="image/png" sizes="16x16" href="${ICONS}favicon-16.png">`
  + `<link rel="icon" type="image/png" sizes="48x48" href="${ICONS}favicon-48.png">`
  + `<link rel="apple-touch-icon" href="${ICONS}apple-touch-icon-180.png">`
  + '<link rel="manifest" href="/site.webmanifest">';

export function splitSite(dir, { maxHtml = 2e6 } = {}) {
  const file = join(dir, 'index.html');
  let html = readFileSync(file, 'utf8');
  // BL-036.9: drop the embedded favicon links (before the data: URIs are split off) and use the portal's set.
  const embedded = html.match(/<link rel="(?:icon|apple-touch-icon|shortcut icon)"[^>]*>/g) || [];
  if (!embedded.length) throw new Error('split-site: geen ingebedde favicon-links gevonden');
  html = html.replace(/<link rel="(?:icon|apple-touch-icon|shortcut icon)"[^>]*>/g, '');
  const out = join(dir, 'assets');
  mkdirSync(out, { recursive: true });
  const written = new Map();
  let bytes = 0;
  html = html.replace(/data:([a-z0-9.+\/-]+);base64,([A-Za-z0-9+\/=]+)/g, (all, mime, b64) => {
    const ext = EXT[mime];
    if (!ext) throw new Error('split-site: onbekend type ' + mime);
    const buf = Buffer.from(b64, 'base64');
    if (buf.length < 512) return all; // tiny icons stay inline (no extra request)
    const name = createHash('sha256').update(buf).digest('hex').slice(0, 16) + '.' + ext;
    if (!written.has(name)) { writeFileSync(join(out, name), buf); written.set(name, buf.length); bytes += buf.length; }
    return 'assets/' + name;
  });
  // first: the document's own <head>/<body> (the demo preview also has them inside strings for its side-by-side pages).
  const patch = (from, to, why, first = false) => {
    const n = html.split(from).length - 1;
    if (first ? n < 1 : n !== 1) throw new Error(`split-site: verwacht ${first ? '≥ ' : ''}1× (${why}), gevonden ${n}×`);
    html = html.replace(from, () => to);
  };
  // Nino art slots: accept our own hashed asset files as well as data: URIs.
  patch("asset.src.startsWith('data:image/webp;base64,')",
    "/^(?:data:image\\/webp;base64,|assets\\/[0-9a-f]{16}\\.webp$)/.test(asset.src)", 'Nino-slotcontrole');
  // Profile images (favourite pizza): same, png/webp/jpg.
  patch('/^data:image\\/(?:png|webp|jpeg);base64,/.test(src)',
    '/^(?:data:image\\/(?:png|webp|jpeg);base64,|assets\\/[0-9a-f]{16}\\.(?:png|webp|jpg)$)/.test(src)', 'profielafbeelding');
  // Book art: no idle warm-up of every page on the web (it would download several MB in the background); the pages
  // load when the book opens, and are cached from then on.
  patch('(window.requestIdleCallback||((fn)=>setTimeout(fn,1500)))(warm,{timeout:4000});',
    '/* web: boekart laadt bij openen (BL-035.9) */', 'boek-voorladen');
  // Lazy images (only the first screen loads): every <img> gets loading="lazy" — in the markup and in HTML strings in
  // code, and for images made in code (an early src setter sets it before the first src). A hidden or never shown
  // image is then not fetched; a visible one loads as soon as it is laid out.
  html = html.replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" ');
  const lazy = '<script>(()=>{const d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,"src");Object.defineProperty(HTMLImageElement.prototype,"src",{configurable:true,enumerable:d.enumerable,get:d.get,set(v){if(!this.hasAttribute("loading"))this.loading="lazy";d.set.call(this,v);}});})();</script>';
  patch('<head><meta charset="utf-8">', '<head><meta charset="utf-8">' + lazy, 'lazy-img', true);
  // Loading state (BL-037.2): lavender page with TOPO, a bar that follows the real load progress of the first screen's
  // files (background, relief layers, Nino's portrait, the font; = `first`, weighted by bytes) and Nino on the Vespa
  // riding along on the bar. The bar always runs to 100%, the loader stays at least 1.2 s (the 0.4 s ride-out included,
  // so a warm start stays ≈ 1.2 s), at 100% the Vespa rides out to the right, then the loader fades and leaves the tree. At most 6 s (fallback: the loader never hangs).
  // prefers-reduced-motion: no Vespa, no ride, only bar and fade.
  const vespaBuf = readFileSync(vespaSrc);
  const vespaName = createHash('sha256').update(vespaBuf).digest('hex').slice(0, 16) + '.webp';
  if (!written.has(vespaName)) { writeFileSync(join(out, vespaName), vespaBuf); written.set(vespaName, vespaBuf.length); bytes += vespaBuf.length; }
  const vespaUrl = 'assets/' + vespaName;
  const css = '<style>html{background:#f4f1fd}#v3Loader{--p:0;position:fixed;inset:0;z-index:2147483647;display:grid;place-content:center;justify-items:center;gap:30px;background:#f4f1fd;visibility:visible;overflow:hidden;transition:opacity .25s ease;font:800 40px/1 ui-rounded,"SF Pro Rounded",system-ui,sans-serif;letter-spacing:.04em;color:#2a2440}'
    + '#v3Loader .v3Track{position:relative;width:min(260px,70vw);height:6px;margin-top:56px}'
    + '#v3Loader i{display:block;position:absolute;inset:0;border-radius:3px;background:#e2dcfb;overflow:hidden}#v3Loader i::after{content:"";position:absolute;inset:0 auto 0 0;width:calc(var(--p)*100%);border-radius:3px;background:#6a52e0;transition:width .25s linear}'
    + '#v3Loader img{position:absolute;bottom:4px;left:calc(var(--p)*(100% - 84px));width:84px;height:56px;max-width:none;pointer-events:none;transition:left .25s linear,transform .4s cubic-bezier(.55,0,.85,.45)}'
    + '#v3Loader.go img{transform:translateX(100vw)}'
    + '@media(prefers-reduced-motion:reduce){#v3Loader img{display:none}#v3Loader i::after{transition:none}}'
    + 'html.v3Shown #v3Loader{opacity:0;pointer-events:none}'
    // While booting, the V2 surfaces that V3 hides anyway (reis.css: the V2 header, everything in #routeHome but the
    // V3 root, the pizza meters, the Vespa toast) are display:none from the first layout, so their pictures are never
    // fetched. V3's own root is not touched; after boot V3's own rules take over.
    + 'html.v3Boot body>header,html.v3Boot #routeHome>:not(.v3Reis),html.v3Boot #ninoMeter,html.v3Boot #vespaTripToast,html.v3Boot #lessonReward{display:none!important}</style>';
  patch('<head><meta charset="utf-8">', '<head><meta charset="utf-8">' + css, 'head', true);
  patch('<head><meta charset="utf-8">', '<head><meta charset="utf-8">' + FAVICON_HEAD, 'favicon-set', true);
  // First-screen files for the loader and the portal's prefetch: the relief layers, the UI font, Nino's portrait and the
  // default background (bg03; the largest of its matches is the full picture, not the thumbnail).
  const sizeOf = n => written.get(n.replace('assets/', '')) || 0;
  const relief = JSON.parse(html.match(/window\.TOPO_V3_RELIEF=(\{[^}]*\})/)?.[1] || '{}');
  const first = new Set([
    ...Object.values(relief).filter(u => u.startsWith('assets/')),
    ...[...html.matchAll(/@font-face\{[^}]*?url\((assets\/[0-9a-f]{16}\.woff2)\)/g)].map(m => m[1]),
    ...[...html.matchAll(/"portrait":"(assets\/[0-9a-f]{16}\.webp)"/g)].map(m => m[1]),
    [...html.matchAll(/"bg03":"(assets\/[0-9a-f]{16}\.webp)"/g)].map(m => m[1]).sort((x, y) => sizeOf(y) - sizeOf(x))[0]
  ].filter(Boolean));
  const list = [...first].map(u => [u, sizeOf(u)]);
  const loaderJs = String.raw`<script>(()=>{
const h=document.documentElement,L=document.getElementById("v3Loader"),t0=performance.now(),F=__LIST__;
const MIN=1200,MAX=6000,RIDE=400,files=[];let ready=false,over=false,shownP=0,go=false;
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const finish=()=>{if(h.classList.contains("v3Shown"))return;h.classList.add("v3Shown");setTimeout(()=>document.getElementById("v3Loader")?.remove(),400);};
const paint=p=>{shownP=Math.max(shownP,p);L&&L.style.setProperty("--p",shownP.toFixed(4));};
const real=()=>{let a=0,b=0;for(const f of files){a+=f.l;b+=f.w;}return b?a/b:1;};
const up=()=>{if(!over)paint(ready?real():Math.min(real(),.95));};
const leave=()=>{if(go)return;go=true;over=true;paint(1);const wait=Math.max(150,MIN-RIDE-(performance.now()-t0)); // the ride-out ends at 1.2 s (BL-035.9: warm stays fast)
 setTimeout(()=>{if(reduce||!L){finish();return;}L.classList.add("go");let n=0;const end=()=>{if(n++)return;finish();};L.querySelector("img").addEventListener("transitionend",e=>{if(e.propertyName==="transform")end();});setTimeout(end,RIDE+200);},wait);};
const check=()=>{if(ready&&real()>=1)leave();};
const get=(u,w)=>{const f={w:w||1e5,l:0};files.push(f);const end=()=>{f.l=f.w;up();check();};
 try{fetch(u).then(async r=>{const rd=r.body&&r.body.getReader();if(!rd){await r.arrayBuffer();return;}let n=0;for(;;){const x=await rd.read();if(x.done)break;n+=x.value.length;f.l=Math.min(f.w*.98,n);up();}}).catch(()=>{}).then(end);}catch(e){end();}};
try{for(const x of F)get(x[0],x[1]);}catch(e){}
window.v3LoaderReady=()=>{try{const u=[],bg=getComputedStyle(document.body).backgroundImage.match(/url\("?([^")]+)/);if(bg)u.push(bg[1]);
 document.querySelectorAll(".v3MapStage image,.v3Side .v3Portrait img").forEach(n=>{const x=n.getAttribute("href")||n.getAttribute("src");if(x)u.push(x);});
 const have=new Set(F.map(x=>new URL(x[0],location.href).href));for(const x of u){const a=new URL(x,location.href).href;if(!have.has(a)){have.add(a);get(x,0);}}}catch(e){}
 ready=true;up();check();};
setTimeout(leave,MAX);
})();</script>`.replace('__LIST__', JSON.stringify(list));
  patch('<body>\n', '<body>\n<div id="v3Loader" role="status" aria-label="TOPO laadt"><span aria-hidden="true">TOPO</span><div class="v3Track" aria-hidden="true"><i></i><img src="' + vespaUrl + '" alt="" width="84" height="56" loading="eager" decoding="async"></div></div>\n' + loaderJs, 'body', true);
  // The app calls this when V3 has booted; the loader leaves once the first screen's files are in (or after 6 s).
  patch('requestAnimationFrame(()=>{document.documentElement.classList.replace("v3Boot","v3Ready");});',
    'requestAnimationFrame(()=>{document.documentElement.classList.replace("v3Boot","v3Ready");window.v3LoaderReady&&window.v3LoaderReady();});', 'klaar');
  if (html.length > maxHtml) throw new Error(`split-site: index.html is ${html.length} B, doel < ${maxHtml}`);
  writeFileSync(file, html);
  return { html: html.length, files: written.size, bytes, names: [...written.keys()], first: [...first] };
}
