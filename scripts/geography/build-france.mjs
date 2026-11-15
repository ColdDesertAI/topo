/** FR-02: offline geographic data preparation. No application files are written. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=new URL('../../',import.meta.url),dir=new URL('src/lands/fr/geo/',root);
const read=p=>readFileSync(new URL(p,root)),json=p=>JSON.parse(read(p));
const hash=b=>createHash('sha256').update(b).digest('hex');
const manifest=json('src/lands/fr/geo/sources.json'),P=json('src/lands/fr/geo/projection.json');
const sourceBytes=read('src/lands/fr/geo/source.json.gz');assert.equal(hash(sourceBytes),manifest.sourceSha256,'pinned source excerpt');
const source=JSON.parse(gunzipSync(sourceBytes)),draft=json('src/lands/fr/items.draft.json'),expected=json('src/lands/fr/geo/city-regions.json');
const project=([lon,lat])=>[P.x.scale*lon+P.x.offset,P.y.scale*lat+P.y.offset];
const round=n=>Number(n.toFixed(2)),fc=features=>({type:'FeatureCollection',features});
function transform(g){const walk=a=>typeof a[0]==='number'?project(a):a.map(walk);return {...g,coordinates:walk(g.coordinates)};}
const prepared=(features,properties)=>fc(features.map(f=>({type:'Feature',properties:properties(f.properties),geometry:transform(f.geometry)})));
const polygonRings=g=>g.type==='Polygon'?g.coordinates:g.coordinates.flat();
function path(g){
 const points=(r,closed)=>{const a=closed&&r[0].join()===r.at(-1).join()?r.slice(0,-1):r;return a.map((p,i)=>(i?'L':'M')+p.map(round).join(' ')).join('')+(closed?'Z':'');};
 if(g.type==='Polygon')return g.coordinates.map(r=>points(r,true)).join('');
 if(g.type==='MultiPolygon')return g.coordinates.map(p=>p.map(r=>points(r,true)).join('')).join('');
 if(g.type==='LineString')return points(g.coordinates,false);
 if(g.type==='MultiLineString')return g.coordinates.map(r=>points(r,false)).join('');
 throw Error('Unsupported geographic type '+g.type);
}
// Optional independent verification against complete upstream files; this never refreshes fixtures.
const verify=process.argv.indexOf('--verify-upstream');
if(verify>=0){
 const folder=process.argv[verify+1];assert.ok(folder,'--verify-upstream requires a folder');
 for(const layer of manifest.layers){
  const bytes=readFileSync(join(folder,layer.file));assert.equal(hash(bytes),layer.sha256,layer.file);
  const originals=new Map(JSON.parse(bytes).features.map(f=>[hash(JSON.stringify(f.geometry)),f]));
  for(const excerpt of source.layers[layer.id].features){
   const original=originals.get(hash(JSON.stringify(excerpt.geometry)));assert.ok(original,layer.id+' original geometry exists');assert.deepEqual(excerpt,original,layer.id+' unmodified upstream feature');
  }
 }console.log('All full upstream hashes and selected original features verified');
}
const verifyLegacy=process.argv.indexOf('--verify-legacy');
if(verifyLegacy>=0){const bytes=readFileSync(process.argv[verifyLegacy+1]);assert.equal(hash(bytes),source.legacy.sha256);const old=JSON.parse(bytes);for(const a of source.legacy.waterAnchors)assert.deepEqual(a.label,[old.items[a.id].lx,old.items[a.id].ly]);console.log('Legacy water-label provenance verified');}
const temp=mkdtempSync(join(tmpdir(),'topo-france-'));
const save=(name,value)=>{const p=join(temp,name);writeFileSync(p,JSON.stringify(value));return p;};
const ms=(...args)=>execFileSync('npx',['--yes','mapshaper@0.7.101',...args],{stdio:['ignore','ignore','pipe'],maxBuffer:8e6});
const load=p=>JSON.parse(readFileSync(p)).features;
const [vx,vy,vw,vh]=P.viewBox,box='bbox='+[vx,vy,vx+vw,vy+vh].join(',');
function processLayer(name,input,commands){const i=save(name+'-input.json',input),o=join(temp,name+'.geojson');ms('-i',i,...commands,'-o',o,'format=geojson','precision=0.01');return {file:o,features:load(o)};}
try{
 const countries=processLayer('countries',prepared(source.layers.countries.features,p=>({id:p.ADM0_A3,name:p.ADMIN})),['-clip',box,'-simplify','dp','interval='+P.simplification.countryOutline,'planar','keep-shapes']);
 const france=countries.features.find(f=>f.properties.id==='FRA');assert.ok(france?.geometry,'metropolitan France exists');
 const canonical=save('canonical.json',fc([{...france,properties:{canonical:true}}]));
 const names=new Map(source.layers.departments.features.map(f=>[f.properties.region_cod.trim(),f.properties.region.trim()]));assert.equal(names.size,13);
 const regionInitial=processLayer('region-initial',prepared(source.layers.departments.features,p=>({regionId:p.region_cod.trim()})),['-dissolve','regionId','-simplify','dp','interval='+P.simplification.sharedRegionArcs,'planar','keep-shapes']);
 const overlay=join(temp,'overlay.geojson');
 ms('-i',regionInitial.file,canonical,'combine-files','-union','target=*','-filter','canonical === true','-explode','-o',overlay,'format=geojson');
 const pieces=load(overlay),edges=new Map(),edgeKey=(a,b)=>[a.map(n=>n.toFixed(6)).join(','),b.map(n=>n.toFixed(6)).join(',')].sort().join('|');
 for(let i=0;i<pieces.length;i++)for(const r of polygonRings(pieces[i].geometry))for(let j=1;j<r.length;j++){const k=edgeKey(r[j-1],r[j]),list=edges.get(k)||[];list.push({i,len:Math.hypot(r[j][0]-r[j-1][0],r[j][1]-r[j-1][1])});edges.set(k,list);}
 const pending=new Set(pieces.flatMap((f,i)=>f.properties.regionId?[]:[i]));let filled=0,sourceAssigned=0;
 while(pending.size){let changed=false;
  for(const i of pending){const weights=new Map();for(const r of polygonRings(pieces[i].geometry))for(let j=1;j<r.length;j++)for(const e of edges.get(edgeKey(r[j-1],r[j]))||[]){const id=pieces[e.i].properties.regionId;if(id&&e.i!==i)weights.set(id,(weights.get(id)||0)+e.len);}
   if(weights.size){pieces[i].properties.regionId=[...weights].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0];pending.delete(i);filled++;changed=true;}
  }
  if(!changed){
   // A generalized coastline can leave an isolated sliver with no shared edge.
   // Require positive overlap with exactly ONE unsimplified source region; never use nearest-neighbour guessing.
   const original=save('original-departments.json',prepared(source.layers.departments.features,p=>({originalRegion:p.region_cod.trim()})));
   const isolated=save('isolated.json',fc([...pending].map(i=>({...pieces[i],properties:{orphanId:i}}))));
   const proof=join(temp,'source-proof.geojson');
   ms('-i',original,isolated,'combine-files','-union','target=*','-filter','orphanId != null && originalRegion != null','-o',proof,'format=geojson');
   const owners=new Map();
   for(const f of load(proof))if(f.geometry){const set=owners.get(f.properties.orphanId)||new Set();set.add(f.properties.originalRegion);owners.set(f.properties.orphanId,set);}
   for(const i of pending){const ids=owners.get(i);assert.equal(ids?.size,1,'Isolated coastal land requires one unambiguous original source region');pieces[i].properties.regionId=[...ids][0];sourceAssigned++;}
   pending.clear();
  }
 }
 const regionFinal=processLayer('region-final',fc(pieces),['-dissolve','regionId','gap-fill-area=0','-sort','regionId']);
 const regions=regionFinal.features.map(f=>({id:f.properties.regionId,nameFr:names.get(f.properties.regionId),path:path(f.geometry)}));assert.equal(regions.length,13);
 const riverIds={Garonne:'garonne',Loire:'loire',Maas:'maas',Meuse:'maas','Rhône':'rhone',Rhone:'rhone',Rhine:'rijn',Rhin:'rijn',Seine:'seine'};
 const rivers=processLayer('rivers',prepared(source.layers.rivers.features,p=>({id:riverIds[p.name]})),['-dissolve','id','-simplify','dp','interval='+P.simplification.riverLines,'planar','-clip',box]);
 const mountainIds={ALPS:'alpen',PYRENEES:'pyreneeen',Vosges:'vogezen'};
 const mountains=processLayer('mountains',prepared(source.layers.mountains.features,p=>({id:mountainIds[p.NAME]})),['-simplify','dp','interval='+P.simplification.otherShapes,'planar','keep-shapes','-clip',countries.file]);
 const historical={elzas:['FR-67','FR-68'],dordogne:['FR-24'],provence:['FR-04','FR-13','FR-83','FR-84']};
 const historicInput=fc(Object.entries(historical).flatMap(([id,codes])=>codes.map(code=>{const f=source.layers.departments.features.find(f=>f.properties.iso_3166_2===code);assert.ok(f,code);return {type:'Feature',properties:{id},geometry:transform(f.geometry)};})));
 const historic=processLayer('historic',historicInput,['-dissolve','id','-simplify','dp','interval='+P.simplification.otherShapes,'planar','keep-shapes','-clip',canonical]);
 const shapes=new Map([...rivers.features,...mountains.features,...historic.features].map(f=>[f.properties.id,path(f.geometry)]));
 for(const [id,rid] of Object.entries({corsica:'FR-COR',bretagne:'FR-BRE',normandie:'FR-NOR'}))shapes.set(id,regions.find(r=>r.id===rid).path);
 const items=draft.items.map(item=>{
  if(item.type==='stad'){
   const f=source.layers.places.features.find(f=>f.properties.NAME===item.fr);assert.ok(f,item.id+' source point');
   const wgs84=[f.properties.LONGITUDE,f.properties.LATITUDE];assert.ok(wgs84.every(Number.isFinite),item.id+' source coordinate fields');
   return {id:item.id,type:'point',point:project(wgs84).map(round),wgs84,regionId:expected[item.id],source:{layer:'places',featureId:f.properties.NE_ID,coordinateFields:['LONGITUDE','LATITUDE']}};
  }
  if(item.type==='water'){
   const a=source.legacy.waterAnchors.find(a=>a.id===item.id),p=source.legacy.projection;assert.ok(a,item.id);
   const wgs84=[a.label[0]/p.xScale+p.longitudeOrigin,p.latitudeOrigin-a.label[1]/p.yScale];
   return {id:item.id,type:'point',point:project(wgs84).map(round),wgs84,role:'representative-label-anchor-not-hit-area',source:{layer:'legacy-derived-water-anchor',revision:source.legacy.commit}};
  }
  const d=shapes.get(item.id);assert.ok(d,item.id+' source shape');return {id:item.id,type:item.type==='rivier'?'line':'area',path:d,accuracy:item.type==='gebergte'?'generalized-physical-zone':item.id==='provence'?'four-department-educational-zone':'source-administrative-geometry',source:{layer:item.type==='rivier'?'rivers':item.type==='gebergte'?'mountains':'departments'}};
 });assert.equal(items.length,40);
 const map={schema:1,status:'draft',land:'fr',projection:'projection.json',projectionSha256:hash(read('src/lands/fr/geo/projection.json')),viewBox:P.viewBox,sourceSha256:manifest.sourceSha256,itemsDraftSha256:hash(read('src/lands/fr/items.draft.json')),outline:{id:'FRA',path:path(france.geometry)},context:countries.features.filter(f=>f.properties.id!=='FRA').map(f=>({id:f.properties.id,name:f.properties.name,path:path(f.geometry)})).sort((a,b)=>a.id.localeCompare(b.id)),regionsFile:'regions.json',items};
 writeFileSync(new URL('regions.json',dir),JSON.stringify(regions)+'\n');writeFileSync(new URL('map.json',dir),JSON.stringify(map)+'\n');
 console.log(JSON.stringify({items:items.length,cities:items.filter(i=>i.regionId).length,regions:regions.length,context:map.context.length,coastSlivers:filled,isolatedSliversAssignedByOriginalSource:sourceAssigned,mapBytes:Buffer.byteLength(JSON.stringify(map)+'\n'),regionsBytes:Buffer.byteLength(JSON.stringify(regions)+'\n'),mapSha256:hash(read('src/lands/fr/geo/map.json')),regionsSha256:hash(read('src/lands/fr/geo/regions.json'))}));
}catch(e){if(e.stderr)console.error(e.stderr.toString());throw e;}finally{rmSync(temp,{recursive:true,force:true});}
