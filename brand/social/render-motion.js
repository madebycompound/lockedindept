// Renders motion posts 2 and 3 to MP4 (H.264, 30fps). Needs the repo served on :8765. Usage: node render-motion.js [check]
const {chromium}=require('playwright'); const {execSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const OUT=path.join(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true}); const check=process.argv[2]==='check';
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
  p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:8765/brand/social/motion.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  const DUR=await p.evaluate(()=>DUR);
  if(check){ for(const [n,ts] of [['problem',[1.2,3.0,5.9,7.6,10.5]],['offer',[1.2,4.6,6.2,8.6,11]]]) for(const t of ts){await p.evaluate(([n,t])=>renderScene(n,t),[n,t]);await p.screenshot({path:path.join(OUT,`_chk_${n}_${t}.png`)});} await b.close(); return; }
  for(const [n,file] of [['problem','LID_post2-problem_motion.mp4'],['offer','LID_post3-offer_motion.mp4']]){
    const dir=path.join(OUT,'_f'); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); const N=Math.round(DUR[n]*30);
    for(let i=0;i<N;i++){await p.evaluate(([n,t])=>renderScene(n,t),[n,i/30]);await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png')});}
    execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 -movflags +faststart "${path.join(OUT,file)}"`);
    fs.rmSync(dir,{recursive:true,force:true}); console.log('done',file,N);
  }
  await b.close();})();
