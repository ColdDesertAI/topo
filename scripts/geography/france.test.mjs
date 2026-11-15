import assert from 'node:assert/strict';
import test from 'node:test';
import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const digest=b=>createHash('sha256').update(b).digest('hex'),geo='src/lands/fr/geo/';
assert.ok(existsSync(new URL(geo+'map.json',root)),'build-france.mjs must produce map.json');
const map=JSON.parse(read(geo+'map.json')),regions=JSON.parse(read(geo+'regions.json')),P=JSON.parse(read(geo+'projection.json'));
const manifest=JSON.parse(read(geo+'sources.json')),source=JSON.parse(gunzipSync(read(geo+'source.json.gz'))),draft=JSON.parse(read('src/lands/fr/items.draft.json'));
const project=([lon,lat])=>[lon*60+390,4576-lat*88];
function parts(path){return [...path.matchAll(/M([^M]+)/g)].map(m=>{const a=m[1].match(/-?\d+(?:\.\d+)?/g).map(Number);return {closed:m[1].endsWith('Z'),points:Array.from({length:a.length/2},(_,i)=>a.slice(2*i,2*i+2))};});}
function segments(path){return parts(path).flatMap(p=>p.points.flatMap((v,i)=>i+1<p.points.length?[[v,p.points[i+1]]]:p.closed?[[v,p.points[0]]]:[]));}
function contains(path,[x,y]){let inside=false;for(const [a,b] of segments(path))if((a[1]>y)!==(b[1]>y)&&x<a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))inside=!inside;return inside;}
const dist=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dy*t);};
const nearest=(p,segs)=>Math.min(...segs.map(([a,b])=>dist(p,a,b)));
const framePoint=p=>p.length===2&&p.every(Number.isFinite)&&p[0]>=0&&p[0]<=1000&&p[1]>=0&&p[1]<=1000;
const rawLines=g=>g.type==='LineString'?[g.coordinates]:g.coordinates;
const regionIds=['ARA','BFC','BRE','COR','CVL','GES','HDF','IDF','NAQ','NOR','OCC','PAC','PDL'].map(s=>'FR-'+s);
const expected={bordeaux:'NAQ',calais:'HDF','le-havre':'NOR',lille:'HDF',lyon:'ARA',marseille:'PAC',metz:'GES',montpellier:'OCC',nancy:'GES',nantes:'PDL',nice:'PAC',parijs:'IDF',straatsburg:'GES',toulouse:'OCC',amiens:'HDF',dijon:'BFC',grenoble:'ARA',orleans:'CVL',reims:'GES'};

test('40 draft IDs resolve to actual points or shapes in the declared frame; all required contexts exist',()=>{
 assert.equal(map.status,'draft');assert.equal(map.land,'fr');assert.equal(map.items.length,40);
 assert.deepEqual(map.items.map(i=>i.id).sort(),draft.items.map(i=>i.id).sort());assert.equal(new Set(map.items.map(i=>i.id)).size,40);
 assert.equal(map.itemsDraftSha256,digest(read('src/lands/fr/items.draft.json')));
 for(const item of map.items){if(item.point)assert.ok(framePoint(item.point),item.id);else{assert.ok(item.path);for(const p of parts(item.path))for(const v of p.points)assert.ok(framePoint(v),item.id+' path vertex');}}
 for(const id of ['BEL','LUX','DEU','CHE','ITA','ESP','AND','MCO','GBR'])assert.ok(map.context.some(c=>c.id===id&&c.path),'visible neighbour '+id);
 for(const c of [map.outline,...map.context])for(const p of parts(c.path))for(const v of p.points)assert.ok(framePoint(v),c.id);
});

test('explicit independent affine projection, shared by all point outputs, with France and Corsica filling the frame',()=>{
 assert.deepEqual(P.viewBox,[0,0,1000,1000]);assert.deepEqual(map.viewBox,P.viewBox);assert.equal(map.projectionSha256,digest(read(geo+'projection.json')));
 assert.deepEqual(P.x,{scale:60,offset:390});assert.deepEqual(P.y,{scale:-88,offset:4576});assert.deepEqual(project([2,48]),[510,352]);
 for(const i of map.items.filter(i=>i.point)){const q=project(i.wgs84);assert.ok(Math.hypot(q[0]-i.point[0],q[1]-i.point[1])<=.0071,i.id+' quantisation only');}
 const vertices=parts(map.outline.path).flatMap(p=>p.points),xs=vertices.map(p=>p[0]),ys=vertices.map(p=>p[1]);
 assert.ok(Math.max(...xs)-Math.min(...xs)>850,'France+Corsica width >85%');assert.ok(Math.max(...ys)-Math.min(...ys)>850,'France+Corsica height >85%');
 assert.ok(contains(map.outline.path,project([9,42])),'Corsica remains in the same projection and frame');
});

