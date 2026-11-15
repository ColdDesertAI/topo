import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {JSDOM,VirtualConsole} from 'jsdom';
import {runInNewContext} from 'node:vm';
import {project} from '../../scripts/geography/lakes.mjs';

process.env.TZ='UTC';
export const ROOT=new URL('../../',import.meta.url);
export const read=path=>readFileSync(new URL(path,ROOT),'utf8');
export const sha=value=>createHash('sha256').update(value).digest('hex');
export const INDEX_SHA='3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a';
export const NOW=Date.UTC(2026,10,10,12);
export const PROFILE={schema:1,name:'Ada',coverColor:'riviera',favoritePizza:'margherita'};
const builder=read('scripts/build-v3-preview.mjs');
export const V3_FILES=[...builder.matchAll(/read\('(scripts\/v3\/[^']+\.js)'\)/g)].map(m=>m[1]);
assert.equal(V3_FILES.length,13,'release builder script order is the adapter contract');
const raw=read('index.html');
// Only embedded image bytes are substituted. Canonical data, scripts, controls,
// globals and their side effects are real. This is NOT a pixel/browser QA harness.
const html=raw.replace(/data:image\/[a-zA-Z+.-]+;base64,[A-Za-z0-9+/=]+/g,'data:image/png;base64,AA==');
// Execute the release builder's real metadata preparation without writing a preview.
// Only image payloads are replaced; no grading, rewards or storage logic is mocked.
assert.ok(builder.indexOf('const sceneManifest=')>=0&&builder.indexOf('// Relief z8')>builder.indexOf('const sceneManifest='),'release metadata preparation boundaries');
const artData=runInNewContext(builder.slice(builder.indexOf('const sceneManifest='),builder.indexOf('// Relief z8'))+';({scenes,v3art})',{
 read,uri:()=> 'data:image/png;base64,AA==',project,
 canonicalItems:JSON.parse(raw.match(/const ITEMS=(\[.*?\]);/s)[1])
});
export const plain=value=>JSON.parse(JSON.stringify(value));
export function seeded(seed=0x70f0){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}

export async function boot(t,{v3=true,storage={},now=NOW,seed=0x70f0}={}){
 const errors=[],downloads=[],clipboard=[],frames=new Map();
 let time=now,frameId=0,reloads=0,allowReload=false,timerId=0;
 const timers=new Map();
 const runTimers=(target=time)=>{
  for(let n=0;n<10000;n++){
   const next=[...timers].filter(([,v])=>v.at<=target).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];
   if(!next){time=target;return;}
   const [id,timer]=next;timers.delete(id);time=timer.at;
   if(timer.interval)timers.set(id,{...timer,at:timer.at+timer.interval});
   timer.call();
  }
  throw Error('Unbounded timer loop in characterization adapter');
 };
 const vc=new VirtualConsole();
 vc.on('jsdomError',e=>{if(allowReload&&/navigation/i.test(e.message)){reloads++;return;}errors.push(e.message);});
 vc.on('error',(...args)=>errors.push(args.map(String).join(' ')));
 const dom=new JSDOM(html,{url:'https://characterization.topo.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  w.TOPO_V3_ART=JSON.parse(JSON.stringify(artData.v3art));w.TOPO_V3_SCENES=JSON.parse(JSON.stringify(artData.scenes));
  const D=w.Date;
  w.Date=class extends D{constructor(...args){super(...(args.length?args:[time]));}static now(){return time;}};
  const schedule=(fn,delay,args,interval=0)=>{const id=++timerId;timers.set(id,{at:time+Math.max(0,Number(delay)||0),interval,call:()=>typeof fn==='function'?fn(...args):w.eval(String(fn))});return id;};
  w.setTimeout=(fn,delay=0,...args)=>schedule(fn,delay,args);
  w.clearTimeout=id=>timers.delete(id);
  w.setInterval=(fn,delay=0,...args)=>schedule(fn,delay,args,Math.max(1,Number(delay)||1));
  w.clearInterval=id=>timers.delete(id);
  Object.defineProperty(w.performance,'now',{value:()=>time-now});
  const random=seeded(seed);w.Math.random=random;
  Object.defineProperty(w.crypto,'getRandomValues',{value:a=>{for(let n=0;n<a.length;n++)a[n]=Math.floor(random()*4294967296);return a;}});
  w.requestAnimationFrame=fn=>{frames.set(++frameId,fn);return frameId;};w.cancelAnimationFrame=id=>frames.delete(id);
  w.requestIdleCallback=()=>0;w.cancelIdleCallback=()=>{};
  w.matchMedia=query=>({matches:query.includes('prefers-reduced-motion'),media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.print=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){if(this.open){this.open=false;this.dispatchEvent(new w.Event('close'));}};
  const B=w.Blob;w.Blob=class extends B{constructor(parts,options){super(parts,options);this.testText=parts.join('');}};
  w.URL.createObjectURL=blob=>{downloads.push(blob.testText);return 'blob:characterization';};w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){if(!this.download)this.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));};
  Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async value=>clipboard.push(value)}});
  for(const [key,value] of Object.entries({'topo-nino-profile-v1':JSON.stringify(PROFILE),'topo-nino-intro-v1':'done',...storage})){
   if(value!==null)w.localStorage.setItem(key,typeof value==='string'?value:JSON.stringify(value));
  }
 }});
 const w=dom.window,d=w.document,ev=source=>w.eval(source);
 if(d.readyState==='loading')await new Promise(resolve=>d.addEventListener('DOMContentLoaded',resolve,{once:true}));
 if(v3)for(const file of V3_FILES)w.eval(read(file)+`\n//# sourceURL=${file}`);
 const flush=async()=>{for(let n=0;n<4;n++){await Promise.resolve();runTimers();const batch=[...frames.values()];frames.clear();for(const fn of batch)fn(time);}await Promise.resolve();};
 const a={w,d,ev,errors,downloads,clipboard,flush,
  q:selector=>d.querySelector(selector),
  json:source=>JSON.parse(ev(`JSON.stringify(${source})`)),
  clock:{now:()=>time,advance:ms=>{assert.ok(ms>=0);runTimers(time+ms);}},
  storage:()=>Object.fromEntries(Object.keys(w.localStorage).sort().map(k=>[k,w.localStorage.getItem(k)])),
  expectReload:()=>{allowReload=true;},reloads:()=>reloads,
  snapshot:()=>JSON.parse(ev('JSON.stringify({mode:state.mode,current:state.current?.id,questionMode:state.questionMode,answered:state.answered,prompt:$("#prompt").textContent,progress:progressSnapshot(),input:{value:$("#answer").value,start:$("#answer").selectionStart,end:$("#answer").selectionEnd,direction:$("#answer").selectionDirection}})')),
  importBackup:async data=>{const text=JSON.stringify(data);await d.getElementById('backupFile').onchange({target:{files:[{size:Buffer.byteLength(text),text:async()=>text}],value:'backup.json'}});await flush();},
  exportBackup:()=>{d.getElementById('exportProgress').click();return JSON.parse(downloads.at(-1));},
  close:()=>{frames.clear();timers.clear();w.close();}
 };
 t?.after(()=>{a.close();assert.deepEqual(errors,[],'unexpected DOM/runtime errors');});
 await flush();assert.deepEqual(errors,[],'boot errors');return a;
}

