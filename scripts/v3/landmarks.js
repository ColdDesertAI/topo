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
 // Ronde 5 punt 8: the relief look lives in reliefDepth (reis.js) for every map; no separate warm/desaturated copy here.
 // Ronde 4: landmarks below every pin and mark layer; the pin stays on top.
 let g=svg.querySelector('.v3Landmarks');if(!g)g=make('g',{class:'v3Landmarks','aria-hidden':'true','pointer-events':'none'});
 svg.insertBefore(g,svg.querySelector(':scope>.v3Pins,:scope>.v3Marks'));
 g.replaceChildren();
 // Ronde 4 size: the median painted height is 40 screen px on desktop and 34 on iPad (≤ 1279 px); the relative sizes
 // between landmarks (paintSize) are kept.
 const size=window.devicePixelRatio>1?256:128,target=matchMedia('(max-width:1279px)').matches?34:40;
 const heights=art.items.map(item=>{const [l,t,r,b]=item.exports[size].paintBounds;return item.paintSize*(b-t)/Math.max(r-l,b-t);}).sort((a,b)=>a-b);
 const grow=target/((heights[(heights.length-1)>>1]+heights[heights.length>>1])/2);
 // Collision check (screen px around each landmark's anchor): never under or over a pin, a ✓/× mark or a mistake
 // label. A landmark that would touch one moves to the nearest free spot at the edge of its place; its anchor
 // (translate) stays on the real geographic point.
 const toMap=svg.getScreenCTM?.()?.inverse(),obstacles=[],GAP=3;
 const boxOf=n=>{try{const b=n.getBBox(),m=toMap&&n.getScreenCTM()&&toMap.multiply(n.getScreenCTM());if(!m||(!b.width&&!b.height))return null;
  const xs=[],ys=[];for(const [x,y] of [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]]){xs.push(m.a*x+m.c*y+m.e);ys.push(m.b*x+m.d*y+m.f);}
  return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];}catch{return null;}};
 for(const n of svg.querySelectorAll(':scope>.v3Pins .v3Pin,:scope>.v3Marks .v3Mark>circle,:scope>.v3Marks .v3MarkName')){const b=boxOf(n);if(b)obstacles.push(b);}
 const hits=(r)=>obstacles.some(o=>r[0]<o[2]+GAP*k&&o[0]<r[2]+GAP*k&&r[1]<o[3]+GAP*k&&o[1]<r[3]+GAP*k);
 const STEPS=[[0,-1],[1,0],[-1,0],[1,-1],[-1,-1],[0,1],[1,1],[-1,1]];
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
 if(all){const seen=new Set(),ids=chapter?new Set(chapter.itemIds):new Set([...svg.querySelectorAll('.v3Hit[data-id]')].map(n=>n.getAttribute('data-id'))); // Oefenen: the places being practised
  if(!chapter)shown=art.items.filter(i=>i.relevantItems.some(x=>ids.has(x)));shown=shown.filter(i=>{const place=i.relevantItems.find(x=>!ids||ids.has(x));if(!place||seen.has(place))return false;seen.add(place);return true;});svg.dataset.landmarkSet='hoofdstuk';}
 else if(onReis&&shown.length){const hits=[...svg.querySelectorAll('circle.v3Hit')].map(c=>c.getAttribute('data-id'));
  const pick=shown.find(i=>i.relevantItems.some(id=>hits.includes(id)))||shown[0];shown=[pick];svg.dataset.landmarkSet='badge';}
 for(const item of shown){
  const asset=item.exports[size];
  const [left,top,right,bottom]=asset.paintBounds;
  // Anchor the painted bottom centre, not the padded square, at the real geographic point.
  const one=matchMedia('(max-width:1279px)').matches?28:32;
  const units=(all?one:item.paintSize*grow)/Math.max(right-left,bottom-top),width=asset.size[0]*units,pw=(right-left)*units,ph=(bottom-top)*units;
  const at=(dx,dy)=>[item.point[0]+(dx-pw/2)*k,item.point[1]+(dy-ph)*k,item.point[0]+(dx+pw/2)*k,item.point[1]+dy*k];
  let dx=0,dy=0;
  if(hits(at(0,0)))search:for(let d=4;d<=96;d+=4)for(const [sx,sy] of STEPS){const r=at(sx*d,sy*d);if(!hits(r)){dx=sx*d;dy=sy*d;break search;}}
  const box=at(dx,dy);obstacles.push(box);
  const node=make('g',{'data-landmark':item.id,'data-longitude':item.coordinates[0],'data-latitude':item.coordinates[1],transform:'translate('+item.point[0]+' '+item.point[1]+') scale('+k+')'});
  if(dx||dy){node.dataset.shift=dx+' '+dy;}
  // BL-016b D: never loose on the relief — each landmark sits on a white badge (circle + shadow, CSS .v3Badge).
  if(onReis||all){const pad=6,bwid=pw+2*pad,bht=ph+2*pad;node.append(make('rect',{class:'v3Badge',x:dx-bwid/2,y:dy-ph-pad,width:bwid,height:bht,rx:bht/2}));}
  node.append(make('image',{href:asset.src,x:-(left+right)/2*units+dx,y:-bottom*units+dy,width,height:width,'data-export-size':size}));
  if(all){node.setAttribute('class','v3Lm');node.setAttribute('tabindex','0');node.setAttribute('pointer-events','auto');
   // the label: a white pill under the icon, shown on hover/focus (scaled 1.15x around the icon's centre by CSS)
   const NL={TOPO_01:'Colosseum, Rome',TOPO_02:'Scheve Toren van Pisa',TOPO_03:'Vesuvius bij Napels',TOPO_04:'Etna, Sicilië',TOPO_05:'Gondel in Venetië',TOPO_06:'Dom van Milaan',TOPO_07:'Dom van Florence',TOPO_08:'Nuraghe, Sardinië',TOPO_09:'Dolomieten',TOPO_10:'Trulli, Alberobello'};
   const name=(NL[item.id]||item.label||'').trim(),lw=Math.max(40,name.length*7.4+20),lab=make('g',{class:'v3LmLabel'});
   lab.append(make('rect',{x:dx-lw/2,y:dy+8,width:lw,height:24,rx:12}));const t=make('text',{x:dx,y:dy+24.5,'text-anchor':'middle'});t.textContent=name;lab.append(t);node.append(lab);
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
