// Sound design + score, rendered offline in the browser's Web Audio engine. 120 BPM, 12/8 feel, cuts on beats (15 frames).
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const ev={user:(process.argv[2]||'').startsWith('user'),ev:JSON.parse(fs.readFileSync(__dirname+'/events.json','utf8')),vo:JSON.parse(fs.readFileSync(__dirname+'/vo'+(process.argv[2]?'_'+process.argv[2]:'')+'.json','utf8'))};
const b=await chromium.launch();const p=await b.newPage();p.on('console',m=>console.log('PAGE',m.text()));p.on('pageerror',e=>console.log('PAGEERR',e.message));
const b64=await p.evaluate(async(IN)=>{const EV=IN.ev,VO=IN.vo;
const USER=IN.user,ED=USER?{t:838,u:860,w:[882,900,914],p:868,k:[924,927]}:{t:846,u:870,w:[870,878,885],p:883,k:[892,895]};
const sr=44100,DUR=USER?35.0:31.0,ac=new OfflineAudioContext(2,sr*DUR,sr),B=.5,U=B/3,ft=f=>f/30,hz=m=>440*Math.pow(2,(m-69)/12);
/* ---- buses ---- */
const master=ac.createGain();master.gain.value=.5;const comp=ac.createDynamicsCompressor();comp.threshold.value=-15;comp.knee.value=8;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.16;
const sh=ac.createWaveShaper();{const c=new Float32Array(2048);for(let i=0;i<2048;i++){const x=i/1024-1;c[i]=Math.tanh(x*1.6)/Math.tanh(1.6);}sh.curve=c;}
master.connect(comp);comp.connect(sh);sh.connect(ac.destination);
const music=ac.createGain(),mf=ac.createBiquadFilter();mf.type='lowpass';mf.frequency.value=17000;mf.Q.value=.6;const duck=ac.createGain();music.connect(mf);mf.connect(duck);duck.connect(master);
VO.forEach(q=>{const t=q[0],d=q[1];duck.gain.setValueAtTime(1,Math.max(0,t-.06));duck.gain.linearRampToValueAtTime(.5,t+.04);duck.gain.setValueAtTime(.5,t+d-.25);duck.gain.linearRampToValueAtTime(1,t+d);});
const drums=ac.createGain();drums.gain.value=1;drums.connect(master);const sfx=ac.createGain();sfx.gain.value=1;sfx.connect(master);
const rev=ac.createGain(),conv=ac.createConvolver(),revOut=ac.createGain();{const n=sr*2.4,ir=ac.createBuffer(2,n,sr);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6)*(i<200?i/200:1);}conv.buffer=ir;}
rev.connect(conv);conv.connect(revOut);revOut.gain.value=.5;revOut.connect(master);
const NB=ac.createBuffer(1,sr*2,sr);{const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
const ok=t=>t>=0&&t<DUR-.02;
function tone(type,f0,f1,t,dur,vol,dest,o){o=o||{};if(!ok(t))return;const os=ac.createOscillator(),g=ac.createGain();os.type=type;os.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)os.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur*(o.gl||1));
  if(o.det)os.detune.value=o.det;if(o.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.vib;lg.gain.value=f0*.012;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+dur+.05);}
  const a=o.a==null?.005:o.a;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);if(o.exp)g.gain.exponentialRampToValueAtTime(.0005,t+dur);else{g.gain.setValueAtTime(vol,t+Math.max(a,dur*(o.hold==null?.6:o.hold)));g.gain.linearRampToValueAtTime(0,t+dur);}
  let out=g;if(o.lp){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(o.lp,t);if(o.lp2)f.frequency.exponentialRampToValueAtTime(o.lp2,t+dur);f.Q.value=o.q||.7;g.connect(f);out=f;}
  os.connect(g);out.connect(dest);if(o.send){const s=ac.createGain();s.gain.value=o.send;out.connect(s);s.connect(rev);}os.start(t);os.stop(Math.min(DUR,t+dur+.05));}
