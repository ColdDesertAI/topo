// DOM measurements run in the browser. No app state or source is changed.
export function probe(){
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
 const label=e=>e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+[...e.classList].slice(0,3).join('.');
 const visible=e=>{if(!e.getClientRects().length||e.closest('.v3PreviewBar,[hidden]'))return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.visibility==='visible'&&+s.opacity>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth};
 const modal=[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility==='visible'}).at(-1);
 const active=e=>!modal||modal.contains(e);
 const texts=[],targets=[],overflow=[],filters=[],variants=[],images=[];
 const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walk.nextNode()){
  const n=walk.currentNode,e=n.parentElement,t=n.textContent.trim();if(!t||!e||/^(SCRIPT|STYLE|NOSCRIPT)$/.test(e.tagName)||!visible(e))continue;
  const range=document.createRange();range.selectNodeContents(n);const r=range.getBoundingClientRect();if(r.width<1||r.height<1||r.bottom<0||r.top>innerHeight)continue;
  let left=Math.max(0,r.left),right=Math.min(innerWidth,r.right),top=Math.max(0,r.top),bottom=Math.min(innerHeight,r.bottom);
  for(let a=e;a;a=a.parentElement){const cs=getComputedStyle(a),q=a.getBoundingClientRect();if(cs.clip!=='auto'&&cs.clip!=='none'){const ns=cs.clip.match(/[-\d.]+/g)?.map(Number);if(ns?.length===4&&(ns[2]<=ns[0]||ns[1]<=ns[3]))right=left;}if(cs.clipPath==='inset(50%)')right=left;
   if(q.width<=1&&q.height<=1&&/hidden|clip/.test(cs.overflowX+cs.overflowY)){right=left}
   // Fixed descendants can escape overflow clipping; actual painted visibility is resolved from glyph screenshot differences.
  }
  if(right-left<1||bottom-top<1)continue;
  const s=getComputedStyle(e),ctm=e instanceof SVGElement?e.getScreenCTM?.():null,scale=ctm?Math.sqrt(Math.abs(ctm.a*ctm.d-ctm.b*ctm.c)):1;
  let clipped=false;for(let a=e.parentElement;a;a=a.parentElement){const cs=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(cs.overflowX+cs.overflowY)){const q=a.getBoundingClientRect();if(r.left<q.left-1||r.right>q.right+1||r.top<q.top-1||r.bottom>q.bottom+1)clipped=true;}}
  if(getComputedStyle(e).clipPath==='inset(50%)'||r.width<=1&&r.height<=1)continue;
  let paintOpacity=1;for(let a=e;a;a=a.parentElement)paintOpacity*=Number(getComputedStyle(a).opacity);
  const id=texts.length;e.setAttribute('data-audit-text',String(id));
  texts.push({id,clipped,element:label(e),text:t,words:t.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length||0,fontSize:parseFloat(s.fontSize)*scale,weight:s.fontWeight,color:e instanceof SVGElement?s.fill:s.color,paintOpacity,fillOpacity:e instanceof SVGElement?Number(s.fillOpacity):1,disabled:!active(e)||!!e.closest(':disabled,[inert]'),active:active(e),rect:{x:r.x,y:r.y,w:r.width,h:r.height}});
 }
 for(const e of document.querySelectorAll('body *')){
  if(!visible(e))continue;const s=getComputedStyle(e),r=rect(e),name=label(e);
  if(active(e)&&r.w>1&&r.h>1&&!/SrOnly|sr-only|visually-hidden/i.test(name)&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+1&&!['auto','scroll'].includes(s.overflowX))overflow.push({element:name,value:`${e.scrollWidth}>${e.clientWidth}`,rect:r});
  for(const pseudo of [null,'::before','::after',...(e.matches('dialog[open]')?['::backdrop']:[])]){const p=pseudo?getComputedStyle(e,pseudo):s,b=p.backdropFilter||p.webkitBackdropFilter;if(b&&b!=='none'&&(!pseudo||pseudo==='::backdrop'||!['none','normal'].includes(p.content)))filters.push({element:name+(pseudo||''),value:b});}
  if(active(e)&&e.matches('button,a[href],input:not([type=hidden]),select,textarea,[role=button],[tabindex="0"]'))targets.push({element:name,name:e.getAttribute('aria-label')||e.innerText?.trim()||e.getAttribute('title')||e.getAttribute('placeholder')||'',rect:r,disabled:!!e.disabled});
  const cls=String(e.className?.baseVal??e.className);const type=e.matches('button,[role=button]')?'button':/chip|pill/i.test(cls)?'pill':/row|listitem/i.test(cls)?'row':/panel|card|plate/i.test(cls)?'panel':null;
  if(type&&active(e))variants.push({type,element:name,styles:Object.fromEntries(['backgroundColor','backdropFilter','border','borderRadius','boxShadow','padding','fontSize','fontWeight'].map(k=>[k,s[k]]))});
  if(e instanceof HTMLImageElement)images.push({element:name,width:e.naturalWidth,height:e.naturalHeight,bytes:e.naturalWidth*e.naturalHeight*4,source:e.currentSrc.startsWith('data:')?'embedded':e.currentSrc});
 }
 const overlaps=[];for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i].rect,b=texts[j].rect,w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(w>3&&h>3)overlaps.push([i,j,Math.round(w*h)]);}
 const closeTargets=[];for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){const a=targets[i].rect,b=targets[j].rect,dx=Math.max(0,a.x-b.x-b.w,b.x-a.x-a.w),dy=Math.max(0,a.y-b.y-b.h,b.y-a.y-a.h);if(Math.hypot(dx,dy)<8)closeTargets.push([i,j]);}
 return {backdropPseudoAudited:true,texts,activeWords:texts.filter(t=>t.active).reduce((n,t)=>n+t.words,0),words:texts.reduce((n,t)=>n+t.words,0),minFontSize:Math.min(...texts.map(t=>t.fontSize)),targets,closeTargets,overflow,filters,variants,images,decodedImageBytes:images.reduce((n,i)=>n+i.bytes,0),domNodes:document.querySelectorAll('*').length,overlaps};
}
export function hideGlyphs(){window.__auditRestore=[];for(const e of document.querySelectorAll('[data-audit-text]')){window.__auditRestore.push([e,e.getAttribute('style')]);e.style.setProperty('-webkit-text-fill-color','transparent','important');e.style.setProperty('text-shadow','none','important');if(e instanceof SVGElement){e.style.setProperty('fill','transparent','important');e.style.setProperty('stroke','transparent','important');}}}
export function restoreGlyphs(){for(const [e,s]of window.__auditRestore||[])s===null?e.removeAttribute('style'):e.setAttribute('style',s);delete window.__auditRestore;}
