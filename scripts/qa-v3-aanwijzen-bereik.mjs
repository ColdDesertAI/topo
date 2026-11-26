// BL-046 QA: in the lesson Aanwijzen on iPad sizes, every target is tappable and the answer panel never hides the land.
// Build first: node scripts/build-v3-preview.mjs (or TOPO_V3_RELEASE=1 for the release build). Run: node scripts/qa-v3-aanwijzen-bereik.mjs
// For all 11 chapters (route lesson Aanwijzen) and every question it measures, at 1080×810 and 810×1080:
//   1 reach      per target place ≥ 1 free tap point: the tap resolver (hit zone) lists the place there and document.elementFromPoint is the map, not the panel
//   2 position   the bounding box of #focusAnswerSheet is identical for all questions (1 unique position per size, so it betrays nothing)
//   3 coverage   % of the Italy shape under the panel (goal 0, tolerance ≤ 1 % at the edge; never a target, which reach already proves)
// Browsers: Chromium (Playwright, hasTouch) and WebKit (WebKitGTK via scripts/qa-webkit.mjs; no touch emulation there,
// the Focus layout keys on width, not on pointer type). QA_HTML overrides the page, QA_SIZES=1080x810 limits the sizes,
// QA_BROWSERS=chromium|webkit limits the browsers, QA_REQUIRE_WEBKIT=1 fails when WebKit is not installed. Exit 1 on any FAIL.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
import {webkit,webkitAvailable} from './qa-webkit.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const rel=new URL('../output/html/TOPO-V3-Italie.html',import.meta.url),prev=new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url);
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(existsSync(fileURLToPath(prev))?prev:rel);
const SIZES=(process.env.QA_SIZES||'1080x810,810x1080').split(',').map(x=>x.split('x').map(Number));
const BROWSERS=(process.env.QA_BROWSERS||'chromium,webkit').split(',');
const CHAPTERS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers'];
const TOLERANCE=1; // % of Italy under the panel
// In-page code (function bodies, run in both browsers). Each returns JSON.
// The lesson is the route lesson "Aanwijzen" of a chapter (demo state #alles: every chapter unlocked, in memory only).
const START=g=>`window.confirm=()=>true;startRouteLesson(${JSON.stringify(g)},'point');return true;`;
const STATE=`const a=state.route.active;return {mode:state.mode,q:state.questionMode,focus:document.body.dataset.focusMode,shell:document.body.dataset.focusShell,answered:state.answered,done:!a||a.done,paused:typeof roundPaused!=='undefined'&&roundPaused,id:state.current&&state.current.id,pool:a?[...new Set(a.queue.map(t=>t.id))]:[]};`;
// answer correctly (a wrong answer only repeats the question), go on; a paused round is continued from the result screen
const STEP=`if(typeof roundPaused!=='undefined'&&roundPaused){document.querySelector('#finishScreen .primary')?.click();return true}if(state.current&&!state.answered)grade(true,byId[state.current.id]);next();return true;`;
const MEASURE=`
 const id=state.current.id,map=document.getElementById('map'),sheet=document.getElementById('focusAnswerSheet');
 const sr=sheet.getBoundingClientRect(),sv=getComputedStyle(sheet),shown=!sheet.hidden&&sv.display!=='none'&&sr.width>0;
 const panel=shown?[sr.left,sr.top,sr.width,sr.height].map(v=>Math.round(v*2)/2):null;
 // Reach = the real tap resolver (mapTapCandidates, the geometry the click handler uses: point radius, fill, river stroke)
 // lists the place AND the topmost element at that point is the map itself, not the panel or another control.
 const item=byId[id],cls=mapFeatureClass(item);let free=0,tried=0;
 const boxes=[...map.querySelectorAll('[data-id="'+id+'"],[data-hit-id="'+id+'"]')].map(n=>n.getBoundingClientRect()).filter(r=>r.width>0||r.height>0);
 if(cls==='point'){const q=new DOMPoint(item.px,item.py).matrixTransform(map.getScreenCTM());boxes.push({left:q.x,top:q.y,width:0,height:0});}
 for(const r of boxes){
  const pad=cls==='point'?22:0,L=r.left-pad,T=r.top-pad,Wd=r.width+2*pad,Ht=r.height+2*pad;
  const nx=Math.min(40,Math.max(4,Math.ceil(Wd/3))),ny=Math.min(40,Math.max(4,Math.ceil(Ht/3)));
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const x=L+(i+.5)*Wd/nx,y=T+(j+.5)*Ht/ny;
   if(x<0||y<0||x>=innerWidth||y>=innerHeight)continue;
   if(!mapTapCandidates(x,y,cls).some(c=>c.id===id))continue;tried++;
   const e=document.elementFromPoint(x,y);if(e&&(e===map||map.contains(e)))free++;}
 }
 let land=0,under=0;const it=map.querySelector('.italy');
 if(it&&shown){const r=it.getBoundingClientRect(),m=it.getScreenCTM().inverse(),N=70;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const x=r.left+(i+.5)*r.width/N,y=r.top+(j+.5)*r.height/N;
   if(!it.isPointInFill(new DOMPoint(x,y).matrixTransform(m)))continue;land++;
   if(x>=sr.left&&x<=sr.right&&y>=sr.top&&y<=sr.bottom)under++;}}
 return {id,name:state.current.name,panel,free,tried,land,under};`;
