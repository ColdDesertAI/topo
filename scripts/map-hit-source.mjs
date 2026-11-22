import{restoreApprovedIpadUI}from'./ipad-update-source.mjs';
import{withoutFocus}from'./focus-source.mjs';
// Audit adapter: restore exactly the replaced legacy resolver, not arbitrary app changes.
// BL-028 (ARCHITECTUUR §1): a test answer gives no pizza points; this one bounded change in grade() is restored before comparing.
const EXAM_REWARD="const reward=state.mode==='exam'?{pizza:false,trip:false}:TopoLearning.award(state);";
export const restoreExamReward=html=>{const n=html.split(EXAM_REWARD).length-1;if(n!==1)throw Error(`BL-028 exam-reward change expected exactly once, found ${n}`);return html.replace(EXAM_REWARD,'const reward=TopoLearning.award(state);');};
export function restoreLegacyMapHit(html,reference){html=restoreApprovedIpadUI(withoutFocus(restoreExamReward(html)));
 const start=reference.indexOf('// Neutral location picker:'),end=reference.indexOf('// Separate 44-screen-pixel river targets',start);
 if(start<0||end<0)throw Error('Pinned baseline map resolver not found');
 const marker=/\/\/ BEGIN MAP HIT\n[\s\S]*?\/\/ END MAP HIT\n\n/;
 if(!marker.test(html))throw Error('Missing bounded map resolver change');
 return html.replace(marker,()=>reference.slice(start,end));
}
