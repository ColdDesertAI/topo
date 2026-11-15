// BL-016 check (ops/contracts/BL-016.md). Scans every painted surface (not a fixed selector list), so a plate cannot
// escape the check by sitting in an unlisted element:
//  1. every surface >= 12 000 px2 (buttons, images and the demo bar excluded) has a bottom alpha <= 0.45;
//  2. the sidebar's glass layer is open (alpha <= 0.05) at the bottom and nothing paints behind it;
//  3. text contrast >= 4.5:1 (3:1 for large text) against the rendered pixels, on BG-01/02/03;
//  4. tint spread: mean Lab colour of each surface (text hidden) per background, max pairwise deltaE, averaged;
//  5. reduced transparency / more contrast: every one of those surfaces is opaque (alpha >= 0.95) without blur.
// Usage: node scripts/qa-v3-glas2.mjs [preview.html] [--json out.json]. Exit 1 on any failure in 1, 2, 3 or 5.
import {createRequire} from 'module';
import {resolve} from 'path';
import {writeFileSync} from 'fs';
const {chromium}=createRequire(import.meta.url)('playwright');
const args=process.argv.slice(2),html=resolve(args[0]&&!args[0].startsWith('--')?args[0]:'output/html/TOPO-V3-Reis-Preview.html');
const VIEWS=['reis','oefenen','toets','rewards','voortgang','les'],BGS=['bg01','bg02','bg03'],SIZES=[[1440,900],[1080,810],[810,1080]];

const lum=([r,g,b])=>{const f=c=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
const lab=([r,g,b])=>{const f=c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4};const [R,G,B]=[f(r),f(g),f(b)];
 const X=(.4124*R+.3576*G+.1805*B)/.95047,Y=.2126*R+.7152*G+.0722*B,Z=(.0193*R+.1192*G+.9505*B)/1.08883,h=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;
 return [116*h(Y)-16,500*(h(X)-h(Y)),200*(h(Y)-h(Z))]};
const dE=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));

// In-page: list painted surfaces with their alpha at the bottom edge.
const SURFACES=()=>{
 const alphas=s=>[...s.matchAll(/rgba?\(([^)]+)\)/g)].map(m=>{const q=m[1].split(',').map(Number);return q.length>3?q[3]:1});
 const root=document.querySelector('.v3Reis')||document.body;const out=[];
 for(const e of document.querySelectorAll('body *')){
  // .v3Portrait is Nino's round picture frame (artwork), not a plate.
  if(e.closest('.v3PreviewBar,.v3Portrait,button,a,[role=button],svg,img,picture,input,label,dialog:not([open])'))continue;
  const r=e.getBoundingClientRect();if(r.width*r.height<12000||r.bottom<=0||r.top>=innerHeight)continue;
  const cs=getComputedStyle(e);if(cs.visibility==='hidden'||+cs.opacity<.05)continue;
  if(/url\(/.test(cs.backgroundImage))continue; // artwork (portraits, thumbnails), not a plate
  const col=alphas(cs.backgroundColor)[0]??0,img=cs.backgroundImage==='none'?[]:alphas(cs.backgroundImage);
  // A background-size narrower than the box (a strip) counts too: it is still paint.
  const bottom=Math.max(col,img.length?img[img.length-1]:0);if(bottom<=0.001&&!(img.length&&img[0]>0))continue;
  const id=e.tagName.toLowerCase()+'.'+[...e.classList].slice(0,2).join('.');
  out.push({id,bottom:+bottom.toFixed(2),top:+Math.max(col,img[0]??0).toFixed(2),blur:cs.backdropFilter||cs.webkitBackdropFilter||'none',rect:[r.x,r.y,r.width,r.height].map(Math.round),inRoot:root.contains(e)||!!e.closest('body.v3Les')});
 }
 const side=document.querySelector('.v3Reis>.v3Side')||document.querySelector('body.v3Les .v3ShellNav');let sideInfo=null;
 if(side){const a=getComputedStyle(side,'::after');const g=alphas(a.backgroundImage);sideInfo={bottom:g.length?g[g.length-1]:1,behind:getComputedStyle(document.querySelector('.v3Reis')||document.body).backgroundImage}}
 return {surfaces:out.filter(s=>s.inRoot),side:sideInfo};
};
const TEXTS=()=>{const texts=[];const vis=e=>e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden';
 const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 for(let n;(n=walk.nextNode());){const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(!el||!vis(el)||el.closest('[aria-hidden=true],svg,.v3PreviewBar'))continue;
  const rg=document.createRange();rg.selectNodeContents(n);const r=rg.getBoundingClientRect();if(r.width<4||r.height<4||r.top<0||r.left<0||r.bottom>innerHeight||r.right>innerWidth)continue;
  // Text partly clipped by a scrolling ancestor (scrolled under its edge) is not readable text; skip it.
  let clipped=false;for(let a=el.parentElement;a&&!clipped;a=a.parentElement){const o=getComputedStyle(a);if(/(auto|scroll|hidden|clip)/.test(o.overflowY+o.overflowX)){const q=a.getBoundingClientRect();clipped=r.top<q.top-1||r.bottom>q.bottom+1||r.left<q.left-1||r.right>q.right+1}}
  if(clipped)continue;const cs=getComputedStyle(el);const m=cs.color.match(/[\d.]+/g).map(Number);if(m.length>3&&m[3]<.5)continue;
  texts.push({t:t.slice(0,24),color:m.slice(0,3),size:parseFloat(cs.fontSize),bold:+cs.fontWeight>=600,rect:[r.x,r.y,r.width,r.height]})}
 return texts};

