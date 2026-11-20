// Minimal WebKit (WebKitGTK, the engine behind Safari) driver for QA, over WebDriver: needs WebKitWebDriver + Xvfb
// (apt: webkit2gtk-driver xvfb). webkitAvailable() is false when they are not installed; QA then runs Chromium only.
import {spawn,spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
const MB='/usr/lib/x86_64-linux-gnu/webkit2gtk-4.1/MiniBrowser';
export const webkitAvailable=()=>spawnSync('which',['WebKitWebDriver','Xvfb']).status===0&&existsSync(MB);
export async function webkit(){
 const disp=':'+(90+Math.floor(Math.random()*9)),xv=spawn('Xvfb',[disp,'-screen','0','2600x1700x24'],{stdio:'ignore'});
 const port=4444+Math.floor(Math.random()*500),d=spawn('WebKitWebDriver',['--port='+port],{stdio:'ignore',env:{...process.env,DISPLAY:disp}});
 await new Promise(r=>setTimeout(r,1500));
 const B='http://127.0.0.1:'+port,call=async(m,p,b)=>(await (await fetch(B+p,{method:m,headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined})).json()).value;
 const s=await call('POST','/session',{capabilities:{alwaysMatch:{browserName:'MiniBrowser','webkitgtk:browserOptions':{binary:MB,args:['--automation']}}}});
 if(!s?.sessionId)throw Error('WebKit session: '+JSON.stringify(s));const P='/session/'+s.sessionId;
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const api={
  goto:async u=>{await call('POST',P+'/url',{url:'about:blank'});await call('POST',P+'/url',{url:u});},
  // the window rect includes the browser chrome: grow until the viewport is exactly w×h
  viewport:async(w,h)=>{let W=w,H=h;for(let i=0;i<4;i++){await call('POST',P+'/window/rect',{width:W,height:H});await wait(200);const v=await api.eval('return [innerWidth,innerHeight]');if(v[0]===w&&v[1]===h)return;W+=w-v[0];H+=h-v[1];}},
  eval:(js,...args)=>call('POST',P+'/execute/sync',{script:js,args}),
  css:c=>api.eval('const s=document.createElement("style");s.textContent=arguments[0];document.head.append(s)',c),
  click:sel=>api.eval('const e=[...document.querySelectorAll(arguments[0])].find(e=>e.offsetParent);e&&e.click();return !!e',sel),
  shot:async()=>Buffer.from(await call('GET',P+'/screenshot'),'base64'),
  wait,close:async()=>{try{await call('DELETE',P);}catch{}d.kill();xv.kill();}};
 return api;
}
