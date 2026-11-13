const {chromium}=require('playwright');const fs=require('fs');const {spawn,execFileSync}=require('child_process');
(async()=>{const mode=process.argv[2];
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
p.on('console',m=>{if(m.type()==='error')console.log('ERR',m.text());});p.on('pageerror',e=>console.log('PAGEERR',e.message.slice(0,300)));
if(process.env.TLANG)await p.addInitScript(l=>{window.__lang=l;},process.env.TLANG);
await p.goto('file://'+__dirname+'/trailer.html');await p.waitForFunction(()=>window.__ready===true,null,{timeout:60000});
await p.evaluate(()=>Promise.all([document.fonts.load('700 100px "Amatic SC"','АБВ1'),document.fonts.load('60px "Neucha"','абв'),document.fonts.ready]));
if(mode==='sheet'){const frames=process.argv[3].split(',').map(Number),out=process.argv[4]||'sheet.png';fs.rmSync('tmpf',{recursive:true,force:true});fs.mkdirSync('tmpf');
  const t0=Date.now();let n=0;for(const f of frames){await p.evaluate(f=>window.__renderFrame(f,true),f);await p.screenshot({path:`tmpf/${String(n).padStart(4,'0')}_${f}.jpg`,type:'jpeg',quality:88});n++;}
  console.log('ms/frame',((Date.now()-t0)/n).toFixed(0));
  execFileSync('python3',['-I',__dirname+'/montage.py','tmpf',out,process.argv[5]||'4']);}
else if(mode==='full'){const out=process.argv[3]||'video.mp4',from=+(process.argv[4]||0),to=+(process.argv[5]||929);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','slow','-crf','15','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
  await p.evaluate(()=>window.__setLogging(true));const t0=Date.now();
  for(let f=from;f<=to;f++){await p.evaluate(f=>window.__renderFrame(f,true),f);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
    if(f%30===0)console.log('frame',f,((Date.now()-t0)/1000).toFixed(0)+'s');}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));fs.writeFileSync('events'+(process.env.TLANG?'_'+process.env.TLANG:'')+'.json',JSON.stringify(await p.evaluate(()=>window.__log())));console.log('done',((Date.now()-t0)/1000).toFixed(0)+'s');}
await b.close();})();
