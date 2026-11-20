// BL-039.8: Kennispaspoort, filling pizza. Build first: node scripts/build-v3-preview.mjs. Run: node scripts/qa-v3-paspoort.mjs
// QA_SIZES=1440x900,1080x810,810x1080 (default); QA_STATES=afgerond,alles. Exit code 1 on any failure.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const sizes=(process.env.QA_SIZES||'1440x900,1080x810,810x1080').split(',').map(x=>x.split('x').map(Number));
const states=(process.env.QA_STATES||'afgerond,alles').split(',');
const LEVELS={'Nog oefenen':0,'Herhalen':25,'Opfrissen':50,'Op weg':75,'Goed onthouden':100};
const fails=[],fail=(w,m)=>fails.push(w+': '+m);
const b=await chromium.launch();
for(const [W,H] of sizes)for(const state of states){
 const w=`${W}×${H} #${state}/bg01`,p=await b.newPage({viewport:{width:W,height:H}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(HTML+'#'+state+'/bg01');await p.waitForTimeout(1300);
 await p.locator('.v3Side [data-nav=voortgang]').filter({visible:true}).first().click();await p.waitForTimeout(900);
 const rows=p.locator('.v3VgPas .v3Row');const n=await rows.count();if(!n){fail(w,'geen paspoortrijen');await p.close();continue;}
 for(let i=0;i<n;i++){await rows.nth(i).click();await p.waitForTimeout(60);}
 const r=await p.evaluate(()=>{const out={levels:{},icons:0,bad:[],legend:[]};
  for(const f of document.querySelectorAll('.v3PasBody td .v3PasFill')){
   if(!f.getBoundingClientRect().width)continue;out.icons++;
   const label=f.getAttribute('aria-label'),top=f.querySelector('.v3PasTop'),base=f.querySelector('.v3PasBase'),cs=getComputedStyle(top),m=cs.maskImage||cs.webkitMaskImage||'';
   const pct=+(/rgb\(0, 0, 0\) ([\d.]+)%/.exec(m)||/#000 0 ([\d.]+)%/.exec(m)||[])[1];
   const rc=f.getBoundingClientRect(),bs=getComputedStyle(base);
   (out.levels[label]??=new Set()).add(pct);
   const e=[];if(f.getAttribute('role')!=='img')e.push('role');if(f.title!==label)e.push('title');
   if(Math.round(rc.width)!==32||Math.round(rc.height)!==32)e.push('maat '+rc.width+'×'+rc.height);
   if(!/grayscale\(1\)/.test(bs.filter)||bs.opacity!=='0.3')e.push('basis '+bs.filter+' '+bs.opacity);
   if(top.getAttribute('aria-hidden')!=='true'||base.getAttribute('aria-hidden')!=='true')e.push('aria-hidden');
   if(!/49\.8%\s+50\.4%/.test(m)&&!/at 49\.8%/.test(m)&&!/49\.8/.test(m))e.push('mask-midden '+m.slice(0,80));
   if(e.length)out.bad.push(label+': '+e.join(', '));}
  for(const cap of document.querySelectorAll('.v3PasBody .v3PasLegend')){const c=cap.getBoundingClientRect();if(!c.width)continue;
   const its=[...cap.querySelectorAll('.v3PasLegendItem')],tops=its.map(i=>Math.round(i.getBoundingClientRect().top)),parent=cap.closest('table').getBoundingClientRect(),
    last=its.at(-1).getBoundingClientRect();
   out.legend.push({names:its.map(i=>i.textContent),pcts:its.map(i=>i.querySelector('.v3PasFill')?.dataset.fill),oneLine:new Set(tops).size===1,fits:last.right<=parent.right+0.5&&cap.scrollWidth<=cap.clientWidth+1,
    font:getComputedStyle(cap).fontSize,h:c.height,hidden:its.every(i=>i.querySelector('[aria-hidden=true]'))});}
  out.levels=Object.fromEntries(Object.entries(out.levels).map(([k,v])=>[k,[...v]]));return out;});
 if(!r.icons)fail(w,'geen pizza\'s zichtbaar');
 for(const [k,v] of Object.entries(r.levels)){if(!(k in LEVELS))fail(w,'onbekend niveau '+k);else if(v.length!==1||v[0]!==LEVELS[k])fail(w,`${k}: vulling ${v} ≠ ${LEVELS[k]}`);}
 for(const e of r.bad)fail(w,e);
 if(!r.legend.length)fail(w,'geen legenda');
 for(const l of r.legend){if(l.names.join()!==Object.keys(LEVELS).join())fail(w,'legenda-namen '+l.names);if(l.pcts.join()!=='0,25,50,75,100')fail(w,'legenda-% '+l.pcts);
  if(!l.oneLine||!l.fits)fail(w,'legenda niet op één regel/past niet '+JSON.stringify(l));if(parseFloat(l.font)<13)fail(w,'legenda < 13 px');}
 console.log(w,'iconen',r.icons,'niveaus',JSON.stringify(r.levels),'legenda',r.legend.length,'font',r.legend[0]?.font);
 if(errors.length)fail(w,'paginafouten '+errors.join(' | '));
 if(process.env.QA_SHOT&&W===1440){await p.screenshot({path:process.env.QA_SHOT+`/pas-${state}.png`});}
 await p.close();
}
await b.close();
if(fails.length){console.error('\nFOUTEN ('+fails.length+')\n'+[...new Set(fails)].join('\n'));process.exit(1);}
console.log('\nQA paspoort: 0 fouten');
