import test from 'node:test';
import assert from 'node:assert/strict';
import {boot,startExam,finishExam,NOW,PROFILE,plain} from './support.mjs';
const KEYS=['topo-italie-v3','topo-nino-intro-v1','topo-nino-profile-v1','topo-v3-toetsen-v1','topoV3PostSeen'];
const keys=value=>Object.keys(value).sort();

test('persisted key names and exact progress, route, daily, profile and exam schemas',async t=>{
 const a=await boot(t);await startExam(a,{form:'write'});await finishExam(a);
 assert.deepEqual(keys(a.storage()),KEYS);
 const progress=JSON.parse(a.w.localStorage.getItem(KEYS[0]));
 assert.deepEqual(keys(progress),['daily','good','mistakes','pizzas','route','schema','slices','trips']);
 assert.equal(progress.schema,3);assert.equal(progress.route.schema,2);
 assert.deepEqual(keys(progress.route),['active','chapters','items','rewardTokens','schema']);
 assert.deepEqual(keys(progress.daily),['correct','date']);assert.deepEqual(progress.daily,{date:'2026-11-10',correct:2});
 assert.deepEqual(JSON.parse(a.w.localStorage.getItem('topo-nino-profile-v1')),PROFILE);
 assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),'done');
 assert.deepEqual(JSON.parse(a.w.localStorage.getItem('topoV3PostSeen')),[],'postcard read state is an unversioned ID array');
 const exams=JSON.parse(a.w.localStorage.getItem('topo-v3-toetsen-v1'));
 assert.deepEqual(keys(exams),['results','schema']);assert.equal(exams.schema,1);
 assert.deepEqual(keys(exams.results[0]),['at','chapters','correct','form','items','length','total']);
 assert.equal(exams.results[0].at,'2026-11-10T12:00:00.000Z');
 const backup=a.exportBackup();assert.deepEqual(keys(backup),['app','profile','progress','savedAt','v3Toetsen','version']);
 assert.deepEqual([backup.app,backup.version,backup.savedAt],['topo-italie',1,new Date(NOW).toISOString()]);
 const b=await boot(t,{storage:a.storage()});assert.deepEqual(b.storage(),a.storage(),'reload preserves the serialized schema');
});

test('pizza reset clears only pizza/slice/trip counters, not lifetime points, route tokens, mistakes, profile or results',async t=>{
 const a=await boot(t);await startExam(a);await finishExam(a);
 a.ev("Object.assign(state,{good:25,pizzas:3,slices:1,trips:1,mistakes:['city-1']});sync()");
 const before=a.json('progressSnapshot()'),profile=a.w.localStorage.getItem('topo-nino-profile-v1'),results=a.w.localStorage.getItem('topo-v3-toetsen-v1');
 a.q('#resetPizza').click();await a.flush();
 assert.deepEqual(a.json('progressSnapshot()'),{...before,pizzas:0,slices:0,trips:0});
 assert.equal(a.w.localStorage.getItem('topo-nino-profile-v1'),profile);assert.equal(a.w.localStorage.getItem('topo-v3-toetsen-v1'),results);
 const b=await boot(t,{storage:a.storage()});assert.deepEqual(b.json('progressSnapshot()'),{...before,pizzas:0,slices:0,trips:0});
});

test('cancelled pizza, progress and full resets preserve every persisted key and active progress',async t=>{
 const a=await boot(t,{storage:{'unrelated-app':'keep'}});await startExam(a);await finishExam(a);
 a.ev('Object.assign(state,{good:25,pizzas:3,slices:1,trips:1});sync()');
 a.w.confirm=()=>false;
 const before=a.json('progressSnapshot()'),store=a.storage();
 for(const selector of ['#resetPizza','#resetAll','.ninoResetDanger']){
  a.q(selector).click();await a.flush();assert.deepEqual(a.json('progressSnapshot()'),before,selector);assert.deepEqual(a.storage(),store,selector);
 }
});

test('observed reset scope: unrelated storage and legacy v2 key survive; zeroed v3 save takes precedence',async t=>{
 const a=await boot(t,{storage:{'unrelated-app':'keep','topo-italie-v2':{good:10,pizzas:1,pizzaSteps:0,mistakes:[]}}});
 const legacy=a.w.localStorage.getItem('topo-italie-v2');
 a.q('#resetAll').click();await a.flush();assert.equal(a.w.localStorage.getItem('unrelated-app'),'keep');
 a.expectReload();a.q('.ninoResetDanger').click();await a.flush();
 assert.equal(a.w.localStorage.getItem('unrelated-app'),'keep');assert.equal(a.w.localStorage.getItem('topo-italie-v2'),legacy,'observed behavior: the legacy key is not removed');
 for(const key of ['topo-nino-profile-v1','topo-nino-intro-v1','topo-v3-toetsen-v1'])assert.equal(a.w.localStorage.getItem(key),null,key);
 assert.equal(a.reloads(),1);
 const b=await boot(t,{storage:{...a.storage(),'topo-nino-profile-v1':null,'topo-nino-intro-v1':null}});
 assert.deepEqual(b.json('[state.good,state.pizzas,state.slices,state.trips]'),[0,0,0,0],'the reset v3 save prevents legacy resurrection');
});

test('bad backup envelopes, invalid profile and corrupt route are rejected before confirmation and without partial writes',async t=>{
 const a=await boot(t);await startExam(a);await finishExam(a);
 const original=a.exportBackup(),before=a.json('progressSnapshot()'),stored=a.storage();let confirmations=0;
 a.w.confirm=()=>{confirmations++;return true;};
 const mutations=[d=>d.app='other',d=>d.version=2,d=>d.progress.schema=4,d=>d.progress.slices=8,d=>d.progress.trips=99,d=>d.progress.good=-1,d=>d.profile.schema=2,d=>d.progress.route.schema=99];
 for(const mutate of mutations){const copy=structuredClone(original);mutate(copy);await a.importBackup(copy);
  assert.match(a.q('#backupStatus').textContent,/Terugzetten lukte niet/);assert.deepEqual(a.json('progressSnapshot()'),before);assert.deepEqual(a.storage(),stored);
 }
 assert.equal(confirmations,0,'validation precedes destructive confirmation');
 assert.deepEqual(plain(a.w.TopoProfile.current()),PROFILE);
});

test('fixed clock and seed control Date, performance, timers and random values across independent boots',async t=>{
 const a=await boot(t,{v3:false}),b=await boot(t,{v3:false});
 const random=x=>[x.w.Math.random(),x.w.Math.random(),...x.w.crypto.getRandomValues(new x.w.Uint32Array(3))];
 assert.deepEqual(random(a),random(b));assert.equal(a.w.Date.now(),NOW);assert.equal(a.w.performance.now(),0);
 const events=[];a.w.setTimeout(()=>events.push(a.w.Date.now()),20);
 a.clock.advance(19);assert.deepEqual(events,[]);a.clock.advance(1);assert.deepEqual(events,[NOW+20]);
 const interval=a.w.setInterval(()=>events.push(a.w.Date.now()),5);a.clock.advance(15);a.w.clearInterval(interval);a.clock.advance(20);
 assert.deepEqual(events,[NOW+20,NOW+25,NOW+30,NOW+35]);assert.equal(a.w.performance.now(),55);assert.equal(b.w.Date.now(),NOW);
});
