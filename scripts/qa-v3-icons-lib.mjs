// BL-037.9: measured icon rules (Dennis 20-11) on the real map shapes, shared by qa-v3-icons.mjs and qa-v3-menu1.mjs.
//  (1) a LOOSE icon (no goal) lies >= 12 screen px EDGE TO EDGE (BL-039.5, Dennis 20-11): from the circle (icon + 6 px) to the edge of
//      every goal of the chapter (the visible dot/pin of a city, the outline of a shape, the edge of a river line)
//  (2) no icon (badge circle) on or over a goal shape or line
//  (3) the label of a LOOSE icon is only the icon's name (no goal name, no comma); a related label starts with the icon's name
//  (4) 0 icons during Aanwijzen, Namen schrijven and Slim rondje (Oefenen) and in Toets (setup, exam, result); Ontdekken shows them
// Plus: nothing dropped (every configured icon found a free spot) and the count per chapter.
export const CHAPTERS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','rivers','countries','seas'];
const probe=(sel)=>{
 const svg=document.querySelector(sel);if(!svg)return {error:'geen kaart '+sel};
 const goals=[];
 for(const n of svg.querySelectorAll('.v3Hit[data-id]')){const id=n.getAttribute('data-id'),m=n.getScreenCTM();if(!m)continue;
  if(n.tagName==='circle'){const q=new DOMPoint(+n.getAttribute('cx'),+n.getAttribute('cy')).matrixTransform(m);
   let rect=null;for(const pin of svg.querySelectorAll(':scope>.v3Pins .v3Pin')){const r=pin.getBoundingClientRect();if(Math.abs(r.bottom-q.y)<3&&Math.abs(r.x+r.width/2-q.x)<3){rect=[r.left,r.top,r.right,r.bottom];break;}}
   const cr=n.getBoundingClientRect();goals.push({id,pt:[q.x,q.y],rect,rad:rect?0:cr.width/2+(parseFloat(getComputedStyle(n).strokeWidth)||0)/2});continue;}
  if(typeof n.getTotalLength!=='function')continue;
  const sc=Math.hypot(m.a,m.b),L=n.getTotalLength(),step=1.5/sc,pts=[];for(let f=0;f<=L;f+=step){const q=n.getPointAtLength(f).matrixTransform(m);pts.push([q.x,q.y]);}
  const cs=getComputedStyle(n),sw=parseFloat(cs.strokeWidth)||0;
  goals.push({id,el:n,m,pts,line:cs.fill==='none',half:(cs.vectorEffect==='non-scaling-stroke'?sw:sw*sc)/2});}
 const dist=(g,x,y)=>{if(g.pt){if(g.rect)return Math.hypot(Math.max(g.rect[0]-x,0,x-g.rect[2]),Math.max(g.rect[1]-y,0,y-g.rect[3]));return Math.max(0,Math.hypot(g.pt[0]-x,g.pt[1]-y)-g.rad);}
  if(!g.line){try{const q=new DOMPoint(x,y).matrixTransform(g.m.inverse());if(g.el.isPointInFill(q))return 0;}catch{}}
  let best=Infinity;for(const q of g.pts){const d=Math.hypot(q[0]-x,q[1]-y);if(d<best)best=d;}return Math.max(0,best-g.half);};
 const names=Object.fromEntries((typeof ITEMS!=='undefined'?ITEMS:[]).map(i=>[i.id,i.name]));
 const out={goals:goals.length,icons:[],dropped:svg.dataset.landmarkDropped||'',set:svg.dataset.landmarkSet||''};
 for(const n of svg.querySelectorAll('.v3Landmarks .v3Lm')){
  const b=n.querySelector('.v3Badge').getBoundingClientRect(),cx=b.x+b.width/2,cy=b.y+b.height/2,r=b.width/2;
  const kind=n.dataset.kind,txt=(n.querySelector('.v3LmLabel text')?.textContent||'').trim();
  let toGoal=Infinity,over=null;
  for(const g of goals){const d=dist(g,cx,cy);toGoal=Math.min(toGoal,d);if(!g.pt&&d<r-1){over=g.id+' ('+d.toFixed(1)+' < '+r.toFixed(1)+')';}}
  out.icons.push({icon:n.dataset.landmark,name:n.dataset.iconName,kind,place:n.dataset.place||n.dataset.where,txt,toGoal:+toGoal.toFixed(1),r:+r.toFixed(1),gap:+(toGoal-r).toFixed(1),over,
   goalNamesIn:goals.map(g=>names[g.id]).filter(nm=>nm&&txt.includes(nm))});}
 return out;
};
export function judge(where,r,fail,expect){
 if(r.error){fail(where,r.error);return null;}
 if(r.dropped)fail(where,'icoon weggelaten (geen vrije plek): '+r.dropped);
 if(expect!=null&&r.icons.length!==expect)fail(where,r.icons.length+' iconen, verwacht '+expect);
 for(const i of r.icons){const t=`${where} ${i.name}@${i.place}`;
  if(i.over)fail(t,'(2) icoon op doelvorm/-lijn '+i.over);
  if(i.kind==='loose'){
   if(!(i.gap>=11.5))fail(t,'(1) los icoon: rand-rand '+i.gap+' px van een doel (< 12; midden '+i.toGoal+', straal '+i.r+')');
   if(i.txt!==i.name||/,/.test(i.txt)||i.goalNamesIn.length)fail(t,'(3) label "'+i.txt+'" koppelt het losse icoon ('+i.goalNamesIn+')');}
  else if(i.kind==='related'){if(!i.txt.startsWith(i.name))fail(t,'(3) label "'+i.txt+'" begint niet met "'+i.name+'"');}
  else fail(t,'icoon zonder soort');}
 const loose=r.icons.filter(i=>i.kind==='loose');
 return {n:r.icons.length,loose:loose.length,minLoose:loose.length?Math.min(...loose.map(i=>i.gap)):null,items:r.icons.map(i=>({icon:i.name,kind:i.kind,place:i.place,gap:i.kind==='loose'?i.gap:null,anyGap:i.gap}))};
}
export async function iconChecks(b,HTML,W,H,fail,{bg='bg01',expected={}}={}){
 const p=await b.newPage({viewport:{width:W,height:H}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(HTML+'#alles/'+bg);await p.waitForTimeout(1500);
 const rows=[];
 // Chapter page (every chapter)
 for(const id of CHAPTERS){
  await p.evaluate(id=>{TOPO_V3.showChapter(id);TOPO_V3.render();},id);await p.waitForTimeout(800);
  const r=await p.evaluate(probe,'.v3MapStage .v3Map');const where=`${W}×${H} hoofdstuk ${id}`;
  const j=judge(where,r,fail,expected[id]);if(j)rows.push({where,...j});
  if(id==='countries'||id==='seas'){if(r.icons.length)fail(where,'iconen op Landen/Zeeën');}
 }
 // Oefenen: every form × the chapters (Ontdekken shows them; Aanwijzen, Namen, Slim rondje hide them)
 await p.locator('.v3Side [data-nav=oefenen]').filter({visible:true}).first().click();await p.waitForTimeout(800);
 for(const form of ['learn','point','write','smart']){
  await p.locator(`.v3Forms [data-form=${form}]`).click();await p.waitForTimeout(500);
  for(const id of (form==='learn'?CHAPTERS:['city1','regions'])){
   if(form==='smart'){}else{await p.locator(`.v3OefGroep [data-group=${id}]`).click();await p.waitForTimeout(700);}
   const r=await p.evaluate(probe,'.v3OefStage svg.v3OefMap');const where=`${W}×${H} oefenen ${form} ${form==='smart'?'':id}`;
   if(form==='learn'){const j=judge(where,r,fail,expected[id]);if(j)rows.push({where,...j});}
   else{const vis=await p.evaluate(()=>[...document.querySelectorAll('.v3OefStage [data-landmark]')].filter(e=>e.getClientRects().length).length);
    if(r.icons?.length||vis)fail(where,'(4) '+(r.icons?.length||vis)+' iconen zichtbaar tijdens '+form);}
   if(form==='smart')break;}
 }
 // Toets: setup, exam and result carry no icons
 await p.locator('.v3Side [data-nav=toets]').filter({visible:true}).first().click();await p.waitForTimeout(700);
 const toets=async(label)=>{const n=await p.evaluate(()=>[...document.querySelectorAll('.v3ToetsMap [data-landmark],.v3ToetsSetupMap [data-landmark],.v3ToetsMap .v3Landmarks>*,.v3PrintMap [data-landmark]')].length);if(n)fail(`${W}×${H} toets ${label}`,'(4) '+n+' iconen in Toets');};
 await toets('opzet');await p.locator('.v3ToetsSetup .v3Start').click();await p.waitForTimeout(800);await toets('vraag');
 for(let i=0;i<60;i++){if(await p.evaluate(()=>document.querySelector('.v3Reis')?.dataset.view==='toetsResult'))break;await p.evaluate(()=>{try{grade(true)}catch{}try{next()}catch{}});await p.waitForTimeout(50);}
 await p.waitForTimeout(500);await toets('resultaat');
 if(errors.length)fail(`${W}×${H} iconen`,'page errors: '+errors.join(' | '));
 await p.close();return rows;
}
