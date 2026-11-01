// Renders every motif to a ProRes 4444 .mov with alpha for Final Cut.
// Usage: node render.js [landscape|portrait|both] [fps]
const {chromium}=require('playwright'); const {execSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const FPS=+(process.argv[3]||30);
const SIZES={landscape:[1920,1080],portrait:[1080,1920]};
const which=process.argv[2]||'both'; const sizes=which==='both'?Object.keys(SIZES):[which];
const MOTIFS={pull:6,rings:4,field:8,band:7,merge:6,count:3,sting:3,chrome:8}; // seconds
const OUT=path.join(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1920,height:1080}});
  await p.goto('http://localhost:8765/brand/motion/render.html',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.load('800 40px Archivo'));
  for(const s of sizes){ const [w,h]=SIZES[s]; await p.setViewportSize({width:w,height:h});
    for(const [name,dur] of Object.entries(MOTIFS)){
      const dir=path.join(OUT,'_frames'); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
      const n=Math.round(dur*FPS);
      for(let i=0;i<n;i++){ await p.evaluate(([name,t,dur,w,h])=>renderFrame(name,t,dur,w,h),[name,i/FPS,dur,w,h]);
        const el=await p.$('#c'); await el.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png'),omitBackground:true}); }
      const mov=path.join(OUT,`LID_${name}_${s}_${w}x${h}_alpha.mov`);
      execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le -vendor apl0 "${mov}"`);
      console.log('done', path.basename(mov), n, 'frames');
    }
  }
  fs.rmSync(path.join(OUT,'_frames'),{recursive:true,force:true});
  await b.close();
})();
