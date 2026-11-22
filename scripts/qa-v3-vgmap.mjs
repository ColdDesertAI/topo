// BL-031a QA: the Voortgang map (svg.v3VgMap) is built once and reused. Build first: node scripts/build-v3-preview.mjs.
// Run: NODE_PATH=<playwright node_modules> node scripts/qa-v3-vgmap.mjs [--phase=voor]
//   --phase=voor   only saves the crit. 4 screenshots of the current build as the baseline (run on the OLD code) and exits.
//   (default)      crit. 1, 2, 3, 5, 7 and crit. 4 against the saved baseline (needs --phase=voor run first, same QA_OUT).
// Screenshots go to QA_OUT (default os.tmpdir(), never the repo). Exit code 1 on any failure.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {existsSync,readFileSync} from 'node:fs';
const {chromium}=createRequire(import.meta.url)('playwright');
const OUT=process.env.QA_OUT||tmpdir();
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const phase=(process.argv.find(a=>a.startsWith('--phase='))||'').slice(8)||'na';
const fails=[],fail=(w,m)=>{fails.push(w+': '+m);console.log('FAIL',w,m);},ok=(w,m)=>console.log('ok  ',w,m||'');
const SIZES=[[1440,900],[1080,810],[810,1080]],STATES=['afgerond','alles'];
const STATUSES=['beheerst','bezig','nog'];
const SEL='.v3View-voortgang svg.v3VgMap';
const b=await chromium.launch();
async function open(W,H,hash){const p=await b.newPage({viewport:{width:W,height:H}});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.errors=errors;
 await p.goto(HTML+hash);await p.waitForTimeout(1300);return p;}
const nav=async(p,t,ms=900)=>{await p.locator(`.v3Side [data-nav=${t}]`).filter({visible:true}).first().click();await p.waitForTimeout(ms);};
// Per status: unique data-id with v3St-<status>, plus the legend numbers and nodes that carry a status but are not in the passport.
const counts=p=>p.evaluate(()=>{const svg=document.querySelector('.v3View-voortgang svg.v3VgMap'),c={beheerst:new Set(),bezig:new Set(),nog:new Set()},multi=[];
 svg.querySelectorAll('[data-id]').forEach(n=>{const st=['beheerst','bezig','nog'].filter(s=>n.classList.contains('v3St-'+s));if(st.length>1)multi.push(n.dataset.id);for(const s of st)c[s].add(n.dataset.id);});
 const leg={};document.querySelectorAll('.v3View-voortgang .v3VgLegend li').forEach(li=>{const k=['beheerst','bezig','nog'].find(s=>li.classList.contains('v3St-'+s));leg[k]=+(/(\d+)\s*$/.exec(li.textContent)||[])[1];});
 return {n:Object.fromEntries(Object.entries(c).map(([k,v])=>[k,v.size])),leg,multi};});

// ---- crit. 4: screenshots 'voor' / 'eerste' / 'wissel3' + pixel comparison in the browser
async function shot(p,name){const f=join(OUT,`vg-${name}.png`);await p.locator('.v3View-voortgang').screenshot({path:f});return f;}
async function diff(p,fa,fb){const [A,B]=[fa,fb].map(f=>readFileSync(f).toString('base64'));
 return p.evaluate(async([a,b])=>{const load=s=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src='data:image/png;base64,'+s;});
  const [x,y]=await Promise.all([load(a),load(b)]);if(x.width!==y.width||x.height!==y.height)return {size:[x.width,x.height,y.width,y.height]};
  const d=i=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);return g.getImageData(0,0,i.width,i.height).data;};
  const u=d(x),v=d(y);let bad=0;for(let i=0;i<u.length;i+=4)if(Math.abs(u[i]-v[i])>8||Math.abs(u[i+1]-v[i+1])>8||Math.abs(u[i+2]-v[i+2])>8)bad++;
  return {pct:100*bad/(u.length/4)};},[A,B]);}
for(const [W,H] of SIZES)for(const st of STATES){
 const w=`crit4 ${W}×${H} #${st}/bg01`,p=await open(W,H,`#${st}/bg01`);
 await nav(p,'voortgang');
 if(phase==='voor'){await shot(p,`voor-${W}x${H}-${st}`);ok(w,'baseline saved');await p.close();continue;}
 const voor=join(OUT,`vg-voor-${W}x${H}-${st}.png`);if(!existsSync(voor)){fail(w,'baseline missing (run --phase=voor on the old build)');await p.close();continue;}
 const e=await shot(p,`eerste-${W}x${H}-${st}`);
 for(let i=0;i<3;i++){await nav(p,'reis');await nav(p,'voortgang');}
 const r3=await shot(p,`wissel3-${W}x${H}-${st}`);
 for(const [tag,f] of [['eerste',e],['na 3 wissels',r3]]){const d=await diff(p,voor,f);
  if(d.size)fail(w+' '+tag,'sizes differ '+d.size);else if(d.pct>0.1)fail(w+' '+tag,d.pct.toFixed(3)+' % afwijkend > 0,1 %');else ok(w+' '+tag,d.pct.toFixed(3)+' % afwijkend');}
 if(p.errors.length)fail(w,'pageerrors '+p.errors.join('|'));
 await p.close();
}
if(phase==='voor'){await b.close();console.log('baseline klaar in',OUT);process.exit(0);}

