'use strict';
/* 3D shots and graphic cards, frames 120-809. Beat = 15 frames. */
const hp2=()=>proj(P.x,P.y+1.1,P.z);
function wipeOut(ctx,lf,len,col,seed){const k=lf-(len-3);if(k>=0)wipe(ctx,(k+1)/3,col,seed);}
function wipeIn(ctx,lf,col,seed){if(lf<2)wipe(ctx,1+(lf+1)/3,col,seed);}
function fruitTag(ctx,id,name,lt){if(lt<0)return;const s=E.outBack(clamp(lt/4));ctx.save();ctx.translate(96,H-268);ctx.rotate(-.035);ctx.scale(s,s);
  ctx.fillStyle='rgba(40,40,60,.22)';ctx.fillRect(10,14,name.length*52+250,190);ctx.fillStyle=PAPER;ctx.fillRect(0,0,name.length*52+250,190);ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.strokeRect(0,0,name.length*52+250,190);
  G.drawFruit(ctx,G.FBY[id],104,96,4.1);ctx.font=AM(118);ctx.fillStyle=INK;ctx.textBaseline='alphabetic';ctx.fillText(name,206,136);ctx.restore();}
function bam(ctx,t,cx,cy,txt,F){if(t<0||t>15)return;const s=E.outBack(clamp(t/4))*(t>12?1-(t-12)/3:1);if(s<=0)return;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.16+(h2(Math.floor(F/2),4)-.5)*.04);ctx.scale(s,s);
  burst(ctx,0,0,330,235,Math.floor(F/2));ctx.font=AM(230);ctx.textAlign='center';ctx.lineJoin='round';ctx.strokeStyle=PAPER;ctx.lineWidth=18;ctx.strokeText(txt,0,76);ctx.fillStyle=INK;ctx.fillText(txt,0,76);ctx.restore();}

/* ---------- dive into the drawing + "this is you" freeze frame (120-179) ---------- */
let CARD=null;
SHOTS.push({name:'dive',a:120,b:179,
  setup(){reset({});place(0,2.6,0);CARD=null;},
  tick(lf){if(lf===5)G.jump();if(lf===31)G.attack();},
  ts:lf=>lf>=34?0:1,
  cam(c,lf){const u=E.io5(rm(lf,0,30)),p=v3l([0,27.88,-2.5],[P.x+3.4,1.9,P.z+6.6],u),t=v3l([0,0,-2.5],[P.x,1.25,P.z],u);setCam(c,p,t,v3l([0,0,-1],[0,1,0],E.io3(rm(lf,0,22))),50);},
  forceGL:lf=>lf===34,glHold:lf=>lf>34,glHide:lf=>lf>=34,
  after(lf,drawn){if(lf!==34||CARD)return;G.hero.visible=false;G.shadow.visible=false;G.ren.render(G.scene,G.cam);const A=mk(W,H);A.getContext('2d').drawImage(glc,0,0,W,H);G.hero.visible=true;G.shadow.visible=true;
    const sc=G.scene,vis=sc.children.map(o=>o.visible),fog=sc.fog;sc.children.forEach(o=>{if(o!==G.hero&&!o.isLight)o.visible=false;});sc.fog=null;G.ren.setClearColor(0x000000,0);G.ren.render(sc,G.cam);
    const B=mk(W,H);B.getContext('2d').drawImage(glc,0,0,W,H);G.ren.setClearColor(0xfbfaf4,1);sc.fog=fog;sc.children.forEach((o,i)=>{o.visible=vis[i];});G.ren.render(sc,G.cam);
    const h=hp2(),cw=620,ch=700,crop=mk(cw,ch),cx=crop.getContext('2d');cx.drawImage(B,h[0]-cw/2,h[1]-ch*.6,cw,ch,0,0,cw,ch);
    const sil=mk(cw,ch),sx=sil.getContext('2d');sx.drawImage(crop,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='#fff';sx.fillRect(0,0,cw,ch);
    const st=mk(cw+60,ch+60),tx=st.getContext('2d');for(let i=0;i<20;i++){const a=i/20*TAU;tx.drawImage(sil,30+Math.cos(a)*11,30+Math.sin(a)*11);}tx.drawImage(crop,30,30);CARD={A,st};},
  ovl(ctx,lf,F){
    if(lf<34){const fl=1-lf/6;if(fl>0){ctx.fillStyle=`rgba(255,255,255,${(fl*.9).toFixed(3)})`;ctx.fillRect(0,0,W,H);}
      const ws=[['И',0,6],['ОНА',6,12],['ОЖИЛА!',12,27]];ws.forEach(q=>{if(lf>=q[1]&&lf<q[2])kword(ctx,q[0],W/2,H/2+150,q[0].length>3?430:500,(lf-q[1])*1.6+2.5,{block:BLUE,color:'#fff',stroke:INK,sw:.07,rot:-.04,seed:q[1],out:q[2]===27?lf-24:-1,st:.5});});
      return;}
    const C=CARD,t=lf-34;if(!C)return;
    ctx.save();const z=1.07+t*.0018;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);ctx.filter='grayscale(.9) brightness(1.1) contrast(.9)';ctx.drawImage(C.A,0,0);ctx.filter='none';ctx.restore();
    ctx.fillStyle='rgba(251,250,244,.5)';ctx.fillRect(0,0,W,H);if(t===0){ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(0,0,W,H);}
    const pop=E.outBack(clamp(t/5));
    ctx.save();ctx.translate(590,610);ctx.rotate(.3+t*.004);burst(ctx,0,0,470*pop,470*pop,Math.floor(F/3),['#ffe838',SUN,'#fff6b8']);ctx.restore();
    ctx.save();ctx.translate(590,600);ctx.rotate(-.07+(1-pop)*.2);const s=1.78*(.55+.45*pop)+t*.002;ctx.scale(s,s);ctx.shadowColor='rgba(40,40,60,.32)';ctx.shadowOffsetX=12;ctx.shadowOffsetY=16;ctx.drawImage(C.st,-C.st.width/2,-C.st.height*.52);ctx.restore();
    kword(ctx,'ЭТО ТЫ!',1330,520,400,t-3,{block:RED,color:'#fff',stroke:INK,sw:.07,rot:-.05,seed:3});
    hand(ctx,'юный пират Карандашного моря',1010,668,64,rm(t,6,12),INK);
    for(let i=0;i<6;i++){const k=t-9-i*.8;if(k<0)continue;const hs=E.outBack(clamp(k/3));ctx.save();ctx.translate(1050+i*92,800);ctx.rotate((h2(i,Math.floor(F/3))-.5)*.2);ctx.scale(hs,hs);ctx.font='96px serif';ctx.textAlign='center';ctx.fillStyle=RED;ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.strokeText('♥',0,30);ctx.fillText('♥',0,30);ctx.restore();}
    arrow(ctx,[[1040,930],[960,985],[850,975],[770,905]],rm(t,5,10),Math.floor(F/3),9,INK);
    wipeOut(ctx,lf,60,BLUE,7);}});

