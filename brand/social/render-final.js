// The launch set: three posts, one motion file and one cover still each. Needs the repo served on :8765.
const {chromium}=require('playwright'); const {execSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const OUT=path.join(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
const enc=(dir,file)=>execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 -movflags +faststart "${path.join(OUT,file)}"`);
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}}); const dir=path.join(OUT,'_f');
  // Post 1
  await p.goto('http://localhost:8765/brand/social/grid.html?s=m1',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  for(let i=0;i<240;i++){await p.evaluate(([t,d])=>renderFrame(t,d),[i/30,8]);await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png')});}
  enc(dir,'LID_launch_1_idea.mp4'); await p.evaluate(()=>renderFrame(4,8)); await p.screenshot({path:path.join(OUT,'LID_launch_1_idea_cover.png')});
  // Posts 2 and 3
  await p.goto('http://localhost:8765/brand/social/motion.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  const DUR=await p.evaluate(()=>DUR);
  for(const [n,file,ct] of [['problem','LID_launch_2_problem',10.8],['offer','LID_launch_3_offer',11.5]]){
    fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); const N=Math.round(DUR[n]*30);
    for(let i=0;i<N;i++){await p.evaluate(([n,t])=>renderScene(n,t),[n,i/30]);await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png')});}
    enc(dir,file+'.mp4'); await p.evaluate(([n,t])=>renderScene(n,t),[n,ct]); await p.screenshot({path:path.join(OUT,file+'_cover.png')});
  }
  fs.rmSync(dir,{recursive:true,force:true}); await b.close();})();
