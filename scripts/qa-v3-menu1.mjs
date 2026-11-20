// BL-029 QA: the V3 composition after render "Menu 1" (docs/v3/renders/Menu 1.png).
// Build first: node scripts/build-v3-preview.mjs. Run: node scripts/qa-v3-menu1.mjs [--fps] [--quick]
// Per size × background × screen it checks:
//   overlap   no two visible text/button boxes overlap (> 2 px), nothing wider than the viewport
//   text      no visible text under 13 px
//   targets   every visible button ≥ 44 px high
//   blur      visible elements with backdrop-filter (pseudo-elements included) ≤ 3
//   nino      the sidebar Nino has one size on every screen (per width class)
//   paspoort  Voortgang: the Kennis-paspoort is closed by default
//   aa        free text (not on a card) against the real backdrop under it: 5th percentile ≥ 4.5 (≥ 3 for large text)
// Plus the lesson result (#finishScreen) at 1440×900 and 2560×1440: no overlap, Nino size; and with --fps the frame
// rate at 1080×810 with the CPU 4× slower (list scroll, screen switches). Exit code 1 on any failure.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const OUT=process.env.QA_OUT||tmpdir(); // screenshots of the lesson result land here, never in the repo
const {chromium}=createRequire(import.meta.url)('playwright');
// QA_HTML=http://…/index.html runs the same checks on the web copy (images as separate files, BL-035.9).
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const args=new Set(process.argv.slice(2));
// Env overrides for focal-point/glow studies (BL-032): QA_SIZES=1080x810,1440x900 · QA_BGS=bg01,bg03 · QA_NOGLOW=1 ·
// QA_BGPOS='bg01:40% 50%;bg02:…' (body background-position per background).
const envList=v=>v?v.split(',').map(x=>x.trim()).filter(Boolean):null;
// --smoke (laag 2 van de verificatie, OPERATING_MODEL §3b): 1440×900 + 1080×810 + 810×1080 (iPad-portret, BL-038), alleen BG-01, Chromium.
const SIZES=envList(process.env.QA_SIZES)?.map(x=>x.split('x').map(Number))||(args.has('--quick')||args.has('--smoke')?[[1440,900],[1080,810],[810,1080]]:[[1280,800],[1366,768],[1440,900],[1920,1080],[2560,1440],[1080,810],[810,1080],[768,1024]]);
const BGS=envList(process.env.QA_BGS)||(args.has('--smoke')?['bg01']:args.has('--quick')?['bg03']:['bg01','bg02','bg03']);
const SCREENS=['overzicht','hoofdstuk','oefenen','toets','toetsresultaat','rewards','voortgang'];
// Free text per screen (no card under it): measured against the backdrop.
const FREE={overzicht:['#v3ListTitle','.v3Panel .v3CardKicker','.v3Panel .v3CardTitle'],
 hoofdstuk:['.v3Panel .v3CardKicker','.v3Panel .v3CardTitle'],
 oefenen:['.v3OefPanel>.v3ScreenTitle'],toets:['.v3ToetsSetup>.v3ScreenTitle'],
 toetsresultaat:['.v3ToetsLabel','.v3ToetsScore'],
 rewards:['.v3Rewards>.v3ScreenTitle','.v3Ride>b','.v3Ride>span'],
 voortgang:['.v3VgSide .v3Card>h2','.v3VgTitleBar>h1','.v3VgCount strong','.v3VgCount span']};
// Measured on every screen as well: the sidebar labels and the counters.
const ALWAYS=['.v3Side .v3NavItem>span','.v3Counts .v3Count>b'];
const RESULT=['#finishScreen h2','#finishScreen p','#finishScreen .finishStats *','#finishScreen button'];
const fails=[];const fail=(where,what)=>{fails.push(where+': '+what);};

