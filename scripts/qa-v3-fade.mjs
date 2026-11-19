// BL-034: the workspace and sidebar fade has no hard step. Build first: node scripts/build-v3-preview.mjs.
// Run: node scripts/qa-v3-fade.mjs   (exit 1 when a step > 3% is found)
// Method: a pixel row at 50% of the height, from the sidebar's edge to the right, mean relative luminance per 40 px block; between neighbouring blocks no
// jump > 0.03. Measured on the LAYERS ALONE (content hidden, a uniform grey scene, so the photo's own detail does not
// count) — that is the criterion. The same row on BG-01/02/03 is reported for information.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML='file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const SCREENS=['reis','oefenen','toets','rewards','voortgang'];
const b=await chromium.launch();const fails=[];
const row=async(p,y)=>p.evaluate(async y=>{const side=Math.ceil((document.querySelector('.v3Reis>.v3Side')?.getBoundingClientRect().right||0)+2);const png=window.__png;const img=new Image();img.src='data:image/png;base64,'+png;await img.decode();
 const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);const k=img.width/innerWidth;
 const d=g.getImageData(0,Math.round(y*k),img.width,1).data;const lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
 const L=[];for(let x=0;x<img.width;x++){const i=x*4;L.push(.2126*lin(d[i])+.7152*lin(d[i+1])+.0722*lin(d[i+2]));}
 const B=Math.round(40*k),x0=Math.round(side*k),blocks=[];for(let x=x0;x+B<=L.length;x+=B)blocks.push(L.slice(x,x+B).reduce((a,v)=>a+v,0)/B);
 let max=0,at=0;for(let i=1;i<blocks.length;i++){const j=Math.abs(blocks[i]-blocks[i-1]);if(j>max){max=j;at=side+i*40;}}
 // the sidebar's own edge (a panel edge with a hairline, by design): the step from the last 20 px of the sidebar into the first 20 px of the workspace
 const m=(a,b)=>{const q=L.slice(Math.round(a*k),Math.round(b*k));return q.reduce((s,v)=>s+v,0)/q.length;};const edge=side>2?Math.abs(m(side-22,side-2)-m(side+2,side+22)):0;
 return {max:+max.toFixed(4),at,edge:+edge.toFixed(4)};},y);
for(const [W,H] of [[1440,900],[1080,810]]){
 for(const scene of ['grijs','bg01','bg02','bg03'])for(const s of SCREENS){
  const p=await b.newPage({viewport:{width:W,height:H}});
  await p.goto(HTML+'#bezig/'+(scene==='grijs'?'bg03':scene));await p.waitForTimeout(1200);
  if(s!=='reis'){await p.locator(`.v3Side [data-nav=${s}]`).filter({visible:true}).first().click();await p.waitForTimeout(800);}
  // layers only: hide everything inside the window (the root's ::before = workspace, the sidebar's ::after = its glass)
  await p.addStyleTag({content:'.v3PreviewBar{visibility:hidden!important}.v3Reis>*:not(.v3Side),.v3Side>*{visibility:hidden!important}'+(scene==='grijs'?'body{background:#7f7f7f!important}':'')});
  await p.waitForTimeout(250);
  const y=Math.round(H/2);await p.evaluate(async png=>{window.__png=png;},(await p.screenshot()).toString('base64'));
  const r=await row(p,y);const where=`${W}×${H} ${scene} ${s}`;
  if(scene==='grijs'&&r.max>.03)fails.push(`${where}: sprong ${r.max} bij x≈${r.at}`);
  console.log(where.padEnd(28),'grootste sprong in de werkruimte',r.max,'bij x≈'+r.at,'· zijbalkrand',r.edge+(scene==='grijs'?'':' (info)'));
  await p.close();}
}
await b.close();
if(fails.length){console.log('\nFOUTEN:\n'+fails.join('\n'));process.exit(1);}
console.log('\nOK: geen sprong > 3% in de lagen');
