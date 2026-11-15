import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import test from 'node:test';
const file=new URL('../../assets/geo/regions/regions.json',import.meta.url);
test('BL-019: twenty uniquely named Italian regions within 60 KB',()=>{
 assert.ok(existsSync(file),'build-regions.mjs must generate regions.json');
 const bytes=readFileSync(file),regions=JSON.parse(bytes);
 assert.ok(bytes.length<=60000,`${bytes.length} bytes`);
 assert.equal(regions.length,20);
 assert.equal(new Set(regions.map(r=>r.id)).size,20);
 for(const r of regions){assert.match(r.id,/^IT-\d{2}$/);assert.ok(r.nameNl&&r.nameIt);assert.match(r.path,/^M/);}
});

// Independent SVG/geometry checks: do not call the builder or Mapshaper for acceptance.
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const digest=b=>createHash('sha256').update(b).digest('hex');
const html=read('index.html').toString();
const items=JSON.parse(html.match(/const ITEMS=(\[.*?\]);/s)[1]);
const outline=html.match(/const italy="([^"]+)";/)[1];
const regions=existsSync(file)?JSON.parse(readFileSync(file)):[];
function rings(path){return [...path.matchAll(/M([^Z]+)Z/g)].map(m=>{const nums=m[1].match(/-?\d+(?:\.\d+)?/g).map(Number);return Array.from({length:nums.length/2},(_,i)=>nums.slice(i*2,i*2+2));});}
function segments(rs){return rs.flatMap(r=>r.map((p,i)=>[p,r[(i+1)%r.length]]));}
const geometry=regions.map(r=>({...r,rings:rings(r.path)})),canonical=rings(outline);
function contains(rs,[x,y]){let inside=false;for(const [a,b] of segments(rs))if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;return inside;}
function distance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}
const minDistance=(p,segs)=>Math.min(...segs.map(([a,b])=>distance(p,a,b)));
const edgeKey=(a,b)=>[a.join(','),b.join(',')].sort().join('|');
const edges=new Map();
for(const r of geometry)for(const [a,b] of segments(r.rings)){const k=edgeKey(a,b),list=edges.get(k)||[];list.push({id:r.id,a,b});edges.set(k,list);}
const exterior=[...edges.values()].filter(v=>v.length===1).map(([e])=>[e.a,e.b]);

test('pinned Natural Earth extraction, projection and canonical outline',()=>{
 const source=read('assets/geo/regions/source.geojson.gz');
 assert.equal(digest(source),'c0b1384f5a3b4c418ccfd5ef1df65f3ae383f97daffd7b3599aa94b0ed924c02');
 const fc=JSON.parse(gunzipSync(source));assert.equal(fc.features.length,110);
 assert.equal(new Set(fc.features.map(f=>f.properties.region_cod)).size,20);
 assert.equal(digest(outline),'d0ae7bbf931af162143fb2b90d39c64aed1d3e01dd9bf627740659534070db31');
 const code=read('scripts/geography/lakes.mjs').toString();assert.match(code,/55 \* longitude - 225\.5, 3830\.75 - 77 \* latitude/);
 assert.ok(read('assets/geo/regions/PROVENANCE.md').toString().includes('22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5'));
 for(const r of geometry)for(const ring of r.rings){assert.ok(ring.length>=3);for(const [x,y] of ring)assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=890&&y>=0&&y<=1235);}
});

test('shared boundaries coincide; no interior gaps, overlaps or self intersections',()=>{
 assert.ok(exterior.length>100);
 for(const es of edges.values()){
  assert.ok(es.length<=2,'edge owned by at most two regions');
  if(es.length===2){assert.notEqual(es[0].id,es[1].id);assert.deepEqual(es[0].a,es[1].b);assert.deepEqual(es[0].b,es[1].a);}
 }
 // Every scanline band between any two vertices has constant edge order unless edges cross.
 // Sample both ends and midpoint; intersections are also checked below.
 const all=geometry.flatMap(r=>segments(r.rings));
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const [a,b]=all[i],[c,d]=all[j];
  if(Math.max(a[0],b[0])<=Math.min(c[0],d[0])||Math.max(c[0],d[0])<=Math.min(a[0],b[0])||Math.max(a[1],b[1])<=Math.min(c[1],d[1])||Math.max(c[1],d[1])<=Math.min(a[1],b[1]))continue;
  const cross=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  assert.ok(!(cross(a,b,c)*cross(a,b,d)<-1e-9&&cross(c,d,a)*cross(c,d,b)<-1e-9),'polygon edges cross');
 }
 const ys=[...new Set(all.flatMap(([a])=>[a[1]]))].sort((a,b)=>a-b);
 const intervals=(segs,y)=>{const xs=segs.filter(([a,b])=>(a[1]>y)!==(b[1]>y)).map(([a,b])=>a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])).sort((a,b)=>a-b);assert.equal(xs.length%2,0);return Array.from({length:xs.length/2},(_,i)=>xs.slice(i*2,i*2+2));};
 let maxCoastError=0;
 for(let i=1;i<ys.length;i++)for(const ratio of [.001,.5,.999]){
  const y=ys[i-1]+(ys[i]-ys[i-1])*ratio;
  const spans=geometry.flatMap(r=>intervals(segments(r.rings),y)).sort((a,b)=>a[0]-b[0]);
  for(let j=1;j<spans.length;j++)assert.ok(spans[j][0]>=spans[j-1][1]-1e-6,`overlap at y=${y}`);
  const merged=[];for(const span of spans){if(merged.length&&Math.abs(span[0]-merged.at(-1)[1])<1e-6)merged.at(-1)[1]=span[1];else merged.push([...span]);}
  // Compare union with the original land mask at this y. Quantisation allows 0.02px boundary drift.
  const original=intervals(segments(canonical),y);
  const inside=(ss,x)=>ss.some(([a,b])=>x>a&&x<b);
  const cuts=[...new Set([...merged,...original].flat())].sort((a,b)=>a-b);
  for(let k=1;k<cuts.length;k++){
   const x=(cuts[k-1]+cuts[k])/2;
   if(inside(merged,x)!==inside(original,x)){
    const err=minDistance([x,y],segments(canonical));maxCoastError=Math.max(maxCoastError,err);assert.ok(err<=.03,`interior gap or land outside canonical mask ${x},${y}: ${err}`);
   }
  }
 }
 console.log(`Landmask scanline discrepancy <= ${maxCoastError.toFixed(5)} px`);
});

