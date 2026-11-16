import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base=new URL('../../ops/reports/audit/',import.meta.url),latest=JSON.parse(await fs.readFile(new URL('latest.json',base))),dir=new URL(latest.directory+'/',base),run=JSON.parse(await fs.readFile(new URL('run.json',dir)));
const cases=await Promise.all(run.cases.map(c=>fs.readFile(new URL('cases/'+c.id+'.json',dir),'utf8').then(JSON.parse)));
export const failures=[];
for(const c of cases.filter(c=>!process.env.AUDIT_SCREEN||process.env.AUDIT_SCREEN.split(',').includes(c.state))){const add=(rule,element,value)=>failures.push({rule,screen:c.state,viewport:c.viewport.join('x'),engine:c.engine,reduced:c.reduced,element,value});
 for(const t of c.texts)if(t.active&&t.fontSize<13)add('text-size',t.element,t.fontSize);
 for(const t of c.contrast)if(t.status==='fail')add('contrast',t.element,`${t.ratio.toFixed(2)} < ${t.required}`);
 for(const t of c.targets)if(t.rect.w<44||t.rect.h<44)add('tap-target',t.element,`${t.rect.w.toFixed(1)}×${t.rect.h.toFixed(1)}`);
 for(const t of c.overflow.filter(t=>t.rect.w>1&&t.rect.h>1&&!/SrOnly|sr-only|visually-hidden/i.test(t.element)))add('overflow',t.element,t.value);
 for(const v of c.axe.violations)if(['serious','critical'].includes(v.impact))for(const n of v.nodes)add('axe',n.target.join(' '),`${v.impact}: ${v.id}`);
 if(c.filters.length>4)add('backdrop-filter',c.filters.map(x=>x.element).join(', '),c.filters.length);
}
try{const p=JSON.parse(await fs.readFile(new URL('performance.json',dir)));if(p.heapGrowthAfter10Switches>.2)failures.push({rule:'heap-growth',screen:'tab-switches',viewport:'1080x810',element:'retained JS heap',value:p.heapGrowthAfter10Switches});}catch{}
await fs.writeFile(new URL('hard-rule-failures.json',dir),JSON.stringify(failures,null,2));
await fs.writeFile(new URL('hard-rule-failures.md',dir),'# Hard-rule failures\n\n|Screen|Viewport|Engine|Reduced|Element|Rule|Value|\n|---|---|---|---|---|---|---|\n'+failures.map(f=>`|${f.screen}|${f.viewport}|${f.engine||'chromium'}|${f.reduced??false}|${String(f.element).replaceAll('|','\\|')}|${f.rule}|${f.value}|`).join('\n'));
for(const rule of ['text-size','contrast','tap-target','overflow','axe','backdrop-filter','heap-growth'])test(rule,()=>{const f=failures.filter(x=>x.rule===rule);assert.equal(f.length,0,`${f.length} current failures; examples ${JSON.stringify(f.slice(0,3))}; full evidence hard-rule-failures.json`);});
