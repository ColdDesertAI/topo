/* Geographic presentation: data anchors and raster height are never moved or rewritten. */
window.TopoV3Landmarks=function(svg,k,opts){
 'use strict';
 const art=window.TOPO_V3_ART?.landmarks;
 if(!art||!svg.matches('.v3MapStage .v3Map,.v3ToetsMap,.v3OefStage svg'))return;
 // BL-034 P1.9 (BL-014 F6), Menu 1 on the chapter page and in Oefenen: ALL landmarks of the own chapter, max. 1 per
 // place, one size (32 px from 1280, 28 below), focusable; hover/focus 1.15x with the name below in a white pill.
 const all=!!opts?.all;
 const NS='http://www.w3.org/2000/svg',make=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));return n;};
 svg.classList.add('v3LandmarkMap');
 // BL-035.3: the place's own tap areas (microHit) lie above the icons, so CSS :hover never reaches them; hover is
 // found from the pointer's position instead (the taps keep going to the place).
 if(all&&!svg.__lmHover){svg.__lmHover=true;let on=null;const set=n=>{if(n===on)return;on?.classList.remove('is-hover');on=n;n?.classList.add('is-hover');};
  svg.addEventListener('pointermove',e=>{let hit=null;for(const n of svg.querySelectorAll('.v3Landmarks .v3Lm .v3Badge')){const r=n.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){hit=n.closest('.v3Lm');break;}}set(hit);});
  svg.addEventListener('pointerleave',()=>set(null));}
 // Ronde 5 punt 8: the relief look lives in reliefDepth (reis.js) for every map; no separate warm/desaturated copy here.
 // Ronde 4: landmarks below every pin and mark layer; the pin stays on top.
 let g=svg.querySelector('.v3Landmarks');if(!g)g=make('g',{class:'v3Landmarks','aria-hidden':'true','pointer-events':'none'});
 svg.insertBefore(g,svg.querySelector(':scope>.v3Pins,:scope>.v3Marks'));
 g.replaceChildren();delete svg.dataset.landmarkDropped;
 // BL-037.9 (d): no icon during Aanwijzen, Namen schrijven and Toets (they give the answer away): reis.js passes hide for
 // Oefenen unless the form is Ontdekken; the Toets map never shows one. Chapter page, Ontdekken and Reis keep them.
 if(opts?.hide||svg.matches('.v3ToetsMap')){svg.dataset.landmarkSet='verborgen';svg.querySelector(':scope>.v3Lifestyle')?.remove();return;}
 // Ronde 4 size: the median painted height is 40 screen px on desktop and 34 on iPad (≤ 1279 px); the relative sizes
 // between landmarks (paintSize) are kept.
 const size=window.devicePixelRatio>1?256:128,target=matchMedia('(max-width:1279px)').matches?34:40;
 const heights=art.items.map(item=>{const [l,t,r,b]=item.exports[size].paintBounds;return item.paintSize*(b-t)/Math.max(r-l,b-t);}).sort((a,b)=>a-b);
 const grow=target/((heights[(heights.length-1)>>1]+heights[heights.length>>1])/2);
 // Collision check (screen px around each landmark's anchor): never under or over a pin, a ✓/× mark or a mistake
 // label. A landmark that would touch one moves to the nearest free spot at the edge of its place; its anchor
 // (translate) stays on the real geographic point.
 const LOOSE_GAP=12.3;
 const toMap=svg.getScreenCTM?.()?.inverse(),obstacles=[],GAP=3;
 const boxOf=n=>{try{const b=n.getBBox(),m=toMap&&n.getScreenCTM()&&toMap.multiply(n.getScreenCTM());if(!m||(!b.width&&!b.height))return null;
  const xs=[],ys=[];for(const [x,y] of [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]]){xs.push(m.a*x+m.c*y+m.e);ys.push(m.b*x+m.d*y+m.f);}
  return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];}catch{return null;}};
 for(const n of svg.querySelectorAll(':scope>.v3Pins .v3Pin,:scope>.v3Marks .v3Mark>circle,:scope>.v3Marks .v3MarkName')){const b=boxOf(n);if(b)obstacles.push(b);}
 const hits=(r)=>obstacles.some(o=>r[0]<o[2]+GAP*k&&o[0]<r[2]+GAP*k&&r[1]<o[3]+GAP*k&&o[1]<r[3]+GAP*k);
 const STEPS=[[0,-1],[1,0],[-1,0],[1,-1],[-1,-1],[0,1],[1,1],[-1,1]];
 // BL-037.9: the goals of the chapter as measurable shapes (screen px = units / k). A city is a point; an area or a river is
 // its visible path, sampled along its outline (never the tap tolerance). inFill: for a filled shape the inside counts as 0.
 const goals=[];
 if(all)for(const n of svg.querySelectorAll('.v3Hit[data-id]')){
  if(n.tagName==='circle'){const cx=+n.getAttribute('cx'),cy=+n.getAttribute('cy'),id=n.getAttribute('data-id');
   // BL-039.5: a city goal is its visible dot: the pin's box when the pin is drawn (tip on the point), else the circle's own radius.
   let rect=null;for(const q of svg.querySelectorAll(':scope>.v3Pins .v3Pin')){const b=boxOf(q);if(b&&Math.abs(b[3]-cy)<3*k&&Math.abs((b[0]+b[2])/2-cx)<3*k){rect=b;break;}}
   let rad=0;if(!rect){try{const r=n.getBoundingClientRect();rad=(r.width/2+(parseFloat(getComputedStyle(n).strokeWidth)||0)/2)*k;}catch{}}
   goals.push({id,pt:[cx,cy],rect,rad});continue;}
  if(typeof n.getTotalLength!=='function')continue;
  try{const L=n.getTotalLength(),step=Math.max(1.2*k,L/4000),pts=[];for(let f=0;f<=L;f+=step){const q=n.getPointAtLength(f);pts.push([q.x,q.y]);}
   const cs=getComputedStyle(n),line=cs.fill==='none',sw=parseFloat(cs.strokeWidth)||0,half=(cs.vectorEffect==='non-scaling-stroke'?sw*k:sw)/2;
   goals.push({id:n.getAttribute('data-id'),el:n,pts,line,half});}catch{}}
 const distGoal=(g,x,y)=>{if(g.pt){if(g.rect)return Math.hypot(Math.max(g.rect[0]-x,0,x-g.rect[2]),Math.max(g.rect[1]-y,0,y-g.rect[3]));return Math.max(0,Math.hypot(g.pt[0]-x,g.pt[1]-y)-g.rad);}
  if(!g.line){try{if(g.el.isPointInFill(new DOMPoint(x,y)))return 0;}catch{}}
  let m=Infinity;for(const q of g.pts){const d=Math.hypot(q[0]-x,q[1]-y);if(d<m)m=d;}return Math.max(0,m-g.half);};
 // distance (units) from a point to the nearest goal shape or line (cities excluded: their pin is an obstacle already)
 const shapeDist=(x,y)=>{let m=Infinity;for(const g of goals){if(g.pt)continue;const d=distGoal(g,x,y);if(d<m)m=d;}return m;};
 const goalDist=(x,y)=>{let m=Infinity;for(const g of goals){const d=distGoal(g,x,y);if(d<m)m=d;}return m;};
 // A point of a place on the map, never loose: a city's own point; for an area a point inside it (the one nearest its
 // middle, then the inside point farthest from the ones already taken); for a river a point on its line.
 function placePoint(id,taken,near){
  const els=[...svg.querySelectorAll('[data-id="'+id+'"]')];if(!els.length)return null;
  const c=els.find(n=>n.tagName==='circle');if(c)return [+c.getAttribute('cx'),+c.getAttribute('cy')];
  const shapes=els.filter(n=>typeof n.getBBox==='function');let el=null,area=-1;for(const n of shapes){try{const b=n.getBBox(),a=b.width*b.height;if(a>area){area=a;el=n;}}catch{}}
  if(!el)return null;const b=el.getBBox(),pts=[];
  for(let gy=1;gy<12;gy++)for(let gx=1;gx<12;gx++){const x=b.x+b.width*gx/12,y=b.y+b.height*gy/12;try{if(el.isPointInFill(new DOMPoint(x,y)))pts.push([x,y]);}catch{}}
  if(!pts.length&&typeof el.getTotalLength==='function'){const L=el.getTotalLength();for(const f of [.5,.3,.7,.4,.6]){const q=el.getPointAtLength(L*f);pts.push([q.x,q.y]);}return pts.find(p=>!taken.some(t=>Math.hypot(t[0]-p[0],t[1]-p[1])<1))||pts[0];}
  if(!pts.length)return [b.x+b.width/2,b.y+b.height/2];
  const mx=pts.reduce((a,p)=>a+p[0],0)/pts.length,my=pts.reduce((a,p)=>a+p[1],0)/pts.length;pts.sort((p,q)=>Math.hypot(p[0]-mx,p[1]-my)-Math.hypot(q[0]-mx,q[1]-my));
  if(near)return pts.reduce((a,p)=>Math.hypot(p[0]-near[0],p[1]-near[1])<Math.hypot(a[0]-near[0],a[1]-near[1])?p:a,pts[0]);
  if(!taken.length)return pts[0];const inner=pts.slice(0,Math.max(1,Math.ceil(pts.length*.6)));
  return inner.reduce((best,p)=>{const d=Math.min(...taken.map(t=>Math.hypot(t[0]-p[0],t[1]-p[1])));return d>best[1]?[p,d]:best;},[inner[0],-1])[0];
 }
 // Ronde 5 punt 2: on Reis only the active chapter's landmarks (data-chapter, set by reis.js); a chapter without one shows
 // the calm basis set (≤ 4). Toets resultaat (no chapter) keeps them all.
 const chapter=svg.dataset.chapter&&typeof ROUTE_CHAPTERS!=='undefined'?ROUTE_CHAPTERS.find(c=>c.id===svg.dataset.chapter):null;
 let shown=art.items;
 if(chapter){const ids=new Set(chapter.itemIds);shown=art.items.filter(i=>i.relevantItems.some(id=>ids.has(id)));svg.dataset.landmarkSet='chapter';
  if(!shown.length){shown=art.items.filter(i=>(art.basisSet||[]).includes(i.id));svg.dataset.landmarkSet='basis';}}
 else delete svg.dataset.landmarkSet;
 // BL-016c: on Reis only ONE landmark, at the active pin (the chapter's first place still to learn, else its first), as a
 // small badge: the illustration on a white pill with a soft shadow. No loose icons, no circles.
 const onReis=!!svg.closest('.v3MapStage');
 if(!all&&onReis&&svg.dataset.focus!=='points')shown=[]; // a badge only where there is an active pin (not on rivers/areas)
 // BL-035.3 (Dennis 19-11): in "all" mode (chapter page, Oefenen) the icons come from ONE config,
 // assets/v3/landmarks/chapter-icons.json: chapter → place → icon. Each icon stands at a real place of the chapter (the
 // place's own map element: a city's point, a point inside an area, a point on a river); several icons at one place get
 // different points of that place. Oefenen: the entries whose place is being practised.
 if(all){const plan=window.TOPO_V3_ART?.chapterIcons;shown=[];
  if(plan){const assets=new Map([...art.items,...(window.TOPO_V3_ART.lifestyle?.items||[])].map(i=>[i.id,i]));
   // Oefenen: the chosen group is the chapter (loose icons need a chapter); 'Alles'/'Mijn fouten' show only related icons.
   const cid=chapter?.id||(plan.chapters[svg.dataset.group]?svg.dataset.group:null);
   const practised=cid?null:new Set([...svg.querySelectorAll('.v3Hit[data-id]')].map(n=>n.getAttribute('data-id')));
   const list=cid?(plan.chapters[cid]||[]):Object.values(plan.chapters).flat().filter(e=>e.related&&practised.has(e.place));
   const used=new Map(),seenPair=new Set(),names=typeof ITEMS!=='undefined'?ITEMS:[];
   for(const e of list){const key=(e.place||e.at.join(','))+'|'+e.icon;if(seenPair.has(key))continue;seenPair.add(key);
    const asset=assets.get(e.icon);if(!asset)continue;const iconName=plan.icons?.[e.icon]||asset.label;
    // RELATED: at its goal; label "Colosseum, Rome" on hover. LOOSE: at its own real point, no goal, label = the icon's name only.
    if(e.related){const taken=used.get(e.place)||[];const pt=placePoint(e.place,taken,e.nearPoint);if(!pt)continue;taken.push(pt);used.set(e.place,taken);
     const place=names.find(x=>x.id===e.place)?.name||'';
     shown.push({...asset,point:pt,place:e.place,avoid:e.avoid,related:true,iconName,label:!place||iconName===place?place||iconName:iconName+', '+place});}
    else shown.push({...asset,point:e.point,loose:true,where:e.where,related:false,iconName,label:iconName});}}
  svg.dataset.landmarkSet='hoofdstuk';}
 else if(onReis&&shown.length){const hits=[...svg.querySelectorAll('circle.v3Hit')].map(c=>c.getAttribute('data-id'));
  const pick=shown.find(i=>i.relevantItems.some(id=>hits.includes(id)))||shown[0];shown=[pick];svg.dataset.landmarkSet='badge';}
 for(const item of shown){
  const asset=item.exports[size];
  const [left,top,right,bottom]=asset.paintBounds;
  // Anchor the painted bottom centre, not the padded square, at the real geographic point.
  const one=matchMedia('(max-width:1279px)').matches?28:32;
  const units=(all?one:item.paintSize*grow)/Math.max(right-left,bottom-top),width=asset.size[0]*units,pw=(right-left)*units,ph=(bottom-top)*units;
  // BL-036.3: an always-visible name pill (related:false) belongs to the icon's box in the collision search, so two
  // icons at one place never put a label over the other icon.
  const alw=all&&item.loose,half=alw?Math.max(pw/2,Math.max(40,(item.iconName||'').length*7.4+20)/2):pw/2;
  // In 'all' mode the box is the lavender circle (6 px around the icon), plus the pill below when it is always shown.
  const at=(dx,dy)=>all?[item.point[0]+(dx-half-6)*k,item.point[1]+(dy-ph-6)*k,item.point[0]+(dx+half+6)*k,item.point[1]+(dy+(alw?26:6))*k]:[item.point[0]+(dx-pw/2)*k,item.point[1]+(dy-ph)*k,item.point[0]+(dx+pw/2)*k,item.point[1]+dy*k];
  let dx=0,dy=0;
  if(all){
   // BL-037.9 (b)(c): the lavender circle (icon + 6 px) never touches a goal shape or line; a LOOSE icon also keeps 12 screen
   // px edge to edge (BL-039.5, Dennis 20-11: circle edge to the edge of the goal's shape, line or dot) from every goal of the chapter and moves at most 28 px from its real point. A related icon at an
   // area or a river steps outside the shape, as near as possible (up to 300 px); one at a city up to 96 px.
   const cr=Math.max(pw,ph)/2+6,ctr=(x,y)=>[item.point[0]+x*k,item.point[1]+(y-ph/2)*k];
   const bad=(x,y)=>{if(hits(at(x,y)))return true;const [cx,cy]=ctr(x,y);
    if(shapeDist(cx,cy)<(cr+1.5)*k)return true;
    if(item.loose&&goalDist(cx,cy)<(cr+LOOSE_GAP)*k)return true;
    // BL-039.5: an optional 'avoid' (related area icon): the spot must lie nearer to its own place than to the avoided goal
    for(const av of item.avoid||[]){const own=goals.find(q=>q.id===item.place),oth=goals.find(q=>q.id===av);if(own&&oth&&distGoal(own,cx,cy)>distGoal(oth,cx,cy))return true;}
    return false;};
   const reach=item.loose?28:(goals.find(q=>q.id===item.place)?.pt?96:300);
   let ok=!bad(0,0);
   if(!ok)search:for(let d=4;d<=reach;d+=d<48?4:6)for(let a=0;a<16;a++){const sx=Math.sin(a*Math.PI/8),sy=-Math.cos(a*Math.PI/8),x=Math.round(sx*d),y=Math.round(sy*d);if(!bad(x,y)){dx=x;dy=y;ok=true;break search;}}
   if(!ok){svg.dataset.landmarkDropped=(svg.dataset.landmarkDropped?svg.dataset.landmarkDropped+',':'')+item.id+(item.place?'@'+item.place:'@'+item.where);continue;}}
  else if(hits(at(0,0)))search:for(let d=4;d<=96;d+=4)for(const [sx,sy] of STEPS){const r=at(sx*d,sy*d);if(!hits(r)){dx=sx*d;dy=sy*d;break search;}}
  const box=at(dx,dy);obstacles.push(box);
  const node=make('g',{'data-landmark':item.id,...(all?{'data-kind':item.loose?'loose':'related','data-icon-name':item.iconName}:{}),...(item.place?{'data-place':item.place}:item.loose?{'data-where':item.where}:{'data-longitude':item.coordinates[0],'data-latitude':item.coordinates[1]}),transform:'translate('+item.point[0]+' '+item.point[1]+') scale('+k+')'});
  if(dx||dy){node.dataset.shift=dx+' '+dy;}
  // BL-016b D: never loose on the relief — each landmark sits on a white badge (circle + shadow, CSS .v3Badge).
  const pic=make('image',{href:asset.src,x:-(left+right)/2*units+dx,y:-bottom*units+dy,width,height:width,'data-export-size':size});
  if(all){const icon=make('g',{class:'v3LmIcon'}),cy=dy-ph/2;icon.style.setProperty('--cx',dx+'px');icon.style.setProperty('--cy',cy+'px');
   icon.append(make('circle',{class:'v3Badge',cx:dx,cy,r:Math.max(pw,ph)/2+6}),pic);node.append(icon);}
  else{if(onReis){const pad=6,bwid=pw+2*pad,bht=ph+2*pad;node.append(make('rect',{class:'v3Badge',x:dx-bwid/2,y:dy-ph-pad,width:bwid,height:bht,rx:bht/2}));}node.append(pic);}
  if(all){node.setAttribute('class','v3Lm');node.setAttribute('tabindex','0');node.setAttribute('pointer-events','auto');
   // the label: a white pill under the icon, shown on hover/focus (scaled 1.15x around the icon's centre by CSS)
   const NL={TOPO_01:'Colosseum, Rome',TOPO_02:'Scheve Toren van Pisa',TOPO_03:'Vesuvius bij Napels',TOPO_04:'Etna, Sicilië',TOPO_05:'Gondel in Venetië',TOPO_06:'Dom van Milaan',TOPO_07:'Dom van Florence',TOPO_08:'Nuraghe, Sardinië',TOPO_09:'Dolomieten',TOPO_10:'Trulli, Alberobello'};
   // BL-036.3: related:false → the icon's own name ("Fiat 500") is always visible, as a small pill (13 px text, 20 px high)
   const always=item.loose,name=(always?item.iconName:item.place?item.label:(NL[item.id]||item.label)||'').trim(),lw=Math.max(40,name.length*7.4+20),lab=make('g',{class:always?'v3LmLabel v3LmLabelAlways':'v3LmLabel'});
   lab.append(make('rect',{x:dx-lw/2,y:dy+(always?6:8),width:lw,height:always?20:24,rx:always?10:12}));const t=make('text',{x:dx,y:dy+(always?20.5:24.5),'text-anchor':'middle'});t.textContent=name;lab.append(t);node.append(lab);
   node.style.setProperty('--lm-oy',(dy-ph/2)+'px');}
  g.append(node);
 }
 // Ronde 5 punt 7: the chapter's lifestyle icons (a fixed list per chapter, locations.json), Reis only, smaller than the
 // landmarks (painted 32 px desktop / 28 px iPad), in their own layer above the landmarks and below every pin and mark;
 // the same collision search keeps them off pins, marks, labels and the landmarks just placed.
 let ls=svg.querySelector(':scope>.v3Lifestyle');
 const plan=chapter&&window.TOPO_V3_ART?.lifestyle?.chapters?.[chapter.id];
 // BL-016b D: no loose lifestyle icons on the Reis relief (they had no badge); the layer stays off.
 if(!plan||svg.closest('.v3MapStage')){ls?.remove();return;}
 if(!ls)ls=make('g',{class:'v3Lifestyle','aria-hidden':'true','pointer-events':'none'});
 g.after(ls);ls.replaceChildren();
 const lsTarget=matchMedia('(max-width:1279px)').matches?28:32,lsItems=window.TOPO_V3_ART.lifestyle.items;
 for(const {id,place,point} of plan){
  const item=lsItems.find(i=>i.id===id);if(!item)continue;
  const asset=item.exports[size],[left,top,right,bottom]=asset.paintBounds;
  const units=lsTarget/Math.max(right-left,bottom-top),width=asset.size[0]*units,pw=(right-left)*units,ph=(bottom-top)*units;
  const at=(dx,dy)=>[point[0]+(dx-pw/2)*k,point[1]+(dy-ph)*k,point[0]+(dx+pw/2)*k,point[1]+dy*k];
  let dx=0,dy=0;
  if(hits(at(0,0)))search:for(let d=4;d<=96;d+=4)for(const [sx,sy] of STEPS){const r=at(sx*d,sy*d);if(!hits(r)){dx=sx*d;dy=sy*d;break search;}}
  obstacles.push(at(dx,dy));
  const node=make('g',{'data-lifestyle':id,'data-place':place,transform:'translate('+point[0]+' '+point[1]+') scale('+k+')'});
  if(dx||dy)node.dataset.shift=dx+' '+dy;
  node.append(make('image',{href:asset.src,x:-(left+right)/2*units+dx,y:-bottom*units+dy,width,height:width,'data-export-size':size}));ls.append(node);
 }
};
