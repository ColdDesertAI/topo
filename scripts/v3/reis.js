/* TOPO V3 — Reis / hoofdstukkeuze (v3b: sidebar · chapter list · real map · one action).
   Presentation layer over the V2 app. Reads canonical state (state.route, ROUTE_CHAPTERS, TopoRoute) and never
   writes it. Every action presses the existing V2 control, so the intro offer, Reis → Verder restore,
   confirmations and lesson start behave exactly as in V2. The map is a clone of the live #map: same paths,
   same coordinates; only paint differs. */
(function setupV3Reis(){
 'use strict';
 const art=NINO_V2_ART,nino=window.TOPO_NINO_ART_DATA?.assets||{},$=s=>document.querySelector(s);
 const SVGNS='http://www.w3.org/2000/svg';
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const img=(a,cls)=>{const i=make('img',cls);i.src=a.src;i.width=a.width;i.height=a.height;i.alt='';i.decoding='async';return i;};
 const btn=(text,fn,cls='v3Btn')=>{const b=make('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;};
 const STAGE={discover:'Ontdekken',point:'Aanwijzen',write:'Namen schrijven'};
 const KIND={...STAGE,gold:'Gouden proef',review:'Opfrissen',smart:'Slim rondje'};
 // V3 handles the event, then presses the original V2 control.
 const press=find=>e=>{e.stopPropagation();const b=find();if(b&&!b.disabled)b.click();};
 const v2Card=id=>$('#routeCards article[data-chapter="'+id+'"]');
 const v2Nav=label=>[...document.querySelectorAll('.ninoNav button')].find(b=>b.textContent.trim()===label);
 const icon=name=>{const s=document.createElementNS(SVGNS,'svg');s.setAttribute('viewBox',name==='vespa'?'0 0 72 48':'0 0 32 32');s.setAttribute('aria-hidden','true');s.classList.add('v3Icon');const u=document.createElementNS(SVGNS,'use');u.setAttribute('href','#topo-'+name);s.append(u);return s;};
 const range=t=>{const f=document.createDocumentFragment();t.split(/(\d+–\d+)/).forEach(p=>{if(!p)return;if(/^\d+–\d+$/.test(p))f.append(make('span','nw',p));else f.append(p);});return f;};
 // Stijlbeeld (renderniveau): relief is the default map style; Schoolkaart stays one tap away.
 const ui={selected:null,relief:true,view:'reis',page:'overzicht'};
 // BL-029: composition after render "Menu 1" (default) or the fallback "Menu 2" (TOPO_V3_MENU='2').
 const MENU=String(window.TOPO_V3_MENU||'1');
 const m1Overview=()=>MENU==='1'&&WIDE.matches&&ui.page==='overzicht'&&ui.view==='reis'; // BL-016d: Reis = overzicht | hoofdstuk (≥ 1024 px)
 // Reis map (fase B; chosen in the afwerking 10-11): "eiland" = Italy floating as land, neighbours as soft silhouettes,
 // the sea transparent on the wash. Variant (b), the map in a glass card, is gone.
 ui.kaart='eiland';
 const BGKEY='topo-v3-background-v1',BACKDROPS={city1:'bg01',city2:'bg03',city3:'bg01',city4:'bg03',islands:'bg03',mountains:'bg02',volcanoes:'bg03',regions:'bg01',countries:'bg02',seas:'bg03',rivers:'bg02'};
 try{ui.background=localStorage.getItem(BGKEY);}catch{}
 const background=()=>{const chapter=$('#journeyScreen')?.classList.contains('hidden')?state.route?.active?.chapterId:ui.selected;
  const key=ui.background==='auto'?(BACKDROPS[chapter]||'bg03'):ui.background||window.TOPO_V3_BG||'bg03';
  const src=V3ART?.bg?.[key];if(src){document.body.style.setProperty('--v3-pano','url("'+src+'")');document.body.dataset.v3Background=key;}
 };
 // Chapter scenes {mini, kop}: the 8 #75 scenes (assets/v3/scenes) and Roma, Venezia, Napoli (assets/v3/render);
 // a chapter without a scene keeps its chapter icon. Render assets: background, portrait, icons, VE-01.
 const scenes=window.TOPO_V3_SCENES||{},V3ART=window.TOPO_V3_ART||null;
 const pic=(src,cls,w,h)=>{const i=make('img',cls);i.src=src;i.alt='';i.decoding='async';if(w){i.width=w;i.height=h;}return i;};
 // Line icons: iconen.js adds the V3 set to the V2 sprite (fase B).

 function model(){
  const chapters=ROUTE_CHAPTERS.map((c,index)=>{const r=TopoRoute.record(state.route,c.id);return {...c,index,r,open:TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id),done:r.stage===3,gold:r.goldAt>0};});
  const next=chapters.find(c=>c.r.stage<3)||null,active=state.route.active&&!state.route.active.done?state.route.active:null;
  const due=TopoRoute.due(state.route,ROUTE_CHAPTERS);
  // BL-034: ONE active chapter for the list ('now'), the marker and the first selection: the lesson in progress, else the
  // next chapter to do, else the last one (all done). Before, the list used `next` and the selection `active`.
  const current=(active&&chapters.find(c=>c.id===active.chapterId))||next||chapters.at(-1);
  return {chapters,next,active,current,due,done:chapters.filter(c=>c.done).length};
 }
 const stateOf=(c,m)=>!c.open?'locked':c.gold?'gold':c.done?'done':c===m.current?'now':'open';

 /* Shell (built once) */
 const root=make('div','v3 v3Reis');root.dataset.v3='reis';
 // Sidebar: one component for Reis and the lesson. Inside a lesson, Reis returns to Reis through the V2 nav.
 // Navigation (V3.0, docs/v3/V3_0_REST.md § 1): six tabs on every screen. The shell (shell.js) routes each tab;
 // the current tab follows the route the learner chose (DECISIONS 7-11).
 const TABS=[['reis','Reis','v3map'],['oefenen','Oefenen','v3cap'],['toets','Toets','v3test'],['rewards','Beloningen','v3trophy'],['voortgang','Voortgang','v3progress']];
 const go=tab=>e=>{e?.stopPropagation?.();window.TOPO_V3?.go?.(tab,e?.currentTarget);};
 const toReis=e=>{ui.page='overzicht';go('reis')(e);render();};
 function makeSide(){
  const side=make('nav','v3Side');side.setAttribute('aria-label','Hoofdnavigatie');
  const brand=make('div','v3Brand');brand.append(make('b',null,'Topo'),make('i','v3Flag'));
  // Nino portrait (render asset NINO-PORTRET); the guide cut-out only when the portrait is missing.
  // BL-037.4: the portrait is a button to the Reis overview (same path as the "Reis" tab: a running lesson is parked by
  // shell.toHome and resumes through Reis → Ga verder).
  const portrait=make('button','v3Portrait v3PortraitBtn');portrait.type='button';portrait.setAttribute('aria-label','Naar mijn reis');portrait.title='Naar mijn reis';
  portrait.addEventListener('click',toReis);if(V3ART?.portrait){portrait.classList.add('v3PortraitArt');portrait.append(pic(V3ART.portrait,null,512,512));}else if(nino.guide)portrait.append(img(nino.guide));
  const navItem=(tab,label,glyph)=>{const b=btn('',tab==='reis'?toReis:go(tab),'v3Btn v3NavItem');b.append(icon(glyph),make('span',null,label));b.dataset.nav=tab;return b;};
  const nav=make('div','v3NavList');nav.append(...TABS.map(t=>navItem(...t)));
  const settings=navItem('instellingen','Instellingen','v3gear');settings.classList.add('v3Settings');
  // BL-034 P1.12: background picker beside the gear — an image button that opens a small popover with 3 thumbnails.
  const bgBtn=btn('',e=>{e.stopPropagation();bgPicker(bgBtn);},'v3Btn v3NavItem v3BgBtn');bgBtn.append(icon('v3image'),make('span',null,'Achtergrond'));
  bgBtn.setAttribute('aria-haspopup','true');bgBtn.setAttribute('aria-expanded','false');bgBtn.title='Achtergrond';
  // BL-036.7: the ?-button opens "Hoe werkt TOPO?" (uitleg.js), same look as the gear and the background button.
  const helpBtn=btn('',e=>{e.stopPropagation();window.TOPO_V3_UITLEG?.open(helpBtn);},'v3Btn v3NavItem v3HelpBtn');helpBtn.append(icon('v3help'),make('span',null,'Hoe werkt TOPO?'));
  helpBtn.setAttribute('aria-label','Hoe werkt TOPO?');helpBtn.title='Hoe werkt TOPO?';helpBtn.setAttribute('aria-haspopup','dialog');
  // BL-037.5: "Alle landen" (door with arrow) leads to the portal (/). Only where a portal exists: the web copy over http(s),
  // not the offline file (file://) and not the demo preview (its flag is read without writing the literal name).
  const foot=make('div','v3SideFoot');foot.append(settings,bgBtn,helpBtn);
  if(/^https?:$/.test(location.protocol)&&!window['TOPO_V3_'+'PREVIEW']){
   const exitBtn=btn('',e=>{e.stopPropagation();location.assign('/');},'v3Btn v3NavItem v3ExitBtn');exitBtn.append(icon('v3exit'),make('span',null,'Alle landen'));
   exitBtn.setAttribute('aria-label','Alle landen');exitBtn.title='Alle landen';foot.append(exitBtn);
  }
  side.append(brand,portrait,nav,foot);markNav(side);return side;
 }
 // BL-034 P1.12: the background popover (one, shared by every sidebar copy). Choice saved through background.set
 // (localStorage); the active thumbnail has a violet ring. Escape or a click outside closes it; focus returns.
 let bgPop=null,bgOpener=null;
 function bgPicker(opener){
  if(bgPop&&!bgPop.hidden&&bgOpener===opener){closeBgPicker();return;}
  const T=V3ART?.bgThumbs;if(!T)return;
  if(!bgPop){bgPop=make('div','v3BgPop v3');bgPop.setAttribute('role','dialog');bgPop.setAttribute('aria-label','Kies een achtergrond');bgPop.hidden=true;document.body.append(bgPop);
   for(const [k,label] of [['bg01','Toscane'],['bg02','Meer'],['bg03','Zee']]){const b=btn('',e=>{e.stopPropagation();window.TOPO_V3.background.set(k);mark();},'v3BgThumb');b.dataset.background=k;
    const im=make('img');im.src=T[k];im.alt='';im.width=96;im.height=54;b.append(im,make('span',null,label));b.setAttribute('aria-label','Achtergrond '+label);bgPop.append(b);}
   document.addEventListener('click',e=>{if(bgPop&&!bgPop.hidden&&!bgPop.contains(e.target)&&!e.target.closest?.('.v3BgBtn'))closeBgPicker();});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&bgPop&&!bgPop.hidden){e.preventDefault();closeBgPicker(true);}});}
  const mark=()=>bgPop.querySelectorAll('.v3BgThumb').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.background===window.TOPO_V3.background.get())));
  mark();bgOpener=opener;opener.setAttribute('aria-expanded','true');bgPop.hidden=false;
  const r=opener.getBoundingClientRect();bgPop.style.left=Math.round(r.right+10)+'px';bgPop.style.bottom=Math.round(innerHeight-r.bottom)+'px';
  (bgPop.querySelector('[aria-pressed=true]')||bgPop.querySelector('button'))?.focus();
 }
 function closeBgPicker(refocus){if(!bgPop)return;bgPop.hidden=true;bgOpener?.setAttribute('aria-expanded','false');if(refocus)bgOpener?.focus();}
 // aria-current on every sidebar copy (Reis window and lesson shell).
 function markNav(scope=document){const cur=window.TOPO_V3?.currentTab?.()||(ui.view==='rewards'?'rewards':'reis');scope.querySelectorAll('.v3Side [data-nav]').forEach(b=>{if(b.dataset.nav===cur)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
 const side=makeSide();
 const list=make('section','v3List');list.setAttribute('aria-labelledby','v3ListTitle');
 // One title per screen (R-reis-ijk): the screen title "Reis"; the list heading stays for screen readers only.
 const screenTitle=make('h1','v3ScreenTitle','Reis');screenTitle.id='v3ReisTitle';screenTitle.tabIndex=-1;
 const listTitle=make('h2','v3SrOnly','Hoofdstukken');listTitle.id='v3ListTitle';const rows=make('ol','v3Rows');rows.id='v3Rows';list.append(screenTitle,listTitle,rows);
 const main=make('section','v3Main');main.setAttribute('aria-labelledby','v3Title');
 const top=make('div','v3Top'),panel=make('div','v3Panel'),stage=make('div','v3MapStage');
 main.append(top,stage,panel);const livePanel=panel;
 // Beloningen (richting B): a calm frame around the rich Reisboekje; counts come from the V2 state.
 const rewardsView=make('section','v3Rewards');rewardsView.setAttribute('aria-labelledby','v3RewardsTitle');
 // Further V3 views (Oefenen, Toets, Voortgang) share this window; shell.js fills them.
 const views={rewards:rewardsView},renderers={};
 function addView(name,label,fn){const v=make('section','v3View v3View-'+name);v.setAttribute('aria-label',label);views[name]=v;renderers[name]=fn;root.append(v);return v;}
 root.append(side,list,main,rewardsView);

 /* Map: clone of the live map, ids prefixed so references stay valid and nothing duplicates. */
 let mapClone=null;
 function cloneMap(prefix='v3m-',cls='v3Map'){
  const live=$('#map');if(!live||!live.querySelector('[data-id]'))return null;
  const svg=live.cloneNode(true),ids=new Map();
  svg.querySelectorAll('[id]').forEach(n=>{ids.set(n.id,prefix+n.id);n.id=prefix+n.id;});
  svg.removeAttribute('id');
  svg.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes]){if(a.value.includes('#')){const v=a.value.replace(/url\(#([^)]+)\)/g,(m,k)=>ids.has(k)?'url(#'+ids.get(k)+')':m).replace(/^#(.+)$/,(m,k)=>ids.has(k)?'#'+ids.get(k):m);if(v!==a.value)n.setAttribute(a.name,v);}}});
  svg.querySelectorAll('[class]').forEach(n=>n.classList.remove('activeTarget','selected','correct','wrong','highlight'));
  svg.querySelectorAll('#'+prefix+'nameLayer>*,.nameLabel').forEach(n=>n.remove());
  // Decorative copy: no focus stops, no accessible duplicates of the live targets.
  svg.querySelectorAll('[tabindex],[role],[aria-label]').forEach(n=>{n.removeAttribute('tabindex');n.removeAttribute('role');n.removeAttribute('aria-label');});
  svg.querySelectorAll('a,button,foreignObject').forEach(n=>n.remove());
  svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.removeAttribute('role');svg.classList.add(cls);
  addRelief(svg,prefix);
  return svg;
 }
 // Relief z8 in the render palette (Codex, v3/relief-z8 @ 2a7b0cf; measured DEM, same 890×1235 frame), in its layer
 // order: sea → land shadow → relief clipped to the original land → white coast rim → existing borders and labels.
 // All layers are decoration (aria-hidden, no pointer events, no data-id): geometry and targets stay the live map's.
 // V3 adds a soft coastal glow (copies of the same land paths) for a gentler sea gradient, and a land base in the
 // lowland colour where the raster ends (outside the canvas).
 const RELIEF=window.TOPO_V3_RELIEF||null;
 function addRelief(svg,prefix='v3m-'){
  const raster=(cls,href)=>{const i=document.createElementNS(SVGNS,'image');for(const [k,v] of Object.entries({x:0,y:0,width:890,height:1235,preserveAspectRatio:'none','pointer-events':'none','aria-hidden':'true',class:cls,href}))i.setAttribute(k,v);return i;};
  const defs=document.createElementNS(SVGNS,'defs');defs.innerHTML='<filter id="v3-coast-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>';svg.prepend(defs);
  const shapes=[...svg.querySelectorAll('.land,.italy')].map(n=>n.getAttribute('d')).filter(Boolean);
  const layer=cls=>{const g=document.createElementNS(SVGNS,'g');g.setAttribute('class',cls);g.setAttribute('aria-hidden','true');g.setAttribute('pointer-events','none');for(const d of shapes){const q=document.createElementNS(SVGNS,'path');q.setAttribute('d',d);g.append(q);}return g;};
  const under=svg.querySelector('#'+prefix+'seaLayer'),terrain=svg.querySelector('.atlasTerrain');if(!under||!terrain)return;
  const below=[];if(RELIEF)below.push(raster('v3R v3RSea',RELIEF.sea));below.push(layer('v3CoastGlow'));if(RELIEF)below.push(raster('v3R v3RShadow',RELIEF.shadow));below.push(layer('v3LandBase'));
  under.before(...below);
  if(RELIEF){terrain.querySelector('image')?.setAttribute('href',RELIEF.terrain);terrain.after(raster('v3R v3RCoast',RELIEF.coast));svg.dataset.relief8='z8';}
 }
 function paintMap(c){
  if(!mapClone){mapClone=cloneMap();if(mapClone){stage.prepend(mapClone);addIsland(mapClone);
   // Outside the 890×1235 canvas the real land continues; the canvas sea colour fills behind it.
   const sea=mapClone.querySelector('.sea');if(sea)mapClone.style.setProperty('--v3-sea-school',getComputedStyle(sea).fill);}}
  if(!mapClone)return;
  mapClone.dataset.relief=ui.relief?'on':'off';mapClone.dataset.kaart=ui.kaart;
  const set=new Set(c&&!m1Overview()?c.itemIds:[]);
  mapClone.querySelectorAll('[data-id]').forEach(n=>n.classList.toggle('v3Hit',set.has(n.getAttribute('data-id'))));
  mapClone.dataset.focus=c&&!m1Overview()?(c.itemIds[0]?.startsWith('city')?'points':'areas'):'';
  // Ronde 5 punt 1: two fixed frames, one scale. Italy (with Sicily and Sardinia) for every chapter; only the chapters
  // whose items lie beyond Italy (OMGEVING: Landen, Zeeën) zoom out to "Italië en omgeving".
  mapClone.dataset.frame=m1Overview()||(MENU==='1'&&WIDE.matches&&ui.page==='hoofdstuk'&&!(c&&OMGEVING.includes(c.id)))?'italy':c&&OMGEVING.includes(c.id)?'omgeving':ui.page==='hoofdstuk'&&WIDE.matches&&c?'hoofdstuk':'italy';
  if(c)mapClone.dataset.chapter=c.id;else delete mapClone.dataset.chapter;
  reserve();fit(mapClone);
 }
 /* Variant (a) Eiland: decoration layers on the Reis clone only (aria-hidden, no pointer events, no data-id; the
    geometry stays the live map's). A copy of Italy's own outline carries a soft drop shadow under the relief; a clip of
    the same outline keeps the relief on Italy; neighbouring land fades out toward the frame (a mask in map space, moved
    with the viewBox), so there is no hard cut line and no haze on Italy. CSS switches them on per variant. */
 function addIsland(svg,prefix='v3m-'){
  // Italy is its mainland outline plus the island chapter's countries (Sicilië, Sardinië are .country items).
  const isles=(ROUTE_CHAPTERS.find(c=>c.id==='islands')?.itemIds||[]).map(id=>svg.querySelector('.country[data-id="'+id+'"]')).filter(Boolean);
  isles.forEach(n=>n.classList.add('v3Isle'));
  const it=svg.querySelector('.italy');const d=[it?.getAttribute('d'),...isles.map(n=>n.getAttribute('d'))].filter(Boolean).join(' ');const terrain=svg.querySelector('.atlasTerrain');if(!it||!terrain)return;
  const defs=document.createElementNS(SVGNS,'defs');
  defs.innerHTML='<clipPath id="'+prefix+'italyClip"><path d="'+d+'"/></clipPath>'
   +'<filter id="'+prefix+'isleShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="12" flood-color="#2a2440" flood-opacity=".28"/></filter>'
   // Relief depth (afwerking 10-11): saturation 1.15 and a stronger hillshade (contrast around the mid tone).
   // Ronde 5 punt 8 (sprankelender): local contrast (unsharp mask) for a livelier hillshade, a mild global contrast, green
   // and yellow a little more saturated (1.15, was 0.65 via warmRelief), a light warm shift and lifted highlights (peaks,
   // snow). Same raster, same geometry; the id stays reliefDepth.
   +'<filter id="'+prefix+'reliefDepth" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="soft"/>'
   +'<feComposite in="SourceGraphic" in2="soft" operator="arithmetic" k1="0" k2="1.55" k3="-.55" k4="0" result="local"/>'
   +'<feComponentTransfer in="local"><feFuncR type="linear" slope="1.12" intercept="-.04"/><feFuncG type="linear" slope="1.12" intercept="-.04"/><feFuncB type="linear" slope="1.12" intercept="-.04"/></feComponentTransfer>'
   +'<feColorMatrix type="saturate" values="1.15"/>'
   +'<feComponentTransfer><feFuncR type="linear" slope="1.05" intercept=".02"/><feFuncG type="linear" slope="1.01" intercept=".01"/><feFuncB type="linear" slope=".92" intercept="0"/></feComponentTransfer>'
   +'<feComponentTransfer><feFuncR type="table" tableValues="0 .1 .2 .3 .4 .5 .61 .74 .88 1"/><feFuncG type="table" tableValues="0 .1 .2 .3 .4 .5 .61 .74 .88 1"/><feFuncB type="table" tableValues="0 .1 .2 .3 .4 .5 .61 .74 .88 1"/></feComponentTransfer></filter>'
   // Warm sunlight from the northwest over Italy (soft-light, clipped to the island), a little shade to the southeast.
   +'<linearGradient id="'+prefix+'sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0c8" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a2440" stop-opacity=".18"/></linearGradient>'
   +'<radialGradient id="'+prefix+'nbGrad" cx=".5" cy=".5" r=".5"><stop offset=".62" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>'
   +'<mask id="'+prefix+'nbFade" maskUnits="userSpaceOnUse"><rect class="v3FadeRect" x="0" y="0" width="890" height="1235" fill="url(#'+prefix+'nbGrad)"/></mask>';
  svg.prepend(defs);
  // Each clone references its own clip (Reis v3m-, Oefenen v3o-, Toets v3t-); the CSS reads it from this property.
  svg.style.setProperty('--v3-isle-clip','url(#'+prefix+'italyClip)');
  // The neighbours as one silhouette: copies of their outlines in one group, so the group's opacity and fade apply once
  // (overlapping shapes, each half transparent, drew seams where they overlap). The originals step aside in variant (a),
  // except a chapter's own countries (Landen), which stay the data.
  const nbg=document.createElementNS(SVGNS,'g');nbg.setAttribute('class','v3Neighbours');nbg.setAttribute('aria-hidden','true');nbg.setAttribute('pointer-events','none');nbg.setAttribute('mask','url(#'+prefix+'nbFade)');
  for(const n of svg.querySelectorAll('.contextLand,.country:not(.v3Isle)')){const q=document.createElementNS(SVGNS,'path');q.setAttribute('d',n.getAttribute('d')||'');nbg.append(q);}
  const base=document.createElementNS(SVGNS,'path');base.setAttribute('d',d);base.setAttribute('class','v3IsleBase');base.setAttribute('aria-hidden','true');base.setAttribute('pointer-events','none');base.setAttribute('filter','url(#'+prefix+'isleShadow)');
  // BL-014 F1: the festive look (LUT, hillshade, snow) is baked into relief-r3, so no SVG filter on the relief (iPad).
  // The sun layer: the whole canvas, clipped to Italy's outline, above the relief and below the coast rim (punt 8).
  const sun=document.createElementNS(SVGNS,'rect');for(const [k,v] of Object.entries({x:0,y:0,width:890,height:1235,fill:'url(#'+prefix+'sun)',class:'v3Sun','aria-hidden':'true','pointer-events':'none','clip-path':'url(#'+prefix+'italyClip)'}))sun.setAttribute(k,v);
  const coast=svg.querySelector('.v3RCoast');if(coast)coast.before(sun);else terrain.after(sun);
  terrain.before(nbg,base);
  const pins=document.createElementNS(SVGNS,'g');pins.setAttribute('class','v3Pins');pins.setAttribute('aria-hidden','true');pins.setAttribute('pointer-events','none');svg.append(pins);
 }
 // Pins (R-reis-ijk): the chapter's places as violet pins on the map, a constant on-screen size (redrawn on each fit).
 const PIN='M0 0C-2.6-5.4-10-10.2-10-17.5a10 10 0 1 1 20 0C10-10.2 2.6-5.4 0 0z';
 function drawPins(svg,k){
  const g=svg.querySelector('.v3Pins');if(!g)return;g.replaceChildren();
  if(svg.dataset.focus!=='points')return;
  for(const c of svg.querySelectorAll('circle.v3Hit')){const x=+c.getAttribute('cx'),y=+c.getAttribute('cy');if(!isFinite(x)||!isFinite(y))continue;
   const p=document.createElementNS(SVGNS,'g');p.setAttribute('class','v3Pin');p.setAttribute('transform','translate('+x+' '+y+') scale('+k*1.5+')'); // BL-016b D: 1.5x, tip (0,0) on the point
   p.innerHTML='<path d="'+PIN+'"/><circle cx="0" cy="-17.5" r="4.2"/>';g.append(p);}
 }
 // BL-029 (Menu 1): on the overview each chapter is one numbered marker (white circle, 36 px; the selected one violet);
 // no pins or landmarks there. The chapter page keeps the real places with pins.
 // BL-029: the free chapter block on the clear right (kicker, title with segments, the button) as screen rects, + 8 px.
 let m1Wide=null; // chapter id whose pins needed the wide reserve on the chapter page
 function freeBlock(){return ['.v3Panel .v3CardKicker','.v3Panel .v3CardHead','.v3Panel .v3Actions','.v3Panel .v3Locked'].map(q=>root.querySelector(q)).filter(e=>e&&e.getClientRects().length)
  .map(e=>{const r=e.getBoundingClientRect();return [r.left-8,r.top-8,r.right+8,r.bottom+8];}).filter(r=>r[2]-r[0]>16&&r[3]-r[1]>16);}
 function decorate(svg,k){
  const g=svg.querySelector('.v3Markers');if(g)g.replaceChildren();
  if(svg===mapClone&&m1Overview()){drawMarkers(svg,k);svg.querySelector('.v3Pins')?.replaceChildren();window.TopoV3Landmarks?.(svg,k,true);return;}
  // BL-034 P1.9: the chapter page and Oefenen show all landmarks of the own chapter (Menu 1).
  const lmAll=MENU==='1'&&(!!svg.closest?.('.v3OefStage')||(svg===mapClone&&WIDE.matches&&ui.page==='hoofdstuk'));
  drawPins(svg,k);window.TopoV3Landmarks?.(svg,k,{all:lmAll});
  // Chapter page: a pin under the free text cannot move; then this chapter (only) gets the wide reserve and refits.
  if(svg===mapClone&&MENU==='1'&&WIDE.matches&&ui.page==='hoofdstuk'&&m1Wide!==ui.selected){const ob=freeBlock();
   const hit=[...svg.querySelectorAll('.v3Pins .v3Pin')].some(p=>{const r=p.getBoundingClientRect();return ob.some(o=>r.left<o[2]&&o[0]<r.right&&r.top<o[3]&&o[1]<r.bottom);});
   if(hit){m1Wide=ui.selected;requestAnimationFrame(()=>{reserve();fit(svg);});}}
 }
 // BL-034 P1.8 (BL-014 F5): chapter markers are numbered drop pins whose tip sits EXACTLY on one of the chapter's own
 // places. Candidates per chapter (places on Italy's land first, nearest the chapter's centre first), computed once.
 let anchors=null;
 function chapterAnchors(svg){
  if(anchors)return anchors;anchors={};
  let i0=Infinity,j0=Infinity,i1=-Infinity,j1=-Infinity;for(const n of svg.querySelectorAll('.italy,.v3Isle')){const b=n.getBBox();i0=Math.min(i0,b.x);j0=Math.min(j0,b.y);i1=Math.max(i1,b.x+b.width);j1=Math.max(j1,b.y+b.height);}
  const land=[...svg.querySelectorAll('.italy,.v3Isle')],onLand=p=>land.some(n=>{try{return n.isPointInFill(new DOMPoint(p[0],p[1]));}catch{return false;}});
  for(const c of ROUTE_CHAPTERS){
   let pts=[];for(const id of c.itemIds){const n=svg.querySelector('[data-id="'+id+'"]');if(!n)continue;let x,y;
    if(n.tagName==='circle'){x=+n.getAttribute('cx');y=+n.getAttribute('cy');}else{const b=n.getBBox();x=b.x+b.width/2;y=b.y+b.height/2;}
    if(isFinite(x)&&isFinite(y)&&x>=i0&&x<=i1&&y>=j0&&y<=j1)pts.push([x,y]);}
   if(!pts.length)continue;
   const all=pts.slice(),inside=pts.filter(onLand);if(inside.length)pts=inside;
   const mx=pts.reduce((a,p)=>a+p[0],0)/pts.length,my=pts.reduce((a,p)=>a+p[1],0)/pts.length;
   anchors[c.id]=pts.sort((a,b)=>Math.hypot(a[0]-mx,a[1]-my)-Math.hypot(b[0]-mx,b[1]-my));
   // BL-038: every place of the chapter inside Italy's frame (also off the land, e.g. a neighbouring country), the last resort
   // when the land places all lie too close to another pin.
   anchors[c.id].all=all.sort((a,b)=>Math.hypot(a[0]-mx,a[1]-my)-Math.hypot(b[0]-mx,b[1]-my));
  }
  return anchors;
 }
 // Mastery in 5 steps (0–3 lessons done, 4 = gold) → the pin's fill, white → lavender → dark violet (CSS, data-step).
 const PINHEAD=25,PINR=15;
 const V3NINO=()=>{const a=window.TOPO_V3_ART?.vespaRijdend;return a?((window.devicePixelRatio||1)>=1.5?a.x240:a.x120):null;};
 function drawMarkers(svg,k){
  let g=svg.querySelector('.v3Markers');if(!g){g=document.createElementNS(SVGNS,'g');g.setAttribute('class','v3Markers');g.setAttribute('aria-hidden','true');svg.append(g);}
  const cand=chapterAnchors(svg),m=model(),cur=m.current;
  const inv=svg.getScreenCTM?.()?.inverse(),toMap=(x,y)=>{const q=new DOMPoint(x,y).matrixTransform(inv);return [q.x,q.y];};
  const obst=inv?freeBlock().map(r=>{const a=toMap(r[0],r[1]),b=toMap(r[2],r[3]);return [Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[0],b[0]),Math.max(a[1],b[1])];}):[];
  // The tip never moves: per chapter choose the candidate place whose pin head stays clear of the heads already placed
  // (34 px between head centres) and of the free text block; the active chapter chooses first.
  const head=p=>[p[0],p[1]-PINHEAD*k],R=(PINR+2)*k,gap=34*k,placed=[];
  const clear=p=>{const h=head(p);let d=Infinity;for(const q of placed)d=Math.min(d,Math.hypot(h[0]-q[0],h[1]-q[1])-gap);
   for(const o of obst){const cx=Math.max(o[0],Math.min(h[0],o[2])),cy=Math.max(o[1],Math.min(h[1],o[3]));d=Math.min(d,Math.hypot(h[0]-cx,h[1]-cy)-R);}return d;};
  const order=[...ROUTE_CHAPTERS].sort((a,b)=>(b.id===cur?.id)-(a.id===cur?.id)),pos={};
  // BL-038: when no candidate is wholly clear, two pin heads still never come closer than 30 px (Vaticaanstad lies in Rome: the
  // countries chapter used to take the very spot of chapter 2 in #afgerond/#alles); only then the free text block may be touched.
  const pinGap=p=>{const h=head(p);let d=Infinity;for(const q of placed)d=Math.min(d,Math.hypot(h[0]-q[0],h[1]-q[1])-30*k);return d;};
  for(const c of order){const ps=cand[c.id];if(!ps)continue;const ok=ps.find(p=>clear(p)>=0);
   const pool=ps.filter(p=>pinGap(p)>=0),wide=(ps.all||ps).filter(p=>pinGap(p)>=0),
    best=ok||(pool.length?pool.reduce((a,p)=>clear(p)>clear(a)?p:a):wide.length?wide.reduce((a,p)=>clear(p)>clear(a)?p:a):ps.reduce((a,p)=>pinGap(p)>pinGap(a)?p:a));pos[c.id]=best;placed.push(head(best));}
  // BL-036.5/BL-037.7: Nino on the Vespa (side view, facing right, 60×40 px) beside the active pin (decorative), right of the pin; moves left / below when it
  // would touch another pin's head or the free text block.
  const NW=60*k,NH=40*k,sp=cur&&pos[cur.id],art=V3NINO();
  if(sp&&art){
   const others=ROUTE_CHAPTERS.filter(c=>c.id!==cur.id&&pos[c.id]).map(c=>head(pos[c.id])),oR=(PINR+2)*k;
   const rectGap=(a,b)=>Math.max(b[0]-a[2],a[0]-b[2],b[1]-a[3],a[1]-b[3]);
   const cands=[[20,-36],[-20-60,-36],[-30,6],[20,-76],[-80,-76]].map(([dx,dy])=>[sp[0]+dx*k,sp[1]+dy*k,sp[0]+(dx+60)*k,sp[1]+(dy+40)*k]);
   const score=r=>{let d=Infinity;for(const q of others){const cx=Math.max(r[0],Math.min(q[0],r[2])),cy=Math.max(r[1],Math.min(q[1],r[3]));d=Math.min(d,Math.hypot(q[0]-cx,q[1]-cy)-oR);}
    for(const o of obst)d=Math.min(d,rectGap(r,o));return d;};
   const best=cands.find(r=>score(r)>=2*k)||cands.reduce((a,r)=>score(r)>score(a)?r:a);
   const img=document.createElementNS(SVGNS,'image');img.setAttribute('class','v3MarkerNino');img.setAttribute('aria-hidden','true');img.setAttribute('href',art);
   img.setAttribute('x',best[0]);img.setAttribute('y',best[1]);img.setAttribute('width',NW);img.setAttribute('height',NH);img.style.setProperty('--bob',(2.5*k)+'px');g.append(img);}
  ROUTE_CHAPTERS.forEach((c,i)=>{const p=pos[c.id];if(!p)return;const ch=m.chapters[i];
   const el=document.createElementNS(SVGNS,'g');el.setAttribute('class','v3Marker');el.dataset.chapter=c.id;
   el.dataset.step=String(ch?.gold?4:Math.min(3,ch?.r?.stage||0));
   // BL-035.2: the overview's pins are the chapter page's violet drop pins; a locked chapter light lavender.
   el.dataset.lock=ch&&stateOf(ch,m)==='locked'?'1':'0';
   if(c.id===cur?.id)el.classList.add('on');else if(c.id===ui.selected)el.classList.add('sel');el.dataset.state=c.id===cur?.id?'actief':c.id===ui.selected?'gekozen':'';
   el.setAttribute('transform','translate('+p[0]+' '+p[1]+') scale('+(c.id===cur?.id?k*1.25:k)+')'); // the active chapter 1.25× larger
   const ring=c.id===cur?.id?'<circle class="v3MarkerRing" cx="0" cy="-'+PINHEAD+'" r="'+(PINR+4.5)+'"/>':'';
   el.innerHTML=ring+'<path class="v3MarkerPin" d="M0 0C-3.2-6.5-'+PINR+'-12.5-'+PINR+'-'+PINHEAD+'a'+PINR+' '+PINR+' 0 1 1 '+(2*PINR)+' 0C'+PINR+'-12.5 3.2-6.5 0 0z"/>'
    +'<text y="-'+(PINHEAD-5.5)+'" text-anchor="middle">'+(i+1)+'</text>';
   // A pointer shortcut only (the list is the accessible route): the marker selects its chapter.
   el.addEventListener('click',e=>{e.stopPropagation();ui.selected=c.id;render();});
   g.append(el);});
 }
 // Frame Italy and the chapter's places with a generous margin, then widen the frame to the stage's shape
 // inside the map canvas (890×1235), so neighbouring countries, seas and islands stay visible as reference.
 const CANVAS={w:890,h:1235},MARGIN=.14,OMGEVING=['countries','seas'];
 function fit(svg){
  try{
   const fr0=svg.dataset.frame;let parts=[...svg.querySelectorAll(fr0==='italy'||fr0==='omgeving'?'.italy,.v3Isle':fr0==='hoofdstuk'?'.v3Hit':'.italy,.v3Hit')];
   if(fr0==='hoofdstuk'&&!parts.length)parts=[...svg.querySelectorAll('.italy,.v3Isle')];if(!parts.length)return;
   // "Italië en omgeving": Italy plus every item of the OMGEVING chapters (neighbouring countries and seas), whichever is selected.
   if(fr0==='omgeving')for(const id of ROUTE_CHAPTERS.filter(c=>OMGEVING.includes(c.id)).flatMap(c=>c.itemIds))svg.querySelectorAll('[data-id="'+id+'"]').forEach(n=>parts.push(n));
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const p of parts){const b=p.getBBox();if(!b.width&&!b.height&&p.tagName!=='circle')continue;x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.width);y1=Math.max(y1,b.y+b.height);}
   if(!isFinite(x0))return;
   // Variant (a) Eiland: Italy itself is the object — a tight frame (4%), not clamped to the canvas (the sea is
   // transparent and the neighbours fade out, so nothing beyond the data reads as sea); the stage letterboxes it.
   // BL-016d chapter page: zoom on this chapter's places, with room around them (at least 90 map units).
   if(fr0==='hoofdstuk'){const cx=(x0+x1)/2,cy=(y0+y1)/2,hw=Math.max((x1-x0)*.62,90),hh=Math.max((y1-y0)*.62,90);x0=cx-hw;x1=cx+hw;y0=cy-hh;y1=cy+hh;
    // Places spread over most of Italy: show Italy whole (a zoom would cut the land off at the panel).
    let i0=Infinity,j0=Infinity,i1=-Infinity,j1=-Infinity;for(const n of svg.querySelectorAll('.italy,.v3Isle')){const b=n.getBBox();i0=Math.min(i0,b.x);j0=Math.min(j0,b.y);i1=Math.max(i1,b.x+b.width);j1=Math.max(j1,b.y+b.height);}
    if(isFinite(i0)&&((x1-x0)>.85*(i1-i0)||(y1-y0)>.85*(j1-j0))){x0=i0;y0=j0;x1=i1;y1=j1;}}
   if(svg.dataset.kaart==='eiland'){const p=Math.max(x1-x0,y1-y0)*.04;x0-=p;y0-=p;x1+=p;y1+=p;svg.style.width=svg.style.height='';
    svg.setAttribute('viewBox',[x0,y0,x1-x0,y1-y0].map(v=>Math.round(v)).join(' '));
    // The viewBox, the fade and the mask region are the element's whole visible box in map units (the neighbours draw
    // beyond the data): the fade reaches zero at that box's edges, so nothing ends in a straight cut. A panel laid
    // over the map's bottom (Reis, afwerking 10-11) reserves --v3-fit-bottom px: Italy fits in the box above it.
    const r=svg.getBoundingClientRect(),fr=svg.querySelector('.v3FadeRect'),mk=fr?.parentNode,res=Math.min(r.height*.5,parseFloat(getComputedStyle(svg).getPropertyValue('--v3-fit-bottom'))||0),
     resR=Math.min(r.width*.5,parseFloat(getComputedStyle(svg).getPropertyValue('--v3-fit-right'))||0), // BL-016b: a card over the map's right side
     resT=Math.min(r.height*.3,parseFloat(getComputedStyle(svg).getPropertyValue('--v3-fit-top'))||0), // BL-016d: tools over the map's top
     resL=Math.min(r.width*.5,parseFloat(getComputedStyle(svg).getPropertyValue('--v3-fit-left'))||0); // BL-038: counters over the map's left (iPad portrait); 0 elsewhere
    if(r.width&&r.height){const w=x1-x0,h=y1-y0,k=Math.max(w/(r.width-resR-resL),h/(r.height-res-resT)),bw=r.width*k,bh=r.height*k,bx=x0-resL*k-((r.width-resR-resL)*k-w)/2,by=y0-resT*k-((r.height-res-resT)*k-h)/2;
     const box=v=>{svg._v3Shown=v;svg.setAttribute('viewBox',v.map(n=>Math.round(n*10)/10).join(' '));if(fr)for(const n of [fr,mk])['x','y','width','height'].forEach((a,i)=>n.setAttribute(a,v[i]));};
     const settle=()=>{box([bx,by,bw,bh]);
      // The land's drop shadow in screen px (afwerking 10-11: 0 18px 24px rgba(42,36,64,.28)), in map units.
      const ds=svg.querySelector('filter[id$="isleShadow"] feDropShadow');if(ds){ds.setAttribute('dy',(18*k).toFixed(1));ds.setAttribute('stdDeviation',(12*k).toFixed(1));}
      decorate(svg,k);};
     // A change between the two fixed frames glides (±450 ms); a refit within one frame, or reduced motion, is immediate.
     // A refit during a glide (the card's resize) keeps gliding, from the box shown now, within the same 450 ms.
     const kind=svg.dataset.frame||'',calm=matchMedia('(prefers-reduced-motion: reduce)').matches,busy=svg.dataset.gliding==='1'&&!calm;
     const glide=busy||svg._v3Box&&svg._v3Kind&&svg._v3Kind!==kind&&!calm,from=svg._v3Shown||svg._v3Box;
     cancelAnimationFrame(svg._v3Tween||0);svg._v3Box=[bx,by,bw,bh];svg._v3Kind=kind;
     if(!glide){delete svg.dataset.gliding;settle();}
     else{const t0=busy?svg._v3T0:performance.now(),to=svg._v3Box,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,base=busy?svg._v3From:from;svg._v3T0=t0;svg._v3From=base;svg.dataset.gliding='1';
      const step=now=>{const t=Math.min(1,(now-t0)/450);if(t<1){const e=ease(t);box(base.map((v,i)=>v+(to[i]-v)*e));svg._v3Tween=requestAnimationFrame(step);}else{delete svg.dataset.gliding;settle();}};
      svg._v3Tween=requestAnimationFrame(step);}}
    return;}
   const pad=Math.max(x1-x0,y1-y0)*MARGIN;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(CANVAS.w,x1+pad);y1=Math.min(CANVAS.h,y1+pad);
   // Match the stage aspect ratio by growing the shorter side, centred and clamped to the canvas.
   // Measure the free stage (any size set by an earlier fit is released first).
   svg.style.width=svg.style.height='';
   const box=svg.getBoundingClientRect(),aspect=box.width>0&&box.height>0?box.width/box.height:0;
   const grow=(a0,a1,len,max)=>{len=Math.min(len,max);let c=(a0+a1)/2,s=c-len/2;s=Math.max(0,Math.min(max-len,s));return [s,s+len];};
   if(aspect){const w=x1-x0,h=y1-y0;if(w/h<aspect)[x0,x1]=grow(x0,x1,h*aspect,CANVAS.w);else [y0,y1]=grow(y0,y1,w/aspect,CANVAS.h);}
   svg.setAttribute('viewBox',[x0,y0,x1-x0,y1-y0].map(v=>Math.round(v)).join(' '));
   // Clamped to the canvas: the element takes the viewBox's own proportions, so nothing outside the drawn data
   // (where neighbouring land is not part of the map) shows as sea; the map floats as one object (phase A, 10-11).
   const vb=(x1-x0)/(y1-y0);
   if(aspect&&Math.abs(vb-aspect)>.01){if(vb<aspect)svg.style.width=Math.round(box.height*vb)+'px';else svg.style.height=Math.round(box.width/vb)+'px';}
   // The neighbours' fade follows the frame; pins keep their on-screen size (map units per px).
   const fr=svg.querySelector('.v3FadeRect');if(fr){fr.setAttribute('x',x0);fr.setAttribute('y',y0);fr.setAttribute('width',x1-x0);fr.setAttribute('height',y1-y0);}
   const r2=svg.getBoundingClientRect();if(r2.width&&r2.height){const k=Math.max((x1-x0)/r2.width,(y1-y0)/r2.height);decorate(svg,k);}
  }catch{}
 }
 // The stage size changes with the layout (rotation, sidebar width): refit on resize.
 // The chapter card lies over the map's bottom where the CSS says so (--v3-card-over: 1): the map keeps it free.
 // Ronde 5 punt 1: the reserve is the tallest card of any chapter in the current state (measured in a hidden copy, so focus
 // and the live card stay put), so switching chapters never changes the map's scale.
 const reserve=()=>{const over=getComputedStyle(stage).getPropertyValue('--v3-card-over').trim()==='1';
  let hMax=0;if(over){const m=model(),probe=panel.cloneNode(false);probe.removeAttribute('id');probe.setAttribute('aria-hidden','true');probe.inert=true;
   Object.assign(probe.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',left:'0',top:'0',width:panel.getBoundingClientRect().width+'px'});panel.after(probe);
   try{for(const c of m.chapters){renderPanel(m,c,probe);hMax=Math.max(hMax,probe.getBoundingClientRect().height);}}finally{probe.remove();}}
  // BL-029 Menu 1: the map runs under the free chapter block; Italy keeps clear of most of the block's width.
  if(m1Overview()&&!PORTRAIT.matches)stage.style.setProperty('--v3-fit-right',Math.round(panel.getBoundingClientRect().width*.6)+'px');
  // Chapter page (Menu 1): the panel is display:contents; its free block is the head's column.
  else if(MENU==='1'&&WIDE.matches&&!PORTRAIT.matches&&ui.page==='hoofdstuk'&&ui.view==='reis'){const h=panel.querySelector('.v3CardHead'),w=h?.getBoundingClientRect().width||360;// Landen/Zeeën (OMGEVING) use the wider frame: always the full reserve (design-critic BL-029 r4: their areas lay under the button).
   stage.style.setProperty('--v3-fit-right',Math.round(OMGEVING.includes(ui.selected)?w+48:m1Wide===ui.selected?w+16:w*.6)+'px');}
  else stage.style.removeProperty('--v3-fit-right');
  stage.style.setProperty('--v3-fit-bottom',over?Math.round(Math.max(hMax,panel.getBoundingClientRect().height)+24)+'px':'0px');};
 if('ResizeObserver' in window){const ro=new ResizeObserver(()=>{reserve();if(mapClone)fit(mapClone);});ro.observe(stage);ro.observe(panel);}

 // Top of the map column: the map tools (Schoolblad, Schoolkaart | Reliëf) left, the counters right with line icons.
 // The tools sit beside the map, never on it (pins and coast stay free).
 const tools=make('div','v3MapTools');
 function renderTop(m){
  const cycle=(state.pizzas%3)*8+state.slices;
  const pz=make('span','v3Count');pz.setAttribute('aria-label',cycle+' van 24 pizzapunten tot de volgende Vespa-rit');
  pz.append(pic(V3ART.icons.slice,'v3CountArt',40,40),make('b',null,cycle+' / 24'));
  const trip=make('span','v3Count');trip.setAttribute('aria-label',state.trips+' Vespa-ritten');trip.append(pic(V3ART.icons.vespa,'v3CountArt',40,40),make('b',null,String(state.trips)));
  const counts=make('div','v3Counts');counts.append(pz,make('i','v3CountSep'),trip);
  // BL-016c: counters top-right of the right column; the map tools sit on the map zone (top-right corner).
  const back=btn('',e=>{e.stopPropagation();closeChapter();},'v3Btn v3Back');back.append(icon('v3back'),make('span',null,'Hoofdstukken'));
  // On the chapter page the tools sit in the top bar (the zoomed map fades at its edges).
  if(WIDE.matches&&ui.page==='hoofdstuk'&&MENU==='1'){const l=make('div','v3TopLeft');l.append(back);top.replaceChildren(l,counts);if(tools.parentNode!==stage)stage.append(tools);}
  else if(WIDE.matches&&ui.page==='hoofdstuk'){const l=make('div','v3TopLeft');l.append(back,tools);top.replaceChildren(l,counts);}
  else if(WIDE.matches){top.replaceChildren(back,counts);if(tools.parentNode!==stage)stage.append(tools);}else top.replaceChildren(tools,counts);
 }
 // BL-038: iPad portrait (700–1023 px) takes the same Menu 1 behaviour (chapter pins, Nino on the Vespa, chapter page, list
 // clicks); CSS gives it its own one-column layout (map on top). PORTRAIT is that band only; >= 1024 px is unchanged.
 const WIDE=matchMedia('(min-width:1024px), (orientation:portrait) and (min-width:700px) and (max-width:1023px)'),PORTRAIT=matchMedia('(orientation:portrait) and (min-width:700px) and (max-width:1023px)');WIDE.addEventListener?.('change',()=>render());

 // Chapter rows (R-reis-ijk): scene, name, status. Done = the earned stamp; gold = the illustrated laurel; in progress = a thin bar under
 // the name; locked = a lock only. The selected row is the selection style.
 // BL-034: one row component for Reis and Voortgang. `target` is the list, `pick` (Voortgang) replaces the Reis click.
 function renderRows(m,target=rows,pick=null){
  requestAnimationFrame(()=>{const a=target.querySelector('.v3Row[aria-pressed=true]');if(a&&target.scrollWidth>target.clientWidth){const l=a.offsetLeft-target.clientWidth/2+a.offsetWidth/2;target.scrollLeft=Math.max(0,l);}});
  target.replaceChildren(...m.chapters.map(c=>{
   const st=stateOf(c,m),li=make('li'),b=make('button','v3Row');b.type='button';b.dataset.chapter=c.id;b.dataset.state=st;
   b.setAttribute('aria-pressed',String(!pick&&ui.selected===c.id));if(st==='now')b.setAttribute('aria-current','step');
   // In the list, "Extra steden 13–18" reads as "Steden 13–18" (one line; the range stays visible); the full title
   // stays the row's tooltip and accessible name.
   const name=make('span','v3Name');name.append(range(c.title.replace(/^Extra steden/,'Steden')));b.setAttribute('aria-label',c.title);
   const thumb=make('span','v3Thumb'),src=scenes[c.id]?.mini;
   if(src)thumb.append(pic(src,null,480,270));
   else if(art['chapter'+c.index]){thumb.classList.add('v3ThumbIcon');thumb.append(img(art['chapter'+c.index]));}
   const mid=make('span','v3RowMid');mid.append(name);
   const end=make('span','v3End');
   if(MENU==='1'&&st==='done'){const ok=make('span','v3OkDot');ok.append(icon('v3checkmark'));end.append(ok);end.classList.add('v3EndDone');end.setAttribute('aria-label','afgerond');}
   else if(st==='gold'){end.append(pic(V3ART.icons.gold,'v3StatusArt',32,32));end.classList.add('v3EndGold');end.setAttribute('aria-label','goud');}
   else if(st==='done'){end.append(pic(V3ART.icons.stamp,'v3StatusArt',32,32));end.classList.add('v3EndDone');end.setAttribute('aria-label','afgerond');}
   else if(st==='locked'){end.append(icon('v3lock'));end.setAttribute('aria-label','op slot');}
   else{const bar=make('span','v3RowBar');bar.style.setProperty('--v3-on',String(c.r.stage/3));bar.setAttribute('aria-hidden','true');mid.append(bar);end.setAttribute('aria-label',c.r.stage+' van 3 lessen');}
   const num=make('span','v3RowNum',String(c.index+1));num.setAttribute('aria-hidden','true');b.title=c.title;
   if(MENU==='1'&&st!=='locked'&&st!=='done'&&st!=='gold'){const ch=make('span','v3Chev');ch.setAttribute('aria-hidden','true');ch.append(icon('v3back'));end.append(ch);}
   b.append(num,thumb,mid,end);
   b.addEventListener('click',e=>{e.stopPropagation();if(pick){pick(c.id);return;}if(WIDE.matches){openChapter(c.id);return;}ui.selected=c.id;render();
    // Phone: the chosen chapter appears at the top: focus its title (keyboard position kept, read by screen readers)
    // and bring it into view; elsewhere keep focus on the list.
    if(matchMedia('(max-width:767px)').matches){$('#v3Title')?.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
    else root.querySelector('.v3Row[data-chapter="'+c.id+'"]')?.focus();});
   li.append(b);return li;
  }));
 }

 // The chapter card (R-reis-ijk): title, three step dots, one pill; replays quietly below.
 // BL-016b B: the chapter scene with Nino (scenes[id].kop, already embedded) large at the top, then "HOOFDSTUK n",
 // the title, the steps and the pill. A locked chapter shows the same scene, muted, with "Opent na …".
 function renderPanel(m,c,panel=livePanel){
  panel.replaceChildren();if(!c)return;
  panel.classList.toggle('v3PanelLocked',!c.open);
  const kop=scenes[c.id]?.kop;
  if(kop){const f=make('figure','v3CardScene');f.setAttribute('aria-hidden','true');f.append(pic(kop,null,1672,941));panel.append(f);}
  panel.append(make('p','v3CardKicker','Hoofdstuk '+(c.index+1)));
  // tabindex -1: on phone, focus moves here after choosing a chapter (Hermes V3-03).
  const h=make('h2','v3CardTitle');if(panel===livePanel)h.id='v3Title';h.tabIndex=-1;
  h.append(make('span','v3SrOnly','Hoofdstuk '+(c.index+1)+': '),range(c.title));
  const head=make('div','v3CardHead');head.append(h);
  const segs=make('div','v3StageBar');segs.setAttribute('role','list');segs.setAttribute('aria-label','Lessen');
  TopoRoute.STAGES.forEach((s,n)=>{const d=make('span',n<c.r.stage?'on':n===c.r.stage&&c.open&&!c.done?'now':'');d.setAttribute('role','listitem');d.setAttribute('aria-label',STAGE[s]+(n<c.r.stage?', klaar':n===c.r.stage&&c.open?', nu':''));if(n<c.r.stage)d.append(icon('v3checkmark'));segs.append(d);});
  head.append(segs);panel.append(head);
  // BL-016c: on the window layout the steps are ONE vertical list with names (dot, label; a finished step is a row
  // that replays it). The dots row and the replay chips stay for the other layouts; CSS shows one or the other.
  const steps=make('ol','v3StepList');steps.setAttribute('aria-label','Lessen');
  TopoRoute.STAGES.forEach((s,n)=>{const done=n<c.r.stage,now=n===c.r.stage&&c.open&&!c.done,li=make('li',done?'on':now?'now':'');
   const dot=make('span','v3StepDot');dot.setAttribute('aria-hidden','true');if(done)dot.append(icon('v3checkmark'));
   const lab=make('span','v3StepLabel',STAGE[s]);
   if(done&&c.open){const b=btn('',press(()=>v2Card(c.id)?.querySelectorAll('.routeStep')[n]),'v3StepRow');b.setAttribute('aria-label',STAGE[s]+' opnieuw');b.append(dot,lab,icon('v3again'));li.append(b);}
   else{const d=make('div','v3StepRow');d.append(dot,lab);if(now)d.setAttribute('aria-current','step');li.append(d);}
   steps.append(li);});
  if(WIDE.matches)panel.append(steps); // the window/chapter layouts only (>= 1024 and iPad portrait, BL-038); the phone keeps the dots row
  const actions=make('div','v3Actions');
  const isActive=m.active&&m.active.chapterId===c.id;
  if(!c.open){const l=make('p','v3Locked');l.append(icon('v3lock'),make('span',null,'Opent na '+m.chapters[c.index-1].title));panel.append(l);return;}
  const pill=(label,find,glyph)=>{const b=btn('',press(find),'v3Btn primary');if(glyph)b.append(icon(glyph));b.append(make('span',null,label));return b;};
  if(isActive){actions.append(pill('Ga verder · '+KIND[m.active.kind],()=>$('#routeContinue')));}
  else if(!c.done){
   const s=TopoRoute.STAGES[c.r.stage];
   const viaContinue=!m.active&&c===m.next;
   actions.append(pill(STAGE[s],()=>viaContinue?$('#routeContinue'):v2Card(c.id)?.querySelectorAll('.routeStep')[c.r.stage]));
  }else{
   const due=m.due.some(d=>d.id===c.id);
   if(!c.gold)actions.append(pill('Verdien goud',()=>v2Card(c.id)?.querySelector('.goldButton'),'v3medal'));
   else actions.append(due?pill('Opfrissen',()=>v2Card(c.id)?.querySelector('.routeActions button:not(.goldButton)'),'v3again'):pill('Goud nog eens',()=>v2Card(c.id)?.querySelector('.goldButton'),'v3medal'));
  }
  panel.append(actions);
  // BL-016d: on the overview the chapter bar shows [Verder] (opens the chapter page); the real action lives there.
  const barGo=btn('',e=>{e.stopPropagation();openChapter(c.id);},'v3Btn primary v3BarGo');barGo.append(make('span',null,'Verder'));panel.append(barGo);
  // Replays: quiet, only for lessons already done.
  if(c.r.stage>0){const again=make('div','v3Again');TopoRoute.STAGES.forEach((s,n)=>{if(n<c.r.stage){const b=btn('',press(()=>v2Card(c.id)?.querySelectorAll('.routeStep')[n]));b.append(icon('v3again'),make('span',null,STAGE[s]));b.setAttribute('aria-label',STAGE[s]+' opnieuw');again.append(b);}});panel.append(again);}
 }

 function renderRewards(m){
  const h=make('h1','v3ScreenTitle','Beloningen');h.id='v3RewardsTitle';h.tabIndex=-1;
  const S=state.slices|0,P=state.pizzas|0,T=state.trips|0,isl=m.chapters.find(c=>c.id==='islands');
  // Postcards as the Reisboekje earns them (V2): two after the islands chapter, one after the 3rd and 6th ride.
  const cards=(isl?.done?2:0)+(T>=3)+(T>=6),gold=m.chapters.filter(c=>c.gold).length;
  const tile=(cls,iconSrc,value,label,aria)=>{const interactive=label!=='Pizza',t=make(interactive?'button':'div','v3Tile'+(cls?' '+cls:''));if(interactive){t.type='button';t.addEventListener('click',()=>window.TOPO_V3.book?.open(t,label));}else t.setAttribute('role','group');t.setAttribute('aria-label',aria);if(iconSrc)t.append(pic(iconSrc,'v3TileIcon',96,96));const v=make('b',null,value);v.setAttribute('aria-hidden','true');const l=make('span',null,label);l.setAttribute('aria-hidden','true');t.append(v,l);return t;};
  const openBook=e=>{e.stopPropagation();window.TopoBook?.open(e.currentTarget);};
  // The book is the button (afwerking 10-11): no separate "Open Reisboekje" button; the cover takes the focus.
  const book=make('div','v3Book'),cover=btn('',openBook,'v3Btn v3BookCover');cover.setAttribute('aria-label','Open het Reisboekje');
  if(art.cover)cover.append(img(art.cover,'v3CoverArt'));book.append(cover);
  const ride=make('div','v3Ride');ride.setAttribute('role','group');ride.setAttribute('aria-label',T+' Vespa-ritten; '+(P%3)+' van 3 pizza’s tot de volgende rit');
  // R-beloningen (fase B, stap 6): the ride's three pizzas above the Vespa, as the data has them (3 per ride, V2 order
  // margherita, salami, quattro formaggi): earned ones whole, the current one with its slices over a faint whole, the rest faint.
  // The art is V2's 3×3 sprite of 0–8 slices. Decoration: the ride's aria-label already says how many.
  const PZ=window.TOPO_PIZZA_ART?.assets,pz=make('div','v3RidePizzas');pz.setAttribute('aria-hidden','true');
  if(PZ)['margherita','salami','quattro-formaggi'].forEach((k,i)=>{if(!PZ[k])return;const n=i<P%3?8:i===P%3?Math.min(8,S):0,e=make('span','v3RidePizza'+(i<P%3?' on':i===P%3?' now':''));
   e.style.setProperty('--v3-pz','url("'+PZ[k]+'")');e.style.setProperty('--v3-pz-pos',(n%3*50)+'% '+(Math.floor(n/3)*50)+'%');e.dataset.slices=n;pz.append(e);});
  if(pz.children.length)ride.append(pz);
  if(V3ART?.vespa)ride.append(pic(V3ART.vespa,'v3RideArt',1200,900));
  const meter=make('div','v3Steps v3RideSteps');meter.setAttribute('aria-hidden','true');for(let i=0;i<3;i++){const s=make('i');if(i<P%3)s.className='on';meter.append(s);}
  const rv=make('b',null,String(T));rv.setAttribute('aria-hidden','true');const rl=make('span',null,'Vespa-ritten');rl.setAttribute('aria-hidden','true');ride.append(rv,rl,meter);
  const tiles=make('div','v3Tiles');
  tiles.append(tile('v3TilePizza',V3ART?.icons.pizza,S+' / 8','Pizza',S+' van 8 stukjes van pizza '+(P+1)),tile('v3TileStamp',V3ART?.icons.stamp,m.done+' / 11','Stempels',m.done+' van 11 stempels'),tile('v3TileGold',V3ART?.icons.gold,gold+' / 11','Goud',gold+' van 11 goudzegels'),tile('v3TilePostcard',V3ART?.icons.postcard,cards+' / 4','Postkaarten',cards+' van 4 postkaarten'));
  rewardsView.replaceChildren(h,book,ride,tiles);
  // BL-034 P1.11 (Menu 1): Nino (masterset NINO-GOLD) free on the scene beside the book and the counts.
  if(MENU==='1'&&window.TOPO_V3?.pose){try{const n=make('div','v3RewardsNino');n.setAttribute('aria-hidden','true');n.append(window.TOPO_V3.pose('NINO-GOLD','success','rewards'));rewardsView.append(n);}catch{}}
 }
 function renderSwitch(){
  let sw=tools.querySelector('.v3Switch');
  if(!sw){sw=make('div','v3Switch');sw.setAttribute('role','group');sw.setAttribute('aria-label','Kaartstijl');
   for(const [k,label] of [[false,'Schoolkaart'],[true,'Reliëf']]){const b=btn(label,e=>{e.stopPropagation();ui.relief=k;render();});b.dataset.relief=String(k);sw.append(b);}
   tools.append(sw);}
  // Map tools: Schoolblad (V3.0 § 5, schoolblad.js) beside the map style switch.
  if(window.TOPO_V3?.schoolblad&&!tools.querySelector('.v3SchoolBtn'))tools.prepend(window.TOPO_V3.schoolblad.button('v3SchoolBtn'));
  sw.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.relief===String(ui.relief))));
 }
 // BL-016d: the chapter page (Reis › Hoofdstuk) and back to the overview.
 function openChapter(id){ui.selected=id;ui.page='hoofdstuk';render();requestAnimationFrame(()=>root.querySelector('.v3Back')?.focus({preventScroll:true}));}
 function closeChapter(){const id=ui.selected;ui.page='overzicht';render();requestAnimationFrame(()=>root.querySelector('.v3Row[data-chapter="'+id+'"]')?.focus({preventScroll:true}));}
 // Escape closes the chapter page only when nothing is open above it (settings sheet, a dialog, Schoolblad).
 document.addEventListener('keydown',e=>{if(e.key!=='Escape'||ui.page!=='hoofdstuk'||root.dataset.view!=='reis'||!WIDE.matches||e.defaultPrevented)return;
  if(document.querySelector('dialog[open],[role=dialog]:not([hidden]):not([aria-hidden=true]),.ninoSettings[open],.v3SettingsSheet[open],.v3SchoolSheet:not([hidden])'))return;closeChapter();});
 function render(){
  const home=$('#routeHome');if(!home)return;
  if(root.parentNode!==home)home.prepend(root);
  root.dataset.theme=window.TOPO_V3_THEME||'viola';
  const m=model();
  if(!ui.selected||!m.chapters.some(c=>c.id===ui.selected))ui.selected=m.current.id;
  const c=m.chapters.find(x=>x.id===ui.selected);
  // Backdrop: BG-03 (BG-01/BG-02 in the preview), full-bleed behind the window; the V2 panorama only as fallback.
  const pano=V3ART?.bg?.[window.TOPO_V3_BG||'bg03']||V3ART?.bg?.bg03||$('.routeScene img')?.currentSrc||$('.routeScene img')?.src;
  if(V3ART?.bg)background();else if(pano)document.body.style.setProperty('--v3-pano','url("'+pano+'")');
  root.dataset.menu=MENU;document.body.dataset.v3Menu=MENU;root.dataset.view=views[ui.view]?ui.view:'reis';root.dataset.kaart=ui.kaart;root.dataset.reisPage=ui.page;
  markNav(root);
  renderTop(m);renderRows(m);renderPanel(m,c);renderSwitch();if(MENU==='1'&&PORTRAIT.matches)panel.append(tools); // BL-038: iPad portrait: the map tools sit in the free block
  paintMap(c);renderRewards(m);
  if(renderers[root.dataset.view])try{renderers[root.dataset.view](views[root.dataset.view],m);}catch(e){console.error('V3 view',e);}
 }
 // V2 chrome steps aside while Reis is shown; lessons and other screens keep V2 as is.
 function chrome(){const on=!$('#journeyScreen')?.classList.contains('hidden')&&!$('#routeHome')?.classList.contains('hidden');document.body.classList.toggle('v3Home',on);}
 new MutationObserver(chrome).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
 const base=renderRouteHome;
 renderRouteHome=function(...a){const out=base.apply(this,a);try{render();chrome();}catch(e){console.error('V3 Reis',e);}return out;};
 document.body.classList.add('v3On');
 window.TOPO_V3={chapterRows:(target,pick)=>renderRows(model(),target,pick),showChapter:id=>{ui.selected=id;ui.page=WIDE.matches?'hoofdstuk':'overzicht';},menu:MENU,background:{refresh:background,get:()=>ui.background||window.TOPO_V3_BG||'bg03',set:key=>{if(!['bg01','bg02','bg03','auto'].includes(key))return;ui.background=key;try{localStorage.setItem(BGKEY,key);}catch{}background();}},render,model,ui,makeSide,markNav,addView,cloneMap,fit,addIsland,icon,make,btn,pic,img,press,v2Card,v2Nav,STAGE,KIND,range,scenes,art:V3ART,nino,root};
 if(!$('#journeyScreen')?.classList.contains('hidden')){render();chrome();}
})();