/* ---------- JUMP: speed-ramped leap between islands (180-227) ---------- */
const JD=[.655,-.755],JN=[.755,.655];let TRAIL=[];
SHOTS.push({name:'jump',a:180,b:227,
  setup(){reset({killIsl:[1,16]});place(JD[0]*3,-13.6+JD[1]*3,Math.atan2(JD[0],JD[1]));TRAIL=[];this.land=-1;},
  tick(lf){G.joy.x=JD[0];G.joy.y=JD[1];if(P.ground&&P.isl===1&&Math.hypot(P.x,P.z+13.6)>4.9)G.jump();},
  ts:lf=>lf<14?1:lf<17?lerp(1,.26,(lf-13)/3):lf<31?.26:lf<34?lerp(.26,1,(lf-30)/3):1,
  post(lf){TRAIL.push([P.x,P.y+.9,P.z,P.ground]);if(this.land<0&&P.ground&&P.isl===3)this.land=lf;},
  cam(c,lf){const M=[4.9,-19.3],d=lerp(7.2,6.0,E.out3(lf/48)),k=.55;setCam(c,[M[0]+JN[0]*d-JD[0]*(1.2-lf*.03),.75,M[1]+JN[1]*d-JD[1]*(1.2-lf*.03)],[lerp(M[0],P.x,k),1.9+P.y*.5,lerp(M[1],P.z,k)],null,52);},
  ovl(ctx,lf,F){const air=TRAIL.filter(q=>!q[3]);if(air.length>1){ctx.save();ctx.setLineDash([20,16]);ctx.lineDashOffset=-Math.floor(F/2)*9;pline(ctx,air.map(q=>proj(q[0],q[1],q[2])),1,Math.floor(F/3),7,INK,2);ctx.restore();}
    const t=lf-15;kword(ctx,'ПРЫГАЙ',130,360,360,t,{align:'left',block:SUN,color:INK,rot:-.035,seed:5,out:lf>=41?lf-41:-1});
    if(this.land>=0){const k=lf-this.land,p=proj(P.x,P.y,P.z);if(k<8){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=6;ctx.lineCap='round';for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI,r0=60+k*26,r1=r0+50-k*4;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*r0*1.5,p[1]+Math.sin(a)*r0*.5);ctx.lineTo(p[0]+Math.cos(a)*r1*1.5,p[1]+Math.sin(a)*r1*.5);ctx.stroke();}ctx.restore();shake(12*(1-k/8),F);}}
    wipeIn(ctx,lf,BLUE,7);}});

