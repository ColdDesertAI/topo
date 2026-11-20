/* TOPO V3 — BL-036.8: the Vespa-rit. One moment per ride (every 3rd pizza), on the Reis map.
   It replaces V2's ride dialog and toast in V3 (celebrateTrip does nothing here); it only reads state.trips, no new counter
   and no new storage. "Already shown" lives in memory only: the ride number at load counts as seen (so a reload or coming
   back to Reis never repeats it); a new ride (state.trips goes up) shows once, as soon as the learner is on the Reis
   overview and nothing else is open.
   - Nino on the Vespa (the same picture as beside the active pin) drives in about 2.5 s along a dotted violet line (#5b45e0)
     from the active pin to the next chapter's pin; the line draws along. No next pin: the card only.
   - Then a card: "Vespa-rit nr. n!", the postcard when this ride earns one (post.js: Venetië 3rd, Napels 6th), buttons
     "Bekijk in Reisboekje" and "Verder".
   - Always skippable: tap/click or Esc jumps to the end picture, then closes. Never blocking: no modal, no focus trap.
   - Reduced motion: no ride, only the end picture with a short fade. */
(function setupV3Rit(){
 'use strict';
 const V=window.TOPO_V3;if(!V)return;
 const ART=typeof NINO_V2_ART!=='undefined'?NINO_V2_ART:null,body=document.body,SVGNS='http://www.w3.org/2000/svg';
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const still=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const trips=()=>state.trips|0;
 // The preview demo "#rit" starts one ride short, so the ride shows once on opening.
 let shown=Math.max(0,trips()-(window.TOPO_V3_RIT_DEMO?1:0)),el=null,raf=0,ready=0,timer=0;
 const POST={3:'venezia',6:'napoli'},PLACE={venezia:'Venetië',napoli:'Napels'};
 const DURATION=2500;

 // V2's ride dialog and toast give way to this moment.
 celebrateTrip=function(){};

 const wide=()=>!!window.matchMedia?.('(min-width:1024px)').matches;
 const overview=()=>body.classList.contains('v3Home')&&document.querySelector('.v3Reis[data-view=reis]')?.checkVisibility?.()!==false;
 function markers(){return [...document.querySelectorAll('.v3Map .v3Markers .v3Marker')].filter(n=>n.getClientRects().length);}
 function busy(){
  if(document.querySelector('dialog[open]'))return true;
  if(typeof pizzaCelebrations!=='undefined'&&pizzaCelebrations.busy)return true;
  return false;
 }
 // Centre of a pin's head (the number inside it), in viewport pixels.
 function head(m){const t=m.querySelector('text')||m,r=t.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}
 function plan(){
  const ms=markers(),on=ms.find(n=>n.classList.contains('on'));
  if(!on)return null;
  const i=ms.indexOf(on),next=ms[i+1]||null;
  if(!next)return {a:head(on),b:null};
  return {a:head(on),b:head(next)};
 }
 // Quadratic curve with a gentle bend; lengths sampled so progress follows the distance travelled.
 function curve(a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,bend=Math.min(.2*d,90),c=[(a[0]+b[0])/2-dy/d*bend,(a[1]+b[1])/2+dx/d*bend];
  const at=t=>[(1-t)**2*a[0]+2*(1-t)*t*c[0]+t*t*b[0],(1-t)**2*a[1]+2*(1-t)*t*c[1]+t*t*b[1]];
  const N=48,acc=[0];let prev=at(0);for(let k=1;k<=N;k++){const p=at(k/N);acc.push(acc[k-1]+Math.hypot(p[0]-prev[0],p[1]-prev[1]));prev=p;}
  const total=acc[N]||1;
  return {c,total,at,pointAt(f){const L=Math.max(0,Math.min(1,f))*total;let k=1;while(k<N&&acc[k]<L)k++;const s=(L-acc[k-1])/((acc[k]-acc[k-1])||1);return at((k-1+Math.max(0,Math.min(1,s)))/N);}};
 }
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

 function close(){
  window.cancelAnimationFrame?.(raf);clearTimeout(timer);raf=0;timer=0;
  const n=el;el=null;body.classList.remove('v3RitOn');document.removeEventListener('keydown',onKey,true);
  if(!n)return;n.remove();
 }
 function onKey(e){
  if(e.key!=='Escape'||!el||e.defaultPrevented)return;
  // Esc belongs to a dialog opened above the ride (the Reisboekje, settings, ...) first.
  if(document.querySelector('dialog[open]'))return;
  e.preventDefault();e.stopPropagation();
  if(el.dataset.phase==='ride')arrive();else close();
 }
 function nextFrame(fn){if(typeof requestAnimationFrame==='function')raf=requestAnimationFrame(fn);else timer=setTimeout(()=>fn(performance.now()),16);}

 function arrive(){
  if(!el||el.dataset.phase==='arrived')return;
  window.cancelAnimationFrame?.(raf);raf=0;
  const g=el._geo;if(g)setProgress(1);
  el.dataset.phase='arrived';el.querySelector('.v3RitCard').hidden=false;
  el.querySelector('.v3RitMore').focus({preventScroll:true});
 }
 function setProgress(f){
  const g=el._geo;if(!g)return;
  const p=g.curve.pointAt(f),nino=el.querySelector('.v3RitNino');
  nino.style.transform='translate('+(p[0]-g.size/2)+'px,'+(p[1]-g.size+10)+'px)'+(g.flip?' scaleX(-1)':'');
  el.querySelector('.v3RitReveal').setAttribute('stroke-dasharray',f+' 1');
 }

 function show(){
  const n=trips(),key=POST[n],geo=wide()?plan():null,reduce=still();
  shown=n;
  const art=window.TOPO_V3_ART?.ninoScooter,src=art?((window.devicePixelRatio||1)>=1.5?art.x64:art.x48):null;
  el=make('div','v3Rit');el.setAttribute('role','dialog');el.setAttribute('aria-label','Vespa-rit nummer '+n);el.dataset.ride=String(n);
  const scrim=make('div','v3RitScrim');el.append(scrim);
  // The ride: only when there is a pin to ride from and a pin to ride to.
  const W=innerWidth,H=innerHeight;let ride=false;
  if(geo&&geo.b&&Math.hypot(geo.b[0]-geo.a[0],geo.b[1]-geo.a[1])>24&&src){
   ride=true;
   const cv=curve(geo.a,geo.b),svg=document.createElementNS(SVGNS,'svg');svg.setAttribute('class','v3RitSvg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width',W);svg.setAttribute('height',H);svg.setAttribute('aria-hidden','true');
   const d='M'+geo.a[0]+' '+geo.a[1]+'Q'+cv.c[0]+' '+cv.c[1]+' '+geo.b[0]+' '+geo.b[1];
   svg.innerHTML='<defs><mask id="v3RitMask" maskUnits="userSpaceOnUse" x="0" y="0" width="'+W+'" height="'+H+'"><path class="v3RitReveal" d="'+d+'" pathLength="1" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-dasharray="0 1"/></mask></defs>'
    +'<path class="v3RitLine" d="'+d+'" fill="none" stroke="#5b45e0" stroke-width="5" stroke-linecap="round" stroke-dasharray="0.1 11" mask="url(#v3RitMask)"/>';
   el.append(svg);
   const size=56,nino=make('img','v3RitNino');nino.src=src;nino.alt='';nino.width=size;nino.height=size;nino.setAttribute('aria-hidden','true');el.append(nino);
   el._geo={curve:cv,size,flip:geo.b[0]<geo.a[0]};
  }
  // The card (end picture).
  const card=make('div','v3RitCard');card.hidden=true;
  if(key&&ART?.[key]){const im=make('img','v3RitPost');im.src=ART[key].src;im.width=ART[key].width;im.height=ART[key].height;im.alt='Ansichtkaart uit '+PLACE[key];card.append(im);}
  const copy=make('div','v3RitCopy'),h=make('h2',null,'Vespa-rit nr. '+n+'!');h.id='v3RitTitle';
  copy.append(h,make('p',null,key?'Je krijgt een ansichtkaart uit '+PLACE[key]+'. Hij ligt in je Reisboekje.':'Drie pizza’s brachten Nino weer een stuk verder.'));
  const row=make('div','v3RitActions'),bk=make('button','v3Btn v3RitBook','Bekijk in Reisboekje'),more=make('button','v3Btn primary v3RitMore','Verder');bk.type='button';more.type='button';
  bk.addEventListener('click',()=>{close();const label=key&&window.TOPO_V3.post?.cards?.find(c=>c[0]===key)?.[1];
   if(label&&window.TOPO_V3.book?.openPage)window.TOPO_V3.book.openPage(bk,label);else window.TopoBook?.open(bk,'trips');});
  more.addEventListener('click',()=>close());
  row.append(bk,more);copy.append(row);card.append(copy);card.addEventListener('click',e=>e.stopPropagation());
  el.setAttribute('aria-labelledby','v3RitTitle');el.append(card);
  scrim.addEventListener('click',()=>{if(el.dataset.phase==='ride')arrive();else close();});
  body.append(el);body.classList.add('v3RitOn');document.addEventListener('keydown',onKey,true);
  if(!ride||reduce){
   el.dataset.phase='ride';if(el._geo)setProgress(1);arrive();el.classList.add('v3RitFade');return;
  }
  el.dataset.phase='ride';setProgress(0);
  const t0=performance.now();
  const step=now=>{if(!el||el.dataset.phase!=='ride')return;const t=Math.min(1,((now||performance.now())-t0)/DURATION);setProgress(ease(t));if(t>=1)arrive();else nextFrame(step);};
  nextFrame(step);
 }

 // One check: is the learner on the Reis overview, with nothing open, and is there a new ride? `now` skips the settle wait.
 function tick(now){
  shown=Math.min(shown,trips());
  if(el||shown>=trips())return false;
  const ok=overview()&&!busy()&&(wide()?markers().some(n=>n.classList.contains('on')):true);
  if(!ok){ready=0;return false;}
  if(!now&&++ready<2)return false; // settled: ready on two consecutive checks (the map has been fitted)
  ready=0;show();return true;
 }
 function loop(){tick(false);}
 setInterval(loop,400);

 // Import and reset replace progress: rebase quietly, never celebrate old progress.
 const saveClear=clearRewardCelebrations;
 clearRewardCelebrations=function(){saveClear();close();setTimeout(()=>{shown=trips();},0);};
 V.rit={tick,shown:()=>shown,open:()=>!!el,close:()=>close()};
})();
