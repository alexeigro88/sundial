'use strict';
/* The world as a child's drawing: the same islands, seen from above, in pencil and crayon. */
const SEAS=[];(()=>{const r=G.R(9001),x0=-72,x1=72,z0=-152,z1=42,n=Math.round((x1-x0)*(z1-z0)*.55);
  for(let i=0;i<n;i++){const x=x0+r()*(x1-x0),z=z0+r()*(z1-z0),len=2.5+r()*6.5,a=(r()<.75?-1.05:.55)+(r()-.5)*.4;
    SEAS.push({x,z,dx:Math.cos(a)*len/2,dz:Math.sin(a)*len/2,w:.17+r()*.17,c:`rgba(${85+r()*30|0},${160+r()*20|0},${228+r()*15|0},${(.3+r()*.35).toFixed(2)})`,k:r()});}})();
function wview(ctx,v){ctx.translate(v.ox,v.oy);ctx.rotate(v.rot);ctx.scale(v.s,v.s);ctx.translate(-v.cx,-v.cz);}
function w2s(v,x,z){const dx=(x-v.cx)*v.s,dz=(z-v.cz)*v.s,c=Math.cos(v.rot),s=Math.sin(v.rot);return [v.ox+dx*c-dz*s,v.oy+dx*s+dz*c];}
function drawSea(ctx,list,n){ctx.lineCap='round';for(let i=0;i<n;i++){const s=list[i];ctx.strokeStyle=s.c;ctx.lineWidth=s.w;ctx.beginPath();ctx.moveTo(s.x-s.dx,s.z-s.dz);ctx.lineTo(s.x+s.dx,s.z+s.dz);ctx.stroke();}}
const islPts=I=>{const p=[];for(let k=0;k<I.n;k++){const a=I.rot+k*TAU/I.n;p.push([I.x+Math.sin(a)*I.R,I.z+Math.cos(a)*I.R]);}return p;};
function icon(ctx,wx,wz,vrot,sc,fn){if(sc<=0)return;ctx.save();ctx.translate(wx,wz);ctx.rotate(-vrot);ctx.scale(sc,sc);ctx.lineJoin='round';ctx.lineCap='round';fn(ctx);ctx.restore();}
const I2={
  house:col=>c=>{c.fillStyle=col;c.fillRect(-.8,-1.3,1.6,1.3);c.fillStyle=RED;c.beginPath();c.moveTo(-1.1,-1.3);c.lineTo(0,-2.35);c.lineTo(1.1,-1.3);c.closePath();c.fill();c.fillStyle=BLUE;c.fillRect(-.22,-.95,.44,.55);
    c.strokeStyle=INK;c.lineWidth=.09;c.strokeRect(-.8,-1.3,1.6,1.3);c.beginPath();c.moveTo(-1.1,-1.3);c.lineTo(0,-2.35);c.lineTo(1.1,-1.3);c.closePath();c.stroke();},
  palm:c=>{c.strokeStyle='#8a5a2b';c.lineWidth=.26;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(.3,-1,.1,-1.9);c.stroke();c.strokeStyle='#3f9a4a';c.lineWidth=.24;
    for(let i=0;i<5;i++){const a=-2.9+i*.68;c.beginPath();c.moveTo(.1,-1.9);c.quadraticCurveTo(.1+Math.cos(a)*.8,-2.3+Math.sin(a)*.3,.1+Math.cos(a)*1.3,-1.6+Math.sin(a)*.6);c.stroke();}},
  rock:c=>{c.fillStyle='#aab0b8';c.beginPath();c.ellipse(0,-.45,.9,.6,0,0,TAU);c.fill();c.strokeStyle=INK;c.lineWidth=.09;c.stroke();},
  dome:c=>{c.fillStyle=ORANGE;c.beginPath();c.arc(0,0,1.6,Math.PI,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();c.fillStyle='#8a5a2b';c.fillRect(-.3,-.9,.6,.9);},
  mount:c=>{c.fillStyle='#b9bcc2';c.beginPath();c.moveTo(-2.2,0);c.lineTo(-.4,-3.6);c.lineTo(.6,-1.6);c.lineTo(1.4,-2.8);c.lineTo(2.6,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();},
  castle:c=>{c.fillStyle='#f2c81e';[[-1.9,2.2],[0,3.2],[1.9,2.2]].forEach(q=>{c.fillRect(q[0]-.6,-q[1],1.2,q[1]);c.beginPath();c.moveTo(q[0]-.8,-q[1]);c.lineTo(q[0],-q[1]-1);c.lineTo(q[0]+.8,-q[1]);c.closePath();c.fill();});c.strokeStyle=INK;c.lineWidth=.1;c.strokeRect(-2.5,-2.2,5,2.2);},
  pyramid:c=>{c.fillStyle='#8a56c9';c.beginPath();c.moveTo(-2,0);c.lineTo(0,-3);c.lineTo(2,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();},
  ship:c=>{c.fillStyle='#8a5a2b';c.beginPath();c.moveTo(-1.8,-.9);c.lineTo(1.8,-.9);c.lineTo(1.2,0);c.lineTo(-1.2,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();c.beginPath();c.moveTo(0,-.9);c.lineTo(0,-3);c.stroke();c.fillStyle='#fff';c.fillRect(0,-2.9,1.3,1.3);c.strokeRect(0,-2.9,1.3,1.3);},
  chest:c=>{c.fillStyle='#b5762a';c.fillRect(-.9,-1.1,1.8,1.1);c.fillStyle=SUN;c.fillRect(-.18,-1.1,.36,1.1);c.strokeStyle=INK;c.lineWidth=.1;c.strokeRect(-.9,-1.1,1.8,1.1);},
  gold:c=>{c.fillStyle=SUN;c.beginPath();c.moveTo(-1.6,0);c.lineTo(0,-1.5);c.lineTo(1.6,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();},
  flag:c=>{c.strokeStyle=INK;c.lineWidth=.14;c.beginPath();c.moveTo(0,0);c.lineTo(0,-3.2);c.stroke();c.fillStyle=INK;c.fillRect(0,-3.2,1.9,1.2);c.fillStyle='#fff';c.beginPath();c.arc(.95,-2.7,.34,0,TAU);c.fill();},
  cave:c=>{c.fillStyle='#9aa0a8';c.beginPath();c.arc(0,0,1.8,Math.PI,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();c.fillStyle='#15131f';c.beginPath();c.arc(0,0,.85,Math.PI,0);c.closePath();c.fill();},
  mon:(col,boss)=>c=>{const r=boss?1.3:.62;c.fillStyle=col;c.beginPath();c.arc(0,-r,r,0,TAU);c.fill();c.strokeStyle=INK;c.lineWidth=.08;c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(-r*.35,-r*1.15,r*.24,0,TAU);c.arc(r*.35,-r*1.15,r*.24,0,TAU);c.fill();
    c.fillStyle=INK;c.beginPath();c.arc(-r*.32,-r*1.12,r*.1,0,TAU);c.arc(r*.38,-r*1.12,r*.1,0,TAU);c.fill();if(boss){c.fillRect(-r*1.1,-r*2.05,r*2.2,r*.16);c.fillRect(-r*.6,-r*2.6,r*1.2,r*.6);}},
  boat:c=>{c.fillStyle='#8a5a2b';c.beginPath();c.moveTo(-1.5,-.8);c.lineTo(1.5,-.8);c.lineTo(1,0);c.lineTo(-1,0);c.closePath();c.fill();c.strokeStyle=INK;c.lineWidth=.1;c.stroke();c.beginPath();c.moveTo(0,-.8);c.lineTo(0,-2.6);c.stroke();c.fillStyle='#fff';c.fillRect(-.9,-2.5,1.8,1.2);c.strokeRect(-.9,-2.5,1.8,1.2);}
};
function decor(ctx,I,i,vrot,sc){const R_=I.R,k=I.kind,ic=(dx,dz,fn,s)=>icon(ctx,I.x+dx,I.z+dz,vrot,sc*(s||1),fn);
  if(k==='village'){ic(-R_*.38,-R_*.2,I2.house('#f6cf3a'));ic(R_*.36,-R_*.26,I2.house('#f08a1c'));ic(-R_*.4,R_*.4,I2.house('#f6cf3a'));ic(R_*.42,R_*.3,I2.house('#9fd0f0'));}
  else if(k==='pines'||k==='palms'){ic(-R_*.45,-.1,I2.palm);ic(R_*.42,-.2,I2.palm);ic(0,R_*.5,I2.palm);}
  else if(k==='blue'){ic(-.6,-.8,I2.house('#6fa8e6'));ic(1.5,1.2,I2.house('#6fa8e6'));}
  else if(k==='dome'){ic(-1,-.6,I2.dome);ic(2.4,-.6,I2.palm);}
  else if(k==='chest'){ic(.3,.6,I2.chest);ic(-1.4,0,I2.palm,.8);}
  else if(k==='rocks'){ic(-R_*.45,-R_*.3,I2.rock);ic(R_*.45,-R_*.25,I2.rock);ic(-R_*.4,R_*.5,I2.rock);if(i===18)ic(0,-1.2,I2.cave);}
  else if(k==='mountain'){ic(-4.6,2.5,I2.mount);ic(4.6,2.5,I2.mount,.85);}
  else if(k==='pyramid'){ic(.4,.6,I2.pyramid);}
  else if(k==='castle'){ic(0,-1.6,I2.castle);}
  else if(k==='ship'){ic(-2.2,-.6,I2.ship);}
  else if(k==='final'){ic(0,-5.6,I2.flag);ic(-6.4,2,I2.rock,1.3);ic(6.4,2,I2.rock,1.3);}
  else if(k==='treasure'){ic(-2.6,-2.4,I2.chest);ic(2.6,-2.4,I2.chest);ic(0,3.2,I2.gold);ic(-4.6,.6,I2.palm);}
  MONS.forEach(m=>{if(m.isl===i)icon(ctx,m.hx,m.hz+.9,vrot,sc,I2.mon(m.d.col,!!m.boss));});}
function drawIsl2D(ctx,I,i,prog,boil,vrot){if(prog<=0)return null;const pts=islPts(I);
  if(prog>1){const fp=clamp(prog-1);ctx.save();G.path(ctx,pts);ctx.clip();ctx.globalAlpha=fp;ctx.fillStyle='#f4f7e2';ctx.fill();ctx.globalAlpha=1;zig(ctx,I.x-I.R*1.25,I.z-I.R*1.25,I.R*2.5,I.R*2.5,I.col,i*31+7,fp,1.05,.88);ctx.restore();}
  const head=pline(ctx,pts.concat([pts[0]]),clamp(prog),i*17+boil,.17,INK,.13);
  if(prog>2)decor(ctx,I,i,vrot,E.outBack(clamp(prog-2)));return head;}
function drawWall(ctx,prog){if(prog<=0)return;zig(ctx,-74,-56.2,69.6,2.4,RED,41,prog,.9,.95);zig(ctx,4.4,-56.2,69.6,2.4,RED,43,prog,.9,.95);}
function drawBridges(ctx,prog){if(prog<=0)return;ctx.save();ctx.strokeStyle='#8a5a2b';ctx.lineWidth=1.5;ctx.lineCap='butt';ctx.globalAlpha=prog;G.BR.forEach(b=>{if(b.px>200)return;ctx.beginPath();ctx.moveTo(b.px,b.pz);ctx.lineTo(b.qx,b.qz);ctx.stroke();});ctx.restore();}
const LAND=ISL.map((I,i)=>i).filter(i=>!ISL[i].cave);

/* ---------- shot 0: the drawing (frames 0-119) ---------- */
const V0=SEAS.filter(s=>s.x>-64&&s.x<60&&s.z>-54&&s.z<20).map(s=>{const r=Math.floor((20-s.z)/9),c=Math.floor((s.x+64)/11);return Object.assign({o:r*100+(r%2?20-c:c)+s.k*.9},s);}).sort((a,b)=>a.o-b.o);
const ORD0=[0,1,4,16,3,2,15,5,17,18,6];
function view0(lf){const e=E.io3(rm(lf,0,100)),zz=E.io5(rm(lf,98,119));let ox=960,oy=540;
  if(lf>102){const a=rm(lf,102,119)*9;ox+=(h2(lf,1)-.5)*2*a;oy+=(h2(lf,2)-.5)*2*a;}
  return {ox,oy,rot:lerp(-.045,0,E.io3(rm(lf,0,112))),cx:lerp(-2,0,zz),cz:lerp(lerp(-18,-15.5,e),-2.5,zz),s:1080/lerp(lerp(66,58,e),26,zz)};}
const seaN=lf=>Math.floor(V0.length*(.015+.985*E.io3(rm(lf,0,50))));
function tool0(lf){const v=view0(lf);
  if(lf<50){const s=V0[Math.max(0,seaN(lf)-1)],p=w2s(v,s.x+s.dx,s.z+s.dz);return [p[0],p[1],0];}
  const k=Math.min(ORD0.length-1,Math.floor((lf-48)/4)),I=ISL[ORD0[k]],pts=islPts(I),fr=clamp((lf-(48+k*4))/5),n=pts.length,u=fr*n,a=pts[Math.floor(u)%n],b=pts[(Math.floor(u)+1)%n],t=u-Math.floor(u),p=w2s(v,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);return [p[0],p[1],1];}
SHOTS.push({name:'drawing',a:0,b:119,gl:false,sim:false,
  ovl(ctx,lf,F){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);const v=view0(lf),boil=Math.floor(F/3);
    ctx.save();wview(ctx,v);drawSea(ctx,V0,seaN(lf));
    ORD0.forEach((ii,k)=>{const t0=48+k*4,pr=rm(lf,t0,t0+5)+rm(lf,t0+5,t0+10)+rm(lf,t0+10,t0+14);drawIsl2D(ctx,ISL[ii],ii,pr,boil,v.rot);});
    drawBridges(ctx,rm(lf,90,97));
    icon(ctx,8.4,2.6,v.rot,E.outBack(rm(lf,94,100)),I2.boat);ctx.restore();
    /* label, like a note taped to the sheet */
    ctx.save();ctx.translate(92,74);ctx.rotate(-.025);const lp=E.outBack(rm(lf,-6,2));ctx.scale(lp,lp);ctx.globalAlpha=1-rm(lf,100,108);
    ctx.fillStyle='rgba(40,40,60,.16)';ctx.fillRect(8,10,820,112);ctx.fillStyle=PAPER;ctx.fillRect(0,0,820,112);ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.strokeRect(0,0,820,112);
    ctx.fillStyle='rgba(246,207,58,.75)';ctx.fillRect(-34,-16,96,34);ctx.fillRect(756,94,96,34);
    hand(ctx,'папа и сын нарисовали игру…',36,78,62,.07+.93*rm(lf,0,36),INK);ctx.restore();
    /* the drawing hand: crayon for the sea, pencil for the islands */
    if(lf<106){const a=tool0(lf),b=tool0(Math.max(0,lf-1));let x=a[0]*.6+b[0]*.4,y=a[1]*.6+b[1]*.4;const out=E.in3(rm(lf,93,106));x+=out*900;y+=out*700;const wob=Math.sin(lf*1.9)*.07;
      if(a[2]===0)crayon(ctx,x,y,-.82+wob,SEA,1.25+out);else pencil(ctx,x,y,-.82+wob,1.2+out);}
    /* the page is about to burst */
    const fl=rm(lf,113,119);if(fl>0){ctx.fillStyle=`rgba(255,255,255,${(fl*fl*.9).toFixed(3)})`;ctx.fillRect(0,0,W,H);speedLines(ctx,W/2,H/2,lf,'rgba(47,102,194,'+(fl*.5).toFixed(2)+')',260+(1-fl)*500);}
  }});

/* ---------- final shot: the 3D world settles back into the sheet on the table (frames 810-899) ---------- */
const SHEET={cx:960,cy:548,w:1680,h:920,rot:-.04};
const MAPL={x:-250,y:128,s:592/88,xm:-2,zm:-62};
function sheetPt(lx,ly){const c=Math.cos(SHEET.rot),s=Math.sin(SHEET.rot);return [SHEET.cx+lx*c-ly*s,SHEET.cy+lx*s+ly*c];}
const VF=(()=>{const o=sheetPt(MAPL.x,MAPL.y);return {ox:o[0],oy:o[1],rot:Math.PI/2+SHEET.rot,s:MAPL.s,cx:MAPL.xm,cz:MAPL.zm};})();
const REG=SEAS.filter(s=>s.x>-47&&s.x<43&&s.z>-143&&s.z<19);
let POSTER=null;
function endOvl(ctx,lf,F){const e=E.io5(rm(lf,2,38)),k=Math.pow((1080/26)/VF.s,1-e),rK=-VF.rot*(1-e),pF=w2s(VF,0,-2.5),boil=Math.floor(F/3);
  if(!POSTER){POSTER=mk(460,600);if(typeof CARD!=='undefined'&&CARD){const c=POSTER.getContext('2d');c.fillStyle='#f1e2bd';c.fillRect(0,0,460,600);zig(c,0,0,460,600,'#e6cf98',5,1,22,.5);c.strokeStyle=INK;c.lineWidth=4;c.strokeRect(12,12,436,576);
      c.fillStyle=INK;c.textAlign='center';c.font=AM(96);c.fillText('WANTED',230,104);c.fillStyle='#fbf6e6';c.fillRect(60,124,340,250);c.strokeRect(60,124,340,250);c.save();c.beginPath();c.rect(62,126,336,246);c.clip();c.drawImage(CARD.st,230-CARD.st.width*.19,112,CARD.st.width*.38,CARD.st.height*.38);c.restore();
      c.fillStyle=INK;c.font=AM(50);c.fillText('DEAD OR ALIVE',230,424);c.font=NE(33);c.fillText(t_('Гроза Карандашного моря'),230,468);c.font=AM(74);c.fillStyle='#a8540a';c.fillText(fmt(100000000),230,548);}
    else G.drawPoster(POSTER,{name:t_('Гроза Карандашного моря'),bounty:100000000,seed:8});}
  ctx.save();ctx.translate(lerp(960,pF[0],e),lerp(540,pF[1],e));ctx.rotate(rK);ctx.scale(k,k);ctx.translate(-pF[0],-pF[1]);
  /* kitchen table */
  ctx.fillStyle='#c99c66';ctx.fillRect(-7000,-7000,16000,16000);
  if(e>.25){for(let i=0;i<70;i++){const y=-40+i*17+(h2(i,3)-.5)*10;ctx.strokeStyle=`rgba(${120+h2(i,5)*40|0},${78+h2(i,6)*30|0},${40+h2(i,7)*20|0},${(.12+h2(i,8)*.2).toFixed(2)})`;ctx.lineWidth=3+h2(i,9)*7;ctx.beginPath();ctx.moveTo(-60,y);ctx.bezierCurveTo(600,y+(h2(i,11)-.5)*26,1300,y+(h2(i,12)-.5)*26,1980,y+(h2(i,13)-.5)*14);ctx.stroke();}
    ctx.strokeStyle='rgba(90,58,30,.35)';ctx.lineWidth=4;[268,560,838].forEach(y=>{ctx.beginPath();ctx.moveTo(-60,y);ctx.lineTo(1980,y+6);ctx.stroke();});}
  /* the sheet */
  ctx.save();ctx.translate(SHEET.cx,SHEET.cy);ctx.rotate(SHEET.rot);
  ctx.fillStyle='rgba(60,38,18,.3)';ctx.fillRect(-SHEET.w/2+16,-SHEET.h/2+22,SHEET.w,SHEET.h);ctx.fillStyle=PAPER;ctx.fillRect(-SHEET.w/2,-SHEET.h/2,SHEET.w,SHEET.h);
  ctx.save();ctx.beginPath();ctx.rect(MAPL.x-550,MAPL.y-296,1100,592);ctx.clip();
  ctx.translate(MAPL.x,MAPL.y);ctx.rotate(Math.PI/2);ctx.scale(MAPL.s,MAPL.s);ctx.translate(-MAPL.xm,-MAPL.zm);
  drawSea(ctx,REG,REG.length);drawWall(ctx,1);drawBridges(ctx,1);
  LAND.forEach(i=>drawIsl2D(ctx,ISL[i],i,3,boil,VF.rot+rK));
  icon(ctx,8.4,2.6,VF.rot+rK,1,I2.boat);icon(ctx,8.4,-64.9,VF.rot+rK,1,I2.boat);
  ctx.restore();
  const fr=rm(lf,30,42);if(fr>0)pline(ctx,[[MAPL.x-550,MAPL.y-296],[MAPL.x+550,MAPL.y-296],[MAPL.x+550,MAPL.y+296],[MAPL.x-550,MAPL.y+296],[MAPL.x-550,MAPL.y-296]],fr,boil,4,INK,3);
  /* title, written across the top of the sheet */
  const tl=lf-36;if(tl>=0){ctx.save();ctx.font=AM(172);const tw=ctx.measureText(t_('ПИРАТЫ КАРАНДАШНОГО МОРЯ')).width+172*.05*(t_('ПИРАТЫ КАРАНДАШНОГО МОРЯ').length-1);ctx.restore();
    zig(ctx,-tw/2+10,-250,tw-20,24,SUN,5+Math.floor(F/2),E.out3(rm(lf,60,67)),14,.95);
    kword(ctx,'ПИРАТЫ КАРАНДАШНОГО МОРЯ',0,-276,172,tl,{color:BLUE,st:.9,shadow:false,sw:.02,nofit:true});}
  /* three words down the right margin */
  [['Нарисуй.',BLUE,60],['Оживи.','#57a639',68],['Играй.',RED,75]].forEach((q,i)=>{const t=lf-q[2];if(t<0)return;const y=-52+i*104;
    pline(ctx,[[352,y-52],[374,y-22],[420,y-92]],E.out3(clamp(t/4)),i*5+boil,11,q[1],3);kword(ctx,q[0],446,y,118,t,{align:'left',color:INK,st:.7,shadow:false,sw:.02,nofit:true});});
  /* our hero's own wanted poster, taped on */
  const pt=lf-70;if(pt>=0){const ps=lerp(2.2,1,E.out5(clamp(pt/5)));ctx.save();ctx.translate(600,318);ctx.rotate(.075+(1-clamp(pt/5))*.3);ctx.scale(.44*ps,.44*ps);ctx.globalAlpha=clamp(pt/2);
    ctx.fillStyle='rgba(40,30,20,.28)';ctx.fillRect(-222,-286,460,600);ctx.drawImage(POSTER,-230,-300);ctx.fillStyle='rgba(246,207,58,.8)';ctx.fillRect(-70,-330,140,56);ctx.restore();}
  ctx.restore();
  /* things left on the table */
  const cin=E.out5(rm(lf,28,50));
  crayon(ctx,lerp(-300,58,cin),lerp(1500,930,cin),-1.5,GREEN,1.0);
  crayon(ctx,lerp(2300,1868,cin),lerp(-500,150,cin),1.63,RED,1.0);
  crayon(ctx,lerp(2500,1560,cin),lerp(1300,1034,cin),-.12,SEA,1.05);
  const pd=rm(lf,74,84),pb=E.out5(pd);if(pd>0)pencil(ctx,lerp(-600,150,pb),lerp(1250,1010,pb),-.1+Math.sin(pd*9)*(1-pd)*.12,1.1);
  ctx.restore();}
SHOTS.push({name:'sheet',a:810,b:929,sim:false,glHide:lf=>lf>3,glHold:()=>true,
  ovl(ctx,lf,F){endOvl(ctx,lf,F);ov.style.opacity=lf<4?[.3,.55,.8,1][lf]:1;}});
