// Renders the grid posts: PNG slides for the two carousels and an MP4 for the motion post. Needs the repo served on :8765.
const {chromium}=require('playwright'); const {execSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const OUT=path.join(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
  const open=async id=>{await p.goto('http://localhost:8765/brand/social/grid.html?s='+id,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);};
  for(const [post,ids] of [['2-problem',['p1','p2','p3','p4','p5','p6','p7']],['3-offer',['o1','o2','o3','o4','o5','o6']]]){
    for(let i=0;i<ids.length;i++){await open(ids[i]);await p.screenshot({path:path.join(OUT,`LID_post${post}_${String(i+1).padStart(2,'0')}.png`)});}
  }
  await open('m1'); const dir=path.join(OUT,'_f'); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir); const FPS=30,DUR=8;
  for(let i=0;i<FPS*DUR;i++){await p.evaluate(([t,d])=>renderFrame(t,d),[i/FPS,DUR]);await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png')});}
  await p.evaluate(()=>renderFrame(4,8)); await p.screenshot({path:path.join(OUT,'LID_post1-idea_cover.png')});
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 -movflags +faststart "${path.join(OUT,'LID_post1-idea_motion.mp4')}"`);
  fs.rmSync(dir,{recursive:true,force:true}); await b.close();})();