async function open(b,W,H,bg){
 const p=await b.newPage({viewport:{width:W,height:H}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 // BL-035.9: no broken pictures — every failed request or 4xx/5xx counts as an error.
 p.on('requestfailed',r=>{if(!/ERR_ABORTED/.test(r.failure()?.errorText||''))errors.push('laden mislukt: '+r.url().split('/').pop()+' '+r.failure()?.errorText);});
 p.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+': '+r.url().split('/').pop());});
 if(process.env.QA_NOGLOW||process.env.QA_BGPOS)await p.addInitScript(([noglow,pos])=>{const css=(noglow?'.v3Panel::before,.v3CardHead::before,.v3VgTitleBar::before,.v3ToetsScoreCard::before{display:none!important}':'')+
  (pos||'').split(';').filter(Boolean).map(x=>{const [k,v]=x.split(':');return 'body[data-v3-background='+k+']{background-position:'+v+'!important;background-size:cover!important}';}).join('');
  addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');st.textContent=css;document.head.append(st);});},[process.env.QA_NOGLOW||'',process.env.QA_BGPOS||'']);
 await p.goto(HTML+'#bezig/'+bg);await p.waitForTimeout(1300);return {p,errors};
}
async function show(p,screen){
 if(screen==='overzicht')return;
 if(screen==='hoofdstuk')await p.locator('.v3Rows .v3Row[aria-pressed=true]').first().click();
 else if(screen==='toetsresultaat'){await p.locator('.v3Side [data-nav=toets]').filter({visible:true}).first().click();await p.waitForTimeout(700);
  await p.locator('.v3ToetsSetup .v3Start').click();await p.waitForTimeout(800);
  for(let i=0;i<60;i++){if(await p.evaluate(()=>document.querySelector('.v3Reis')?.dataset.view==='toetsResult'))break;await p.evaluate(()=>{try{grade(true)}catch{}try{next()}catch{}});await p.waitForTimeout(50);}}
 else await p.locator(`.v3Side [data-nav=${screen}]`).filter({visible:true}).first().click();
 await p.waitForTimeout(900);
}
// Layout facts inside the page. Overlap: text, buttons and the chapter markers on the map against each other.
const probe=()=>{
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;const c=getComputedStyle(e);if(c.visibility==='hidden'||+c.opacity===0)return false;
  for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none')return false;if(s.clip&&s.clip!=='auto'&&a.getBoundingClientRect().width<=1)return false;}
  return r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth;};
 const root=document.querySelector('.v3Reis');const scope=document.body.classList.contains('v3Les')?document.body:root;
 const inMap=e=>!!e.closest('svg,.v3MapStage,.v3OefStage,.v3VgKaart figure svg,.ninoArtSlot');
 const texts=[...scope.querySelectorAll('*')].filter(e=>!inMap(e)&&!e.closest('.v3Demo,#v3Demo,[data-v3-demo]')&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&vis(e));
 const small=texts.filter(e=>parseFloat(getComputedStyle(e).fontSize)<13).map(e=>(e.className||e.tagName)+' '+getComputedStyle(e).fontSize+' "'+e.textContent.trim().slice(0,20)+'"');
 const buttons=[...scope.querySelectorAll('button,[role=button],a[href]')].filter(e=>!inMap(e)&&vis(e));
 const lowBtn=buttons.filter(e=>e.getBoundingClientRect().height<43.5).map(e=>(e.className||e.tagName)+' h='+Math.round(e.getBoundingClientRect().height)+' "'+e.textContent.trim().slice(0,16)+'"');
 // Text boxes: the range of the text itself (not the element box), so padding does not count as overlap.
 const boxes=[];for(const e of texts){let r=null;for(const n of e.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);const q=rg.getBoundingClientRect();if(q.width<1||q.height<1)continue;
  r=r?{left:Math.min(r.left,q.left),top:Math.min(r.top,q.top),right:Math.max(r.right,q.right),bottom:Math.max(r.bottom,q.bottom)}:{left:q.left,top:q.top,right:q.right,bottom:q.bottom};}
  if(r)boxes.push({e,r,t:e.textContent.trim().slice(0,18)});}
 for(const e of buttons){const r=e.getBoundingClientRect();boxes.push({e,r,t:'['+e.textContent.trim().slice(0,14)+']',btn:true});}
 for(const c of scope.querySelectorAll('.v3Markers .v3Marker .v3MarkerPin')){if(!vis(c))continue;boxes.push({e:c,r:c.getBoundingClientRect(),t:'marker '+(c.parentNode.textContent||'').trim()});}
 for(const g of scope.querySelectorAll('.v3MapStage .v3Pins .v3Pin')){if(!vis(g))continue;boxes.push({e:g,r:g.getBoundingClientRect(),t:'pin',pin:true});}
 const over=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(a.e.contains(b.e)||b.e.contains(a.e))continue;
  if(a.pin&&b.pin)continue;
  const x=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),y=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
  if(x>2&&y>2&&!(a.btn&&b.btn&&a.e.parentElement===b.e.parentElement&&false))over.push(a.t+' × '+b.t+' ('+Math.round(x)+'×'+Math.round(y)+')');}
 const wide=document.scrollingElement.scrollWidth>innerWidth+1;
 // Blur: elements and their ::before/::after with a backdrop-filter, visible on screen.
 let blur=0;const blurred=[];for(const e of document.querySelectorAll('body *')){if(!vis(e))continue;for(const ps of [null,'::before','::after']){const c=getComputedStyle(e,ps);
  if(ps&&(c.content==='none'||c.display==='none'))continue;const f=c.backdropFilter||c.webkitBackdropFilter;if(f&&f!=='none'){blur++;blurred.push((e.className||e.tagName)+(ps||''));}}}
 const portrait=[...document.querySelectorAll('.v3Reis .v3Side .v3Portrait,.v3ShellNav .v3Portrait')].find(vis);const pr=portrait?portrait.getBoundingClientRect():null;
 const pas=document.querySelector('.v3View-voortgang details.mastery');
 const it=document.querySelector('.v3MapStage .v3Map .italy');const ir=it&&vis(it)?it.getBoundingClientRect():null;const mapShare=ir?+(ir.width*ir.height/(innerWidth*innerHeight)).toFixed(3):null;
 return {small,lowBtn,over,wide,blur,blurred,nino:pr?Math.round(pr.width)+'×'+Math.round(pr.height):null,paspoortOpen:pas?pas.open:null,mapShare};
};
// Contrast, two ways per text box:
//   p5   backdrop: the text hidden, the pixels under it against the text colour (5th percentile);
//   ink  what is really drawn: the shown screenshot against the hidden one (98th percentile of the per-pixel ratio),
//        so a layer lying OVER the text (evaluator BL-029: the workspace over the lesson result) fails as well.
async function contrast(p,sels){
 // Visually hidden text (sr-only: clipped to 1 px, e.g. the rail labels on iPad) is not measured.
 const info=await p.evaluate(sels=>sels.flatMap(s=>[...document.querySelectorAll(s)].filter(e=>{if(!e.getClientRects().length||getComputedStyle(e).visibility==='hidden')return false;const b=e.getBoundingClientRect();if(b.width<=2||b.height<=2)return false;
  for(let a=e;a;a=a.parentElement){const c=getComputedStyle(a);if(c.display==='none'||(c.clip&&c.clip!=='auto'))return false;}return true;}).map(e=>{
  const rg=document.createRange();rg.selectNodeContents(e);const r=rg.getBoundingClientRect(),c=getComputedStyle(e);
  return {s,r:[r.x,r.y,r.width,r.height],color:c.color,size:parseFloat(c.fontSize),weight:+c.fontWeight};})).filter(t=>t.r[2]>1&&t.r[3]>1),sels);
 if(!info.length)return [];
 const shown=(await p.screenshot()).toString('base64');
 const tag=await p.addStyleTag({content:sels.join(',')+'{color:transparent!important;-webkit-text-fill-color:transparent!important}'+sels.map(s=>s+' *').join(',')+'{color:transparent!important;-webkit-text-fill-color:transparent!important}'});
 await p.waitForTimeout(120);const png=(await p.screenshot()).toString('base64');
 await tag.evaluate(n=>n.remove());
 return p.evaluate(async([png,shown,info])=>{const load=async src=>{const img=new Image();img.src='data:image/png;base64,'+src;await img.decode();
   const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const g=cv.getContext('2d');g.drawImage(img,0,0);return {cv,g};};
  const {cv,g}=await load(png),S=await load(shown);const k=cv.width/innerWidth;
  const lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;},L=(r,gg,b)=>.2126*lin(r)+.7152*lin(gg)+.0722*lin(b);
  return info.map(t=>{const m=t.color.match(/[\d.]+/g).map(Number),fg=L(m[0],m[1],m[2]);const [x,y,w,h]=t.r.map(v=>Math.round(v*k));
   const d=g.getImageData(Math.max(0,x),Math.max(0,y),Math.max(1,Math.min(w,cv.width-x)),Math.max(1,Math.min(h,cv.height-y))).data;const cr=[];
   const ds=S.g.getImageData(Math.max(0,x),Math.max(0,y),Math.max(1,Math.min(w,cv.width-x)),Math.max(1,Math.min(h,cv.height-y))).data;const ink=[];
   for(let i=0;i<d.length;i+=4*3){const bl=L(d[i],d[i+1],d[i+2]);cr.push((Math.max(fg,bl)+.05)/(Math.min(fg,bl)+.05));}
   for(let i=0;i<d.length;i+=4){const a=L(d[i],d[i+1],d[i+2]),bb=L(ds[i],ds[i+1],ds[i+2]);ink.push((Math.max(a,bb)+.05)/(Math.min(a,bb)+.05));}
   cr.sort((a,b)=>a-b);ink.sort((a,b)=>a-b);const large=t.size>=24||(t.size>=18.66&&t.weight>=700);
   return {s:t.s,p5:+cr[Math.floor(cr.length/20)].toFixed(2),ink:+ink[Math.floor(ink.length*.98)].toFixed(2),need:large?3:4.5};});},[png,shown,info]);
}
async function lessonResult(b,W,H){
 const {p,errors}=await open(b,W,H,'bg03');
 await p.locator('.v3Panel .v3Actions .v3Btn.primary').filter({visible:true}).first().click();await p.waitForTimeout(900);
 const where=`les-resultaat ${W}×${H}`;
 // Blur during a lesson question (≤ 3); Nino the same size as on the other screens.
 const q=await p.evaluate(probe);if(q.blur>3)fail(`les-vraag ${W}×${H}`,'blur op '+q.blur+': '+q.blurred.join(', '));
 if(q.nino!==(W<1280?'60×64':'140×152'))fail(`les-vraag ${W}×${H}`,'Nino '+q.nino);
 // BL-038: the lesson bar never lies over the sidebar/rail (iPad portrait: it did).
 {const ov=await p.evaluate(()=>{const a=document.querySelector('.v3LesBar')?.getBoundingClientRect(),n=[...document.querySelectorAll('.v3ShellNav,.v3ShellNav .v3Side')].map(e=>e.getBoundingClientRect()).filter(r=>r.width>2);if(!a||!a.width)return 0;let m=0;for(const b of n){const x=Math.min(a.right,b.right)-Math.max(a.left,b.left),y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(x>2&&y>2)m=Math.max(m,Math.round(x));}return m;});if(ov)fail(`les-vraag ${W}×${H}`,'lesbalk over de zijbalk ('+ov+' px)');}
 for(let i=0;i<80;i++){if(await p.locator('#finishScreen').count())break;
  await p.evaluate(()=>{try{grade(true);}catch{}try{next();}catch{}});await p.waitForTimeout(40);}
 await p.waitForTimeout(700);
 // Blur with the reward modal open (≤ 3).
 const m=await p.evaluate(probe);if(m.blur>3)fail(where+' (modal)','blur op '+m.blur+': '+m.blurred.join(', '));
 // A reward modal (pizza, Vespa) may sit on top of the result: close it the way a child would, then measure the result.
 for(let i=0;i<4;i++){const d=p.locator('dialog[open] button,[role=dialog]:not([hidden]) button').filter({visible:true});if(!await d.count())break;await d.last().click().catch(()=>{});await p.waitForTimeout(600);}
 const has=await p.locator('#finishScreen').count();const r=has?await p.evaluate(probe):null;
 if(!has)fail(where,'lesresultaat niet bereikt');
 else{if(r.over.length)fail(where,'overlap: '+r.over.slice(0,4).join('; '));if(r.wide)fail(where,'breder dan het scherm');if(r.small.length)fail(where,'tekst < 13 px: '+r.small.slice(0,3).join('; '));}
 // The lesson bar never lies over the result card (evaluator BL-029 r2: it did on short screens).
 if(has){const ov=await p.evaluate(()=>{const a=document.querySelector('.v3LesBar')?.getBoundingClientRect(),b=document.querySelector('#finishScreen')?.getBoundingClientRect();if(!a||!b||!a.width)return 0;const x=Math.min(a.right,b.right)-Math.max(a.left,b.left),y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);return x>2&&y>2?Math.round(x)+'×'+Math.round(y):0;});if(ov)fail(where,'lesbalk over de resultaatkaart '+ov);}
 if(has){const aa=await contrast(p,[...RESULT,...ALWAYS]);for(const t of aa){if(t.p5<t.need)fail(where,`AA ${t.s} ${t.p5} < ${t.need}`);if(t.ink<t.need)fail(where,`AA getekend ${t.s} ${t.ink} < ${t.need} (laag over de tekst?)`);}}
 if(errors.length)fail(where,'page errors: '+errors.join(' | '));
 if(has)await p.screenshot({path:join(OUT,`qa-menu1-lesresultaat-${W}.png`)}).catch(()=>{});
 console.log(where,has?JSON.stringify({over:r.over.length,blurVraag:q.blur,blurModal:m.blur,blur:r.blur,nino:r.nino,ninoVraag:q.nino}):'—');
 await p.close();return r;
}
async function fps(b){
 const p=await b.newPage({viewport:{width:1080,height:810}});const c=await p.context().newCDPSession(p);
 await p.goto(HTML+'#alles/bg03');await p.waitForTimeout(1500);await c.send('Emulation.setCPUThrottlingRate',{rate:4});await p.waitForTimeout(300);
 const meter=async(action,ms=1800)=>{await p.evaluate(()=>{window.__f=[];let l=performance.now();const t=n=>{window.__f.push(n-l);l=n;if(!window.__stop)requestAnimationFrame(t)};window.__stop=false;requestAnimationFrame(t)});
  await action();await p.waitForTimeout(ms);
  return p.evaluate(()=>{window.__stop=true;const f=window.__f.slice(2);const tot=f.reduce((a,b)=>a+b,0);const s=[...f].sort((a,b)=>a-b);
   const rest=s.slice(0,-1),tr=rest.reduce((a,b)=>a+b,0);
   return {fps:+(1000*f.length/tot).toFixed(1),p95ms:+(s[Math.floor(s.length*.95)]||0).toFixed(1),longestMs:Math.round(s.at(-1)||0),over33:f.filter(x=>x>33.4).length,fpsWithoutLongest:+(1000*rest.length/tr).toFixed(1)}})};
 const out={};
 // (The chapter list does not scroll at 1080×810: all 11 rows fit; Voortgang is the screen that scrolls.)
 out.naarHoofdstuk=await meter(async()=>{await p.locator('.v3Rows .v3Row').nth(1).click();});
 for(const v of ['oefenen','toets','rewards','voortgang'])out['naar '+v]=await meter(async()=>{await p.locator(`.v3Side [data-nav=${v}]`).filter({visible:true}).first().click();},1500);
 const vb=await p.locator('.v3View-voortgang').boundingBox();
 out.voortgangScroll=await meter(async()=>{await p.mouse.move(vb.x+vb.width/2,vb.y+vb.height/2);for(let i=0;i<12;i++){await p.mouse.wheel(0,150);await p.waitForTimeout(80);}});
 await p.close();
 for(const [k,v] of Object.entries(out))if(v.fps<50)fail('fps 1080×810 CPU 4×',k+' '+v.fps+' fps < 50');
 return out;
}

