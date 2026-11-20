/* TOPO V3.0 — Voortgang (docs/v3/V3_0_REST.md § 3): places on the real map, the chapters, the daily goal, the
   kennis-paspoort and the toets results. Everything is read from V2; nothing is computed anew:
   * per place the V2 kennis-paspoort (its own table, moved here) gives the labels for Vinden and Naam; a place is
     "beheerst" when both read "Goed onthouden", "bezig" when at least one is not "Nog oefenen", otherwise "nog niet"
     (threshold in DECISIONS);
   * chapters: TopoRoute.record (stage 0–3, goud) and TopoRoute.unlocked; daily goal: V2 renderDailyGoal → #dailyProgress (of 8);
   * pizza's and Vespa-ritten: V2 state.pizzas and state.trips, as in Beloningen;
   * toets results: the last 10 from toets.js. No streak (rejected earlier). */
(function setupV3Voortgang(){
 'use strict';
 const V=window.TOPO_V3;if(!V||!V.shell)return;
 const {make,STAGE}=V,$=s=>document.querySelector(s);
 const STATUS={beheerst:'Beheerst',bezig:'Bezig',nog:'Nog niet'};
 const mastery=$('details.mastery'),grid=$('#masteryGrid');

 // The V2 paspoort builds its table when opened; it is moved into Voortgang and rebuilt on every visit.
 function passport(){
  if(!mastery||!grid)return null;
  mastery.open=true;mastery.dispatchEvent(new Event('toggle'));
  const rows=[...grid.querySelectorAll('tbody tr')];if(rows.length!==ITEMS.length)return null;
  return ITEMS.map((item,n)=>{const [find,name]=[...rows[n].querySelectorAll('td')].map(td=>td.textContent.trim());
   const status=find==='Goed onthouden'&&name==='Goed onthouden'?'beheerst':find!=='Nog oefenen'||name!=='Nog oefenen'?'bezig':'nog';
   return {item,find,name,status};});
 }
 // BL-039.8: Vinden/Naam per place as a filling pizza (the Beloningen icon IC-pizza-96): grey base + the coloured icon on top,
 // revealed by a conic mask from 12 o'clock around the pizza's centre (measured on the 96 px export: 49.8% 50.4%).
 // The V2 status texts map to the levels: Nog oefenen 0 · Herhalen 25 · Opfrissen 50 · Op weg 75 · Goed onthouden 100 %.
 const LEVELS=[['Nog oefenen',0],['Herhalen',25],['Opfrissen',50],['Op weg',75],['Goed onthouden',100]];
 const LEVEL=new Map(LEVELS);
 const fill=(pct,size,label)=>{const src=V.art?.icons?.pizza,w=make('span','v3PasFill');if(!src)return null;
  w.style.width=w.style.height=size+'px';
  const base=V.pic(src,'v3PasBase',size,size),top=V.pic(src,'v3PasTop',size,size);
  const m='conic-gradient(from 0deg at 49.8% 50.4%,#000 0 '+pct+'%,transparent '+pct+'% 100%)';top.style.maskImage=m;top.style.webkitMaskImage=m;
  base.setAttribute('aria-hidden','true');top.setAttribute('aria-hidden','true');w.append(base,top);
  if(label){w.setAttribute('role','img');w.setAttribute('aria-label',label);w.title=label;}else w.setAttribute('aria-hidden','true');
  w.dataset.fill=String(pct);return w;};
 const pizzaCell=text=>{const td=make('td','v3PasIcon'),pct=LEVEL.get(text),f=pct==null?null:fill(pct,32,text);
  if(!f){td.textContent=text;return td;}td.append(f);return td;};
 const pizzaLegend=()=>{const cap=make('caption','v3PasLegend');cap.setAttribute('aria-label','Niveaus: '+LEVELS.map(l=>l[0]).join(', '));
  for(const [name,pct] of LEVELS){const it=make('span','v3PasLegendItem'),f=fill(pct,22,null);if(f)it.append(f);it.append(document.createTextNode(name));cap.append(it);}
  return cap;};
 const bar=(value,max,cls)=>{const b=make('div','v3Bar '+(cls||''));b.setAttribute('role','progressbar');b.setAttribute('aria-valuemin','0');b.setAttribute('aria-valuemax',String(max));b.setAttribute('aria-valuenow',String(value));const f=make('i');f.style.width=(max?value/max*100:0)+'%';b.append(f);return b;};
 const section=(title,id,...content)=>{const s=make('section','v3Field v3Card');const h=make('h2',null,title);h.id=id;s.setAttribute('aria-labelledby',id);s.append(h,...content);return s;};
 const fmt=at=>new Date(at).toLocaleDateString('nl-NL',{day:'numeric',month:'short'});

 V.addView('voortgang','Voortgang',view=>{
  const h=make('h1',null,'Voortgang');h.id='v3VoortgangTitle';h.tabIndex=-1;
  const pp=passport()||[],count=pp.filter(p=>p.status==='beheerst').length;

  // Titelbalk (R-voortgang): "Voortgang" and "n / 45" on one line, then a broad bar.
  const head=make('div','v3VgHead');const big=make('p','v3VgCount');big.append(make('strong',null,count+' / '+ITEMS.length),make('span',null,' plekken'));
  head.append(big,bar(count,ITEMS.length,'v3VgBar'));head.lastChild.setAttribute('aria-label','Plekken beheerst');
  const titleBar=make('div','v3VgTitleBar');titleBar.append(h,head);

  // Kaart: each place coloured by its status; legend.
  const fig=make('figure','v3VgKaart');
  const svg=V.cloneMap('v3v-','v3VgMap');
  // Ronde 5 punt 4: relief on; the mastery colour lies over it as a tint (ronde5.css).
  if(svg){svg.classList.add('v3Map');svg.dataset.relief='on';svg.dataset.kaart='eiland';svg.dataset.frame='italy';V.addIsland(svg,'v3v-');fig.append(svg);
   const sea=svg.querySelector('.sea');
   for(const p of pp)svg.querySelectorAll('[data-id="'+p.item.id+'"]').forEach(n=>{n.classList.add('v3Hit','v3St-'+p.status);if(p.item.kind==='river')n.classList.add('v3StLine');});
   requestAnimationFrame(()=>{if(sea)svg.style.setProperty('--v3-sea-school',getComputedStyle(sea).fill);V.fit(svg);});}
  const legend=make('ul','v3VgLegend');for(const [k,label] of Object.entries(STATUS)){const li=make('li','v3St-'+k);li.append(make('i'),make('span',null,label+' · '+pp.filter(p=>p.status===k).length));legend.append(li);}
  // The card's caption (R-voortgang-doel): the map's subject; the count stays in the title bar.
  const all=pp.length===ITEMS.length&&count===ITEMS.length;
  const cap=make('figcaption','v3VgKaartTitle','Italië');cap.append(make('span',null,all?count+' / '+ITEMS.length+' beheerst':ITEMS.length+' plekken'));
  fig.append(cap,legend);
  // 45 / 45: a calm congratulation (ronde 5 punt 4) — a gold edge round the map and a small cheering Nino; no confetti.
  fig.classList.toggle('v3VgAllDone',all);
  if(all&&V.pose){const cheer=make('div','v3VgCheer');cheer.setAttribute('aria-hidden','true');cheer.append(V.pose('NINO-JUICHT','success','progress-cheer'));
   // Ronde 5 punt 7: the Fiat 500 beside the cheering Nino (the only lifestyle icon on this screen).
   const fiat=V.art?.lifestyle?.items.find(i=>i.id==='TOPO_16');if(fiat){const f=V.pic(fiat.exports[devicePixelRatio>1?256:128].src,'v3VgTreat',128,128);f.setAttribute('aria-hidden','true');f.dataset.lifestyle='TOPO_16';cheer.append(f);}
   fig.append(cheer);}fig.setAttribute('aria-label',count+' van '+ITEMS.length+' plekken beheerst');

  // Hoofdstukken (R-voortgang, fase B stap 7): the chapter's real photo, "n. naam", one thick bar of the three lessons
  // (three segments, so the bar still reads the stage) and a status illustration: gold laurel (IC-gold) = goud, the
  // green check = klaar, the pizza slice (IC-slice) = open, the lock = nog dicht. All from TopoRoute.record.
  const list=make('ol','v3VgChapters'),M=V.model?.(),ART=V.art,SC=V.scenes||{};
  // BL-034 (Menu 1): exactly the Reis list component (number, name, status), same size; a row opens that chapter on Reis.
  const sameRows=V.menu==='1'&&V.chapterRows;
  ROUTE_CHAPTERS.forEach((c,i)=>{const r=TopoRoute.record(state.route,c.id),li=make('li'),open=M?.chapters[i]?.open??true;li.dataset.chapter=c.id;
   const st=r.goldAt>0?'gold':r.stage===3?'done':open?'open':'locked';li.dataset.status=st;
   const thumb=make('span','v3VgThumb');thumb.setAttribute('aria-hidden','true');if(SC[c.id]?.mini)thumb.append(V.pic(SC[c.id].mini,null,480,270));
   const steps=make('span','v3VgSteps');steps.setAttribute('aria-hidden','true');for(let n=0;n<3;n++){const s=make('i');if(n<r.stage)s.className='on';steps.append(s);}
   const status=make('span','v3VgStatus');status.setAttribute('aria-hidden','true');
   if(st==='gold'&&ART?.icons?.gold)status.append(V.pic(ART.icons.gold,null,96,96));
   else if(st==='open'&&ART?.icons?.slice)status.append(V.pic(ART.icons.slice,null,96,96));
   else status.append(V.icon(st==='locked'?'v3lock':'v3checkmark'));
   li.setAttribute('aria-label',c.title+': '+r.stage+' van 3 lessen'+(r.goldAt>0?', goud':st==='locked'?', nog dicht':''));
   const name=make('span','v3VgName');name.append(make('span','v3VgNum',(i+1)+'.'),document.createTextNode(' '+c.title.replace(/^Extra steden/,'Steden')));
   li.append(thumb,name,steps,status);list.append(li);});
  // BL-035.5 (live 19-11): the Kennis-paspoort IS this list — no separate panel. Each of the 11 rows (the Reis row
  // component, same size) opens in place (whole row the toggle, chevron, aria-expanded) to its places with their mastery
  // (Vinden, Naam). The list grows with the page: no inner scrollbar.
  const passTable=c=>{const places=pp.filter(p=>c.itemIds.includes(p.item.id));const t=make('table','v3PasBody');
   const hr=make('tr');hr.append(make('th',null,'Plek'),make('th',null,'Vinden'),make('th',null,'Naam'));const thead=make('thead');thead.append(hr);
   const tb=make('tbody');for(const p of places){const tr=make('tr');tr.dataset.status=p.status;const th=make('th',null,p.item.name);th.scope='row';tr.append(th,pizzaCell(p.find),pizzaCell(p.name));tb.append(tr);}
   t.append(pizzaLegend(),thead,tb);return {t,done:places.filter(p=>p.status==='beheerst').length,n:places.length};};
  if(sameRows){list.className='v3Rows v3VgRows v3VgPas';V.chapterRows(list,()=>{});
   for(const li of list.children){const b=li.querySelector('.v3Row'),c=ROUTE_CHAPTERS.find(x=>x.id===b?.dataset.chapter);if(!c)continue;
    const {t,done,n}=passTable(c),id='v3Pas-'+c.id;t.id=id;t.hidden=true;
    b.removeAttribute('aria-pressed');b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',id);
    b.setAttribute('aria-label',c.title+': '+done+' van '+n+' plekken beheerst');
    const end=b.querySelector('.v3End');end?.querySelector('.v3Chev')?.remove();end?.removeAttribute('aria-label');
    const cnt=make('span','v3PasCount',done+' / '+n);cnt.setAttribute('aria-hidden','true');const chev=make('span','v3PasChev');chev.setAttribute('aria-hidden','true');
    end?.append(cnt,chev);
    b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));t.hidden=!open;li.classList.toggle('v3Open',open);});
    li.append(t);}
  }

  // Dagdoel (V2).
  try{renderDailyGoal();}catch{}
  const today=Math.min(8,+($('#dailyProgress')?.value||0));
  const dots=make('span','v3VgDots');dots.setAttribute('aria-hidden','true');for(let n=0;n<8;n++){const d=make('i');if(n<today)d.className='on';dots.append(d);}
  // Pizza's and Vespa-ritten (V2 state, as Beloningen): the ride's pizzas of 3 and the rides so far.
  const P=state.pizzas|0,T=state.trips|0;
  const tile=(cls,src,lineIcon,label,value,aria,extra)=>{const t=make('section','v3VgTile '+cls);t.setAttribute('aria-label',aria);const ic=make('span','v3VgTileIcon');ic.setAttribute('aria-hidden','true');
   if(src)ic.append(V.pic(src,null,96,96));else ic.append(V.icon(lineIcon));const txt=make('span','v3VgTileText');const l=make('span','v3VgTileLabel',label),v=make('strong',null,value);l.setAttribute('aria-hidden','true');v.setAttribute('aria-hidden','true');txt.append(l,v);t.append(ic,txt);if(extra)t.append(extra);return t;};
  const dagdoel=tile('v3VgDagdoel',null,'v3target','Dagdoel',today+' / 8','Dagdoel: '+today+' van 8',dots);dagdoel.querySelector('.v3VgTileText').classList.add('v3VgDaily');
  const pd=make('span','v3VgDots v3VgPizzaDots');pd.setAttribute('aria-hidden','true');for(let n=0;n<3;n++){const d=make('i');if(n<P%3)d.className='on';pd.append(d);}
  const pizzas=tile('v3VgPizzas',ART?.icons?.pizza,'v3slice','Pizza’s',(P%3)+' / 3',(P%3)+' van 3 pizza’s tot de volgende rit',pd);
  const rides=tile('v3VgRides',ART?.icons?.vespa,'v3scooter','Vespa-ritten',String(T),T+' Vespa-ritten');

  // Toetsuitslagen.
  const results=V.toets?.load?.()||[],rl=make('ol','v3VgToetsen');
  for(const r of results){const li=make('li');li.append(make('span','v3VgDate',fmt(r.at)),make('span','v3VgOnderwerp',r.chapters.length===ROUTE_CHAPTERS.length?'Alles':r.chapters.map(id=>ROUTE_CHAPTERS.find(c=>c.id===id)?.title).join(', ')),make('strong',null,r.correct+' / '+r.total));rl.append(li);}
  const toetsen=results.length?rl:make('p','v3VgEmpty','Nog geen toetsen.');

  const pass=make('div','v3VgPaspoort');if(mastery){pass.append(mastery);
   // BL-029: passport() opens it to read its table; on screen the paspoort starts closed (the child opens it).
   mastery.open=false;}
  // BL-034 (Menu 1): the paspoort per chapter — one row per chapter (whole row a button, chevron 20 px, aria-expanded)
  // with "x van y beheerst"; it opens to the chapter's places with Vinden and Naam. Data: the V2 paspoort (pp).
  // The V2 details element stays in the DOM (passport() reads it) but out of sight; Dennis could not find its toggle.
  if(V.menu==='1'&&!sameRows){
   const acc=make('div','v3Pas');let k=0;
   for(const c of ROUTE_CHAPTERS){const places=pp.filter(p=>c.itemIds.includes(p.item.id));if(!places.length)continue;k++;
    const done=places.filter(p=>p.status==='beheerst').length,id='v3Pas-'+c.id;
    const head=make('button','v3PasHead');head.type='button';head.setAttribute('aria-expanded','false');head.setAttribute('aria-controls',id);
    const chev=make('span','v3PasChev');chev.setAttribute('aria-hidden','true');
    head.append(make('span','v3PasName',c.title.replace(/^Extra steden/,'Steden')),make('span','v3PasCount',done+' van '+places.length+' beheerst'),chev);
    const body=make('table','v3PasBody');body.id=id;body.hidden=true;
    const hr=make('tr');hr.append(make('th',null,'Plek'),make('th',null,'Vinden'),make('th',null,'Naam'));const thead=make('thead');thead.append(hr);
    const tb=make('tbody');for(const p of places){const tr=make('tr');tr.dataset.status=p.status;const th=make('th',null,p.item.name);th.scope='row';tr.append(th,pizzaCell(p.find),pizzaCell(p.name));tb.append(tr);}
    body.append(pizzaLegend(),thead,tb);
    head.addEventListener('click',()=>{const open=head.getAttribute('aria-expanded')!=='true';head.setAttribute('aria-expanded',String(open));body.hidden=!open;});
    const item=make('div','v3PasItem');item.append(head,body);acc.append(item);}
   if(k){mastery&&(mastery.hidden=true);pass.prepend(acc);}
  }

  // Raster (12 kolommen): titelbalk; kaartkaart 1–7 en hoofdstukken 8–12; Dagdoel, Pizza's en Vespa-ritten; Toetsen; paspoort.
  const side=make('div','v3VgSide');side.append(section(sameRows?'Kennis-paspoort':'Hoofdstukken','v3VgHoofdstukken',list));
  const grid2=make('div','v3VgGrid');grid2.append(fig,side);
  const row=make('div','v3VgRow');row.append(dagdoel,pizzas,rides);
  const overview=make('div','v3VgOverview');overview.append(titleBar,grid2,row);
  // Menu 1: the paspoort lives in the chapter list above (the V2 details stays in the DOM for passport(), out of sight).
  if(sameRows){if(mastery){mastery.hidden=true;pass.hidden=true;}view.replaceChildren(overview,section('Toetsen','v3VgToetsTitel',toetsen),pass);}
  else view.replaceChildren(overview,section('Toetsen','v3VgToetsTitel',toetsen),section('Kennis-paspoort','v3VgPaspoortTitel',pass));
 });
 V.voortgang={passport};
})();
