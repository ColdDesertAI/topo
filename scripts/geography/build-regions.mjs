/** BL-019. Build-time GIS only; no app files are written. See PROVENANCE.md. */
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {hash,project} from './lakes.mjs';
const root=new URL('../../',import.meta.url),dir=new URL('assets/geo/regions/',root);
const read=p=>readFileSync(new URL(p,root));
const source=read('assets/geo/regions/source.geojson.gz');
if(hash(source)!=='c0b1384f5a3b4c418ccfd5ef1df65f3ae383f97daffd7b3599aa94b0ed924c02')throw Error('Pinned source digest differs');
const fc=JSON.parse(gunzipSync(source));
const verifyIndex=process.argv.indexOf('--verify-upstream');
if(verifyIndex!==-1){
 const upstream=readFileSync(process.argv[verifyIndex+1]);
 if(hash(upstream)!=='22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5')throw Error('Upstream source digest differs');
 const features=JSON.parse(upstream).features.filter(f=>f.properties.adm0_a3==='ITA').map(f=>({type:'Feature',properties:Object.fromEntries(['adm1_code','region_cod','region'].map(k=>[k,f.properties[k]])),geometry:f.geometry}));
 if(JSON.stringify(features)!==JSON.stringify(fc.features))throw Error('Source extraction differs from upstream Italy features');
 console.log('Upstream SHA256 and all 110 unmodified source geometries verified');
}
const html=read('index.html').toString(),outline=html.match(/const italy="([^"]+)";/)?.[1];
if(!outline)throw Error('Canonical Italy path missing');
const pathRings=path=>[...path.matchAll(/M([^Z]+)Z/g)].map(m=>{const n=m[1].match(/-?\d+(?:\.\d+)?/g).map(Number);return Array.from({length:n.length/2},(_,i)=>n.slice(i*2,i*2+2));});
const ringClose=r=>r.length&&r[0].join()===r.at(-1).join()?r:[...r,r[0]];
const polyRings=g=>g.type==='Polygon'?g.coordinates:g.coordinates.flat();
const names={21:['Piemonte','Piëmont'],23:["Valle d’Aosta",'Valle d’Aosta'],25:['Lombardia','Lombardije'],32:['Trentino-Alto Adige','Trentino-Zuid-Tirol'],34:['Veneto','Veneto'],36:['Friuli-Venezia Giulia','Friuli-Venezia Giulia'],42:['Liguria','Ligurië'],45:['Emilia-Romagna','Emilia-Romagna'],52:['Toscana','Toscane'],55:['Umbria','Umbrië'],57:['Marche','Marche'],62:['Lazio','Lazio'],65:['Abruzzo','Abruzzen'],67:['Molise','Molise'],72:['Campania','Campanië'],75:['Puglia','Apulië'],77:['Basilicata','Basilicata'],78:['Calabria','Calabrië'],82:['Sicilia','Sicilië'],88:['Sardegna','Sardinië']};
function projected(g){return g.type==='Polygon'?{...g,coordinates:g.coordinates.map(r=>r.map(project))}:{...g,coordinates:g.coordinates.map(p=>p.map(r=>r.map(project)))};}
const key=p=>p.map(n=>n.toFixed(6)).join(',');
const edgeKey=(a,b)=>[key(a),key(b)].sort().join('|');
const temp=mkdtempSync(join(tmpdir(),'topo-regions-'));
const json=(name,value)=>{const p=join(temp,name);writeFileSync(p,JSON.stringify(value));return p;};
const ms=(...args)=>execFileSync('npx',['--yes','mapshaper@0.7.101',...args],{stdio:['ignore','ignore','pipe'],maxBuffer:8e6});
try{
 const input=json('provinces.json',{...fc,features:fc.features.map(f=>({...f,geometry:projected(f.geometry)}))});
 const landRings=pathRings(outline), signedArea=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2;
 const canonicalPolygons=landRings.filter(r=>signedArea(r)>0).map(r=>[ringClose(r)]);
 // Preserve the canonical San Marino hole (opposite winding); it is not an Italian island.
 for(const hole of landRings.filter(r=>signedArea(r)<0))canonicalPolygons[0].push(ringClose(hole));
 const italy=json('italy.json',{type:'FeatureCollection',features:[{type:'Feature',properties:{canonical:true},geometry:{type:'MultiPolygon',coordinates:canonicalPolygons}}]});
 const dissolved=join(temp,'regions.geojson');
 // A single topological dataset: shared arcs are simplified once, not once per region.
 ms('-i',input,'-dissolve','region_cod','-simplify','dp','interval=0.35','planar','keep-shapes','-o',dissolved,'format=geojson');
 const overlay=join(temp,'overlay.geojson');
 ms('-i',dissolved,italy,'combine-files','-union','target=*','-filter','canonical === true','-explode','-o',overlay,'format=geojson');
 const pieces=JSON.parse(readFileSync(overlay)).features;
 // Reconcile the 10m source with the app's 50m coastline, without changing either app geometry or coordinates.
 // Assign uncovered overlay faces by longest shared boundary; never guess ownership of isolated islands.
 const edges=new Map();
 for(let i=0;i<pieces.length;i++)for(const r of polyRings(pieces[i].geometry))for(let j=1;j<r.length;j++){
  const k=edgeKey(r[j-1],r[j]),e=edges.get(k)||[];e.push({i,len:Math.hypot(r[j][0]-r[j-1][0],r[j][1]-r[j-1][1])});edges.set(k,e);
 }
 const pending=new Set(pieces.flatMap((p,i)=>p.properties.region_cod?[]:[i]));
 let byShared=0;
 while(pending.size){let changed=false;
  for(const i of pending){const weights=new Map();
   for(const r of polyRings(pieces[i].geometry))for(let j=1;j<r.length;j++)for(const e of edges.get(edgeKey(r[j-1],r[j]))||[]){const id=pieces[e.i].properties.region_cod;if(id&&e.i!==i)weights.set(id,(weights.get(id)||0)+e.len);}
   if(weights.size){pieces[i].properties.region_cod=[...weights].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0];pending.delete(i);changed=true;byShared++;}
  }
  if(changed)continue;
  throw Error('Uncovered isolated land has no source-backed neighbouring region: '+[...pending].join(','));
 }
 const filled=json('filled.json',{type:'FeatureCollection',features:pieces});
 const output=join(temp,'final.geojson');
 ms('-i',filled,'-dissolve','region_cod','gap-fill-area=0','-sort','region_cod','-o',output,'format=geojson','precision=0.01');
 const final=JSON.parse(readFileSync(output)).features.map(f=>{
  const id=f.properties.region_cod,[nameIt,nameNl]=names[id.slice(3)];
  const path=polyRings(f.geometry).map(r=>r.slice(0,-1).map((p,i)=>(i?'L':'M')+p.join(' ')).join('')+'Z').join('');
  return{id,nameNl,nameIt,path};
 });
 const bytes=JSON.stringify(final)+'\n';
 if(final.length!==20||Buffer.byteLength(bytes)>60000)throw Error(`Contract: ${final.length} regions, ${Buffer.byteLength(bytes)} bytes`);
 writeFileSync(new URL('regions.json',dir),bytes);
 console.log(JSON.stringify({regions:final.length,bytes:Buffer.byteLength(bytes),sha256:hash(bytes),coastReconciliation:{byShared},canonicalOutlineSha256:hash(outline)}));
}catch(e){if(e.stderr)console.error(e.stderr.toString());throw e;}finally{rmSync(temp,{recursive:true,force:true});}