const b=await chromium.launch();
const nino={};const table=[];
for(const [W,H] of SIZES)for(const bg of BGS){
 const {p,errors}=await open(b,W,H,bg);
 for(const screen of SCREENS){
  if(screen!=='overzicht'){await p.goto(HTML+'#bezig/'+bg);await p.waitForTimeout(1100);await show(p,screen);}
  const where=`${W}×${H} ${bg} ${screen}`;const r=await p.evaluate(probe);
  // BL-035.9: every visible picture has arrived (lazy ones in view included) and none is broken.
  const broken=await p.evaluate(async()=>{const vis=e=>{const q=e.getBoundingClientRect();return q.width>1&&q.height>1&&q.bottom>0&&q.top<innerHeight&&q.right>0&&q.left<innerWidth&&getComputedStyle(e).visibility!=='hidden';};
   const imgs=[...document.querySelectorAll('img')].filter(vis);for(let t=0;t<40&&imgs.some(i=>!i.complete);t++)await new Promise(r=>setTimeout(r,100));
   return imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>(i.className||i.alt||'img')+' '+(i.currentSrc||i.src).split('/').pop().slice(0,40));});
  if(broken.length)fail(where,'kapotte afbeelding: '+broken.slice(0,3).join('; '));
  // Evaluator BL-036: every sidebar button (nav, gear, background, ?) lies on screen and its centre reaches it.
  const unreach=await p.evaluate(()=>[...document.querySelectorAll('.v3Reis>.v3Side :is(button,a)')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').filter(e=>{const q=e.getBoundingClientRect();if(q.width<2||q.height<2)return false;
   const x=q.left+q.width/2,y=q.top+q.height/2;if(x<0||y<0||x>innerWidth||y>innerHeight)return true;const t=document.elementFromPoint(x,y);return !(t&&(e===t||e.contains(t)));}).map(e=>(e.getAttribute('aria-label')||e.textContent||e.className).trim().slice(0,24)));
  if(unreach.length)fail(where,'knop niet bereikbaar: '+unreach.join('; '));
  if(r.over.length)fail(where,'overlap: '+r.over.slice(0,4).join('; '));
  if(r.wide)fail(where,'breder dan het scherm');
  if(r.small.length)fail(where,'tekst < 13 px: '+r.small.slice(0,3).join('; '));
  if(r.lowBtn.length)fail(where,'knop < 44 px: '+r.lowBtn.slice(0,3).join('; '));
  if(r.blur>3)fail(where,'blur op '+r.blur+' elementen: '+r.blurred.join(', '));
  const wc=W<1280?'ipad':'desktop';(nino[wc]??=new Set()).add(r.nino);
  if(screen==='voortgang'&&r.paspoortOpen!==false)fail(where,'Kennis-paspoort niet ingeklapt');
  // BL-034 bug: the filled marker is the active chapter = the list's current row, always.
  if(screen==='overzicht'){const mk=await p.evaluate(()=>({on:[...document.querySelectorAll('.v3Markers .v3Marker.on')].map(m=>m.dataset.chapter),cur:document.querySelector('.v3Rows .v3Row[aria-current=step]')?.dataset.chapter||null}));
   if(mk.on.length!==1||(mk.cur&&mk.on[0]!==mk.cur))fail(where,`actieve marker ${mk.on} ≠ actief hoofdstuk ${mk.cur}`);}
  // Map first (design-critic BL-029 r3): Italy's box ≥ 25% of the screen on the overview and the chapter page.
  // (2560: the layout does not scale up yet — BL-033; reported, not a failure here.)
  if((screen==='overzicht'||screen==='hoofdstuk')&&W<2400&&!(r.mapShare>=.25))fail(where,'kaart te klein: '+r.mapShare);
  // BL-038 (iPad portrait): the map plane >= 45% of the screen on Reis (overview, chapter), >= 40% of the height on Oefenen/Toets;
  // the start buttons and the Toets chapter chips lie inside the screen.
  if(W<1024&&H>W){const g=await p.evaluate(()=>{const R=s=>{const e=document.querySelector(s);if(!e||!e.getClientRects().length)return null;const r=e.getBoundingClientRect();return r;};
    const st=R('.v3Reis[data-view=reis] .v3MapStage')||R('.v3OefStage')||R('.v3ToetsSetupStage');
    const inside=[...document.querySelectorAll('.v3OefPanel .v3Start,.v3ToetsSetup .v3Start,.v3ToetsSetup .v3Chip')].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.top<0||r.bottom>innerHeight||r.left<0||r.right>innerWidth;}).length;
    return {area:st?st.width*st.height/(innerWidth*innerHeight):null,hh:st?st.height/innerHeight:null,out:inside};});
   if((screen==='overzicht'||screen==='hoofdstuk')&&!(g.area>=.45))fail(where,'kaartvlak < 45%: '+(g.area&&g.area.toFixed(3)));
   if((screen==='oefenen'||screen==='toets')&&!(g.hh>=.40))fail(where,'kaart < 40% van de hoogte: '+(g.hh&&g.hh.toFixed(3)));
   if(g.out)fail(where,'startknop of chips buiten beeld: '+g.out);
   if(g.area!==null)(globalThis.kv??=[]).push(where+' '+(g.area!==null&&(screen==='overzicht'||screen==='hoofdstuk')?g.area.toFixed(3):'h '+(g.hh??0).toFixed(2)));}
  const aa=await contrast(p,[...(FREE[screen]||[]),...ALWAYS]);for(const t of aa){if(t.p5<t.need)fail(where,`AA ${t.s} ${t.p5} < ${t.need}`);if(t.ink<t.need)fail(where,`AA getekend ${t.s} ${t.ink} < ${t.need} (laag over de tekst?)`);}
  table.push({where,map:r.mapShare,blur:r.blur,nino:r.nino,aaMin:aa.length?Math.min(...aa.map(t=>+(t.p5/t.need).toFixed(2))):null});
 }
 if(errors.length)fail(`${W}×${H} ${bg}`,'page errors: '+errors.join(' | '));
 await p.close();
}
// BL-038: on the Reis overview no two pin heads closer than 30 px, in every demo state (#bezig, #afgerond, #alles) at every size
// (Pin 2 and 9 used to lie on one spot in #afgerond/#alles: Vaticaanstad lies in Rome).
for(const [W,H] of SIZES)for(const st of ['bezig','afgerond','alles']){
 const p=await b.newPage({viewport:{width:W,height:H}});await p.goto(HTML+'#'+st+'/'+BGS[0]);await p.waitForTimeout(1300);
 const m=await p.evaluate(()=>{const a=[...document.querySelectorAll('.v3Markers .v3Marker')].filter(e=>e.getClientRects().length).map(e=>{const t=e.querySelector('text').getBoundingClientRect();return {c:e.dataset.chapter,x:t.x+t.width/2,y:t.y+t.height/2};});
  const close=[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const d=Math.hypot(a[i].x-a[j].x,a[i].y-a[j].y);if(d<30)close.push(a[i].c+'~'+a[j].c+' '+Math.round(d)+' px');}return {n:a.length,close};});
 if(m.n&&m.close.length)fail(`${W}×${H} #${st} overzicht`,'pinkoppen te dicht: '+m.close.join('; '));
 await p.close();}