function noise(t,dur,vol,dest,o){o=o||{};if(!ok(t))return;const s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();s.buffer=NB;s.loop=true;s.loopStart=Math.random();f.type=o.type||'bandpass';f.frequency.setValueAtTime(o.f0||2000,t);if(o.f1)f.frequency.exponentialRampToValueAtTime(o.f1,t+dur);f.Q.value=o.q||.8;
  const a=o.a==null?.004:o.a;if(o.swell){g.gain.setValueAtTime(.002,t);g.gain.exponentialRampToValueAtTime(vol,t+dur*.97);g.gain.linearRampToValueAtTime(0,t+dur);}else{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);}if(o.swell){}else if(o.exp)g.gain.exponentialRampToValueAtTime(.0005,t+dur);else{g.gain.setValueAtTime(vol,t+dur*.5);g.gain.linearRampToValueAtTime(0,t+dur);}
  s.connect(f);f.connect(g);g.connect(dest);if(o.send){const x=ac.createGain();x.gain.value=o.send;g.connect(x);x.connect(rev);}
  if(o.am){const l=ac.createOscillator(),lg=ac.createGain(),vg=ac.createGain();l.frequency.value=o.am;lg.gain.value=.5;vg.gain.value=.5;g.disconnect();g.connect(vg);l.connect(lg);lg.connect(vg.gain);vg.connect(dest);l.start(t);l.stop(t+dur+.05);}
  s.start(t,Math.random());s.stop(Math.min(DUR,t+dur+.05));}