test('all source excerpts and upstream revisions are pinned; no invented province or coordinate fixtures',()=>{
 assert.equal(digest(read(geo+'source.json.gz')),'94ccfecf81c64016a4706b0ffbfab762e8e0d204820f3bb79a3ba0c0c61862f9');
 assert.equal(manifest.sourceSha256,map.sourceSha256);assert.equal(manifest.license,'public domain');assert.equal(manifest.revision,'ca96624a56bd078437bca8184e78163e5039ad19');
 assert.deepEqual(manifest.layers.map(l=>l.features),[17,96,19,10,3]);
 const hashes=['239eec57ac17f100a11e2536cffc56752c318b50ae765b0918ff7aab4ce8f255','22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5','9b8e3de09048ef00dfc70357dbb9fa324493f214b5e0ae4daf1aa79a8d10116b','bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a','b7b26e50ea917d3696aec87f932def2bf5f890f5770e441d59c162c6f4c92a77'];
 assert.deepEqual(manifest.layers.map(l=>l.sha256),hashes);
 assert.equal(source.legacy.sha256,'9331755e8532f7c465feb73013f663150d85badd8626cdacf1e1b556ad14b860');
 assert.equal(source.legacy.commit,'dc9d094dd9aeff635021ae897d25337f64a76982');
 assert.equal(new Set(source.layers.departments.features.map(f=>f.properties.region_cod.trim())).size,13);
});

test('every one of 19 cities lies strictly in France and exactly its independently expected region',()=>{
 assert.deepEqual(JSON.parse(read(geo+'city-regions.json')),Object.fromEntries(Object.entries(expected).map(([id,r])=>[id,'FR-'+r])));
 assert.equal(regions.length,13);assert.deepEqual(regions.map(r=>r.id).sort(),regionIds.sort());
 const cities=draft.items.filter(i=>i.type==='stad');assert.equal(cities.length,19);
 for(const item of cities){const g=map.items.find(i=>i.id===item.id),s=source.layers.places.features.find(f=>f.properties.NAME===item.fr);
  assert.deepEqual(g.wgs84,[s.properties.LONGITUDE,s.properties.LATITUDE],item.id+' exact source coordinate fields, as in land/fr-geo');assert.deepEqual(g.source.coordinateFields,['LONGITUDE','LATITUDE']);
  if(item.id==='parijs')assert.deepEqual(g.wgs84,[2.33139,48.868639],'preserve existing Paris source choice; do not silently switch to the other NE point');assert.equal(g.source.featureId,s.properties.NE_ID);
  assert.ok(contains(map.outline.path,g.point),item.id+' inside national outline');assert.equal(g.regionId,'FR-'+expected[item.id]);
  assert.deepEqual(regions.filter(r=>contains(r.path,g.point)).map(r=>r.id),[g.regionId],item.id+' unique correct region');
 }
});

test('13 regions share exact edges, have no overlap or visible interior gaps, and cover the national outline',()=>{
 const cached=regions.map(r=>({id:r.id,segs:segments(r.path)})),all=cached.flatMap(r=>r.segs),national=segments(map.outline.path),edgeMap=new Map();
 const key=(a,b)=>[a.join(','),b.join(',')].sort().join('|');
 for(const r of cached)for(const [a,b] of r.segs){const k=key(a,b),list=edgeMap.get(k)||[];list.push({id:r.id,a,b});edgeMap.set(k,list);}
 for(const es of edgeMap.values()){
  assert.ok(es.length<=2,'at most two owners');
  if(es.length===2){assert.notEqual(es[0].id,es[1].id);assert.deepEqual(es[0].a,es[1].b);assert.deepEqual(es[0].b,es[1].a);}
  else{const {a,b}=es[0];assert.ok(nearest([(a[0]+b[0])/2,(a[1]+b[1])/2],national)<=.03,'unshared edge must be national coast/border/hole');}
 }
 const intervals=(ss,y)=>{const xs=ss.filter(([a,b])=>(a[1]>y)!==(b[1]>y)).map(([a,b])=>a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])).sort((a,b)=>a-b);assert.equal(xs.length%2,0);return Array.from({length:xs.length/2},(_,i)=>xs.slice(2*i,2*i+2));};
 const ys=[...new Set([...all,...national].flatMap(([a,b])=>[a[1],b[1]]))].sort((a,b)=>a-b);let maxDrift=0;
 for(let n=1;n<ys.length;n++)for(const fraction of [.001,.5,.999]){
  const y=ys[n-1]+(ys[n]-ys[n-1])*fraction,spans=cached.flatMap(r=>intervals(r.segs,y)).sort((a,b)=>a[0]-b[0]),merged=[];
  for(const s of spans){if(merged.length){assert.ok(s[0]>=merged.at(-1)[1]-1e-6,'regional overlap at '+y);if(Math.abs(s[0]-merged.at(-1)[1])<1e-6){merged.at(-1)[1]=s[1];continue;}}merged.push([...s]);}
  const base=intervals(national,y),cuts=[...new Set([...merged,...base].flat())].sort((a,b)=>a-b),inside=(ss,x)=>ss.some(([a,b])=>x>a&&x<b);
  for(let j=1;j<cuts.length;j++){const x=(cuts[j-1]+cuts[j])/2;if(inside(merged,x)!==inside(base,x)){const d=nearest([x,y],national);maxDrift=Math.max(maxDrift,d);assert.ok(d<=.03,'interior gap or exterior overhang '+[x,y,d]);}}
 }
 console.log('Region/national-mask maximum scanline drift:',maxDrift.toFixed(5),'px');
});

