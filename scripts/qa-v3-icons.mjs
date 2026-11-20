// BL-037.9: the targeted icon test. Build first: node scripts/build-v3-preview.mjs. Run: node scripts/qa-v3-icons.mjs
// QA_SIZES=1440x900,1080x810,810x1080 (default). Exit code 1 on any failure. Rules: see qa-v3-icons-lib.mjs.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {iconChecks} from './qa-v3-icons-lib.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const HTML=process.env.QA_HTML||'file://'+fileURLToPath(new URL('../output/html/TOPO-V3-Reis-Preview.html',import.meta.url));
const sizes=(process.env.QA_SIZES||'1440x900,1080x810,810x1080').split(',').map(x=>x.split('x').map(Number));
const cfg=JSON.parse(readFileSync(new URL('../assets/v3/landmarks/chapter-icons.json',import.meta.url),'utf8'));
const expected=Object.fromEntries(Object.entries(cfg.chapters).map(([k,v])=>[k,v.length]));
const rowsAll=[];const fails=[];const fail=(w,m)=>fails.push(w+': '+m);
const b=await chromium.launch();
for(const [W,H] of sizes){const rows=await iconChecks(b,HTML,W,H,fail,{expected});rowsAll.push([W,H,rows]);
 console.log(`${W}×${H}`,rows.filter(r=>r.where.includes('hoofdstuk')).map(r=>r.where.split(' ').pop()+' '+r.n+(r.loose?'('+r.loose+' los, min rand-rand '+r.minLoose+' px)':'')).join(' · '));}
await b.close();
if(process.env.QA_JSON)(await import('node:fs')).writeFileSync(process.env.QA_JSON,JSON.stringify(rowsAll));
if(fails.length){console.log('\nFOUTEN ('+fails.length+'):\n'+fails.join('\n'));process.exit(1);}
console.log('\nOK: iconregels gehaald');