/* ---- instruments ---- */
const KICKS=[];
const kick=(t,v=1)=>{KICKS.push(t);tone('sine',155,42,t,.3,.95*v,drums,{exp:1,gl:.4,a:.002});noise(t,.02,.25*v,drums,{type:'highpass',f0:2500,exp:1});};
const clap=(t,v=1)=>{noise(t,.16,.42*v,drums,{f0:1700,q:.9,exp:1,send:.25});noise(t+.012,.1,.3*v,drums,{f0:2400,q:1.2,exp:1});tone('triangle',200,150,t,.09,.25*v,drums,{exp:1});};
const hat=(t,v=.3)=>noise(t,.045,v*.42,drums,{type:'highpass',f0:7500,exp:1});
const tom=(t,f,v=.6)=>tone('sine',f*1.6,f,t,.22,v,drums,{exp:1,gl:.3,send:.15});
const crash=(t,v=.5)=>noise(t,1.6,v*.42,drums,{type:'highpass',f0:5200,exp:1,send:.5});
const bass=(t,m,d,v=.5)=>{tone('sawtooth',hz(m),0,t,d,v*.5,music,{lp:420,lp2:160,q:1.2,a:.006});tone('sine',hz(m-12),0,t,d,v*.75,music,{a:.006});};
const lead=(t,m,d,v=.2)=>{[-9,9].forEach(dt=>tone('sawtooth',hz(m),0,t,d,v*.5,music,{det:dt,lp:2600,lp2:1500,q:.9,a:.012,vib:5.5,send:.18}));tone('square',hz(m-12),0,t,d,v*.22,music,{lp:1200,a:.012});};
const pluck=(t,m,d,v=.3,s=.6)=>{tone('triangle',hz(m),0,t,d,v,music,{exp:1,a:.003,send:s});tone('sine',hz(m+12),0,t,d*.6,v*.4,music,{exp:1,a:.003,send:s});};
const stab=(t,ms,v=.3,d=.28)=>ms.forEach(m=>{[-11,11].forEach(dt=>tone('sawtooth',hz(m),0,t,d,v*.34,music,{det:dt,lp:3600,lp2:600,q:1.1,a:.004,hold:.25,send:.22}));});
const pad=(t,ms,d,v=.12)=>ms.forEach((m,i)=>{[-8,7].forEach(dt=>tone('sawtooth',hz(m),0,t,d,v*.4,music,{det:dt+i*3,lp:800,q:.6,a:d*.35,hold:.7,send:.5}));});
const whoosh=(t,d=.3,v=.4,up=true)=>noise(t,d,v,sfx,{f0:up?400:5000,f1:up?5200:350,q:1.4,a:d*.45,send:.2});
const riser=(t,d,v=.4)=>{noise(t,d,v,sfx,{type:'highpass',f0:900,f1:9000,q:.9,swell:1,send:.3});tone('sawtooth',110,880,t,d,v*.35,sfx,{a:d*.8,hold:.97,lp:1200,lp2:6000});};
const boom=(t,v=1)=>{tone('sine',95,28,t,1.3,.95*v,sfx,{exp:1,gl:.7,a:.003});noise(t,.7,.55*v,sfx,{type:'lowpass',f0:1400,f1:120,exp:1,send:.55});noise(t,.05,.5*v,sfx,{type:'highpass',f0:3000,exp:1});};
const pop=(t,m=76,v=.22)=>tone('sine',hz(m),hz(m+7),t,.07,v,sfx,{exp:1,a:.002,send:.15});
const tick=(t,m=88,v=.12)=>tone('triangle',hz(m),0,t,.035,v,sfx,{exp:1,a:.001});
const thud=(t,v=.7)=>{tone('sine',120,50,t,.2,v,sfx,{exp:1,gl:.4});noise(t,.07,v*.5,sfx,{type:'lowpass',f0:2600,exp:1,send:.25});};
const scratch=(t,d,v=.16)=>noise(t,d,v,sfx,{f0:3300+Math.random()*1500,q:1.1,am:17+Math.random()*9,a:.01});
/* ---- the epic layer: braams, taiko, choir, spiccato strings ---- */
const braam=(t,m,d=2.2,v=.5)=>{[0,7,12].forEach(iv=>[-15,0,14].forEach(dt=>tone('sawtooth',hz(m+iv),0,t,d,v*.15,music,{det:dt,lp:2400,lp2:260,q:2,a:.05,hold:.35,send:.5})));tone('sine',hz(m-12),0,t,d,v*.55,music,{a:.03,hold:.4});};
const taiko=(t,v=.7)=>{tone('sine',118,46,t,.55,v,drums,{exp:1,gl:.35,a:.003,send:.35});noise(t,.22,v*.4,drums,{type:'lowpass',f0:1100,f1:200,exp:1,send:.45});};
function choir(t,ms,d,v){if(!ok(t))return;ms.forEach((m,i)=>{[-7,8].forEach(dt=>{const os=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();os.type='sawtooth';os.frequency.value=hz(m);os.detune.value=dt+i*2;l.frequency.value=5.2;lg.gain.value=hz(m)*.008;l.connect(lg);lg.connect(os.frequency);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.18,d*.3));g.gain.setValueAtTime(v,t+d*.7);g.gain.linearRampToValueAtTime(0,t+d);
      [[720,5,1],[1120,6,.7],[2600,7,.25]].forEach(f=>{const b=ac.createBiquadFilter(),bg=ac.createGain();b.type='bandpass';b.frequency.value=f[0];b.Q.value=f[1];bg.gain.value=f[2];os.connect(b);b.connect(bg);bg.connect(g);});
      g.connect(music);const s=ac.createGain();s.gain.value=.7;g.connect(s);s.connect(rev);os.start(t);l.start(t);os.stop(Math.min(DUR,t+d+.05));l.stop(Math.min(DUR,t+d+.05));});});}
