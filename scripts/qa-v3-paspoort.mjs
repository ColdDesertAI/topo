// BL-039.8 + BL-042.2: Kennispaspoort, filling pizza; compact legend, list width, one open, Esc, ×, map not covered. Build first: node scripts/build-v3-preview.mjs. Run: node scripts/qa-v3-paspoort.mjs
// QA_SIZES=1440x900,1080x810,810x1080 (default); QA_STATES=afgerond,alles. Exit code 1 on any failure.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const sizes=(process.env.QA_SIZES||'1440x900,1080x810,810x1080').split(',').map(x=>x.split('x').map(Number));
const states=(process.env.QA_STATES||'afgerond,alles').split(',');
const LEVELS={'Nog oefenen':0,'Herhalen':25,'Opfrissen':50,'Op weg':75,'Goed onthouden':100};
// List width measured at the commit before 2cdedd9 (rows open): 1440 -> 300, 1080 -> 274 (+2 px tolerance); portrait is not wider than the side column.
const MAXW={1440:300,1080:274};
const fails=[],fail=(w,m)=>fails.push(w+': '+m);
const b=await chromium.launch();
for(const [W,H] of sizes)for(const state of states){
 const w=`${W}×${H} #${state}/bg01`,p=await b.newPage({viewport:{width:W,height:H}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(HTML+'#'+state+'/bg01');await p.waitForTimeout(1300);
 await p.locator('.v3Side [data-nav=voortgang]').filter({visible:true}).first().click();await p.waitForTimeout(900);
 const rows=p.locator('.v3VgPas .v3Row');const n=await rows.count();if(!n){fail(w,'geen paspoortrijen');await p.close();continue;}
 const grab=()=>p.evaluate(()=>{const out={levels:{},icons:0,bad:[],legend:[]};
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
  for(const cap of document.querySelectorAll('.v3PasTools .v3PasLegend')){const c=cap.getBoundingClientRect();if(!c.width)continue;
   const its=[...cap.querySelectorAll('.v3PasLegendItem')],box=cap.closest('li').getBoundingClientRect(),last=cap.parentElement.querySelector('.v3PasClose').getBoundingClientRect();
   out.legend.push({names:its.map(i=>i.querySelector('.v3PasFill')?.getAttribute('aria-label')),titles:its.map(i=>i.querySelector('.v3PasFill')?.title),pcts:its.map(i=>i.querySelector('.v3PasFill')?.dataset.fill),
    sizes:its.map(i=>Math.round(i.querySelector('.v3PasFill').getBoundingClientRect().width)),fits:cap.scrollWidth<=cap.clientWidth+1&&last.right<=box.right+0.5&&c.right<=last.left+0.5,font:getComputedStyle(cap).fontSize});}
  out.levels=Object.fromEntries(Object.entries(out.levels).map(([k,v])=>[k,[...v]]));return out;});
 // BL-041a: names of mastered places: the ✓ hangs left of the text on the first line, never alone, no word broken, later lines start at the text x.
 const thCheck=()=>p.evaluate(()=>{const out=[];let beh=0,multi=0;
  for(const th of document.querySelectorAll('.v3VgPas .v3PasBody tbody th')){const r=th.getBoundingClientRect();if(!r.width)continue;
   const cs=getComputedStyle(th),name=th.textContent.trim();
   if(th.scrollWidth>th.clientWidth+1)out.push(name+': scrollWidth '+th.scrollWidth+' > '+th.clientWidth);
   if(cs.wordBreak!=='normal'||cs.overflowWrap!=='normal')out.push(name+': word-break/overflow-wrap '+cs.wordBreak+'/'+cs.overflowWrap);
   const tn=[...th.childNodes].find(n=>n.nodeType===3);const rg=document.createRange();rg.selectNodeContents(tn);
   const lines=[];for(const q of rg.getClientRects()){let l=lines.find(x=>Math.abs(x.top-q.top)<3);if(!l)lines.push(l={top:q.top,left:q.left,bottom:q.bottom});l.left=Math.min(l.left,q.left);}
   const textX=r.left+parseFloat(cs.borderLeftWidth)+parseFloat(cs.paddingLeft);
   // a word is broken when a line break falls inside a word: compare the line count with the count from a nowrap-free word measure
   const words=name.split(/\s+/);const wr=document.createRange();let wl=new Set();let pos=0;let broken=false;
   for(const w of words){const i=name.indexOf(w,pos);pos=i+w.length;wr.setStart(tn,i+(tn.textContent.indexOf(name)));wr.setEnd(tn,i+w.length+(tn.textContent.indexOf(name)));if(new Set([...wr.getClientRects()].map(q=>Math.round(q.top))).size>1)broken=true;}
   if(broken)out.push(name+': woord gebroken');
   if(lines.length>1)multi++;
   for(const l of lines)if(Math.abs(l.left-textX)>2)out.push(name+': regel begint op x '+l.left.toFixed(1)+' ≠ '+textX.toFixed(1));
   if(th.parentElement.dataset.status==='beheerst'){beh++;const b=getComputedStyle(th,'::before');
    if(b.content.replace(/"/g,'')!=='✓')out.push(name+': geen ✓');
    else{// the ✓ is an inline-block before the text: it is alone on a line when the first word starts one line lower. Measured with the cell top-aligned (restored after).
     const va=th.style.verticalAlign;th.style.verticalAlign='top';
     const w1=name.split(/\s+/)[0],fr=document.createRange();fr.setStart(tn,0);fr.setEnd(tn,w1.length);const fq=fr.getClientRects()[0],r2=th.getBoundingClientRect(),
      contentTop=r2.top+parseFloat(cs.borderTopWidth)+parseFloat(cs.paddingTop),lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.3;
     if(fq.top-contentTop>lh*0.5)out.push(name+': ✓ alleen op een regel (eerste woord '+(fq.top-contentTop).toFixed(1)+' px onder de bovenkant)');
     th.style.verticalAlign=va;
     if(b.display!=='inline-block'||parseFloat(b.width)>parseFloat(cs.paddingLeft)+.5||Math.abs(parseFloat(cs.textIndent)+parseFloat(b.width))>.5)out.push(name+': ✓ hangt niet in de inspringing '+b.width+' / '+cs.paddingLeft+' / '+cs.textIndent);}}}
  return {out,beh,multi};});
 const grab0=()=>0;
 const acc={levels:{},icons:0,bad:[],legend:[]};
 const side=async()=>p.evaluate(()=>{const l=document.querySelector('.v3VgPas').getBoundingClientRect(),m=document.querySelector('.v3VgMap').getBoundingClientRect(),cs=[...document.querySelectorAll('.v3VgPas li')].map(li=>li.getBoundingClientRect()),o=document.querySelectorAll('.v3VgPas .v3Row[aria-expanded=true]').length,
   open=document.querySelector('.v3VgPas .v3Row[aria-expanded=true]')?.closest('li'),ob=open?open.getBoundingClientRect():null,x=open?.querySelector('.v3PasClose')?.getBoundingClientRect(),all=document.querySelectorAll('.v3VgPas li *');
   let wide=0;for(const e of all){const r=e.getBoundingClientRect();if(r.width&&r.right>l.right+1)wide++;}
   const ov=!(l.right<=m.left+1||l.left>=m.right-1||l.bottom<=m.top||l.top>=m.bottom);
   return {w:Math.round(l.width),sideRight:l.right,overMap:ov,open:o,wide,x:x&&[Math.round(x.width),Math.round(x.height)],xlabel:open?.querySelector('.v3PasClose')?.getAttribute('aria-label')};});
 const st0=await side();
 if(MAXW[W]&&st0.w>MAXW[W]+2)fail(w,'lijst '+st0.w+' px > '+MAXW[W]+'+2');
 if(st0.overMap)fail(w,'lijst bedekt de kaart');
 let maxw=st0.w;
 for(let i=0;i<n;i++){await rows.nth(i).click();await p.waitForTimeout(60);
  const st=await side();maxw=Math.max(maxw,st.w);
  if(st.open!==1)fail(w,'rij '+i+': '+st.open+' open, verwacht 1');
  if(st.wide)fail(w,'rij '+i+': '+st.wide+' elementen breder dan de lijst');
  if(MAXW[W]&&st.w>MAXW[W]+2)fail(w,'lijst '+st.w+' > '+MAXW[W]+'+2 (rij '+i+')');
  if(st.overMap)fail(w,'open lijst bedekt de kaart');
  if(!st.x||st.x[0]<44||st.x[1]<44||st.xlabel!=='Sluiten')fail(w,'sluitknop '+JSON.stringify(st.x)+' '+st.xlabel);
  const tc=await thCheck();acc.beh=(acc.beh||0)+tc.beh;acc.multi=(acc.multi||0)+tc.multi;for(const m of tc.out)fail(w,'naam: '+m);
  const g=await grab();for(const k of Object.keys(g.levels))(acc.levels[k]??=new Set()).add(...g.levels[k]);acc.icons+=g.icons;acc.bad.push(...g.bad);acc.legend.push(...g.legend);}
 // Esc closes the open chapter and returns focus to its row; × does the same.
 await rows.nth(1).click();await p.keyboard.press('Escape');await p.waitForTimeout(80);
 let e1=await p.evaluate(()=>({open:document.querySelectorAll('.v3VgPas .v3Row[aria-expanded=true]').length,focus:document.activeElement?.classList.contains('v3Row')&&document.activeElement.dataset.chapter}));
 if(e1.open!==0||!e1.focus)fail(w,'Esc: '+JSON.stringify(e1));
 await rows.nth(2).click();await p.locator('.v3VgPas .v3Row[aria-expanded=true]').locator('xpath=..').locator('.v3PasClose').click();await p.waitForTimeout(80);
 e1=await p.evaluate(()=>({open:document.querySelectorAll('.v3VgPas .v3Row[aria-expanded=true]').length,focus:document.activeElement?.classList.contains('v3Row')}));
 if(e1.open!==0||!e1.focus)fail(w,'×: '+JSON.stringify(e1));
 // Evaluator BL-042: with a layer above (Instellingen, the background picker), Esc closes that layer only; the chapter stays open.
 const cnt=()=>p.evaluate(()=>({open:document.querySelectorAll('.v3VgPas .v3Row[aria-expanded=true]').length,dlg:!!document.querySelector('dialog[open]'),pop:[...document.querySelectorAll('.v3BgPop')].some(x=>!x.hidden)}));
 await rows.nth(1).click();await p.locator('.v3Reis>.v3Side .v3Settings').filter({visible:true}).first().click();await p.waitForTimeout(300);
 await p.keyboard.press('Escape');await p.waitForTimeout(150);let l1=await cnt();
 if(l1.dlg||l1.open!==1)fail(w,'Esc met Instellingen open: '+JSON.stringify(l1));
 await p.locator('.v3Reis>.v3Side .v3BgBtn').filter({visible:true}).first().click();await p.waitForTimeout(200);
 await p.keyboard.press('Escape');await p.waitForTimeout(150);l1=await cnt();
 if(l1.pop||l1.open!==1)fail(w,'Esc met achtergrondkiezer open: '+JSON.stringify(l1));
 await p.keyboard.press('Escape');await p.waitForTimeout(100);if((await cnt()).open!==0)fail(w,'tweede Esc sluit het hoofdstuk niet');
 await rows.nth(0).click();await rows.nth(1).click();
 if((await side()).open!==1)fail(w,'twee hoofdstukken tegelijk open');
 await rows.nth(0).click();
 const r=acc;r.levels=Object.fromEntries(Object.entries(r.levels).map(([k,v])=>[k,[...v]]));
 if(!r.icons)fail(w,'geen pizza\'s zichtbaar');
 for(const [k,v] of Object.entries(r.levels)){if(!(k in LEVELS))fail(w,'onbekend niveau '+k);else if(v.length!==1||v[0]!==LEVELS[k])fail(w,`${k}: vulling ${v} ≠ ${LEVELS[k]}`);}
 for(const e of r.bad)fail(w,e);
 if(!r.legend.length)fail(w,'geen legenda');
 for(const l of r.legend){if(l.names.join()!==Object.keys(LEVELS).join()||l.titles.join()!==l.names.join())fail(w,'legenda-namen/title '+l.names+' | '+l.titles);if(l.sizes.some(x=>x<18||x>22))fail(w,'legenda-pizza '+l.sizes);if(l.pcts.join()!=='0,25,50,75,100')fail(w,'legenda-% '+l.pcts);
  if(!l.fits)fail(w,'legenda past niet '+JSON.stringify(l));if(parseFloat(l.font)<13)fail(w,'legenda < 13 px');}
 console.log(w,'iconen',r.icons,'niveaus',JSON.stringify(r.levels),'legenda',r.legend.length,'font',r.legend[0]?.font,'lijst max',maxw,'beheerst',r.beh,'meerregelig',r.multi);
 if(errors.length)fail(w,'paginafouten '+errors.join(' | '));
 // BL-041a: the Esc listener of an earlier Voortgang render is removed at once: the keydown count on document does not grow over 5× Reis → Voortgang.
 if(W===1440&&state===states[0]){const cdp=await p.context().newCDPSession(p);
  const kd=async()=>{const {result}=await cdp.send('Runtime.evaluate',{expression:'document'});const {listeners}=await cdp.send('DOMDebugger.getEventListeners',{objectId:result.objectId});return listeners.filter(l=>l.type==='keydown').length;};
  const nav=async t=>{await p.locator(`.v3Side [data-nav=${t}]`).filter({visible:true}).first().click();await p.waitForTimeout(700);};
  const one=await kd();
  for(let i=0;i<5;i++){await nav('reis');await nav('voortgang');}
  const five=await kd();console.log(w,'keydown-listeners op document: na 1× Voortgang',one,'na 5× wisselen',five);
  if(five!==one)fail(w,'Esc-listener lekt: '+one+' → '+five);
  await rows.nth(1).click();await p.keyboard.press('Escape');await p.waitForTimeout(80);
  if((await side()).open!==0)fail(w,'Esc sluit het hoofdstuk niet na opnieuw renderen');}
 if(process.env.QA_SHOT&&W===1440){await p.screenshot({path:process.env.QA_SHOT+`/pas-${state}.png`});}
 await p.close();
}
await b.close();
if(fails.length){console.error('\nFOUTEN ('+fails.length+')\n'+[...new Set(fails)].join('\n'));process.exit(1);}
console.log('\nQA paspoort: 0 fouten');
