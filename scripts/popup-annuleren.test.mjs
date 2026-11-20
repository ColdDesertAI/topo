// BL-036.2: every clarification popup (Rome lens, "Welke plek bedoel je?" picker) can be cancelled without an answer
// (x, Escape, tap outside) and still grades / shows the lesson normally when a choice is made. Inventory: ops/reports/BL-036-popup-inventaris.md
import test from 'node:test';
import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import{JSDOM,VirtualConsole}from'jsdom';
const html=readFileSync(new URL('../index.html',import.meta.url)).toString();
function boot(){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://popup.test',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){if(!this.open)return;this.open=false;this.dispatchEvent(new w.Event('close'))}}});
 const w=dom.window;return{w,d:w.document,ev:s=>w.eval(s),errors,close:()=>w.close()}}
let shared;const boot1=()=>{if(!shared){shared=boot();shared.ev(`window.__log=[];const g=grade;grade=function(ok,c){window.__log.push(['grade',ok,c&&c.id]);return g.apply(this,arguments)};const sl=showLesson;showLesson=function(i){window.__log.push(['lesson',i&&i.id]);return sl.apply(this,arguments)}`)}shared.ev('window.__log.length=0');return shared};
const snap=a=>a.ev(`JSON.stringify({mode:state.mode,qm:state.questionMode,cur:state.current&&state.current.id,answered:state.answered,good:state.good,bad:state.bad,wrong:state.wrong,lesson:state.lessonIndex,ls:Object.keys(localStorage).sort().map(k=>k+'='+localStorage.getItem(k))})`);
const cancels={
 'x-knop':a=>a.d.querySelector('#mapPicker .pickerClose').click(),
 'Escape':a=>a.d.querySelector('#mapPicker').dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})),
 'tik buiten':a=>a.d.querySelector('#mapPicker').dispatchEvent(new a.w.MouseEvent('click',{bubbles:true,clientX:-5,clientY:-5})),
 'Terug naar de kaart':a=>a.d.querySelector('#mapPicker .pickerCancel').click(),
};
// [label, set-up, how the picker is opened]. Modes: Ontdekken (learn), Aanwijzen (point), Oefenen (route point stage / point), Toets (exam).
const cases=[
 ['Ontdekken: kaarttik met meerdere plekken',a=>a.ev(`mode('learn')`),a=>a.ev(`openMapPicker([byId['city-9'],byId['area-o']])`),true],
 ['Aanwijzen: kaarttik op Rome/Vaticaan',a=>a.ev(`mode('point');state.current=byId['city-9'];state.questionMode='point';state.answered=false;clearActive()`),a=>a.ev(`romeHit.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))`),false],
 ['Aanwijzen: kaarttik op andere overlap (stad/staat)',a=>a.ev(`mode('point');state.current=byId['city-9'];state.questionMode='point';state.answered=false;clearActive()`),a=>a.ev(`openMapPicker([byId['city-9'],byId['area-o'],byId['area-n']])`),false],
 ['Oefenen (leerroute, aanwijsstap): kaarttik',a=>a.ev(`mode('route');state.current=byId['city-9'];state.questionMode='point';state.answered=false;clearActive()`),a=>a.ev(`openMapPicker([byId['city-9'],byId['area-o']])`),false],
 ['Toets: aanwijsvraag',a=>a.ev(`mode('exam');state.current=byId['city-9'];state.questionMode='point';state.answered=false;clearActive()`),a=>a.ev(`openMapPicker([byId['city-9'],byId['area-o']])`),false],
];
for(const[label,setup,open,learn]of cases){
 for(const[how,cancel]of Object.entries(cancels))test(`${label}: openen en annuleren (${how}) laat alles ongewijzigd`,()=>{
  const a=boot1();try{setup(a);const before=snap(a);open(a);const dlg=a.d.querySelector('#mapPicker');assert(dlg.open);a.ev('window.__log.length=0');
   const close=dlg.querySelector('.pickerClose');assert(close,'x-knop aanwezig');assert.equal(close.getAttribute('aria-label'),'Sluiten, terug naar de kaart');
   cancel(a);assert(!dlg.open,'dialoog dicht');assert.equal(a.ev('window.__log.length'),0,'niet beoordeeld, geen les geopend');assert.equal(snap(a),before);assert.deepEqual(a.errors,[]);
  }finally{}});
 test(`${label}: openen en kiezen wordt normaal verwerkt`,()=>{
  const a=boot1();try{setup(a);open(a);const dlg=a.d.querySelector('#mapPicker');assert(dlg.open);a.ev('window.__log.length=0');
   const btn=dlg.querySelector('[data-map-choice="city-9"]')||dlg.querySelector('[data-map-choice]');btn.click();assert(!dlg.open);
   const log=JSON.parse(a.ev('JSON.stringify(window.__log)'));
   if(learn){assert(log.some(e=>e[1]===btn.dataset.mapChoice));assert(log.every(e=>e[0]==='lesson'))}
   else{assert.deepEqual(log,[['grade',btn.dataset.mapChoice==='city-9',btn.dataset.mapChoice]]);if(!label.startsWith('Oefenen'))assert(a.ev('state.answered'))}
   assert.deepEqual(a.errors,[]);
  }finally{}});
}
// Rome lens (Ontdekken and the discover step of the learn route): shown on tap/hover, x/Escape/tap outside only hide it.
for(const[label,setup]of[['Ontdekken',a=>a.ev(`mode('learn')`)],['Leerroute-ontdekstap',a=>a.ev(`mode('route');state.questionMode='discover'`)]]){
 const lensOpen=a=>{a.ev(`romeHit.dispatchEvent(new MouseEvent('click',{bubbles:true}))`);const l=a.d.querySelector('#romeLens');assert(!l.classList.contains('hidden'));return l};
 for(const how of['x-knop','Escape','tik buiten'])test(`Romelens ${label}: annuleren (${how}) verbergt zonder beoordeling`,()=>{
  const a=boot1();try{setup(a);const before=snap(a);const l=lensOpen(a);a.ev('window.__log.length=0');const x=l.querySelector('.lensClose');assert(x);assert.equal(x.getAttribute('aria-label'),'Sluiten, terug naar de kaart');
   if(how==='x-knop')x.click();else if(how==='Escape')a.d.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
   else a.d.querySelector('#map').dispatchEvent(new a.w.Event('pointerdown',{bubbles:true}));
   assert(l.classList.contains('hidden'));assert.equal(a.ev('window.__log.length'),0);assert.equal(snap(a),before);assert.deepEqual(a.errors,[]);
  }finally{}});
 test(`Romelens ${label}: kiezen werkt normaal`,()=>{
  const a=boot1();try{setup(a);const l=lensOpen(a);   l.querySelector('[data-choice="area-o"]').click();
   if(label==='Ontdekken')assert(JSON.parse(a.ev('JSON.stringify(window.__log)')).some(e=>e[0]==='lesson'&&e[1]==='area-o'));
   assert.deepEqual(a.errors,[]);
  }finally{}});
}

test.after(()=>shared&&shared.close());
