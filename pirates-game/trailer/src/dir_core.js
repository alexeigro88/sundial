'use strict';
/* Director core: deterministic frame runner + 2D overlay kit. 1920x1080 @ 30fps, 120 BPM (beat = 15 frames). */
const G=window.__game,T=G.T,P=G.P,ISL=G.ISL,MONS=G.MONS,SHIPS=G.SHIPS,SHARKS=G.SHARKS,BARRELS=G.BARRELS,PR=G.PR;
const W=1920,H=1080,FPS=30,TAU=Math.PI*2;
const PAPER='#fbfaf4',INK='#4a4a52',BLUE='#2f66c2',RED='#d63b2f',SUN='#f6cf3a',ORANGE='#ff9a1f',GREEN='#8cc152',SEA='#6faee3',PINK='#ff8fd8',CYAN='#7fe9ff',DARK='#1f1a33';
const glc=document.getElementById('gl');
const ov=document.createElement('canvas');ov.width=W;ov.height=H;ov.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:50;pointer-events:none';
document.getElementById('app').appendChild(ov);
const X=ov.getContext('2d');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,rm=(f,a,b)=>clamp((f-a)/(b-a));
const E={out3:t=>1-Math.pow(1-t,3),in3:t=>t*t*t,io3:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  outBack:(t,s=1.9)=>1+(s+1)*Math.pow(t-1,3)+s*Math.pow(t-1,2),inExpo:t=>t<=0?0:Math.pow(2,10*t-10),outExpo:t=>t>=1?1:1-Math.pow(2,-10*t),
  io5:t=>t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2,out5:t=>1-Math.pow(1-t,5)};
const h2=(a,b=0)=>{const x=Math.sin(a*127.1+b*311.7+.5)*43758.5453;return x-Math.floor(x);};
const AM=s=>`700 ${s}px "Amatic SC","Neucha",cursive`,NE=s=>`${s}px "Neucha",cursive`;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};

/* ---------- event log for sound design ---------- */
const LOG=[];let CUR=0,LOGGING=false,EVhit=-99,MUTE_EV=false;
const logEv=(n,extra)=>{if(LOGGING&&!MUTE_EV)LOG.push([n,CUR,extra||0]);};
['jump','swing','hit','ouch','coin','splash','zap','win'].forEach(n=>{G.sfx[n]=()=>{logEv(n);if(n==='hit'&&!MUTE_EV)EVhit=CUR;};});

/* ---------- camera / projection ---------- */
const _v=new T.Vector3();
function setCam(c,p,t,up,fov){c.fov=fov||50;c.aspect=W/H;c.updateProjectionMatrix();c.up.set(up?up[0]:0,up?up[1]:1,up?up[2]:0);c.position.set(p[0],p[1],p[2]);c.lookAt(t[0],t[1],t[2]);
  c.updateMatrixWorld(true);c.matrixWorldInverse.copy(c.matrixWorld).invert();}
function proj(x,y,z){_v.set(x,y,z).project(G.cam);return [(_v.x+1)/2*W,(1-_v.y)/2*H,_v.z];}
const v3l=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];