/* ---------- stutter cut: who lives here (228-239) ---------- */
SHOTS.push({name:'faces',a:228,b:239,
  setup(){reset({});place(9.2,-24.2,0);this.ms=[MONS.find(m=>m.d.col==='#e0a03a'),MONS.find(m=>m.d.shell),MONS.find(m=>m.d.dash&&m.d.col==='#b8433a')];this.nm=['ЁЖ','ЧЕРЕПАХА','НОСОРОГ'];MONS.forEach(m=>{if(!this.ms.includes(m)&&this.ms.some(q=>q.isl===m.isl))m.g.visible=false;});this.cl=[SUN,GREEN,RED];},
  cam(c,lf){const m=this.ms[Math.floor(lf/4)],y=ISL[m.isl].y,k=(lf%4)/4;setCam(c,[m.x+1.5*m.s,y+m.s*1.9,m.z+(5.0-k*.7)*m.s],[m.x,y+m.s*1.15,m.z],null,36);},
  post(lf){this.ms.forEach(m=>{m.g.rotation.y=.3;m.bar.visible=false;});},
  ovl(ctx,lf,F){const i=Math.floor(lf/4),k=lf%4;if(k===0){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(0,0,W,H);}
    kword(ctx,this.nm[i],120,H-110,250,k*2.2+1,{align:'left',block:this.cl[i],color:INK,rot:-.03,seed:i*9,st:.4});}});

/* ---------- FIGHT: slashes, impact frames, ground slam (240-299) ---------- */
SHOTS.push({name:'fight',a:240,b:299,hitStop:2,
  setup(){reset({});place(0,-13.2,Math.PI);const ms=monsOn(1);ms.forEach((m,i)=>{const a=i/ms.length*TAU+.5;m.x=Math.sin(a)*3.1;m.z=-13.2+Math.cos(a)*3.1;m.g.position.set(m.x,0,m.z);});this.slam=-1;},
  tick(lf){if(lf===9||lf===21)G.attack();if(lf===27)G.jump();if(lf===35)G.attack();},
  ts(lf){return this.slam>=0&&lf>this.slam+5?.34:1;},
  post(lf){if(this.slam<0&&G.fx.some(f=>f.k==='ring')){this.slam=lf;hitStop=4;logEv('slam');}},
  cam(c,lf){const a=.5+lf*.014,r=lerp(5.4,4.6,E.out3(rm(lf,0,44))),h=lerp(9.4,7.6,E.out3(rm(lf,0,44)));setCam(c,[P.x+Math.sin(a)*r,h,P.z+Math.cos(a)*r],[P.x,.8+P.y*.3,P.z],null,50);},
  ovl(ctx,lf,F){const p=hp2(),st=this.slam>=0&&lf-this.slam<6,am=impact(ctx,F-EVhit,p[0],p[1],F,st);shake(am,F);
    kword(ctx,'РУБИ',W-140,380,430,lf-9,{align:'right',block:RED,color:'#fff',stroke:INK,sw:.07,rot:.03,seed:11,out:lf>=30?lf-30:-1});
    if(this.slam>=0)bam(ctx,lf-this.slam-1,p[0]+430,p[1]-250,'БАЦ!',F);
    drawFloats(ctx);wipeOut(ctx,lf,60,SUN,13);}});

/* ---------- SHOP DEVIL: fifteen fruits (300-314) ---------- */
SHOTS.push({name:'shop',a:300,b:314,gl:false,sim:false,
  ovl(ctx,lf,F){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);const fx=1444,fy=250,z=1+E.in3(rm(lf,10,14.5))*7;ctx.save();ctx.translate(fx,fy);ctx.scale(z,z);ctx.translate(-fx,-fy);
    zig(ctx,640,60,1220,960,'#fff3c4',21+Math.floor(F/3),E.out3(rm(lf,0,6)),70,.9);
    G.FR.forEach((f,i)=>{const t=lf-1-i*.5;if(t<0)return;const s=E.outBack(clamp(t/4)),x=760+(i%5)*228,y=250+Math.floor(i/5)*290;ctx.save();ctx.translate(x,y);ctx.rotate((h2(i,Math.floor(F/3))-.5)*.14);
      ctx.fillStyle='rgba(40,40,60,.14)';ctx.beginPath();ctx.ellipse(8,98,70*s,16*s,0,0,TAU);ctx.fill();G.drawFruit(ctx,f,0,0,5.4*s);ctx.restore();});
    ctx.save();ctx.translate(330,300);ctx.rotate(-.13);const sp=E.outBack(clamp(lf/5));ctx.scale(sp,sp);burst(ctx,0,0,300,215,Math.floor(F/3));ctx.font=AM(150);ctx.textAlign='center';ctx.fillStyle='#1c49a6';ctx.fillText('SHOP',0,-18);ctx.fillText('DEVIL',0,104);ctx.restore();
    kword(ctx,'ЕШЬ',120,760,300,lf-2,{align:'left',block:SUN,color:INK,rot:-.03,seed:2});kword(ctx,'ФРУКТЫ',120,1000,300,lf-4,{align:'left',block:SUN,color:INK,rot:-.02,seed:4});
    ctx.restore();wipeIn(ctx,lf,SUN,13);}});

