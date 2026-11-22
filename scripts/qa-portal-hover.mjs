// BL-041a: portal hover only on devices with hover; keyboard focus intact; reduced motion fades without zoom; UI checks.
// Run: node scripts/qa-portal-hover.mjs   (serves the repo root on a free port; /portal/ needs ../assets). Exit code 1 on any failure.
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const root=fileURLToPath(new URL('..',import.meta.url));
const port=8700+Math.floor(Math.random()*200);
const srv=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
await new Promise(r=>setTimeout(r,1200));
const URL_='http://127.0.0.1:'+port+'/portal/index.html';
const fails=[],fail=(w,m)=>fails.push(w+': '+m),log=(...a)=>console.log(...a);
const b=await chromium.launch();
const open=async(opts)=>{const c=await b.newContext(opts);const p=await c.newPage();
 await p.route('**/index.html',r=>r.request().url().includes('/portal/')?r.continue():r.abort()); // the Italy link: no navigation to the 41 MB app
 await p.addInitScript(()=>document.addEventListener('click',e=>e.preventDefault(),true)); // no navigation to the Italy app: the tap still happens
 await p.goto(URL_,{waitUntil:'load'});await p.waitForSelector('.country');await p.waitForTimeout(500);return {c,p};};
const state=p=>p.evaluate(()=>[...document.querySelectorAll('.country')].map(c=>({name:c.querySelector('h2,h3').textContent.trim(),go:c.classList.contains('go'),future:c.classList.contains('future'),
 alt:+getComputedStyle(c.querySelector('img.alt')).opacity,base:+getComputedStyle(c.querySelector('img.base')).opacity,tf:getComputedStyle(c.querySelector('img.base')).transform,
 tfAlt:getComputedStyle(c.querySelector('img.alt')).transform,btn:getComputedStyle(c.querySelector('.action,.soon')).backgroundColor,cursor:getComputedStyle(c.querySelector('.action,.soon')).cursor})));
const cardBox=async(p,i)=>{const v=p.locator('.country').nth(i).locator('.visual');await v.scrollIntoViewIfNeeded();return v.boundingBox();};

// 1. every :hover rule sits inside @media (hover:hover)
{const {c,p}=await open({viewport:{width:1440,height:900}});
 const r=await p.evaluate(()=>{const bad=[];let n=0;const walk=(rules,ok)=>{for(const x of rules){
   if(x instanceof CSSMediaRule){walk(x.cssRules,ok||/hover:\s*hover/.test(x.conditionText||x.media.mediaText));}
   else if(x instanceof CSSStyleRule){if(/:hover/.test(x.selectorText)){n++;if(!ok)bad.push(x.selectorText);}}
   else if(x.cssRules)walk(x.cssRules,ok);}};
  for(const s of document.styleSheets)walk(s.cssRules,false);return {bad,n};});
 log('1 :hover-regels',r.n,'zonder hover-media',r.bad.length);if(!r.n)fail('crit1','geen :hover-regels gevonden (test leeg)');for(const x of r.bad)fail('crit1',x);
 await c.close();}

// 2. touch: nothing hangs after a tap
for(const [W,H] of [[810,1080],[1080,810]]){
 const {c,p}=await open({viewport:{width:W,height:H},hasTouch:true,isMobile:true});const w=`touch ${W}×${H}`;
 if(await p.evaluate(()=>matchMedia('(hover:hover)').matches))fail(w,'hover:hover matcht op touch');
 const n=await p.locator('.country').count();
 for(let i=0;i<n;i++){const bx=await cardBox(p,i);await p.touchscreen.tap(bx.x+bx.width/2,bx.y+bx.height/2);await p.waitForTimeout(900);
  const st=await state(p);for(const [k,s] of st.entries()){
   if(i===0&&k===0){log(w,'Italië net getikt (focus-within door de tik op de link, navigatie volgt):',JSON.stringify({alt:s.alt,tf:s.tf}));continue;} // by design: the tapped link has focus
   const baseNeutral=s.future?.69:1; // .future base is .69 by design
   if(s.alt!==0)fail(w,`na tik op kaart ${i}: ${s.name} alt-opacity ${s.alt} ≠ 0`);
   if(s.tf!=='none')fail(w,`na tik op kaart ${i}: ${s.name} transform ${s.tf} ≠ none`);
   if(s.base!==baseNeutral)fail(w,`na tik op kaart ${i}: ${s.name} base-opacity ${s.base} ≠ ${baseNeutral}`);}
  log(w,'tik kaart',i,'ok');}
 await c.close();}