test('six rivers retain source centre lines; mountain areas are explicitly generalized source zones',()=>{
 const names={garonne:['Garonne'],loire:['Loire'],maas:['Maas','Meuse'],rhone:['Rhône','Rhone'],rijn:['Rhine','Rhin'],seine:['Seine']};
 for(const [id,ns] of Object.entries(names)){
  const item=map.items.find(i=>i.id===id);assert.equal(item.type,'line');assert.ok(!item.path.includes('Z'));assert.ok(segments(item.path).length>5);
  const originals=source.layers.rivers.features.filter(f=>ns.includes(f.properties.name)).flatMap(f=>rawLines(f.geometry)).map(line=>line.map(project));
  const ss=originals.flatMap(r=>r.slice(1).map((p,i)=>[r[i],p])),out=segments(item.path);
  for(const p of parts(item.path).flatMap(p=>p.points))assert.ok(nearest(p,ss)<=.22,id+' output remains on actual source river');
  for(const p of originals.flat().filter(framePoint))assert.ok(nearest(p,out)<=.22,id+' source detail not silently omitted');
 }
 for(const id of ['alpen','pyreneeen','vogezen']){const g=map.items.find(i=>i.id===id);assert.equal(g.type,'area');assert.equal(g.accuracy,'generalized-physical-zone');assert.ok(parts(g.path).every(p=>p.closed));assert.ok(segments(g.path).length>20,id+' real polygon, not a box');}
});

test('water anchors retain the old source-derived representative locations; historic regions and Corsica have real shapes',()=>{
 const p=source.legacy.projection,land=[map.outline,...map.context];
 for(const a of source.legacy.waterAnchors){const g=map.items.find(i=>i.id===a.id);assert.equal(g.role,'representative-label-anchor-not-hit-area');assert.deepEqual(g.wgs84,[a.label[0]/p.xScale+p.longitudeOrigin,p.latitudeOrigin-a.label[1]/p.yScale]);assert.ok(land.every(c=>!contains(c.path,g.point)),a.id+' remains water');}
 for(const id of ['corsica','bretagne','normandie','elzas','dordogne','provence'])assert.ok(segments(map.items.find(i=>i.id===id).path).length>20,id+' source area');
 assert.equal(map.items.find(i=>i.id==='corsica').path,regions.find(r=>r.id==='FR-COR').path);
 assert.equal(map.items.find(i=>i.id==='provence').accuracy,'four-department-educational-zone');
});

test('every region has an independent unsimplified department interior witness',()=>{
 function rawContains(g,p){const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;const ring=(r,p)=>{let v=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<a[0]+(p[1]-a[1])*(b[0]-a[0])/(b[1]-a[1]))v=!v;}return v;};return polys.some(rs=>ring(rs[0],p)&&!rs.slice(1).some(r=>ring(r,p)));}
 for(const id of regionIds){let witness=false;
  for(const f of source.layers.departments.features.filter(f=>f.properties.region_cod.trim()===id)){
   const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
   for(const rs of polys){const xs=rs[0].map(p=>p[0]),ys=rs[0].map(p=>p[1]);
    for(const frac of [.5,.3,.7]){const p=[Math.min(...xs)+(Math.max(...xs)-Math.min(...xs))*frac,(Math.min(...ys)+Math.max(...ys))/2];
     if(!rawContains(f.geometry,p))continue;const q=project(p);if(nearest(q,segments(map.outline.path))<3)continue;
     assert.deepEqual(regions.filter(r=>contains(r.path,q)).map(r=>r.id),[id],id+' original department witness');witness=true;break;
    }if(witness)break;
   }if(witness)break;
  }assert.ok(witness,id+' source witness found');
 }
});

test('rebuild reproduces both output files byte for byte (opt-in --rebuild)',{skip:!process.argv.includes('--rebuild')},()=>{
 const before=['map.json','regions.json'].map(f=>digest(read(geo+f)));
 const r=spawnSync(process.execPath,['scripts/geography/build-france.mjs'],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 assert.deepEqual(['map.json','regions.json'].map(f=>digest(read(geo+f))),before);
});