/* ---------- three fruit powers, one beat each (315-359) ---------- */
function isl5(){const ms=monsOn(5),tu=ms.find(m=>m.d.shell),ot=ms.filter(m=>m!==tu);return {tu,ot};}
let FIVE=null;
const setM=(m,x,z)=>{m.x=x;m.z=z;m.g.position.set(x,ISL[m.isl].y,z);};
SHOTS.push({name:'fire',a:315,b:329,hitStop:2,
  setup(){reset({fr:['fire','bolt','giant','power']});const q=isl5();FIVE={a:q.ot[0].id,b:q.ot[1].id};place(0,-28.6,Math.PI);setM(q.ot[0],0,-33.8);setM(q.ot[1],-4.2,-34.6);setM(q.ot[2],3.6,-35.4);setM(q.tu,5.2,-33.5);},
  tick(lf){if(lf===2){G.usePow('fire');logEv('fire');}},
  cam(c,lf){setCam(c,[P.x+2.6-lf*.03,2.9,P.z+5.0-lf*.06],[-.2,.9,-33.6],null,44);},
  ovl(ctx,lf,F){const fb=G.fx.find(f=>f.k==='fire');if(fb){const p=proj(fb.o.position.x,fb.o.position.y,fb.o.position.z);ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],190);g.addColorStop(0,'rgba(255,220,120,.95)');g.addColorStop(.35,'rgba(255,120,30,.55)');g.addColorStop(1,'rgba(255,80,0,0)');ctx.fillStyle=g;ctx.fillRect(p[0]-200,p[1]-200,400,400);ctx.restore();}
    const p=hp2(),am=impact(ctx,F-EVhit,W/2,H*.42,F,true);shake(am,F);drawFloats(ctx);fruitTag(ctx,'fire','ОГНЕПЕРЕЦ',lf);}});
SHOTS.push({name:'bolt',a:330,b:344,hitStop:2,
  setup(){if(!FIVE){const q=isl5();FIVE={a:q.ot[0].id,b:q.ot[1].id};}reset({fr:['fire','bolt','giant','power'],dead:[FIVE.a]});const q=isl5();place(1.6,-29,Math.PI);this.t=q.ot[0];setM(q.ot[0],-1.4,-34.4);setM(q.ot[1],4.4,-35.2);setM(q.tu,5.4,-32.6);this.hit=-1;},
  tick(lf){if(lf===4){G.usePow('bolt');this.hit=lf;}},
  cam(c,lf){setCam(c,[P.x+7.6,1.5,P.z-.6+lf*.03],[-.6,3.3,-33.4],null,52);},
  ovl(ctx,lf,F){const t=this.hit>=0?lf-this.hit:-1,m=this.t;if(t>=0&&t<6){const p=proj(m.x,ISL[5].y+.6,m.z),pts=[[p[0]+(h2(F,1)-.5)*260,-20]];for(let i=1;i<8;i++)pts.push([p[0]+(h2(F,i+3)-.5)*230*(1-i/8),-20+(p[1]+20)*i/8]);pts.push([p[0],p[1]]);
      ctx.save();ctx.lineJoin='miter';ctx.lineCap='round';ctx.globalAlpha=1-t/6;[['#fff',34],[SUN,16],['#fff',5]].forEach(q=>{ctx.strokeStyle=q[0];ctx.lineWidth=q[1];ctx.beginPath();pts.forEach((v,i)=>ctx[i?'lineTo':'moveTo'](v[0],v[1]));ctx.stroke();});ctx.restore();
      if(t<2){ctx.fillStyle=`rgba(255,255,255,${t?.3:.8})`;ctx.fillRect(0,0,W,H);}}
    const am=impact(ctx,F-EVhit-1,W*.42,H*.5,F,true);shake(am,F);drawFloats(ctx);fruitTag(ctx,'bolt','ГРОМОСЛИВА',lf);}});
SHOTS.push({name:'giant',a:345,b:359,hitStop:3,
  setup(){if(!FIVE){const q=isl5();FIVE={a:q.ot[0].id,b:q.ot[1].id};}reset({fr:['fire','bolt','giant','power'],dead:[FIVE.a,FIVE.b]});const q=isl5();place(0,-31.6,0);setM(q.ot[0],-2.3,-29.9);setM(q.tu,2.4,-29.7);},
  tick(lf){if(lf===0)G.usePow('giant');if(lf===9)G.attack();},
  cam(c,lf){setCam(c,[P.x+1.5,.55,P.z+5.6-lf*.04],[P.x,2.0+lf*.03,P.z],null,60);},
  ovl(ctx,lf,F){const p=hp2(),am=impact(ctx,F-EVhit,p[0],p[1],F,true);shake(am+(lf<8?4:0),F);drawFloats(ctx);fruitTag(ctx,'giant','ТЫКВА-ВЕЛИКАН',lf);wipeOut(ctx,lf,15,SEA,17);}});

