// BL-039.7: the chapter picture opens large. Build first: node scripts/build-v3-preview.mjs. Run: node scripts/qa-v3-zoom.mjs
// QA_SIZES=1440x900,1080x810,810x1080 (default). Exit code 1 on any failure.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const sizes=(process.env.QA_SIZES||'1440x900,1080x810,810x1080').split(',').map(x=>x.split('x').map(Number));
const fails=[],fail=(w,m)=>fails.push(w+': '+m),ok=(w,c,m)=>{if(!c)fail(w,m);};
const b=await chromium.launch();
const open=async(p,state,id)=>{await p.goto('about:blank');await p.goto(HTML+'#'+state+'/bg01');await p.waitForTimeout(1200);
 await p.evaluate(id=>{TOPO_V3.showChapter(id);TOPO_V3.render();},id);await p.waitForTimeout(700);};
const active=p=>p.evaluate(()=>{const a=document.activeElement;return a?(a.className||a.tagName)+'':''});
for(const [W,H] of sizes){
 const portrait=W<H&&W<1024;
 for(const reduce of [false,true]){
  const ctx=await b.newContext({viewport:{width:W,height:H},reducedMotion:reduce?'reduce':'no-preference'});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const where=`${W}×${H}${reduce?' reduced-motion':''}`;
  // unlocked: #alles city1 and #bezig city1
  for(const state of ['alles','bezig']){
   await open(p,state,'city1');const w=`${where} #${state}/bg01 city1`;
   const btn=p.locator('.v3Panel .v3SceneZoom');
   if(portrait){const vis=await btn.filter({visible:true}).count();ok(w,vis===0,'iPad-portret: scène moet verborgen zijn, geen zichtbare knop ('+vis+')');continue;}
   ok(w,await btn.count()===1,'geen knop "Bekijk de afbeelding groot"');
   ok(w,(await btn.getAttribute('aria-label'))==='Bekijk de afbeelding groot','aria-label klopt niet');
   if(!await btn.count())continue;
   for(const how of ['klik','enter']){
    const t=`${w} openen via ${how}`;
    if(how==='klik')await btn.click();else{await btn.focus();await p.keyboard.press('Enter');}
    await p.waitForTimeout(30);
    // animation: transform (zoom) or opacity only (reduced motion)
    const anim=await p.evaluate(()=>[...document.querySelectorAll('.v3ZoomImg')].flatMap(i=>i.getAnimations().flatMap(a=>a.effect.getKeyframes().map(k=>Object.keys(k).filter(n=>!['offset','easing','composite','computedOffset'].includes(n)).join(','))))).catch(()=>[]);
    ok(t,reduce?anim.length>0&&anim.every(k=>!/transform/.test(k)):anim.some(k=>/transform/.test(k)),'animatie: '+JSON.stringify(anim));
    await p.waitForTimeout(520);
    const ov=p.locator('.v3ZoomOverlay');ok(t,await ov.count()===1,'overlay niet geopend');
    const r=await p.evaluate(()=>{const i=document.querySelector('.v3ZoomImg'),r=i.getBoundingClientRect(),x=document.querySelector('.v3ZoomClose').getBoundingClientRect(),cs=getComputedStyle(document.querySelector('.v3ZoomOverlay'));
     return {w:r.width,h:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2,vw:innerWidth,vh:innerHeight,ratio:i.naturalWidth/i.naturalHeight,xw:x.width,xh:x.height,xr:x.right,xt:x.top,blur:cs.backdropFilter||cs.webkitBackdropFilter,bg:cs.backgroundColor,focus:document.activeElement?.className,radius:getComputedStyle(document.querySelector('.v3ZoomClose')).borderRadius,xbg:getComputedStyle(document.querySelector('.v3ZoomClose')).backgroundColor};});
    ok(t,r.w<=r.vw*.8+1&&r.h<=r.vh*.8+1,`afmeting ${r.w.toFixed(0)}×${r.h.toFixed(0)} > 80vw×80vh (${(r.vw*.8).toFixed(0)}×${(r.vh*.8).toFixed(0)})`);
    ok(t,Math.abs(r.w/r.h-r.ratio)<.02,`verhouding ${(r.w/r.h).toFixed(3)} ≠ ${r.ratio.toFixed(3)}`);
    ok(t,Math.abs(r.cx-r.vw/2)<2&&Math.abs(r.cy-r.vh/2)<2,'niet in het midden');
    ok(t,Math.abs(r.w-Math.min(r.vw*.8,r.vh*.8*r.ratio))<2,'niet zo groot mogelijk binnen 80vw×80vh');
    ok(t,r.xw===44&&r.xh===44&&r.radius.includes('50%'),`× ${r.xw}×${r.xh} ${r.radius}`);
    ok(t,r.xr>r.vw-40&&r.xt<40,'× niet rechtsboven');
    ok(t,/blur/.test(r.blur||''),'geen blur achter de overlay');
    ok(t,/ZoomClose/.test(r.focus||''),'focus niet op ×: '+r.focus);
    // focus stays inside
    await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');ok(t,/ZoomClose/.test(await active(p)),'focus verlaat de overlay');
    // close: ×, Esc, outside
    for(const way of ['×','Esc','buiten']){
     const tc=`${t}, sluiten met ${way}`;
     if(way!=='×'||true){if(way==='×')await p.locator('.v3ZoomClose').click();else if(way==='Esc')await p.keyboard.press('Escape');else await p.mouse.click(8,Math.round(H/2));}
     await p.waitForTimeout(560);
     ok(tc,await p.locator('.v3ZoomOverlay').count()===0,'overlay blijft staan');
     ok(tc,/v3SceneZoom/.test(await active(p)),'focus niet terug op de afbeelding: '+await active(p));
     if(way!=='buiten'){await btn.click();await p.waitForTimeout(560);}
    }
   }
   // locked chapter: not clickable (no button), picture stays hidden/muted
   await open(p,state,'city4');
   const lk=await p.evaluate(()=>({locked:!!document.querySelector('.v3Panel.v3PanelLocked'),btn:document.querySelectorAll('.v3Panel .v3SceneZoom').length}));
   if(state==='bezig'){ok(`${w} vergrendeld city4`,lk.locked&&lk.btn===0,'vergrendeld hoofdstuk heeft een knop of is niet vergrendeld: '+JSON.stringify(lk));}
   else ok(`${w} city4 (alles af)`,lk.btn===1,'ontgrendeld hoofdstuk zonder knop');
  }
  if(errors.length)fail(where,'page errors: '+errors.join(' | '));
  await ctx.close();
 }
 console.log(`${W}×${H}`,portrait?'portret: scène verborgen, geen knop':'zoom getest (normaal + reduced motion)');
}
await b.close();
if(fails.length){console.log('\nFOUTEN ('+fails.length+'):\n'+fails.join('\n'));process.exit(1);}
console.log('\nOK: hoofdstukafbeelding-zoom gehaald');
