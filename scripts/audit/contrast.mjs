import {PNG} from 'pngjs';
const lum=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
export const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
export function contrast(before,backdrop,texts){
 const a=PNG.sync.read(before),b=PNG.sync.read(backdrop);
 return texts.map(t=>{
  const {x,y,w,h}=t.rect,fg=t.color.match(/[\d.]+/g)?.map(Number),samples=[];
  if(!fg)return {...t,status:'unknown',reason:'unsupported computed colour'};
  const uncertainOpacity=(t.paintOpacity??1)<.999||(t.fillOpacity??1)<.999;
  const alpha=fg[3]??1;
  for(let yy=Math.max(0,Math.floor(y));yy<Math.min(a.height,Math.ceil(y+h));yy++)for(let xx=Math.max(0,Math.floor(x));xx<Math.min(a.width,Math.ceil(x+w));xx++){
   const i=(yy*a.width+xx)*4,old=[...a.data.subarray(i,i+3)],bg=[...b.data.subarray(i,i+3)];
   if(Math.max(...old.map((v,j)=>Math.abs(v-bg[j])))>12)samples.push(ratio(fg.slice(0,3).map((v,j)=>v*alpha+bg[j]*(1-alpha)),bg));
  }
  samples.sort((a,b)=>a-b);const value=samples[Math.floor(samples.length*.05)],required=t.fontSize>=24||t.fontSize>=18.667&&+t.weight>=700?3:4.5;
  return {...t,samples:samples.length,ratio:value??null,required,status:t.disabled?'exempt':uncertainOpacity||!samples.length?'unknown':value+.005<required?'fail':'pass',reason:uncertainOpacity?'ancestor/fill opacity needs group compositing':!samples.length?'no painted glyph samples':null,method:'5th-percentile backdrop at changed glyph pixels; computed foreground/fill; group opacity classified unknown'};
 });
}