/* ---------- SAIL (360-419) ---------- */
function onShip(i,x,z){const sh=SHIPS[i];sh.x=x;sh.z=z;sh.rot=Math.PI;sh.g.position.set(x,0,z);sh.g.rotation.y=Math.PI;P.x=x;P.z=z;P.y=-.4;P.vy=0;P.ship=i;P.ground=true;P.face=Math.PI;G.hero.rotation.y=Math.PI;P.isl=-1;P.sx=x;P.sz=z;P.sy=-.4;parrotTo();}
SHOTS.push({name:'sail',a:360,b:419,
  setup(){reset({parrot:true});onShip(0,26,6);[[26.3,-3.2],[25.7,-9.6],[26.6,-17]].forEach((q,i)=>{const b=BARRELS[i];b.x=q[0];b.z=q[1];b.t=0;b.g.visible=true;});warm(3,1/60);},
  tick(lf){G.joy.x=0;G.joy.y=-1;},
  cam(c,lf){const sh=SHIPS[0];if(lf<30)setCam(c,[sh.x-3.9+lf*.03,1.9+lf*.02,sh.z+7.4],[sh.x+.5,1.9,sh.z-2.5],null,50);else setCam(c,[sh.x+11.5,13.5,sh.z+9.5],[sh.x-2.5,0,sh.z-3.5],null,42);},
  ovl(ctx,lf,F){kword(ctx,'ПЛЫВИ',W-130,350,380,lf-3,{align:'right',block:SEA,color:'#fff',stroke:INK,sw:.07,rot:.03,seed:19,out:lf>=27?lf-27:-1});
    if(lf===30){ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(0,0,W,H);}drawFloats(ctx);wipeIn(ctx,lf,SEA,17);}});

/* ---------- FIRE THE CANNON at the shark (420-479) ---------- */
SHOTS.push({name:'cannon',a:420,b:479,hitStop:3,
  setup(){reset({parrot:true,sharks:true,fr:['powder'],coins:900000});onShip(0,30,-2);const k=SHARKS[0];this.k=k;k.x=31.4;k.z=-25;k.g.rotation.y=0;this.hit=-1;this.shot=-1;warm(3,1/60);},
  tick(lf){if(lf===23){G.attack();this.shot=lf;logEv('cannon');}},
  post(lf){const k=this.k;if(k.dead<=0){const u=E.out3(rm(lf,0,21));k.x=lerp(31.4,30.3,u);k.z=lerp(-25,-8.7,u);k.flee=0;k.g.position.set(k.x,-1.32+k.up*.6+Math.sin(lf*.5)*.04,k.z);k.g.rotation.y=0;}
    else if(this.hit<0){this.hit=lf;logEv('boom');const o=G.add(G.scene,new T.RingGeometry(.9,1.35,30),new T.MeshBasicMaterial({color:0xffffff,transparent:true,side:T.DoubleSide,depthWrite:false}),k.x,-1.22,k.z);o.rotation.x=-Math.PI/2;G.fx.push({k:'ring',o,t:.4});}},
  cam(c,lf){const sh=SHIPS[0],k=this.k;if(lf<20)setCam(c,[32.6,.3,-5.4],[k.x,.35,k.z],null,40);
    else if(lf<40)setCam(c,[sh.x+11.5-(lf-20)*.05,3.0,-6.4],[30.1,.5,-5.6],null,44);
    else setCam(c,[sh.x+3.0-(lf-40)*.02,1.35,sh.z+4.9],[sh.x,1.75,sh.z-.8],null,44);},
  ovl(ctx,lf,F){const sh=SHIPS[0];kword(ctx,'СТРЕЛЯЙ',120,340,340,lf-20,{align:'left',block:ORANGE,color:INK,rot:-.03,seed:23,out:lf>=37?lf-37:-1});
    if(this.shot>=0){const t=lf-this.shot,p=proj(sh.x,.2,sh.z-2.6);if(t<2){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],340);g.addColorStop(0,'rgba(255,245,200,1)');g.addColorStop(1,'rgba(255,160,40,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();shake(14,F);}
      if(t>=1&&t<11&&lf<40){ctx.save();for(let i=0;i<6;i++){const a=i*1.1+t*.1,r=30+t*16+i*9;ctx.fillStyle=`rgba(240,238,230,${(.75*(1-t/11)).toFixed(2)})`;ctx.beginPath();ctx.arc(p[0]+Math.cos(a)*r*.9,p[1]-t*9+Math.sin(a)*r*.5,34+t*4+i*3,0,TAU);ctx.fill();}ctx.restore();}}
    if(this.hit>=0&&lf<40){const p=proj(this.k.x,0,this.k.z),am=impact(ctx,lf-this.hit,p[0],p[1],F,true);shake(am,F);bam(ctx,lf-this.hit-1,p[0]+300,p[1]-260,'БУМ!',F);}
    if(lf<40)drawFloats(ctx);
    else{const t=lf-40;if(t===0){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(0,0,W,H);}const v=Math.round(150*E.out3(clamp(t/9)))*1000;
      kword(ctx,'+'+G.money(v),W-150,330,330,t*1.4,{align:'right',block:SUN,color:INK,rot:.03,seed:29,st:.4});hand(ctx,'монет за акулу',W-720,440,70,rm(t,5,12),INK);}}});