async function open(b,w,h,bg,v,reduced){
 const p=await b.newPage({viewport:{width:w,height:h}});
 if(reduced){const c=await p.context().newCDPSession(p);await c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'},{name:'prefers-contrast',value:'more'}]})}
 await p.goto('file://'+html+'#alles/'+bg);await p.waitForTimeout(1100);
 if(v==='les'){await p.locator('.v3Main .v3Btn.primary').filter({visible:true}).first().click();await p.waitForTimeout(1300)}
 else if(v!=='reis'){await p.locator(`[data-nav=${v}]`).filter({visible:true}).first().click();await p.waitForTimeout(700)}
 await p.evaluate(()=>document.activeElement?.blur?.());await p.mouse.move(1,1);await p.waitForTimeout(250);return p}
async function pixels(b,w,h,png,boxes){const q=await b.newPage({viewport:{width:w,height:h}});
 const res=await q.evaluate(async({shot,boxes})=>{const img=new Image();img.src='data:image/png;base64,'+shot;await img.decode();
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);
  const get=r=>x.getImageData(Math.max(0,Math.round(r[0])),Math.max(0,Math.round(r[1])),Math.max(1,Math.round(r[2])),Math.max(1,Math.round(r[3]))).data;
  return boxes.map(({r,tc})=>{const d=get(r);const arr=[];for(let i=0;i<d.length;i+=4)arr.push([d[i],d[i+1],d[i+2]]);
   if(!tc)return [0,1,2].map(k=>arr.reduce((s,p)=>s+p[k],0)/arr.length);
   const dist=p=>Math.hypot(p[0]-tc[0],p[1]-tc[1],p[2]-tc[2]);arr.sort((a,b)=>dist(b)-dist(a));const top=arr.slice(0,Math.max(1,arr.length>>2));
   return [0,1,2].map(k=>top.reduce((s,p)=>s+p[k],0)/top.length)})},{shot:png.toString('base64'),boxes});
 await q.close();return res}

const b=await chromium.launch();const R={alpha:[],side:[],contrast:[],reduced:[],empty:[],tint:{}};
for(const [w,h] of SIZES)for(const bg of BGS)for(const v of VIEWS){
 const p=await open(b,w,h,bg,v,false);const s=await p.evaluate(SURFACES);const texts=await p.evaluate(TEXTS);
 if(!s.surfaces.length)R.empty.push({w,bg,v});
 for(const x of s.surfaces)R.alpha.push({w,bg,v,id:x.id,bottom:x.bottom,ok:x.bottom<=.45});
 if(s.side)R.side.push({w,bg,v,bottom:s.side.bottom,behind:s.side.behind,ok:s.side.bottom<=.05&&s.side.behind==='none'});
 const shot=await p.screenshot();
 const bgs=await pixels(b,w,h,shot,texts.map(t=>({r:t.rect,tc:t.color})));
 texts.forEach((t,i)=>{const r=ratio(t.color,bgs[i]),need=(t.size>=24||(t.size>=18.66&&t.bold))?3:4.5;if(r<need)R.contrast.push({w,bg,v,t:t.t,size:t.size,ratio:+r.toFixed(2),need})});
 // Tint: hide text and icons, measure each surface's whole box (inset 8 px).
 await p.addStyleTag({content:'*{color:transparent!important;text-shadow:none!important}img,svg,picture,canvas,button{visibility:hidden!important}'});await p.waitForTimeout(150);
 const shot2=await p.screenshot();const boxes=s.surfaces.map(x=>({r:[x.rect[0]+8,x.rect[1]+8,Math.max(1,x.rect[2]-16),Math.max(1,x.rect[3]-16)]}));
 const means=await pixels(b,w,h,shot2,boxes);s.surfaces.forEach((x,i)=>{const k=`${w}:${v}:${x.id}`;(R.tint[k]??={})[bg]=lab(means[i])});
 await p.close();
 if(bg==='bg01'){const pr=await open(b,w,h,bg,v,true);const sr=await pr.evaluate(SURFACES);
  for(const x of sr.surfaces)if(x.top>=.2&&(x.top<.95||x.blur!=='none'))R.reduced.push({w,v,id:x.id,top:x.top,blur:x.blur});await pr.close()}
}
await b.close();
const spread=Object.entries(R.tint).filter(([,o])=>Object.keys(o).length===3).map(([k,o])=>{const L=Object.values(o);let m=0;for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)m=Math.max(m,dE(L[i],L[j]));return [k,+m.toFixed(1)]});
const fails={alpha:R.alpha.filter(a=>!a.ok),side:R.side.filter(s=>!s.ok),contrast:R.contrast,reduced:R.reduced,empty:R.empty};
const sum={surfacesChecked:R.alpha.length,alphaFails:fails.alpha.length,sideFails:fails.side.length,contrastFails:fails.contrast.length,reducedFails:fails.reduced.length,emptyViews:fails.empty.length,
 meanTintSpreadDE:spread.length?+(spread.reduce((s,[,m])=>s+m,0)/spread.length).toFixed(2):null};
console.log(JSON.stringify(sum,null,1));
for(const [k,v] of Object.entries(fails))if(v.length)console.log(k,JSON.stringify([...new Map(v.map(x=>[JSON.stringify({...x,bg:undefined,w:undefined}),x])).values()].slice(0,15)));
const jo=args.indexOf('--json');if(jo>=0)writeFileSync(args[jo+1],JSON.stringify({sum,fails,spread},null,1));
process.exitCode=fails.alpha.length||fails.side.length||fails.contrast.length||fails.reduced.length||fails.empty.length?1:0;