const spic=(t,m,v=.1)=>[-6,6].forEach(dt=>tone('sawtooth',hz(m),0,t,.1,v*.5,music,{det:dt,lp:3400,lp2:900,q:.9,a:.004,hold:.3,send:.2}));
/* ---- score ---- */
const MEL=[[62,2],[65,1],[69,2],[69,1],[67,2],[65,1],[64,2],[60,1],[62,2],[65,1],[69,2],[74,1],[72,2],[69,1],[69,3],[74,2],[72,1],[69,2],[65,1],[67,2],[69,1],[67,2],[64,1],[65,2],[64,1],[62,2],[60,1],[62,3],[62,2],[0,1]];
const PROG=[38,36,38,33,38,31,33,38],CH={38:[62,65,69],36:[60,64,67],33:[57,61,64],31:[55,58,62]};
const inWin=(t,ws)=>ws.some(w=>t>=w[0]-.001&&t<w[1]-.001);
/* intro: a music box over the pencil */
{let t=0;for(const n of MEL.slice(0,15)){if(n[0])pluck(t+.02,n[0]+12,n[1]*U*2.2,.2,.7);t+=n[1]*U;}pad(.2,[50,57,62],3.6,.1);}
/* lead + groove windows */
const LEADW=[[4,5.12],[6,16],[20,26]],GROOVE=[[4,5.12],[6,16],[20,26]];
{let t=4,i=0;while(t<26){const n=MEL[i%MEL.length];if(n[0]&&inWin(t,LEADW))lead(t,n[0]+(t>=20?12:0),n[1]*U*.95,t>=20?.17:.2);t+=n[1]*U;i++;}}
for(let gb=0;gb<44;gb++){const t=4+gb*B;if(!inWin(t,GROOVE))continue;const r=PROG[gb%8];kick(t);if(gb%2)clap(t);for(let u=0;u<3;u++)hat(t+u*U,u?.26:.5);
  bass(t,r,U*1.9,.55);bass(t+2*U,r+7,U*.85,.28);if(t>=20)stab(t,CH[r].map(m=>m),.2,.2);}
/* epic layer placement */
for(let gb=0;gb<44;gb++){const t=4+gb*B;if(!inWin(t,GROOVE))continue;const r=PROG[gb%8],big=t>=20;if(gb%2===0)taiko(t,big?.75:.5);if(gb%4===3){taiko(t+U,.35);taiko(t+2*U,.5);}
  [0,7,12].forEach((iv,u)=>spic(t+u*U,r+24+iv,big?.13:.075));if(big||t>=10)choir(t,CH[r].map(m=>m),B*.98,big?.085:.04);}
