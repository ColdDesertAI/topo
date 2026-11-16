// Estimate decoded raster surfaces, including CSS backgrounds and SVG <image>.
// This estimates dimensions, not actual browser/GPU allocations or cache residency.
export async function imageFootprint(){
 const refs=new Map();const add=(src,kind)=>{if(!src||src.startsWith('#'))return;const r=refs.get(src)||{kinds:[],instances:0};r.kinds.push(kind);r.instances++;refs.set(src,r)};
 for(const e of document.querySelectorAll('*')){const r=e.getBoundingClientRect(),s=getComputedStyle(e);if(!r.width||!r.height||r.bottom<0||r.top>innerHeight||s.visibility!=='visible')continue;
  if(e instanceof HTMLImageElement)add(e.currentSrc,'img');
  if(e instanceof SVGImageElement)add(e.href.baseVal,'svg-image');
  for(const pseudo of [null,'::before','::after']){const cs=pseudo?getComputedStyle(e,pseudo):s;if(pseudo&&['none','normal'].includes(cs.content))continue;for(const m of cs.backgroundImage.matchAll(/url\(["']?(.+?)["']?\)/g))add(m[1],'css'+(pseudo||''));}
 }
 const images=[];for(const [src,ref]of refs){try{const img=new Image();img.src=src;await img.decode();images.push({kinds:[...new Set(ref.kinds)],instances:ref.instances,width:img.naturalWidth,height:img.naturalHeight,bytes:img.naturalWidth*img.naturalHeight*4});}catch{images.push({kinds:[...new Set(ref.kinds)],instances:ref.instances,unknown:true});}}
 return {method:'visible raster references incl. SVG image and CSS pseudo backgrounds, deduplicated by exact URL, estimated naturalWidth×naturalHeight×4; excludes vector/GPU/internal cache allocations',uniqueBytes:images.reduce((n,i)=>n+(i.bytes||0),0),instanceBytes:images.reduce((n,i)=>n+(i.bytes||0)*i.instances,0),images};
}