test('entire external boundary is within 3 px of the app Italy outline, in both directions',()=>{
 const sample=segs=>segs.flatMap(([a,b])=>{const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.5));return Array.from({length:n+1},(_,i)=>[a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n]);});
 const canonicalSegments=segments(canonical);
 const a=Math.max(...sample(exterior).map(p=>minDistance(p,canonicalSegments)));
 const b=Math.max(...sample(canonicalSegments).map(p=>minDistance(p,exterior)));
 // Distance to a closed segment set is 1-Lipschitz: half sample spacing is a conservative bound between samples.
 assert.ok(Math.max(a,b)+.25<=3,`${a},${b}`);
 console.log(`Symmetric coast distance sampled ${Math.max(a,b).toFixed(5)} px; certified upper bound ${(Math.max(a,b)+.25).toFixed(5)} px`);
});

test('all 45 ITEMS have an explicit, independently expected anchor classification',()=>{
 const mapping=JSON.parse(read('assets/geo/regions/item-regions.json'));
 assert.equal(mapping.length,45);assert.equal(new Set(mapping.map(m=>m.itemId)).size,45);
 assert.deepEqual(mapping.map(m=>m.itemId).sort(),items.map(i=>i.id).sort());
 const expected=['75','45','52','42','25','72','82','52','62','21','34','34','25','88','82','78','75','42','82','45','65','32','36'];
 const others={'area-a':'82','area-b':'88','area-c':'62','area-d':'34','area-e':'72','area-f':'82','area-g':'45','area-h':'52','water-F':'62','water-G':'45'};
 let contained=0,coastal=0,outside=0;
 for(const item of items){
  const m=mapping.find(m=>m.itemId===item.id),region=item.kind==='city'?'IT-'+expected[+item.id.slice(5)-1]:others[item.id]?'IT-'+others[item.id]:null;
  assert.equal(m.regionId,region,item.name+' expected region');
  if(region){const r=geometry.find(r=>r.id===region),p=[item.px,item.py];
   if(item.id==='city-11'){
    assert.equal(m.status,'coastal-source-exception');assert.ok(!contains(canonical,p),'Venice canonical coastline limitation is explicit');
    assert.ok(minDistance(p,segments(r.rings))<=3,'Venice remains within documented 3px coast tolerance');coastal++;
   }else{assert.equal(m.status,'contained-anchor');assert.ok(contains(r.rings,p),item.name+' must be inside '+region);contained++;}
  }else{
   assert.equal(m.status,'outside-italian-regions');assert.ok(m.reason);
   const maskHits=geometry.filter(r=>contains(r.rings,[item.px,item.py])).map(r=>r.id);
   assert.deepEqual(maskHits,item.id==='area-o'?['IT-62']:[],item.name+' expected coarse landmask relation (not sovereignty)');
   outside++;
  }
 }
 assert.equal(contained,32);assert.equal(coastal,1);assert.equal(outside,12);
 console.log('ITEMS: 32 strict anchor containments; 1 Venice coastline exception; 12 non-Italian-region items. Literal 45/45 containment is NOT claimed.');
});

test('builder reproduces the committed artifact byte for byte (opt-in --rebuild)',{skip:!process.argv.includes('--rebuild')},()=>{
 const before=digest(readFileSync(file));const result=spawnSync(process.execPath,['scripts/geography/build-regions.mjs'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);assert.equal(digest(readFileSync(file)),before);
});

test('all twenty identities are backed by independent interior witnesses from source provinces',()=>{
 const fc=JSON.parse(gunzipSync(read('assets/geo/regions/source.geojson.gz')));
 const ids=[...new Set(fc.features.map(f=>f.properties.region_cod))].sort();
 assert.deepEqual(regions.map(r=>r.id).sort(),ids);
 for(const id of ids){let witnessed=false;
  for(const f of fc.features.filter(f=>f.properties.region_cod===id)){
   const raw=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
   for(const poly of raw){
    const rs=poly.map(r=>r.map(([lon,lat])=>[55*lon-225.5,3830.75-77*lat]));
    const ys=rs[0].map(p=>p[1]),y=(Math.min(...ys)+Math.max(...ys))/2;
    const xs=segments(rs).filter(([a,b])=>(a[1]>y)!==(b[1]>y)).map(([a,b])=>a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])).sort((a,b)=>a-b);
    let width=0,p;
    for(let i=0;i<xs.length;i+=2)if(xs[i+1]-xs[i]>width){width=xs[i+1]-xs[i];p=[(xs[i]+xs[i+1])/2,y];}
    if(width<8||!contains(rs,p))continue;
    const hits=geometry.filter(r=>contains(r.rings,p));
    assert.deepEqual(hits.map(r=>r.id),[id],`independent source witness for ${id}`);witnessed=true;break;
   }
   if(witnessed)break;
  }
  assert.ok(witnessed,id+' has a reliable inland witness');
 }
});