braam(4,38,1.9,.55);braam(20,38,2.4,.75);braam(22,36,1.6,.5);braam(24,38,1.8,.5);
choir(17.1,[50,57,62,65],2.8,.035);
/* fills */
[5.75,5.75+U,5.75+2*U].forEach((t,i)=>{clap(t,.7+i*.15);tom(t,180-i*30,.5);});
[15.5,15.5+U,15.5+2*U].forEach((t,i)=>tom(t,200-i*40,.6));noise(15.5,.5,.3,sfx,{f0:6000,f1:300,q:1.2,a:.02});
/* freeze frame: the music ducks under the card */
mf.frequency.setValueAtTime(17000,5.08);mf.frequency.exponentialRampToValueAtTime(380,5.2);mf.frequency.setValueAtTime(380,5.86);mf.frequency.exponentialRampToValueAtTime(17000,6.0);
[5.133,5.133+B,5.133+B*1].forEach(()=>{});for(let k=0;k<5;k++)hat(5.25+k*U,.2);
/* speed ramp on the jump */
mf.frequency.setValueAtTime(17000,ft(193));mf.frequency.exponentialRampToValueAtTime(700,ft(197));mf.frequency.setValueAtTime(700,ft(210));mf.frequency.exponentialRampToValueAtTime(17000,ft(214));
tone('sine',520,130,ft(194),.55,.25,sfx,{a:.02,send:.4});noise(ft(194),.6,.2,sfx,{f0:3000,f1:300,q:1.5,a:.1,send:.3});
/* breakdown: the cave */
music.gain.setValueAtTime(1,15.98);
tone('sine',36.7,0,16,3.9,.13,sfx,{a:1,hold:.8});tone('sine',73.4,0,16,3.9,.06,sfx,{a:1.2,hold:.8,lp:300});noise(16,3.9,.035,sfx,{type:'lowpass',f0:500,q:.5,a:1,send:.4});
for(let k=0;k<3;k++)thud(16.15+k*.36,.22);
pad(17,[50,53,57,64],2.9,.09);boom(17,.3);
[[17.4,86],[17.9,81],[18.25,89],[18.7,84],[19.1,93],[19.45,88]].forEach(q=>pluck(q[0],q[1],.5,.13,.9));
{let t=17.2;for(const n of MEL.slice(0,5)){pluck(t,n[0]+12,.9,.14,.9);t+=n[1]*U*2;}}
[18.3,18.36,19.5,19.55].forEach(t=>tone('sine',4200,5200,t,.04,.05,sfx,{exp:1,send:.6}));
riser(18.95,.95,.42);for(let k=0;k<16;k++){const t=19+.93*(1-Math.pow(1-k/16,1.7));clap(t,.25+k*.035);}
/* drop 2: posters */
boom(20,1);crash(20,.6);[603,618,633,648].forEach((f,i)=>{thud(ft(f),1);noise(ft(f),.12,.5,sfx,{f0:900,q:.6,exp:1,send:.3});});
/* stats */
[720,735,750,765].forEach((f,i)=>{const t=ft(f);stab(t,[62+[0,3,5,7][i],69+[0,3,5,7][i],74+[0,3,5,7][i]],.26,.3);for(let k=0;k<6;k++)tick(t+k/30,84+k*2,.13);pop(t+.2,79+i*2,.2);});
[0,.07].forEach((d,i)=>tone('sawtooth',1500+i*500,900+i*300,ft(766)+d,.11,.16,sfx,{lp:4200,a:.004,vib:38}));
/* finale */
riser(26,1,.5);for(let k=0;k<22;k++){const t=26+.97*(1-Math.pow(1-k/22,1.5));clap(t,.2+k*.03);}
for(let gb=0;gb<2;gb++){kick(26+gb*B);}
boom(27,1.1);crash(27,.75);braam(27,38,3.2,.5);taiko(27,.9);choir(27,[62,66,69,74,78],3.3,.04);for(let k=0;k<12;k++)taiko(26+k/12,.18+k*.03);
[[50,.3],[57,.26],[62,.26],[66,.24],[69,.22],[74,.18]].forEach(q=>{[-9,9].forEach(dt=>tone('sawtooth',hz(q[0]),0,27,3.6,q[1]*.26,music,{det:dt,lp:3200,lp2:500,q:.8,a:.01,exp:1,send:.5}));});
tone('sine',hz(26),0,27,3.4,.34,music,{a:.01,exp:1});
{let t=27.25;[[74,2],[78,1],[81,2],[78,1],[74,3]].forEach(n=>{pluck(t,n[0],1.1,.2,.8);t+=n[1]*U*1.15;});}
for(let k=0;k<22;k++)tick(ft(ED.t)+k*.9/30,70+(k*5)%12,.05);scratch(ft(ED.t),.75,.1);
whoosh(ft(ED.u),.22,.25);[[ED.w[0],74],[ED.w[1],78],[ED.w[2],81]].forEach(q=>{pluck(ft(q[0]),q[1],.9,.24,.8);pop(ft(q[0]),q[1]+12,.12);});
thud(ft(ED.p),.5);ED.k.forEach((f,i)=>tone('triangle',900-i*120,500,ft(f),.05,.2-i*.07,sfx,{exp:1}));
/* credits card (voiced cut only): a soft major-key coda */
if(USER){thud(ft(947),.8);noise(ft(947),.1,.4,sfx,{f0:1100,q:.6,exp:1,send:.3});pad(31.5,[50,57,62,66],3.3,.11);tone('sine',hz(26),0,31.55,3.2,.22,music,{a:.4,hold:.6});
  {let t=31.85;[[74,2],[78,1],[81,2],[86,1],[81,2],[78,1],[74,3]].forEach(n=>{pluck(t,n[0],1.0,.17,.8);t+=n[1]*U*1.25;});}
  [953,961].forEach(f=>{scratch(ft(f),.2,.12);pop(ft(f+3),78,.14);});for(let k=0;k<12;k++)tick(ft(971)+k*.7/30,72+(k*5)%12,.06);whoosh(ft(983),.2,.2);
  stab(ft(989),[74,78,81,86],.24,.5);pop(ft(989),90,.22);tom(ft(989),150,.5);crash(ft(989),.22);}