async function drive(run,wait,label,W,H){
 const res={label,ok:true,msgs:[],reach:0,total:0,positions:new Set(),maxCover:0,coverWorst:''};
 const bad=m=>{res.ok=false;res.msgs.push(m);};
 for(const ch of CHAPTERS){
  await run(START(ch));await wait(900);
  const s0=await run(STATE);
  if(s0.mode!=='route'||s0.q!=='point'||s0.focus!=='true'){bad(`${ch}: les Aanwijzen/Focus niet actief (${JSON.stringify(s0)})`);continue;}
  const pool=new Set(s0.pool),seen=new Map();
  for(let draw=0;draw<200&&seen.size<pool.size;draw++){
   const st=await run(STATE);if(st.done&&!st.paused)break;
   if(st.id&&pool.has(st.id)&&!st.answered&&!seen.has(st.id)&&!st.paused){
    const m=await run(MEASURE);seen.set(m.id,m);
    if(!m.panel)bad(`${ch}/${m.name}: paneel niet zichtbaar`);else res.positions.add(m.panel.join(','));
    const cover=m.land?100*m.under/m.land:0;if(cover>res.maxCover){res.maxCover=cover;res.coverWorst=m.name;}
   }
   await run(STEP);await wait(160);
  }
  for(const id of pool){const m=seen.get(id);res.total++;
   if(!m)bad(`${ch}: vraag ${id} nooit getrokken`);
   else if(m.free>0)res.reach++;else bad(`${ch}/${m.name}: 0 van ${m.tried} tikpunten in de hit-zone vrij (bedekt)`);}
 }
 return res;
}
const report=[];
for(const [W,H] of SIZES){
 if(BROWSERS.includes('chromium')){
  const b=await chromium.launch();const c=await b.newContext({viewport:{width:W,height:H},hasTouch:true});const p=await c.newPage();
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(HTML+'#alles/bg01');await p.waitForTimeout(1500);
  report.push(await drive(body=>p.evaluate(b=>new Function(b)(),body),ms=>p.waitForTimeout(ms),`Chromium ${W}×${H}`,W,H));
  if(errors.length)report.at(-1).msgs.push('JS-fouten: '+errors.slice(0,3).join(' | ')),report.at(-1).ok=false;
  await b.close();
 }
 if(BROWSERS.includes('webkit')){
  if(!webkitAvailable()){console.log('WebKit niet beschikbaar (WebKitWebDriver/Xvfb/MiniBrowser): overgeslagen');if(process.env.QA_REQUIRE_WEBKIT)report.push({label:`WebKit ${W}×${H}`,ok:false,msgs:['WebKit niet beschikbaar'],reach:0,total:45,positions:new Set(),maxCover:0});continue;}
  const w=await webkit();
  try{
   await w.goto(HTML+'#alles/bg01');await w.viewport(W,H);await w.wait(2000);
   report.push(await drive(body=>w.eval(body),ms=>w.wait(ms),`WebKit ${W}×${H}`,W,H));
  }finally{await w.close();}
 }
}
let fail=false;
for(const r of report){
 const pos=r.positions.size,verdicts=[r.reach===45&&r.total===45,pos===1,r.maxCover<=TOLERANCE];
 const ok=r.ok&&verdicts.every(Boolean);if(!ok)fail=true;
 console.log(`${ok?'PASS':'FAIL'} ${r.label}: bereikbaar ${r.reach}/${r.total} (doel 45/45) · unieke paneelposities ${pos} (doel 1) · Italië onder paneel max ${r.maxCover.toFixed(1)}%${r.coverWorst?' bij '+r.coverWorst:''} (doel ≤ ${TOLERANCE}%)`);
 for(const m of r.msgs.slice(0,60))console.log('   - '+m);
 if(r.msgs.length>60)console.log(`   … en ${r.msgs.length-60} meer`);
}
if(!report.length){console.log('FAIL: niets gemeten');fail=true;}
process.exit(fail?1:0);