// 3. desktop hover unchanged; 4. keyboard focus
{const {c,p}=await open({viewport:{width:1440,height:900}});const w='desktop 1440×900';
 if(!await p.evaluate(()=>matchMedia('(hover:hover)').matches))fail(w,'hover:hover matcht niet');
 const before=await state(p);
 for(const i of [0,3]){const bx=await cardBox(p,i);await p.mouse.move(bx.x+bx.width/2,bx.y+bx.height/2);await p.waitForTimeout(900);
  const s=(await state(p))[i];log(w,'hover kaart',i,JSON.stringify(s));
  const want=s.future?.73:1;if(s.alt!==want)fail(w,`hover ${s.name}: alt ${s.alt} ≠ ${want}`);
  if(!/^matrix\(1\.03,/.test(s.tf))fail(w,`hover ${s.name}: transform ${s.tf}`);
  if(!s.go){if(s.btn!==before[i].btn)fail(w,'niet-actieve knop veranderde: '+s.btn);if(s.cursor!=='default')fail(w,'cursor '+s.cursor);}
  else if(s.btn!=='rgb(91, 69, 224)')fail(w,'actieve knop hover '+s.btn);}
 await p.mouse.move(2,2);await p.waitForTimeout(900);
 // 4. keyboard
 await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.waitForTimeout(900);
 const f=await p.evaluate(()=>({tag:document.activeElement.className,alt:+getComputedStyle(document.querySelector('.country.go img.alt')).opacity,
   btn:getComputedStyle(document.querySelector('.country.go .action')).backgroundColor}));
 log('4 focus',JSON.stringify(f));if(!/action/.test(f.tag)){await p.keyboard.press('Tab');await p.waitForTimeout(900);}
 const f2=await p.evaluate(()=>({tag:document.activeElement.className,alt:+getComputedStyle(document.querySelector('.country.go img.alt')).opacity}));
 log('4 focus (na zoeken)',JSON.stringify(f2));
 if(!/action/.test(f2.tag))fail('crit4','Italië-knop niet bereikbaar met Tab: '+f2.tag);else if(f2.alt!==1)fail('crit4','focus-within geeft alt '+f2.alt);
 await c.close();}

// 5. reduced motion: fade, no zoom
{const {c,p}=await open({viewport:{width:1440,height:900},reducedMotion:'reduce'});const w='reduced motion';
 for(const i of [0,3]){const bx=await cardBox(p,i);await p.mouse.move(bx.x+bx.width/2,bx.y+bx.height/2);await p.waitForTimeout(500);
  const r=await p.evaluate(i=>{const c=document.querySelectorAll('.country')[i],im=c.querySelector('img.alt'),cs=getComputedStyle(im),a=getComputedStyle(c.querySelector('.action,.soon span[aria-hidden],.soon')),
   ar=c.querySelector('.action span[aria-hidden]');
   return {dur:cs.transitionDuration,prop:cs.transitionProperty,tf:getComputedStyle(c.querySelector('img.base')).transform,op:+cs.opacity,arrow:ar?getComputedStyle(ar).transform:null};},i);
  log(w,'kaart',i,JSON.stringify(r));
  const d=parseFloat(r.dur);if(!(r.prop.split(',').map(x=>x.trim()).includes('opacity')&&d>=.15&&d<=.25))fail(w,`kaart ${i}: transition ${r.prop} ${r.dur}`);
  if(r.tf!=='none')fail(w,`kaart ${i}: transform ${r.tf}`);if(r.arrow&&r.arrow!=='none')fail(w,'pijl beweegt '+r.arrow);
  if(!(r.op>0))fail(w,`kaart ${i}: geen crossfade (alt ${r.op})`);}
 await c.close();}

// UI: no cut-off text, contrast >= 4.5, font >= 13 px
for(const [W,H] of [[1440,900],[1080,810],[810,1080]]){
 const {c,p}=await open({viewport:{width:W,height:H}});const w=`UI ${W}×${H}`;
 const r=await p.evaluate(()=>{const out=[];const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
  const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number);
  const bg=el=>{for(let e=el;e;e=e.parentElement){const c=rgba(getComputedStyle(e).backgroundColor);if(c.length&&(c.length===3||c[3]>=1))return c.slice(0,3);}return [255,255,255];};
  const boxes=[];
  for(const el of document.querySelectorAll('.country h2,.country h3,.country .description,.country .action,.country .soon,.hero h1,.hero p,footer span')){
   const own=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!own)continue;
   if(el.scrollWidth>el.clientWidth+1)out.push('afgesneden: '+el.textContent.trim());
   const cs=getComputedStyle(el);if(parseFloat(cs.fontSize)<13&&!el.closest('footer'))out.push('font '+cs.fontSize+' '+el.textContent.trim());
   if(parseFloat(cs.fontSize)<13)out.push('font '+cs.fontSize+' '+el.textContent.trim());
   const a=lum(rgba(cs.color).slice(0,3)),bl=lum(bg(el)),ct=(Math.max(a,bl)+.05)/(Math.min(a,bl)+.05);if(ct<4.5)out.push('contrast '+ct.toFixed(2)+' '+el.textContent.trim());
   boxes.push({t:el.textContent.trim(),r:el.getBoundingClientRect(),btn:el.matches('.action,.soon')});}
  for(const a of boxes.filter(x=>!x.btn))for(const b of boxes.filter(x=>x.btn)){const i=a.r,j=b.r;if(i.left<j.right&&i.right>j.left&&i.top<j.bottom&&i.bottom>j.top)out.push('overlap '+a.t+' / '+b.t);}
  return {out,n:boxes.length};});
 log(w,'elementen',r.n,'fouten',r.out.length);for(const x of r.out)fail(w,x);await c.close();}
await b.close();srv.kill();
if(fails.length){console.error('\nFOUTEN ('+fails.length+')\n'+[...new Set(fails)].join('\n'));process.exit(1);}
console.log('\nQA portal-hover: 0 fouten');