/* sidechain pump */
KICKS.forEach(t=>{if(t<26.9&&t>=4){music.gain.setValueAtTime(.42,t);music.gain.linearRampToValueAtTime(1,t+.17);}});
/* ---- picture-locked sound effects ---- */
/* pencil */
for(let t=.05;t<1.62;t+=.11+Math.random()*.05)scratch(t,.1+Math.random()*.06,.2);
for(let k=0;k<11;k++){const t=ft(48+k*4);scratch(t,.13,.22);scratch(t+.17,.12,.13);}
riser(2.75,1.18,.45);tone('sine',60,200,3.2,.72,.3,sfx,{a:.6,hold:.98});
/* the drop */
boom(4,1.15);crash(4,.7);[[120,62],[126,65],[132,69]].forEach(q=>{stab(ft(q[0]),[q[1],q[1]+7,q[1]+12],.3,.2);pop(ft(q[0]),q[1]+12,.2);});
whoosh(4.02,.9,.3,false);
/* freeze card */
noise(ft(154),.05,.5,sfx,{type:'highpass',f0:3500,exp:1});tone('sawtooth',900,90,ft(154),.22,.2,sfx,{lp:2500,a:.004});thud(ft(154),.8);
pop(ft(157),72,.25);for(let i=0;i<6;i++)tick(ft(163+i*.8),84+i,.14);noise(ft(160),.2,.1,sfx,{f0:3600,q:1.2,am:22});
/* wipes */
[177,297,357,717,777].forEach(f=>whoosh(ft(f),.18,.42));
/* words */
[[195,69],[249,74],[302,72],[304,76],[363,71],[440,74],[528,67],[575,72],[600,74]].forEach(q=>pop(ft(q[0]),q[1],.2));
/* stutter faces */
[228,232,236].forEach((f,i)=>{tom(ft(f),210-i*45,.8);pop(ft(f),70-i*3,.2);noise(ft(f),.05,.25,sfx,{type:'highpass',f0:4000,exp:1});});
/* shop: fifteen fruits */
for(let i=0;i<15;i++)tick(ft(301+i*.5),72+[0,2,4,7,9][i%5]+Math.floor(i/5)*12,.14);whoosh(ft(310),.16,.3);
/* thunder, giant */
noise(ft(334),.9,.7,sfx,{type:'lowpass',f0:3800,f1:200,exp:1,send:.6});boom(ft(334),.8);tone('sawtooth',60,170,ft(345),.32,.3,sfx,{lp:700,lp2:2200,a:.02});
/* sea + shark motif */
noise(12,2,.08,sfx,{type:'lowpass',f0:900,q:.5,a:.4,am:.6});
[420,428,434,438].forEach((f,i)=>{tone('sawtooth',hz(26+(i%2)),0,ft(f),.16,.34,sfx,{lp:500,q:1.5,a:.01});tone('sine',hz(38+(i%2)),0,ft(f),.16,.3,sfx,{a:.01});});
for(let k=0;k<9;k++)tick(ft(460+k),76+k*2,.13);pop(ft(469),96,.22);pop(ft(470.5),100,.18);
/* treasure hall shimmer */
[570,574,578,582].forEach((f,i)=>pluck(ft(f),86+i*3,.5,.08,.9));
/* kraken */
tone('sawtooth',55,48,ft(660),.5,.3,sfx,{lp:420,q:2,a:.05,vib:13});
/* stamps + counters */
thud(ft(692),1);noise(ft(692),.1,.5,sfx,{f0:1200,q:.6,exp:1,send:.3});for(let k=0;k<8;k++)tick(ft(693+k),76+k*2,.14);pop(ft(701.5),100,.22);
[706,709,712,715].forEach(f=>{thud(ft(f),.8);noise(ft(f),.06,.4,sfx,{f0:1500,q:.7,exp:1});});for(let k=0;k<8;k++)tick(ft(709+k),80+k*2,.12);pop(ft(717),103,.2);
/* events logged by the picture */
const coinAt=new Set();
EV.forEach(e=>{const n=e[0],t=ft(e[1]);
  if(n==='jump'){tone('sine',330,620,t,.13,.16,sfx,{a:.005});}
  else if(n==='swing'){noise(t,.11,.3,sfx,{f0:1800,f1:5200,q:1.6,a:.03});}
  else if(n==='hit'){tone('sine',170,70,t,.14,.6,sfx,{exp:1,gl:.4});noise(t,.07,.45,sfx,{f0:1500,q:.7,exp:1});}
  else if(n==='coin'){if(coinAt.has(e[1]))return;coinAt.add(e[1]);tone('sine',1318,0,t,.08,.16,sfx,{exp:1});tone('sine',1760,0,t+.07,.2,.16,sfx,{exp:1,send:.3});}
  else if(n==='zap'){tone('sawtooth',1500,200,t,.22,.16,sfx,{lp:5000,a:.003});}
  else if(n==='fire'){noise(t,.3,.4,sfx,{f0:700,f1:3200,q:1,a:.05});tone('sawtooth',160,520,t,.25,.16,sfx,{lp:1500,a:.02});}
  else if(n==='cannon'){boom(t,1.05);noise(t,.3,.6,sfx,{type:'lowpass',f0:5000,f1:300,exp:1,send:.5});}
  else if(n==='boom'){boom(t,.9);noise(t,.6,.5,sfx,{type:'lowpass',f0:2500,f1:400,exp:1,send:.5,am:14});}
  else if(n==='slam'){boom(t,1.1);noise(t,.25,.5,sfx,{type:'highpass',f0:1800,exp:1,send:.4});}
  else if(n==='win'){[74,78,81,86].forEach((m,i)=>pluck(t+.25+i*.06,m,.5,.14,.7));}
  else if(n==='splash'){noise(t,.4,.3,sfx,{f0:900,f1:300,q:.8,exp:1});}});