/* ---------- into the dark (480-509) ---------- */
SHOTS.push({name:'door',a:480,b:509,
  setup(){reset({parrot:true,killIsl:[18]});place(13.0,-33.6,Math.PI);parrotTo();warm(2,1/60);},
  tick(lf){G.joy.x=0;G.joy.y=-.3;},
  cam(c,lf){const k=E.in3(rm(lf,18,29));setCam(c,[lerp(14.7,13.2,E.in3(rm(lf,26,29))),lerp(1.8,.95,k),lerp(-28.6,-29.4,lf/30)-k*7.6],[13.2,1.0,-38.6],null,46);},
  ovl(ctx,lf,F){const g=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.95);g.addColorStop(0,'rgba(20,16,36,0)');g.addColorStop(1,`rgba(20,16,36,${(.25+lf*.02).toFixed(2)})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    const d=rm(lf,25,29);if(d>0){ctx.fillStyle=`rgba(21,19,31,${d.toFixed(2)})`;ctx.fillRect(0,0,W,H);}}});

/* ---------- EXPLORE: the cave (510-569) ---------- */
SHOTS.push({name:'cave',a:510,b:569,dark:()=>true,
  setup(){reset({parrot:true});place(400,-.4,Math.PI);parrotTo();warm(45,0);},
  tick(lf){G.joy.x=0;G.joy.y=-.36;},
  cam(c,lf){const u=E.io3(lf/60);setCam(c,v3l([402.9,1.15,3.0],[403.7,6.4,3.3],u),v3l([400.4,1.6,-9],[401.5,.2,-17],u),null,50);},
  ovl(ctx,lf,F){const d=1-rm(lf,0,16);if(d>0){ctx.fillStyle=`rgba(21,19,31,${d.toFixed(2)})`;ctx.fillRect(0,0,W,H);}
    kword(ctx,'ИССЛЕДУЙ',130,H-120,330,lf-18,{align:'left',block:PINK,balpha:.95,color:'#fff',stroke:'#15131f',sw:.08,rot:-.03,seed:31,shadowCol:'rgba(0,0,0,.4)',out:lf>=53?lf-53:-1});}});
SHOTS.push({name:'hall',a:570,b:599,dark:lf=>lf<22,
  setup(){reset({parrot:true,killIsl:[27]});place(397,-38.8,Math.PI);parrotTo();warm(45,0);},
  tick(lf){if(lf<5){G.joy.x=-.25;G.joy.y=-1;}else if(lf<15){G.joy.x=1;G.joy.y=-.12;}else{G.joy.x=0;G.joy.y=0;}},
  cam(c,lf){const u=E.out3(rm(lf,0,16)),k=E.in3(rm(lf,17,29));setCam(c,v3l(v3l([398,4.6,-31.2],[398,3.3,-33.8],u),[398,2.7,-40.4],k),v3l([398,1.2,-41.5],[398,2.5,-43.2],k),null,48);},
  ovl(ctx,lf,F){drawFloats(ctx,1.15);kword(ctx,'ИЩИ КЛАДЫ',W-130,330,300,lf-5,{align:'right',block:SUN,color:INK,rot:.03,seed:37,out:lf>=20?lf-20:-1});
    const w=rm(lf,21,27);if(w>0){ctx.fillStyle=`rgba(255,255,255,${(w*w).toFixed(2)})`;ctx.fillRect(0,0,W,H);}}});

/* ---------- WANTED (600-659) ---------- */
let POSTERS=null;const PL=[{x:300,r:-.09},{x:740,r:.05},{x:1180,r:-.04},{x:1620,r:.1}];
const posters=()=>POSTERS||(POSTERS=G.BOSS.map(b=>{const c=mk(460,600);G.drawPoster(c,{boss:b,name:b.name,bounty:b.bounty,seed:b.seed});return c;}));
function stamp(ctx,t,F){if(t<0)return;const s=lerp(3.4,1,E.out5(clamp(t/3)));ctx.save();ctx.rotate(-.3);ctx.scale(s,s);ctx.globalAlpha=clamp(t/1.5)*.93;ctx.strokeStyle=RED;ctx.fillStyle=RED;ctx.lineWidth=11;ctx.strokeRect(-205,-64,410,128);ctx.font=AM(120);ctx.textAlign='center';ctx.fillText('ПОЙМАН!',0,42);ctx.restore();}
function posterAt(ctx,i,x,y,sc,r,t,F,stampT){const P_=posters()[i];if(t<0)return;const s=sc*lerp(2.7,1,E.out5(clamp(t/4)));ctx.save();ctx.translate(x,y);ctx.rotate(r+(1-clamp(t/4))*.28);ctx.scale(s,s);ctx.globalAlpha=clamp(t/1.5);
  ctx.fillStyle='rgba(40,30,20,.3)';ctx.fillRect(-230+14+18*(1-clamp(t/4)),-300+18+24*(1-clamp(t/4)),460,600);ctx.drawImage(P_,-230,-300);ctx.fillStyle='rgba(246,207,58,.82)';ctx.fillRect(-64,-326,128,52);
  if(stampT!=null)stamp(ctx,stampT,F);ctx.restore();
  if(t>=3&&t<9){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.lineCap='round';for(let k=0;k<12;k++){const a=k/12*TAU+.2,r0=sc*370+(t-3)*22,r1=r0+38;ctx.globalAlpha=1-(t-3)/6;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r0*.8,y+Math.sin(a)*r0);ctx.lineTo(x+Math.cos(a)*r1*.8,y+Math.sin(a)*r1);ctx.stroke();}ctx.restore();}}
SHOTS.push({name:'posters',a:600,b:659,gl:false,sim:false,
  ovl(ctx,lf,F){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);let sh=0;for(let i=0;i<4;i++){const t=lf-i*15;if(t>=3&&t<8)sh=14*(1-(t-3)/5);}ctx.save();ctx.translate((h2(F,1)-.5)*2*sh,(h2(F,2)-.5)*2*sh);
    zig(ctx,-40,330,2000,640,'#f6e9c8',51+Math.floor(F/3),1,90,.8);
    kword(ctx,'РАЗЫСКИВАЮТСЯ',W/2,232,270,lf*1.3,{block:RED,color:'#fff',stroke:INK,sw:.07,rot:-.012,seed:41,st:.5});
    for(let i=0;i<4;i++)posterAt(ctx,i,PL[i].x,676,.98,PL[i].r,lf-i*15,F);ctx.restore();
    const w=1-lf/5;if(w>0){ctx.fillStyle=`rgba(255,255,255,${w.toFixed(2)})`;ctx.fillRect(0,0,W,H);}}});

/* ---------- the Kraken falls (660-689) ---------- */
SHOTS.push({name:'kraken',a:660,b:689,hitStop:5,
  setup(){reset({parrot:true,fr:['power']});place(0,-114.2,Math.PI);const m=MONS.find(q=>q.boss===G.BOSS[2]);this.m=m;m.hp=3;setM(m,0,-120.6);parrotTo();this.hit=-1;warm(2,1/60);},
  tick(lf){G.joy.x=0;G.joy.y=lf<8?-1:0;if(lf===7)G.jump();if(lf===15)G.attack();},
  post(lf){if(this.hit<0&&G.S.dead.includes(this.m.id)){this.hit=lf;logEv('slam');}},
  cam(c,lf){setCam(c,v3l([-7.8,1.5,-110.2],[-5.6,2.5,-111.4],lf/30),[0,2.7,-118.6],null,52);},
  ovl(ctx,lf,F){const t=lf-2;if(t>=0&&this.hit<0){const s=E.outBack(clamp(t/4));ctx.save();ctx.translate(110,H-250);ctx.rotate(-.025);ctx.scale(s,s);ctx.fillStyle='rgba(20,20,30,.3)';ctx.fillRect(10,14,1010,176);ctx.fillStyle=INK;ctx.fillRect(0,0,1010,176);
      ctx.font=AM(104);ctx.fillStyle=PAPER;ctx.fillText('КРАКЕН ЧЕРНИЛЬНОЕ ПУЗО',36,96);ctx.font=AM(64);ctx.fillStyle=SUN;ctx.fillText('награда  30 000 000',38,158);ctx.restore();}
    if(this.hit>=0){const p=hp2(),k=lf-this.hit,am=impact(ctx,k,p[0],p[1]-80,F,true);shake(am,F);bam(ctx,k-1,W*.62,H*.36,'БАЦ!',F);const w=rm(lf,this.hit+7,29);if(w>0){ctx.fillStyle=`rgba(251,250,244,${w.toFixed(2)})`;ctx.fillRect(0,0,W,H);}}}});
SHOTS.push({name:'caught',a:690,b:704,gl:false,sim:false,
  ovl(ctx,lf,F){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);const sh=lf>=2&&lf<7?16*(1-(lf-2)/5):0;ctx.save();ctx.translate((h2(F,1)-.5)*2*sh,(h2(F,2)-.5)*2*sh);
    zig(ctx,900,170,980,760,'#f6e9c8',61+Math.floor(F/3),1,90,.8);posterAt(ctx,2,560,545,1.55,-.05,lf+4,F,lf-2);
    const v=Math.round(30*E.out3(rm(lf,3,11)))*1000000;hand(ctx,'награда',1080,400,84,rm(lf,2,7),INK);kword(ctx,G.money(v),1040,640,250,(lf-3)*1.5,{align:'left',color:'#c98a06',st:.3,shadow:false,sw:.03});
    zig(ctx,1040,668,760,26,RED,7+Math.floor(F/2),E.out3(rm(lf,8,13)),15,.95);ctx.restore();}});
SHOTS.push({name:'allcaught',a:705,b:719,gl:false,sim:false,
  ovl(ctx,lf,F){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);let sh=0;for(let i=0;i<4;i++){const t=lf-1-i*3;if(t>=0&&t<4)sh=12*(1-t/4);}ctx.save();ctx.translate((h2(F,1)-.5)*2*sh,(h2(F,2)-.5)*2*sh);
    zig(ctx,-40,90,2000,600,'#f6e9c8',51+Math.floor(F/3),1,90,.8);
    for(let i=0;i<4;i++)posterAt(ctx,i,PL[i].x,420,.8,PL[i].r,99,F,lf-1-i*3);
    hand(ctx,'награда за тебя',150,860,80,rm(lf,3,9),INK);const v=Math.round(100*E.out3(rm(lf,4,12)))*1000000;kword(ctx,G.money(v),150,1030,230,(lf-4)*1.6,{align:'left',color:'#c98a06',st:.3,shadow:false,sw:.03});ctx.restore();
    wipeOut(ctx,lf,15,RED,71);}});

/* ---------- the numbers, one per beat (720-779) ---------- */
function stat(ctx,lt,num,label,x,y,align,onDark){const v=Math.round(num*E.out3(clamp(lt/6)));kword(ctx,String(v),x,y,540,lt*1.3,{align,block:SUN,color:BLUE,stroke:PAPER,sw:.06,rot:-.03,seed:num,st:.5});
  kword(ctx,label,x,y+210,210,(lt-2)*1.3,{align,color:onDark?'#fff':INK,stroke:onDark?INK:PAPER,sw:.09,rot:-.02,st:.5});}
SHOTS.push({name:'stat-islands',a:720,b:734,setup(){reset({});place(0,2.6,0);},
  cam(c,lf){setCam(c,v3l([-18,19,11],[-11.5,17,2.5],lf/15),[1,0,-22],null,50);},ovl(ctx,lf,F){stat(ctx,lf,24,'ОСТРОВА',150,560,'left',true);wipeIn(ctx,lf,RED,71);}});
SHOTS.push({name:'stat-monsters',a:735,b:749,setup(){reset({});place(11.5,-103.5,0);warm(8,1/60);},post(lf){MONS.forEach(m=>{m.bar.visible=false;});},
  cam(c,lf){const a=.5+lf*.022;setCam(c,[11.5+Math.sin(a)*7.6,2.5,-103.5+Math.cos(a)*7.6],[11.5,1.1,-103.5],null,48);},
  ovl(ctx,lf,F){if(!lf){ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(0,0,W,H);}stat(ctx,lf,78,'МОНСТРОВ',W-150,560,'right',true);}});
SHOTS.push({name:'stat-fruits',a:750,b:764,gl:false,sim:false,
  ovl(ctx,lf,F){ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);zig(ctx,-60,-40,2040,1160,'#fff3c4',81+Math.floor(F/3),1,120,.75);
    G.FR.forEach((f,i)=>{const a=i/15*TAU+lf*.045,s=E.outBack(clamp((lf-i*.3)/4));ctx.save();ctx.translate(W/2+Math.cos(a)*790,H/2+Math.sin(a)*400);ctx.rotate(Math.sin(a*2+lf*.2)*.25);G.drawFruit(ctx,f,0,0,5.2*s);ctx.restore();});
    stat(ctx,lf,15,'ФРУКТОВ',W/2,560,'center',false);}});
SHOTS.push({name:'stat-parrot',a:765,b:779,setup(){reset({parrot:true});place(0,2.6,0);parrotTo();warm(10,1/60);},
  post(lf){G.parrot.rotation.y=.55;},
  cam(c,lf){setCam(c,[PR.x+1.5-lf*.01,PR.y+.3,PR.z+2.4],[PR.x-.35,PR.y+.08,PR.z],null,34);},
  ovl(ctx,lf,F){if(!lf){ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(0,0,W,H);}stat(ctx,lf,1,'ПОПУГАЙ',170,560,'left',true);wipeOut(ctx,lf,15,BLUE,91);}});

/* ---------- back up into the sky: the world becomes a drawing again (780-809) ---------- */
SHOTS.push({name:'rise',a:780,b:809,
  setup(){reset({parrot:true});place(0,2.6,0);parrotTo();warm(6,1/60);},
  tick(lf){if(lf===2)G.jump();},
  cam(c,lf){const u=E.io5(rm(lf,0,29));setCam(c,v3l([P.x+3.4,1.9,P.z+6.6],[0,27.88,-2.5],u),v3l([P.x,1.25,P.z],[0,0,-2.5],u),v3l([0,1,0],[0,0,-1],E.io3(rm(lf,6,29))),50);},
  ovl(ctx,lf,F){wipeIn(ctx,lf,BLUE,91);}});
