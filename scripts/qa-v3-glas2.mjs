// BL-016 check (ops/contracts/BL-016.md): no opaque plates, sidebar open at the bottom, text contrast measured against
// the rendered pixels on BG-01/02/03, and the panel tint spread between backgrounds.
// Usage: node scripts/qa-v3-glas2.mjs [preview.html] [--json out.json]
import {createRequire} from 'module';
import {resolve} from 'path';
const {chromium}=createRequire(import.meta.url)('playwright');
const html=resolve(process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:'output/html/TOPO-V3-Reis-Preview.html');
const VIEWS=['reis','oefenen','toets','rewards','voortgang'],BGS=['bg01','bg02','bg03'],SIZES=[[1440,900],[1080,810],[810,1080]];
const PANELS='.v3Reis>.v3List,.v3Main>.v3Top,.v3Main>.v3Panel,.v3Reis>.v3View-oefenen,.v3ToetsSetup,.v3Rewards .v3Ride,.v3Rewards .v3Tile,.v3Reis>.v3View-voortgang';

const lum=([r,g,b])=>{const f=c=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
const lab=([r,g,b])=>{const f=c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4};const [R,G,B]=[f(r),f(g),f(b)];
 const X=(.4124*R+.3576*G+.1805*B)/.95047,Y=.2126*R+.7152*G+.0722*B,Z=(.0193*R+.1192*G+.9505*B)/1.08883,h=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;
 return [116*h(Y)-16,500*(h(X)-h(Y)),200*(h(Y)-h(Z))]};
const dE=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));

