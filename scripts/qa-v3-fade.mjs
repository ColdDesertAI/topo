// BL-034/BL-035: the workspace and sidebar layers. Build first: node scripts/build-v3-preview.mjs.
// Run: node scripts/qa-v3-fade.mjs   (exit 1 on a failure). Chromium, plus WebKit when WebKitWebDriver + Xvfb are present
// (scripts/qa-webkit.mjs); QA_ENGINES=chromium limits it.
// Per screen (Reis, Oefenen, Toets, Beloningen, Voortgang) × 1440×900, 1080×810 × BG-01/02/03, content hidden:
// 1. the fade: a pixel row at 50% height from the sidebar's edge to the right, mean relative luminance per 40 px block of
//    the jump between neighbouring blocks that the LAYERS ADD (|jump with layers| − |jump of the scene alone|, so the
//    photo's own detail does not count, and blur that softens it counts as no step): max 0.03.
// 2. the scene shows through the workspace from 25% of the width: detail (luminance std. dev.) in x 25–45%, y 30–70% keeps
//    ≥ 45% of the scene's own.
// 3. the sidebar's bottom 30% shows the scene: detail there keeps ≥ 60% of the scene's own.
// A uniform grey scene is reported for information (the brief's gradient itself steps ~4% per 40 px on mid grey).
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {webkit,webkitAvailable} from './qa-webkit.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML='file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const SCREENS=['reis','oefenen','toets','rewards','voortgang'],SIZES=[[1440,900],[1080,810]],SCENES=['bg01','bg02','bg03','grijs'];
const HIDE='.v3PreviewBar{visibility:hidden!important}.v3Reis>*:not(.v3Side),.v3Side>*{visibility:hidden!important}';
const NOLAYER='.v3Reis::before,.v3Reis::after,.v3Side::after{display:none!important}';
const engines=(process.env.QA_ENGINES||'chromium,webkit').split(',').filter(e=>e!=='webkit'||webkitAvailable());
const b=await chromium.launch();const calc=await b.newPage();const fails=[];
// analysis in a Chromium page: two PNGs (with and without layers) → the three measures
const analyse=(a,z,W,H,side)=>calc.evaluate(async ([a,z,W,H,side])=>{
 const load=async s=>{const i=new Image();i.src='data:image/png;base64,'+s;await i.decode();const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(i,0,0,W,H);return g.getImageData(0,0,W,H).data;};
 const A=await load(a),Z=await load(z),lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;},Lum=(d,x,y)=>{const i=(y*W+x)*4;return .2126*lin(d[i])+.7152*lin(d[i+1])+.0722*lin(d[i+2]);};
 const y=Math.round(H/2),bl=d=>{const o=[];for(let x=side;x+40<=W;x+=40){let s=0;for(let k=x;k<x+40;k++)s+=Lum(d,k,y);o.push(s/40);}return o;},a1=bl(A),z1=bl(Z);
 let max=0,at=0;for(let i=1;i<a1.length;i++){const j=Math.abs(a1[i]-a1[i-1])-Math.abs(z1[i]-z1[i-1]);if(j>max){max=j;at=side+i*40;}}
 const sd=(d,x0,x1,y0,y1)=>{let n=0,s=0,q=0;for(let yy=y0;yy<y1;yy+=2)for(let x=x0;x<x1;x+=2){const v=Lum(d,x,yy);n++;s+=v;q+=v*v;}const m=s/n;return Math.sqrt(Math.max(0,q/n-m*m));};
 const r=(x0,x1,y0,y1)=>sd(A,x0,x1,y0,y1)/Math.max(1e-6,sd(Z,x0,x1,y0,y1));
 return {max:+max.toFixed(4),at,scene:+r(Math.round(W*.25),Math.round(W*.45),Math.round(H*.3),Math.round(H*.7)).toFixed(2),side:+r(8,side-8,Math.round(H*.7),H-4).toFixed(2)};
},[a,z,W,H,side]);
for(const eng of engines){
 const wk=eng==='webkit'?await webkit():null;
 for(const [W,H] of SIZES)for(const scene of SCENES)for(const s of SCREENS){
  let a,z,side;const url=HTML+'#bezig/'+(scene==='grijs'?'bg03':scene),extra=scene==='grijs'?'body{background:#7f7f7f!important}':'';
  if(wk){await wk.viewport(W,H);await wk.goto(url);await wk.wait(1600);if(s!=='reis'){await wk.click(`.v3Side [data-nav=${s}]`);await wk.wait(900);}
   await wk.css(HIDE+extra);await wk.wait(300);side=Math.ceil(await wk.eval('return document.querySelector(".v3Reis>.v3Side").getBoundingClientRect().right'));
   a=(await wk.shot()).toString('base64');await wk.css(NOLAYER);await wk.wait(300);z=(await wk.shot()).toString('base64');}
  else{const p=await b.newPage({viewport:{width:W,height:H}});await p.goto(url);await p.waitForTimeout(1200);
   if(s!=='reis'){await p.locator(`.v3Side [data-nav=${s}]`).filter({visible:true}).first().click();await p.waitForTimeout(800);}
   await p.addStyleTag({content:HIDE+extra});await p.waitForTimeout(250);side=Math.ceil(await p.evaluate(()=>document.querySelector('.v3Reis>.v3Side').getBoundingClientRect().right));
   a=(await p.screenshot()).toString('base64');await p.addStyleTag({content:NOLAYER});await p.waitForTimeout(250);z=(await p.screenshot()).toString('base64');await p.close();}
  const r=await analyse(a,z,W,H,side),where=`${eng} ${W}×${H} ${scene} ${s}`,real=scene!=='grijs';
  if(real&&r.max>.03)fails.push(`${where}: sprong ${r.max} bij x≈${r.at}`);
  if(real&&r.scene<.45)fails.push(`${where}: scène vanaf 25% te zwak (${r.scene})`);
  if(real&&r.side<.6)fails.push(`${where}: zijbalk onderin toont te weinig scène (${r.side})`);
  console.log(where.padEnd(36),'sprong',r.max,'x≈'+r.at,...(real?['· scène 25–45%',r.scene,'· zijbalk onder',r.side]:['(info: effen grijs)']));
 }
 if(wk)await wk.close();
}
await b.close();
if(fails.length){console.log('\nFOUTEN:\n'+fails.join('\n'));process.exit(1);}
console.log('\nOK ('+engines.join(' + ')+'): geen sprong > 3%, scène zichtbaar vanaf 25%, zijbalk onderin toont de scène');