/* ---------- overlay kit ---------- */
const grc=mk(W,H);grc.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:60;pointer-events:none;mix-blend-mode:multiply';document.getElementById('app').appendChild(grc);const GX=grc.getContext('2d');
const NOISE=[0,1,2].map(k=>{const cv=mk(256,256),x=cv.getContext('2d'),d=x.createImageData(256,256);for(let i=0;i<65536;i++){const v=233+h2(i,k*7+1)*22|0;d.data[i*4]=v;d.data[i*4+1]=v-1;d.data[i*4+2]=v-4;d.data[i*4+3]=255;}x.putImageData(d,0,0);return cv;});
function grain(F,dark){const ctx=GX,n=NOISE[Math.floor(F/2)%3],ox=(Math.floor(F/2)*97)%256,oy=(Math.floor(F/2)*53)%256;ctx.save();ctx.fillStyle=ctx.createPattern(n,'repeat');ctx.translate(-ox,-oy);ctx.fillRect(ox,oy,W,H);ctx.restore();
  const g=ctx.createRadialGradient(W/2,H/2,H*.55,W/2,H/2,H*1.12);g.addColorStop(0,'rgba(60,48,40,0)');g.addColorStop(1,dark?'rgba(0,0,0,.5)':'rgba(70,52,38,.22)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
/* crayon zigzag fill of a rect; prog reveals it stroke by stroke */
function zig(ctx,x,y,w,h,col,seed,prog,lw,alpha){prog=prog==null?1:prog;if(prog<=0)return;lw=lw||18;const rows=Math.max(2,Math.ceil(h/(lw*.62))),tot=rows*prog;
  ctx.save();ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha*=alpha==null?.92:alpha;ctx.beginPath();
  for(let i=0;i<=Math.ceil(tot);i++){const u=i/rows,yy=y+u*h+(h2(seed,i)-.5)*lw*.5,side=i%2;let xx=side?x+w+(h2(seed+3,i)-.3)*lw:x-(h2(seed+5,i)-.3)*lw;
    if(i>tot){const pi=i-1,pu=pi/rows,py=y+pu*h+(h2(seed,pi)-.5)*lw*.5,ps=pi%2,px=ps?x+w+(h2(seed+3,pi)-.3)*lw:x-(h2(seed+5,pi)-.3)*lw,k=tot-pi;xx=px+(xx-px)*k;ctx.lineTo(xx,py+(yy-py)*k);break;}
    if(i)ctx.lineTo(xx,yy);else ctx.moveTo(xx,yy);}
  ctx.stroke();ctx.restore();}
/* full-screen crayon wipe: p 0..1 covers left->right, 1..2 uncovers */
function wipe(ctx,p,col,seed){if(p<=0||p>=2)return;const n=22,lw=190,a=p<=1?0:(p-1)*n,b=p<=1?p*n:n;ctx.save();ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();let st=false;
  const pt=i=>[-140+i*(W+280)/n+(h2(seed,i)-.5)*60,i%2?H+160:-160];
  for(let i=Math.floor(a);i<=Math.ceil(b);i++){let q=pt(i);if(i<a){const q2=pt(i+1),k=a-i;q=[q[0]+(q2[0]-q[0])*k,q[1]+(q2[1]-q[1])*k];}if(i>b){const q0=pt(i-1),k=b-(i-1);q=[q0[0]+(q[0]-q0[0])*k,q0[1]+(q[1]-q0[1])*k];}
    if(st)ctx.lineTo(q[0],q[1]);else{ctx.moveTo(q[0],q[1]);st=true;}}
  ctx.stroke();ctx.restore();}
/* kinetic word: letters drop in with overshoot, crayon block behind, boil on twos */
function kword(ctx,txt,x,y,size,lt,o){o=o||{};if(lt<0)return;const F=CUR,ls=size*(o.ls==null?.05:o.ls);ctx.save();ctx.font=AM(size);ctx.textBaseline='alphabetic';
  const ws=[...txt].map(ch=>ctx.measureText(ch).width+ls),tw=ws.reduce((a,b)=>a+b,0)-ls;let x0=o.align==='left'?x:o.align==='right'?x-tw:x-tw/2;
  const out=o.out==null?-1:o.out,sy=out>=0?1-E.in3(clamp(out/3)):1;if(sy<=0){ctx.restore();return;}
  ctx.translate(x0+tw/2,y);ctx.rotate((o.rot||0)+(h2(Math.floor(F/3),7)-.5)*.012);ctx.scale(1+(1-sy)*.5,sy);ctx.translate(-(x0+tw/2),-y);
  if(o.block){const pad=size*.14;zig(ctx,x0-pad,y-size*.84,tw+pad*2,size*1.0,o.block,(o.seed||1)+Math.floor(F/2)*3,E.out3(clamp(lt/4)),size*.2,o.balpha);}
  let cx=x0;[...txt].forEach((ch,i)=>{const tl=lt-i*(o.st==null?1:o.st),w=ws[i]-ls;if(tl>=0&&ch!==' '){const s=1+(1-E.outBack(clamp(tl/5)))*.9,dy=-(1-E.out3(clamp(tl/4)))*size*.28,r=(h2(i,Math.floor(F/3))-.5)*.05;
      ctx.save();ctx.translate(cx+w/2,y+dy);ctx.rotate(r);ctx.scale(s,s);ctx.textAlign='center';ctx.lineJoin='round';
      if(o.shadow!==false){ctx.fillStyle=o.shadowCol||'rgba(40,40,60,.22)';ctx.fillText(ch,size*.035,size*.045);}
      ctx.strokeStyle=o.stroke||PAPER;ctx.lineWidth=size*(o.sw==null?.1:o.sw);ctx.strokeText(ch,0,0);ctx.fillStyle=o.color||INK;ctx.fillText(ch,0,0);ctx.restore();}
    cx+=ws[i];});
  ctx.restore();return tw;}
/* plain handwritten text with left-to-right write-on */
function hand(ctx,txt,x,y,size,prog,col,font){ctx.save();ctx.font=(font||NE)(size);ctx.textBaseline='alphabetic';const tw=ctx.measureText(txt).width;ctx.beginPath();ctx.rect(x-10,y-size*1.2,(tw+20)*clamp(prog),size*1.7);ctx.clip();ctx.fillStyle=col||INK;ctx.fillText(txt,x,y);ctx.restore();return tw;}
/* anime-style speed lines converging on a point */
function speedLines(ctx,cx,cy,seed,col,inner){ctx.save();ctx.fillStyle=col||'#16161c';const n=54;for(let i=0;i<n;i++){const a=i/n*TAU+(h2(seed,i)-.5)*.14,wd=.01+h2(seed+9,i)*.04,r0=(inner||300)*(.8+h2(seed+4,i)*.9),r1=1500;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0*.72);ctx.lineTo(cx+Math.cos(a-wd)*r1,cy+Math.sin(a-wd)*r1);ctx.lineTo(cx+Math.cos(a+wd)*r1,cy+Math.sin(a+wd)*r1);ctx.closePath();ctx.fill();}ctx.restore();}
/* jagged comic burst like the SHOP DEVIL sign */
function burstPath(ctx,cx,cy,rx,ry,n,seed,k){ctx.beginPath();for(let i=0;i<n*2;i++){const a=i/(n*2)*TAU-1.57,r=i%2?1:(k||.74)+(h2(seed,i)-.5)*.06;ctx[i?'lineTo':'moveTo'](cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r);}ctx.closePath();}
function burst(ctx,cx,cy,rx,ry,seed,cols){cols=cols||[RED,ORANGE,'#ffe838'];[1,.9,.78].forEach((s,i)=>{burstPath(ctx,cx,cy,rx*s,ry*s,13,seed);ctx.fillStyle=cols[i];ctx.fill();});}
/* pencil-line polyline with double jittered pass; frac draws only the first part */
function pline(ctx,pts,frac,seed,lw,col,jit){frac=frac==null?1:frac;if(frac<=0)return null;let tot=0;const L=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  const lim=tot*frac;let head=pts[0];ctx.save();ctx.strokeStyle=col||INK;ctx.lineWidth=lw||3;ctx.lineCap='round';ctx.lineJoin='round';
  for(let k=0;k<2;k++){ctx.beginPath();let acc=0;const j=(jit==null?1.6:jit);ctx.moveTo(pts[0][0]+(h2(seed+k,0)-.5)*j,pts[0][1]+(h2(seed+k,50)-.5)*j);
    for(let i=1;i<pts.length;i++){let q=pts[i];if(acc+L[i-1]>lim){const u=(lim-acc)/L[i-1];q=[pts[i-1][0]+(q[0]-pts[i-1][0])*u,pts[i-1][1]+(q[1]-pts[i-1][1])*u];head=q;ctx.lineTo(q[0]+(h2(seed+k,i)-.5)*j,q[1]+(h2(seed+k,i+50)-.5)*j);break;}
      head=q;ctx.lineTo(q[0]+(h2(seed+k,i)-.5)*j,q[1]+(h2(seed+k,i+50)-.5)*j);acc+=L[i-1];}
    ctx.stroke();}ctx.restore();return head;}
function arrow(ctx,pts,frac,seed,lw,col){const hd=pline(ctx,pts,frac,seed,lw,col,2.5);if(frac>=1){const a=pts[pts.length-1],b=pts[pts.length-2],an=Math.atan2(a[1]-b[1],a[0]-b[0]);
    pline(ctx,[[a[0]-Math.cos(an-.5)*38,a[1]-Math.sin(an-.5)*38],a,[a[0]-Math.cos(an+.5)*38,a[1]-Math.sin(an+.5)*38]],1,seed+9,lw,col,2);}return hd;}
/* drawing tools: tip at (x,y), body extends along ang */
function crayon(ctx,x,y,ang,col,sc){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(sc||1,sc||1);
  ctx.fillStyle='rgba(40,40,60,.16)';ctx.fillRect(40,14,330,40);
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(52,-17);ctx.lineTo(52,17);ctx.closePath();ctx.fill();ctx.fillRect(50,-20,320,40);
  ctx.fillStyle='rgba(255,255,255,.82)';ctx.fillRect(110,-20,200,40);ctx.fillStyle=col;ctx.fillRect(126,-20,8,40);ctx.fillRect(286,-20,8,40);
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(52,-18);ctx.lineTo(52,-20);ctx.lineTo(370,-20);ctx.lineTo(370,20);ctx.lineTo(52,20);ctx.lineTo(52,18);ctx.closePath();ctx.stroke();ctx.restore();}
function pencil(ctx,x,y,ang,sc){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(sc||1,sc||1);
  ctx.fillStyle='rgba(40,40,60,.16)';ctx.fillRect(40,12,420,30);
  ctx.fillStyle='#e9c79a';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(62,-15);ctx.lineTo(62,15);ctx.closePath();ctx.fill();
  ctx.fillStyle='#3c3c44';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,-4.5);ctx.lineTo(18,4.5);ctx.closePath();ctx.fill();
  ctx.fillStyle='#f6cf3a';ctx.fillRect(62,-15,340,30);ctx.fillStyle='#e0b520';ctx.fillRect(62,5,340,10);ctx.fillStyle='#fff3a8';ctx.fillRect(62,-15,340,7);
  ctx.fillStyle='#b9bec6';ctx.fillRect(402,-15,26,30);ctx.fillStyle='#f29a9a';ctx.fillRect(428,-15,34,30);
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(62,-15);ctx.lineTo(462,-15);ctx.lineTo(462,15);ctx.lineTo(62,15);ctx.closePath();ctx.stroke();ctx.restore();}
/* floating numbers from the game, redrawn as punchy type */
function drawFloats(ctx,sc){const fl=window.__floats||[];for(const f of fl){const age=G.tNow-f.t;if(age<0||age>1.1)continue;const p=proj(f.x,f.y+age*1.7,f.z);if(p[2]>1)continue;
    const s=(sc||1)*(f.cls==='gold'?96:80)*(.6+.4*E.outBack(clamp(age*7)));ctx.save();ctx.globalAlpha=clamp((1.1-age)/.25);ctx.font=AM(s);ctx.textAlign='center';ctx.lineJoin='round';ctx.strokeStyle=PAPER;ctx.lineWidth=s*.16;
    ctx.translate(p[0],p[1]);ctx.rotate((h2(f.t*100,3)-.5)*.2);ctx.strokeText(f.txt,0,0);ctx.fillStyle=f.cls==='gold'?'#e09a00':f.cls==='green'?'#3f9a2a':RED;ctx.fillText(f.txt,0,0);ctx.restore();}}
