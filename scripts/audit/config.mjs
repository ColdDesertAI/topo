export const snapshot='5060ac771ded70c6af35aead83cc1346630703df';
export const viewports=[[1440,900],[1080,810],[810,1080],[390,844]];
export const states=['kennismaking','reis-nieuw','reis','reis-hoofdstuk','oefenen','ontdekken','aanwijzen','schrijven','feedback','feedback-fout','toets','toets-actief','toets-resultaat','beloningen','reisboekje','voortgang','instellingen'];
export async function openState(page,state,preview){
 await page.goto('about:blank');
 await page.goto(preview+'#'+(state==='kennismaking'?'welkom':state==='reis-nieuw'?'nieuw':'alles')+'/bg03');
 await page.waitForFunction(()=>window.TOPO_V3?.shell?.go,null,{timeout:20000});
 await page.waitForTimeout(700);
 await page.evaluate(()=>{document.querySelector('.v3PreviewBar')?.setAttribute('hidden','');});
 const nav={oefenen:'oefenen',toets:'toets',beloningen:'rewards',voortgang:'voortgang',instellingen:'instellingen'};
 if(nav[state])await page.evaluate(tab=>TOPO_V3.shell.go(tab),nav[state]);
 if(state==='reis-hoofdstuk'){if(await page.locator('.v3BarGo:visible').count())await page.locator('.v3BarGo:visible').first().click();else await page.locator('.v3Row[data-chapter=river]:visible,.v3Row[aria-pressed=true]:visible').first().click();}
 if(state==='reisboekje'){await page.evaluate(()=>TOPO_V3.shell.go('rewards'));await page.locator('.v3BookCover:visible').click();}
 if(['ontdekken','aanwijzen','schrijven','feedback','feedback-fout'].includes(state)){
  await page.evaluate(()=>TOPO_V3.shell.go('oefenen'));
  const form={ontdekken:'learn',aanwijzen:'point',schrijven:'write',feedback:'write','feedback-fout':'write'}[state];
  await page.locator(`[data-form="${form}"]:visible`).click();await page.locator('.v3Start:visible').click();await page.waitForTimeout(400);
  if(state.startsWith('feedback')){await page.locator('#answer').fill(state==='feedback-fout'?'Fout':await page.evaluate(()=>window.state?.current?.name||state.current.name));await page.locator('#answer').press('Enter');}
 }
 if(['toets-actief','toets-resultaat'].includes(state)){
  await page.evaluate(()=>TOPO_V3.shell.go('toets'));
  await page.locator('[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]').click();
  await page.locator('[aria-labelledby=v3ToetsLengte] [data-value="10"]').click();
  await page.locator('.v3View-toets .v3Start').click();await page.waitForTimeout(300);
  if(state==='toets-resultaat')for(let n=0;n<10;n++){
   const q=await page.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
   if(q.mode==='write'){await page.locator('#answer').fill(n===2?'Fout':q.name);await page.locator('#answer').press('Enter');}
   else await page.locator(`#map [data-id="${q.id}"][tabindex="0"]`).first().press('Enter');
   await page.waitForTimeout(90);await page.locator('#next').click();await page.waitForTimeout(90);
  }
 }
 await page.evaluate(()=>document.activeElement?.blur?.());await page.waitForTimeout(450);
}
