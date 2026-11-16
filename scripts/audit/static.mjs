import fs from 'node:fs/promises';import path from 'node:path';import postcss from 'postcss';
export async function scan(root){
 const dir=path.join(root,'scripts/v3'),files=await fs.readdir(dir),tokens={},selectors=[],important=[],inline=[];
 for(const file of files.filter(n=>/\.(css|js)$/.test(n))){const text=await fs.readFile(path.join(dir,file),'utf8');
  if(file.endsWith('.js')){for(const m of text.matchAll(/(?:\.style\.[\w]+\s*=|\.style\.setProperty\(|setAttribute\(['"]style['"]|style\s*:\s*['"])[^\n;]{0,200}/g))inline.push({file,line:text.slice(0,m.index).split('\n').length,expression:m[0]});continue;}
  const ast=postcss.parse(text,{from:file});ast.walkRules(r=>selectors.push({file,line:r.source.start.line,selector:r.selector}));
  ast.walkDecls(d=>{const p=d.prop,category=/color|fill|stroke|background$/.test(p)?'colour':/radius/.test(p)?'radius':/shadow/.test(p)?'shadow':/filter/.test(p)?'blur':p==='font-size'?'fontSize':/margin|padding|gap/.test(p)?'spacing':null;
   if(category){tokens[category]??={};tokens[category][d.value]??=[];tokens[category][d.value].push(`${file}:${d.source.start.line}`);}
   if(d.important)important.push({file,line:d.source.start.line,property:p,value:d.value});});
 }
 const counts={};selectors.forEach(s=>(counts[s.selector]??=[]).push(`${s.file}:${s.line}`));
 return {tokens,selectors,important,inline,duplicateSelectors:Object.entries(counts).filter(([,v])=>v.length>1).map(([selector,sources])=>({selector,sources})),limitations:['Static token categories include expressions/shorthands; not atomic resolved colours.','Inline-JS scan finds literal assignments, not all dynamically computed styles.','Unmatched selectors are coverage candidates; pseudo/media/interactive states can be legitimate.']};
}