const b=await chromium.launch();const out={alpha:[],side:[],contrast:[],tint:{}};
for(const [w,h] of SIZES)for(const bg of BGS)for(const v of VIEWS){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto('file://'+html+'#alles/'+bg);await p.waitForTimeout(1100);
 if(v!=='reis'){await p.locator(`[data-nav=${v}]`).filter({visible:true}).first().click();await p.waitForTimeout(700);}
 await p.evaluate(()=>document.activeElement?.blur?.());await p.mouse.move(1,1);await p.waitForTimeout(250);
 const info=await p.evaluate(PANELS=>{
  const alphaAt=(bgc,bgi,frac)=>{ // effective alpha of a solid colour or a 2-stop vertical gradient at a height fraction
   const nums=s=>[...s.matchAll(/rgba?\(([^)]+)\)/g)].map(m=>{const q=m[1].split(',').map(Number);return q.length>3?q[3]:1});
   const g=nums(bgi);if(g.length>=2)return g[0]+(g[g.length-1]-g[0])*frac;const c=nums(bgc);return c.length?c[0]:0};
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>8&&r.height>8&&getComputedStyle(e).visibility!=='hidden'&&e.offsetParent!==null};
  const panels=[...document.querySelectorAll(PANELS)].filter(vis).map(e=>{const cs=getComputedStyle(e),r=e.getBoundingClientRect();
   return {sel:e.className.split(' ').slice(0,2).join('.'),bottom:+alphaAt(cs.backgroundColor,cs.backgroundImage,1).toFixed(2),rect:[r.x,r.y,r.width,r.height].map(Math.round)}});
  const side=document.querySelector('.v3Reis>.v3Side');let sideB=null,gear=null;
  if(side){const a=getComputedStyle(side,'::after');sideB={bottom:+alphaAt('',a.backgroundImage,1).toFixed(2),mask:a.maskImage||a.webkitMaskImage};
   const gr=side.querySelector('.v3Settings')?.getBoundingClientRect();gear=gr?[gr.x,gr.y,gr.width,gr.height].map(Math.round):null}
  const texts=[];const walk=document.createTreeWalker(document.querySelector('.v3Reis')||document.body,NodeFilter.SHOW_TEXT);
  for(let n;(n=walk.nextNode());){const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(!el||!vis(el)||el.closest('[aria-hidden=true],svg'))continue;
   const rg=document.createRange();rg.selectNodeContents(n);const r=rg.getBoundingClientRect();if(r.width<4||r.height<4||r.top<0||r.left<0||r.bottom>innerHeight||r.right>innerWidth)continue;
   // Text partly clipped by a scrolling ancestor (a list scrolled under its edge) is not measured: it is not readable text.
   let clipped=false;for(let a=el.parentElement;a&&!clipped;a=a.parentElement){const o=getComputedStyle(a);if(/(auto|scroll|hidden|clip)/.test(o.overflowY+o.overflowX)){const q=a.getBoundingClientRect();clipped=r.top<q.top-1||r.bottom>q.bottom+1||r.left<q.left-1||r.right>q.right+1}}
   if(clipped)continue;
   const cs=getComputedStyle(el);const m=cs.color.match(/[\d.]+/g).map(Number);if(m.length>3&&m[3]<.5)continue;
   texts.push({t:t.slice(0,24),color:m.slice(0,3),size:parseFloat(cs.fontSize),bold:+cs.fontWeight>=600,rect:[r.x,r.y,r.width,r.height]})}
  return {panels,sideB,gear,texts}},PANELS);
 const shot=(await p.screenshot()).toString('base64');
 // Decode the screenshot in a blank page to read pixels.
 const q=await b.newPage({viewport:{width:w,height:h}});
 const px=await q.evaluate(async({shot,texts,panels})=>{const img=new Image();img.src='data:image/png;base64,'+shot;await img.decode();
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);
  const at=(r)=>x.getImageData(Math.max(0,Math.round(r[0])),Math.max(0,Math.round(r[1])),Math.max(1,Math.round(r[2])),Math.max(1,Math.round(r[3]))).data;
  const bgOf=(d,tc)=>{ // background = the pixels farthest from the text colour (top half by distance), averaged
   const arr=[];for(let i=0;i<d.length;i+=4)arr.push([d[i],d[i+1],d[i+2]]);const dist=p=>Math.hypot(p[0]-tc[0],p[1]-tc[1],p[2]-tc[2]);
   arr.sort((a,b)=>dist(b)-dist(a));const top=arr.slice(0,Math.max(1,arr.length>>2));return [0,1,2].map(k=>top.reduce((s,p)=>s+p[k],0)/top.length)};
  const worst=(d,tc)=>{const arr=[];for(let i=0;i<d.length;i+=4)arr.push([d[i],d[i+1],d[i+2]]);return arr};
  return {texts:texts.map(t=>({...t,bg:bgOf(at(t.rect),t.color)})),
   panels:panels.map(pn=>{const d=at([pn.rect[0]+12,pn.rect[1]+12,Math.min(120,pn.rect[2]-24),Math.min(60,pn.rect[3]-24)]);let s=[0,0,0],n=0;for(let i=0;i<d.length;i+=4){s[0]+=d[i];s[1]+=d[i+1];s[2]+=d[i+2];n++}return {...pn,mean:s.map(v=>v/n)}})}},
  {shot,texts:info.texts,panels:info.panels});
 await q.close();await p.close();
 for(const pn of px.panels){out.alpha.push({w,bg,v,sel:pn.sel,bottom:pn.bottom,ok:pn.bottom<=.45});
  const key=`${w}:${v}:${pn.sel}`;(out.tint[key]??={})[bg]=lab(pn.mean)}
 if(info.sideB)out.side.push({w,bg,v,...info.sideB,gear:info.gear,ok:info.sideB.bottom<=.05});
 for(const t of px.texts){const r=ratio(t.color,t.bg),need=(t.size>=24||(t.size>=18.66&&t.bold))?3:4.5;
  if(r<need)out.contrast.push({w,bg,v,t:t.t,size:t.size,ratio:+r.toFixed(2),need})}
}
await b.close();
const spread=Object.entries(out.tint).map(([k,o])=>{const L=Object.values(o);let m=0;for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++)m=Math.max(m,dE(L[i],L[j]));return [k,+m.toFixed(1)]});
const bad={alpha:out.alpha.filter(a=>!a.ok),side:out.side.filter(s=>!s.ok),contrast:out.contrast};
const meanSpread=spread.length?+(spread.reduce((s,[,m])=>s+m,0)/spread.length).toFixed(1):0;
console.log(JSON.stringify({panelsChecked:out.alpha.length,alphaFails:bad.alpha.length,sideFails:bad.side.length,contrastFails:bad.contrast.length,meanTintSpreadDE:meanSpread},null,1));
if(bad.alpha.length)console.log('alpha',JSON.stringify(bad.alpha.slice(0,12)));
if(bad.contrast.length)console.log('contrast',JSON.stringify(bad.contrast.slice(0,25)));
const jo=process.argv.indexOf('--json');if(jo>0){(await import('fs')).writeFileSync(process.argv[jo+1],JSON.stringify({...out,spread},null,1))}
process.exitCode=bad.alpha.length||bad.side.length||bad.contrast.length?1:0;
