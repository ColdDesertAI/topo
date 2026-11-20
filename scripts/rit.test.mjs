// BL-036.8: the Vespa-rit (scripts/v3/rit.js) shows exactly once per new ride, is skippable (tap, Esc), never replays after
// a reload, and with reduced motion shows only the end picture. Standalone jsdom harness: only state.trips and the Reis markers.
import test,{after}from'node:test';
import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import{JSDOM}from'jsdom';
const src=readFileSync(new URL('./v3/rit.js',import.meta.url),'utf8');
const markup=['1','2','3','4'].map((id,i)=>`<g class="v3Marker${id==='3'?' on':''}" data-chapter="c${id}" data-x="${200+i*120}" data-y="${300+(i%2)*60}"><text>${id}</text></g>`).join('');
const wins=[];after(()=>wins.forEach(w=>{try{w.close()}catch{}}));
function boot({trips=0,reduced=false,wide=true,onReis=true,previewDemo=false}={}){
 const dom=new JSDOM(`<body class="${onReis?'v3Home':''}"><div class="v3Reis" data-view="reis"><div class="v3Map"><svg><g class="v3Markers">${markup}</g></svg></div></div></body>`,{url:'https://rit.test',runScripts:'dangerously'});
 const w=dom.window,log=[];wins.push(w);
 w.matchMedia=q=>({matches:/reduce/.test(q)?reduced:wide});
 w.Element.prototype.getClientRects=function(){return[{}]};
 w.Element.prototype.getBoundingClientRect=function(){const g=this.closest('[data-x]');const x=+(g?.dataset.x||0),y=+(g?.dataset.y||0);return{left:x,top:y,width:0,height:0,right:x,bottom:y}};
 w.eval(`var state={trips:${trips}};var celebrateTrip=function(){window.__v2=(window.__v2||0)+1};var clearRewardCelebrations=function(){};var pizzaCelebrations={busy:false};
  var NINO_V2_ART={venezia:{src:'data:,v',width:10,height:10},napoli:{src:'data:,n',width:10,height:10}};
  window.TOPO_V3_ART={ninoScooter:{x48:'data:,s48',x64:'data:,s64'}};window.TOPO_V3={book:{openPage(o,l){window.__page=l}},post:{cards:[['venezia','Venetië, je derde Vespa-rit'],['napoli','Napels, je zesde Vespa-rit']]}};
  window.TopoBook={open(o,t){window.__book=t}};${previewDemo?"window.TOPO_V3_RIT_DEMO=1;":''}`);
 w.eval(src);
 return{w,d:w.document,set:n=>w.eval(`state.trips=${n}`),tick:()=>w.TOPO_V3.rit.tick(true),all:()=>w.document.querySelectorAll('.v3Rit'),esc:()=>w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})),log};
}
test('1e en 2e pizza (rit-teller gelijk): geen rit',()=>{const a=boot({trips:0});a.tick();assert.equal(a.all().length,0);a.tick();assert.equal(a.all().length,0);a.w.close();});
test('de 3e pizza (nieuwe rit) toont de rit precies een keer',()=>{
 const a=boot({trips:0});a.set(1);assert.equal(a.tick(),true);assert.equal(a.all().length,1);
 assert.equal(a.d.querySelector('.v3RitCard h2').textContent,'Vespa-rit nr. 1!');
 assert.equal(a.tick(),false);assert.equal(a.all().length,1,'geen tweede overlay');
 a.d.querySelector('.v3RitMore').click();assert.equal(a.all().length,0);
 assert.equal(a.tick(),false);assert.equal(a.all().length,0,'niet opnieuw na sluiten of terug naar Reis');
 a.w.eval('celebrateTrip("Rome","Florence")');assert.equal(a.w.__v2,undefined,'V2-ritmoment vervangen');a.w.close();});