export function answer(a,{ok=true,skip=false,given='verkeerde naam'}={}){
 if(skip){a.q('#reveal').click();return;}
 if(a.ev('state.questionMode')==='point')a.ev(ok?'chooseMapPlace(state.current)':'chooseMapPlace(ITEMS.find(i=>i.id!==state.current.id))');
 else{a.q('#answer').value=ok?a.ev('state.current.name'):given;a.q('#check').click();}
}
export async function startExam(a,{chapters=['islands'],form='both',length=0}={}){
 a.w.TOPO_V3.go('toets');
 let all=a.q('section[aria-labelledby="v3ToetsHoofdstukken"] [data-group="all"]');
 if(all.getAttribute('aria-pressed')!=='true')all.click();
 a.q('section[aria-labelledby="v3ToetsHoofdstukken"] [data-group="all"]').click();
 for(const id of chapters)a.q(`section[aria-labelledby="v3ToetsHoofdstukken"] [data-group="${id}"]`).click();
 a.q(`section[aria-labelledby="v3ToetsVorm"] [data-value="${form}"]`).click();
 a.q(`section[aria-labelledby="v3ToetsLengte"] [data-value="${length}"]`).click();
 a.q('.v3View-toets .v3Start').click();await a.flush();
 assert.equal(a.ev('state.mode'),'exam');
}
export async function finishExam(a,decide=()=>({ok:true})){
 const total=a.ev('state.examTotal');
 for(let n=0;n<total;n++){
  answer(a,decide(n,a.ev('state.questionMode')));a.q('#next').click();
 }
 await a.flush();return plain(a.w.TOPO_V3.toets.last);
}
