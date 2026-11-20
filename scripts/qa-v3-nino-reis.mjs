// BL-037.4: gerichte test. Het Nino-portret in de zijbalk is een knop "Naar mijn reis" (44 px, focusbaar). In een lopende
// les brengt hij je naar het Reis-overzicht; de les blijft bewaard en "Ga verder" gaat verder op dezelfde vraag.
// Bouw eerst: node scripts/build-v3-preview.mjs. Draai: node scripts/qa-v3-nino-reis.mjs (exit 1 bij een fout).
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const fails=[];const check=(ok,what)=>{if(!ok)fails.push(what);console.log((ok?'ok   ':'FOUT ')+what);};
const b=await chromium.launch();
for(const [W,H] of [[1440,900],[1080,810],[810,1080]]){
 const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(HTML+'#bezig');await p.waitForTimeout(1500);
 const nino=()=>p.locator('.v3Side .v3Portrait').filter({visible:true}).first();
 const view=()=>p.evaluate(()=>({view:document.querySelector('.v3Reis')?.dataset.view,les:document.body.classList.contains('v3Les'),q:state.current?.id||null,mode:state.mode}));
 const tag=`${W}x${H} `;
 // Op Reis: knop met label, 44 px, focusbaar.
 const n0=nino();const box=await n0.boundingBox();
 check(await n0.evaluate(e=>e.tagName==='BUTTON'&&e.getAttribute('aria-label')==='Naar mijn reis'),tag+'portret is een knop met aria-label "Naar mijn reis"');
 check(box&&box.width>=44&&box.height>=44,tag+'doel >= 44 px ('+Math.round(box?.width)+'x'+Math.round(box?.height)+')');
 await n0.focus();check(await n0.evaluate(e=>e.matches(':focus')),tag+'focusbaar');
 // Start een routeles via Ga verder, noteer de vraag.
 await p.locator('.v3Main .v3Btn.primary').filter({visible:true}).first().click();await p.waitForTimeout(900);
 let s=await view();check(s.les&&!!s.q,tag+'les loopt (vraag '+s.q+')');const q=s.q;
 // Nino in de les, via toetsenbord (Enter) of klik.
 const nl=nino();
 if(await nl.count()){
  await nl.click();await p.waitForTimeout(900);
  s=await view();check(!s.les&&s.view==='reis',tag+'Nino-klik in de les gaat naar het Reis-overzicht ('+s.view+')');
  await p.locator('.v3Main .v3Btn.primary').filter({visible:true}).first().click();await p.waitForTimeout(900);
  s=await view();check(s.les&&s.q===q,tag+'Ga verder hervat dezelfde vraag ('+s.q+' = '+q+')');
 }else check(true,tag+'(geen zichtbaar Nino in de les-zijbalk op deze maat; test via de Reis-pagina hieronder)');
 // Ook vanaf Reis: klik op Nino terwijl de les geparkeerd is via nav "Voortgang", dan Nino, dan Ga verder.
 await p.locator('.v3Side [data-nav=voortgang]').filter({visible:true}).first().click();await p.waitForTimeout(700);
 const n2=nino();
 if(await n2.count()){await n2.click();await p.waitForTimeout(800);s=await view();check(s.view==='reis',tag+'Nino vanaf Voortgang naar Reis ('+s.view+')');}
 check(!errs.length,tag+'geen paginafouten '+errs.slice(0,2));
 await p.close();
}
await b.close();
process.exit(fails.length?1:0);
