/* TOPO V3 — BL-036.7: "Hoe werkt TOPO?" One calm glass dialog, opened by the ?-button in the sidebar foot (beside the gear
   and the background button) or by the address /italie/#uitleg. Closing (x, Esc) returns focus to the button and removes
   the hash. Static text only; every fact was checked in the code (learning-engine: 8 points = 1 pizza, 3 pizzas = 1 Vespa
   ride; route-engine: Ontdekken gives no points; toets: no reward, the daily goal counts; voortgang.js: Beheerst / Bezig /
   Nog niet; nino-v2.js: Reservekopie under Instellingen). */
(function setupV3Uitleg(){
 'use strict';
 const SECTIONS=[
  ['De reis',['Je reist in 11 hoofdstukken door Italië. Elk hoofdstuk heeft drie lessen: Ontdekken, Aanwijzen en Namen schrijven.','Zijn de drie lessen klaar? Dan krijg je een stempel en gaat het volgende hoofdstuk open. Daarna kun je ook de gouden proef doen.']],
  ['Oefenen en Toets',['Bij Oefenen kies je zelf wat je wilt oefenen. Er is geen druk.','Bij Toets kies je de hoofdstukken en hoe lang de toets duurt. Een toets geeft geen pizza’s en geen Vespa-ritten. Je goede antwoorden tellen wel mee voor je dagdoel (8 goede antwoorden per dag).']],
  ['Beloningen',['Een goed antwoord bij Aanwijzen of Namen schrijven is 1 punt. Ontdekken geeft geen punten.','8 punten zijn 1 pizza. 3 pizza’s zijn 1 Vespa-rit.','In het Reisboekje bewaar je je stempels en ansichtkaarten.']],
  ['Voortgang en Kennispaspoort',['Bij Voortgang zie je hoe ver je bent. Het Kennispaspoort geeft elke plek een kleur.','Donkerviolet is Beheerst: je kent de plek goed. Lichtviolet is Bezig: je bent aan het oefenen. Bijna wit is Nog niet.']],
  ['Schoolblad en schoolkaart',['Het Schoolblad laat de kaart met alle namen zien. Handig als je iets even niet weet. Tijdens een toets staat het uit.','Op de Reis-kaart kies je Schoolkaart (plat) of Reliëf (met bergen).']],
  ['Voor ouders en leraren',['TOPO bewaart alles alleen op dit apparaat. Er is geen account en geen inlog.','Wil je de voortgang veiligstellen of meenemen naar een ander apparaat? Maak dan een reservekopie via Instellingen (het tandwiel). Daar kun je ook helemaal opnieuw beginnen.']]
 ];
 let dlg=null,opener=null;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 function build(){
  const d=el('dialog','v3 v3Uitleg');d.setAttribute('aria-labelledby','v3UitlegTitle');
  const x=el('button','v3UitlegClose','\u00d7');x.type='button';x.setAttribute('aria-label','Sluiten');x.addEventListener('click',()=>d.close());
  const h=el('h1',null,'Hoe werkt TOPO?');h.id='v3UitlegTitle';h.tabIndex=-1;
  const intro=el('p','v3UitlegIntro','TOPO is een reis door Italië. Je leert steden, bergen, rivieren en meer, op de kaart en met namen.');
  d.append(x,h,intro);
  for(const [title,paras] of SECTIONS){const s=el('section','v3UitlegSec');s.append(el('h2',null,title));for(const t of paras)s.append(el('p',null,t));d.append(s);}
  d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
  // Esc closes only this (top) window, never one underneath (e.g. the first-run welcome when #uitleg is opened on a fresh device).
  d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();d.close();}});
  d.addEventListener('cancel',e=>{e.preventDefault();d.close();});
  d.addEventListener('close',()=>{
   if(location.hash==='#uitleg')history.replaceState(null,'',location.pathname+location.search);
   const o=opener;opener=null;if(o?.isConnected&&o.checkVisibility?.()!==false)requestAnimationFrame(()=>o.focus({preventScroll:true}));
  });
  document.body.append(d);return d;
 }
 function open(from){
  if(!dlg)dlg=build();if(dlg.open)return;
  opener=from||document.activeElement;
  if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
  dlg.scrollTop=0;dlg.querySelector('h1').focus({preventScroll:true});
 }
 window.TOPO_V3_UITLEG={open,close:()=>dlg?.close(),isOpen:()=>!!dlg?.open};
 // /italie/#uitleg opens the page straight away (after the shell has booted); closing removes the hash.
 const fromHash=()=>{if(location.hash==='#uitleg')open(null);};
 if(document.readyState==='complete')setTimeout(fromHash,0);else window.addEventListener('load',()=>setTimeout(fromHash,0));
 window.addEventListener('hashchange',fromHash);
})();