/* impact frames: lf = frames since the hit. Returns shake amplitude. */
function impact(ctx,k,cx,cy,seed,strong){if(k<0||k>5)return 0;
  if(k===0){glc.style.filter='invert(1) grayscale(1) contrast(2.4)';speedLines(ctx,cx,cy,seed,'#fbfaf4',strong?340:260);return 0;}
  if(k===1){glc.style.filter='brightness(1.5) saturate(1.5)';ctx.fillStyle='rgba(255,255,255,.42)';ctx.fillRect(0,0,W,H);speedLines(ctx,cx,cy,seed+3,'#16161c',strong?420:340);return strong?26:16;}
  return (strong?18:10)*(1-(k-1)/5);}
function shake(amp,F){if(amp<=0)return;glc.style.transform=`translate(${((h2(F,1)-.5)*2*amp).toFixed(1)}px,${((h2(F,2)-.5)*2*amp).toFixed(1)}px) scale(${(1.03+amp*.0012).toFixed(4)})`;}

/* ---------- game state helpers ---------- */
function clearFx(){for(const f of G.fx)G.scene.remove(f.o);G.fx.length=0;window.__floats=[];}
function place(x,z,face,y){const i=G.islandAt(x,z);P.x=x;P.z=z;P.y=y!=null?y:(i>=0?ISL[i].y:0);P.vy=0;P.face=face;G.hero.rotation.y=face;P.ground=true;P.sx=x;P.sz=z;P.sy=P.y;P.isl=i;}
function reset(o){o=o||{};const S=G.S;['start','shop','map','wanted','win'].forEach(id=>{document.getElementById(id).hidden=true;});S.hp=6;S.coins=o.coins||0;S.bounty=0;S.fr=o.fr||[];S.dead=(o.dead||[]).slice();S.open=[];S.home=0;S.seen=[0,1,2,3];S.won=false;S.parrot=!!o.parrot;S.dig=null;S.digs=0;S.ships=null;
  for(const k in G.cd)G.cd[k]=0;for(const k in G.keys)G.keys[k]=false;G.joy.x=G.joy.y=0;
  MONS.forEach(m=>{if(o.killIsl&&o.killIsl.includes(m.isl))S.dead.push(m.id);});
  G.syncMons();G.syncShips();MONS.forEach(m=>{m.kx=m.kz=0;m.flash=0;m.froz=0;m.g.rotation.y=0;m.bar.visible=false;});
  SHARKS.forEach(k=>{k.dead=o.sharks?0:9999;k.hp=4;k.x=k.hx;k.z=k.hz;k.flee=0;k.up=0;k.g.visible=!!o.sharks;k.g.position.set(k.x,-1.3,k.z);});
  BARRELS.forEach(b=>{b.t=o.barrels?0:9999;b.g.visible=!!o.barrels;});
  clearFx();P.giant=0;P.inv=0;P.atk=0;P.swing=0;P.dash=0;P.dcd=0;P.slam=false;P.dj=false;P.kx=P.kz=0;P.ship=-1;P.onBr=-1;G.hero.scale.setScalar(1);
  window.__noHurt=true;G.setStarted(true);G.cam.fov=50;P.x=0;P.z=0;P.y=0;warm(50,0);}