test('herladen: dezelfde stand toont de rit niet opnieuw',()=>{const a=boot({trips:3});assert.equal(a.tick(),false);assert.equal(a.all().length,0);a.w.close();});
test('wacht tot de gebruiker op het Reis-overzicht is',()=>{const a=boot({trips:0,onReis:false});a.set(1);assert.equal(a.tick(),false);a.d.body.classList.add('v3Home');assert.equal(a.tick(),true);a.w.close();});
test('wacht tot een dialoog dicht is',()=>{const a=boot({trips:0});a.set(1);const dlg=a.d.createElement('dialog');dlg.setAttribute('open','');a.d.body.append(dlg);assert.equal(a.tick(),false);dlg.remove();assert.equal(a.tick(),true);a.w.close();});
test('3e rit: ansichtkaart Venetië + knoppen; Bekijk in Reisboekje opent het boek op de kaart',()=>{
 const a=boot({trips:2});a.set(3);a.tick();assert(a.d.querySelector('.v3RitPost'));assert.match(a.d.querySelector('.v3RitCopy p').textContent,/Venetië/);
 a.d.querySelector('.v3RitBook').click();assert.equal(a.all().length,0);assert.equal(a.w.__page,'Venetië, je derde Vespa-rit');a.w.close();});
test('rit zonder ansichtkaart opent het boek bij de ritten',()=>{const a=boot({trips:1});a.set(2);a.tick();assert(!a.d.querySelector('.v3RitPost'));a.d.querySelector('.v3RitBook').click();assert.equal(a.w.__book,'trips');a.w.close();});
test('rit loopt ~2,5 s en tekent de lijn mee; daarna de kaart',async()=>{
 const a=boot({trips:0});a.set(1);a.tick();const o=a.d.querySelector('.v3Rit');assert.equal(o.dataset.phase,'ride');assert(a.d.querySelector('.v3RitNino'));assert(a.d.querySelector('.v3RitLine'));assert.equal(a.d.querySelector('.v3RitCard').hidden,true);
 await new Promise(r=>setTimeout(r,1000));const f=parseFloat(a.d.querySelector('.v3RitReveal').getAttribute('stroke-dasharray'));assert(f>0&&f<1,'lijn tekent mee: '+f);
 await new Promise(r=>setTimeout(r,1900));assert.equal(o.dataset.phase,'arrived');assert.equal(a.d.querySelector('.v3RitCard').hidden,false);assert.equal(parseFloat(a.d.querySelector('.v3RitReveal').getAttribute('stroke-dasharray')),1);a.w.close();});
test('Esc slaat de rit over naar het eindbeeld, nogmaals Esc sluit; app blijft bruikbaar (niet modaal)',()=>{
 const a=boot({trips:0});a.set(1);a.tick();assert.equal(a.d.querySelector('.v3Rit').dataset.phase,'ride');a.esc();assert.equal(a.d.querySelector('.v3Rit').dataset.phase,'arrived');a.esc();assert.equal(a.all().length,0);
 assert.equal(a.d.querySelector('dialog'),null);a.w.close();});
test('tik op de achtergrond slaat over en sluit daarna',()=>{const a=boot({trips:0});a.set(1);a.tick();a.d.querySelector('.v3RitScrim').click();assert.equal(a.d.querySelector('.v3Rit').dataset.phase,'arrived');a.d.querySelector('.v3RitCard').click();assert.equal(a.all().length,1,'tik op de kaart sluit niet');a.d.querySelector('.v3RitScrim').click();assert.equal(a.all().length,0);a.w.close();});
test('reduced motion: geen rit, alleen het eindbeeld',async()=>{const a=boot({trips:0,reduced:true});a.set(1);a.tick();const o=a.d.querySelector('.v3Rit');assert.equal(o.dataset.phase,'arrived');assert.equal(a.d.querySelector('.v3RitReveal').getAttribute('stroke-dasharray'),'1 1','eindbeeld: lijn al volledig, Nino op de bestemming');assert(a.d.querySelector('.v3RitNino'));assert.equal(a.d.querySelector('.v3RitCard').hidden,false);await new Promise(r=>setTimeout(r,300));assert.equal(o.dataset.phase,'arrived');assert.equal(a.d.querySelector('.v3RitReveal').getAttribute('stroke-dasharray'),'1 1','geen rit-animatie');a.w.close();});
test('smal scherm (geen kaartpinnen): alleen de kaart, ook een keer',()=>{const a=boot({trips:0,wide:false});a.set(1);assert.equal(a.tick(),true);assert.equal(a.d.querySelector('.v3RitNino'),null);assert.equal(a.d.querySelector('.v3RitCard').hidden,false);a.d.querySelector('.v3RitMore').click();assert.equal(a.tick(),false);a.w.close();});
test('preview-demo #rit: toont de rit een keer bij het openen',()=>{const a=boot({trips:3,previewDemo:true});assert.equal(a.tick(),true);assert.match(a.d.querySelector('.v3RitCard h2').textContent,/nr\. 3/);a.w.close();});