// ---- crit. 1, 2, 3: same node, no stale classes, status counts
for(const [st,bg] of [['alles','bg03'],['afgerond','bg01']]){
 const w=`crit1-3 1080×810 #${st}/${bg}`,p=await open(1080,810,`#${st}/${bg}`);
 await nav(p,'voortgang');
 await p.evaluate(s=>{window.__vg=document.querySelector(s);},SEL);
 const c1=await counts(p);
 for(let i=0;i<5;i++){await nav(p,'reis',700);await nav(p,'voortgang',700);}
 const same=await p.evaluate(s=>({same:document.querySelector(s)===window.__vg,total:document.querySelectorAll('svg.v3VgMap').length}),SEL);
 if(!same.same||same.total!==1)fail(w+' crit1',JSON.stringify(same));else ok(w+' crit1','zelfde node, 1 svg.v3VgMap');
 const c5=await counts(p);
 const eq=JSON.stringify(c1.n)===JSON.stringify(c5.n)&&JSON.stringify(c5.n)===JSON.stringify(c5.leg)&&JSON.stringify(c1.n)===JSON.stringify(c1.leg);
 if(!eq||c1.multi.length||c5.multi.length)fail(w+' crit3',JSON.stringify({c1,c5}));else ok(w+' crit3',JSON.stringify(c5.n)+' = legenda, 1× = 5×');
 if(st==='afgerond'){
  // crit. 2: plant a wrong class on a node whose item is not 'beheerst', switch, check it is gone.
  const planted=await p.evaluate(s=>{const svg=document.querySelector(s);const n=[...svg.querySelectorAll('[data-id]')].find(x=>!x.classList.contains('v3St-beheerst'));if(!n)return null;
   const had=n.getAttribute('class');n.classList.add('v3St-beheerst','v3Hit');window.__pl=n;return {id:n.dataset.id,had};},SEL);
  if(!planted)fail(w+' crit2','geen niet-beheerst node om te planten (bovenstaande staat te volledig)');
  else{await nav(p,'reis',700);await nav(p,'voortgang',700);
   const after=await p.evaluate(s=>{const svg=document.querySelector(s),n=window.__pl,live=[...svg.querySelectorAll('[data-id="'+n.dataset.id+'"]')];return {sameNode:svg.contains(n),cls:live.map(x=>x.getAttribute('class'))};},SEL);
   const bad=after.cls.some(c=>/v3St-beheerst/.test(c||''));const cc=await counts(p);
   const okc=JSON.stringify(cc.n)===JSON.stringify(cc.leg);
   if(bad||!after.sameNode||!okc)fail(w+' crit2',JSON.stringify({planted,after,cc}));else ok(w+' crit2','geplante klasse weg op '+planted.id+'; aantallen = legenda');}
 }
 if(p.errors.length)fail(w,'pageerrors '+p.errors.join('|'));
 await p.close();
}

// ---- crit. 5: fit after a size change (landscape -> reis -> portrait -> voortgang) vs a fresh load at 810×1080
{const w='crit5 1080×810 -> 810×1080',p=await open(1080,810,'#alles/bg01');await nav(p,'voortgang');await nav(p,'reis');
 await p.setViewportSize({width:810,height:1080});await p.waitForTimeout(600);await nav(p,'voortgang',1200);
 const grab=pg=>pg.evaluate(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {rect:[r.x,r.y,r.width,r.height].map(v=>Math.round(v*10)/10),vb:e.getAttribute('viewBox')};},SEL);
 const a=await grab(p);await p.close();
 const q=await open(810,1080,'#alles/bg01');await nav(q,'voortgang',1200);const f=await grab(q);await q.close();
 const dr=Math.max(...a.rect.map((v,i)=>Math.abs(v-f.rect[i])));
 if(dr>2||a.vb!==f.vb)fail(w,JSON.stringify({wissel:a,vers:f}));else ok(w,'rect max '+dr.toFixed(1)+' px, viewBox '+a.vb);}

// ---- crit. 7: keydown/resize listeners on document and window do not grow
{const w='crit7 listeners',p=await open(1080,810,'#alles/bg01');const c=await p.context().newCDPSession(p);
 const count=async()=>{const o={};for(const [name,expr] of [['document','document'],['window','window']]){const {result}=await c.send('Runtime.evaluate',{expression:expr});
   const {listeners}=await c.send('DOMDebugger.getEventListeners',{objectId:result.objectId});for(const t of ['keydown','resize'])o[name+'.'+t]=listeners.filter(l=>l.type===t).length;}return o;};
 await nav(p,'voortgang');const one=await count();
 for(let i=0;i<5;i++){await nav(p,'reis',600);await nav(p,'voortgang',600);}
 const five=await count();
 if(JSON.stringify(one)!==JSON.stringify(five))fail(w,JSON.stringify({one,five}));else ok(w,JSON.stringify(five));
 await p.close();}

await b.close();
console.log(fails.length?`\n${fails.length} FAIL`:'\nalles ok');
process.exit(fails.length?1:0);