function parrotTo(){PR.x=P.x-.8;PR.y=P.y+2.5;PR.z=P.z+.4;PR.tg=null;PR.cd=99;}
function warm(n,dt){MUTE_EV=true;const s=window.__skipGL;window.__skipGL=true;for(let i=0;i<n;i++){if(dt)G.update(dt);G.render();}window.__skipGL=s;MUTE_EV=false;}
const monsOn=i=>MONS.filter(m=>m.isl===i&&!G.S.dead.includes(m.id));

/* ---------- shots + runner ---------- */
const SHOTS=[];let lastF=-99,lastShot=null,hitStop=0;
function shotAt(f){for(const s of SHOTS)if(f>=s.a&&f<=s.b)return s;return null;}
function runFrame(sh,f,draw){CUR=f;const lf=f-sh.a;
  if(sh.tick)sh.tick(lf);
  let ts=sh.ts?sh.ts(lf):1;
  if(hitStop>0){hitStop--;ts=0;}
  if(sh.sim!==false&&ts>0){G.update(ts/FPS/2);G.update(ts/FPS/2);}
  if(sh.post)sh.post(lf);
  if(sh.hitStop&&EVhit===f&&hitStop===0)hitStop=sh.hitStop;
  window.__camFn=sh.cam?(c=>sh.cam(c,lf)):null;
  const force=sh.forceGL&&sh.forceGL(lf);
  window.__skipGL=!(draw||force)||sh.gl===false||(sh.glHold&&sh.glHold(lf));
  if(sh.sim!==false||sh.cam)G.render();
  if(sh.after)sh.after(lf,draw||force);
  if(!draw)return;
  glc.style.filter='';glc.style.transform='';glc.style.visibility=sh.gl===false||(sh.glHide&&sh.glHide(lf))?'hidden':'visible';
  X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.filter='none';X.clearRect(0,0,W,H);
  ov.style.opacity=1;if(sh.ovl)sh.ovl(X,lf,f);
  X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';
  grain(f,sh.dark&&sh.dark(lf));}
window.__renderFrame=(f,draw)=>{const sh=shotAt(f);if(!sh)return false;
  if(sh!==lastShot||f!==lastF+1){hitStop=0;EVhit=-99;MUTE_EV=true;sh.setup&&sh.setup();MUTE_EV=false;for(let g=sh.a;g<f;g++)runFrame(sh,g,false);}
  runFrame(sh,f,draw!==false);lastF=f;lastShot=sh;return true;};
window.__setLogging=v=>{LOGGING=v;};window.__log=()=>LOG;window.__shots=()=>SHOTS.map(s=>[s.name,s.a,s.b]);