for(const [wc,set] of Object.entries(nino))if(set.size!==1)fail('nino '+wc,'meerdere maten: '+[...set].join(', '));
// BL-034 bug scenario: a lesson in progress in another chapter than the next one (a replay of chapter 1 while chapter 2
// is next) -> the filled marker is the chapter of the lesson in progress, exactly one marker is filled.
{const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto(HTML+'#bezig/bg03');await p.waitForTimeout(1300);
 const r=await p.evaluate(()=>{state.route.active={chapterId:'city1',kind:'discover',stage:0,done:false,queue:[],index:0,correct:0,wrong:0};renderRouteHome();
  return {on:[...document.querySelectorAll('.v3Markers .v3Marker.on')].map(m=>m.dataset.chapter)};});
 if(r.on.length!==1||r.on[0]!=='city1')fail('actief hoofdstuk (lopende les in 1, volgende is 2)',`gevulde marker ${r.on} (verwacht city1)`);
 console.log('actief hoofdstuk bij lopende les:',JSON.stringify(r));await p.close();}
const les=[];for(const [W,H] of [[1280,800],[1366,768],[1440,900],[2560,1440],[810,1080],[768,1024]])les.push(await lessonResult(b,W,H));
let f=null;if(args.has('--fps'))f=await fps(b);
await b.close();
const blurPer={};for(const t of table){const s=t.where.split(' ').pop();blurPer[s]=Math.max(blurPer[s]||0,t.blur);}
console.log('blur (max per scherm):',JSON.stringify(blurPer));
console.log('kaartaandeel (overzicht):',table.filter(t=>t.where.endsWith('overzicht')).map(t=>t.where.split(' ').slice(0,2).join(' ')+' '+t.map).join(' · '));
if(globalThis.kv)console.log('portret kaartvlak (Reis ≥ .45, Oefenen/Toets hoogte ≥ .40):',globalThis.kv.join(' · '));
console.log('nino:',JSON.stringify(Object.fromEntries(Object.entries(nino).map(([k,v])=>[k,[...v]]))));
console.log('AA (laagste p5/eis per scherm, ≥ 1 = ok):',table.filter(t=>t.aaMin!==null).map(t=>t.where+' '+t.aaMin).join(' · '));
if(f)console.log('fps:',JSON.stringify(f));
if(fails.length){console.log('\nFOUTEN ('+fails.length+'):\n'+fails.join('\n'));process.exit(1);}
console.log('\nOK: geen fouten');