/* silence before each drop, clean tail at the end */
master.gain.setValueAtTime(.5,3.925);master.gain.linearRampToValueAtTime(0,3.94);master.gain.setValueAtTime(0,3.995);master.gain.linearRampToValueAtTime(.5,4.0);
master.gain.setValueAtTime(.5,19.925);master.gain.linearRampToValueAtTime(0,19.94);master.gain.setValueAtTime(0,19.995);master.gain.linearRampToValueAtTime(.5,20.0);
master.gain.setValueAtTime(.5,DUR-.4);master.gain.linearRampToValueAtTime(0,DUR-.02);
const buf=await ac.startRendering(),L=buf.getChannelData(0),Rr=buf.getChannelData(1),n=L.length,out=new DataView(new ArrayBuffer(44+n*4));let pk=0;for(let i=0;i<n;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(Rr[i]));console.log('peak',pk.toFixed(3));
const w=(o,s)=>{for(let i=0;i<s.length;i++)out.setUint8(o+i,s.charCodeAt(i));};w(0,'RIFF');out.setUint32(4,36+n*4,true);w(8,'WAVEfmt ');out.setUint32(16,16,true);out.setUint16(20,1,true);out.setUint16(22,2,true);out.setUint32(24,sr,true);out.setUint32(28,sr*4,true);out.setUint16(32,4,true);out.setUint16(34,16,true);w(36,'data');out.setUint32(40,n*4,true);
const k=.98/Math.max(pk,.98);for(let i=0;i<n;i++){out.setInt16(44+i*4,Math.max(-1,Math.min(1,L[i]*k))*32767,true);out.setInt16(46+i*4,Math.max(-1,Math.min(1,Rr[i]*k))*32767,true);}
let s='';const u8=new Uint8Array(out.buffer);for(let i=0;i<u8.length;i+=32768)s+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));return btoa(s);},ev);
fs.writeFileSync(__dirname+'/audio'+(process.argv[2]?'_'+process.argv[2]:'')+'.wav',Buffer.from(b64,'base64'));console.log('audio written',(b64.length*.75/1e6).toFixed(1)+'MB');await b.close();})();
