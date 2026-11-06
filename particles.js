/* Locked In Dept. particle image. A <div class="fig" data-particles> becomes a 3D particle field sampled from its image.
   At rest the picture holds and breathes. Scrolling blows the particles outward in depth, toward and past the camera; scrolling back reassembles them.
   Cursor bends the field. data-particles sets the grid step in px (default 4). */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  document.querySelectorAll('[data-particles]').forEach(fig=>{
    const img=fig.querySelector('img'); if(!img) return;
    const stage=fig.closest('[data-particles-stage]')||fig; if(getComputedStyle(stage).position==='static') stage.style.position='relative';
    const c=document.createElement('canvas'); c.setAttribute('aria-hidden','true');
    Object.assign(c.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'0'});
    stage.appendChild(c); const g=c.getContext('2d');
    let w=1,h=1,ox=0,oy=0,fw=1,fh=1,dpr=1,P=[],mx=null,my=null,on=false,raf=0,prog=0,target=0; const t0=performance.now();
    const STEP=+fig.dataset.particles||4, FOV=900;
    function build(){
      const sr=stage.getBoundingClientRect(), r=fig.getBoundingClientRect(); w=sr.width; h=sr.height; ox=r.left-sr.left; oy=r.top-sr.top; fw=r.width; fh=r.height; dpr=Math.min(devicePixelRatio||1,2);
      c.width=w*dpr; c.height=h*dpr; g.setTransform(dpr,0,0,dpr,0,0);
      const s=document.createElement('canvas'); s.width=Math.ceil(fw); s.height=Math.ceil(fh); const sg=s.getContext('2d');
      const iw=img.naturalWidth, ih=img.naturalHeight, k=Math.max(fw/iw,fh/ih), dw=iw*k, dh=ih*k;
      const py=parseFloat((getComputedStyle(img).objectPosition.split(' ')[1]||'50%'))/100;
      sg.drawImage(img,(fw-dw)/2,(fh-dh)*py,dw,dh);
      const d=sg.getImageData(0,0,s.width,s.height).data; P=[];
      for(let y=STEP/2;y<fh;y+=STEP)for(let x=STEP/2;x<fw;x+=STEP){
        const i=((y|0)*s.width+(x|0))*4; const l=(d[i]*0.3+d[i+1]*0.59+d[i+2]*0.11)/255;
        if(l<0.06&&Math.random()<0.7) continue; // thin the near-black so the explosion is colour, not soot
        const ax=(x-fw/2)/fw, ay=(y-fh/2)/fh, m=Math.hypot(ax,ay)+0.05, rnd=Math.random();
        P.push({x:ox+x,y:oy+y,r:d[i],g:d[i+1],b:d[i+2],sz:STEP*(0.55+0.6*l),ph:Math.random()*6.283,
          vx:ax/m*(0.6+rnd)*w*0.7, vy:ay/m*(0.6+Math.random())*h*0.9, vz:-(200+Math.random()*1400), spin:(Math.random()-0.5)*2});
      }

    }
    function draw(t){
      g.clearRect(0,0,w,h);
      prog+=(target-prog)*0.12; const e=ease(Math.min(1,Math.max(0,prog)));
      const cx=ox+fw/2, cy=oy+fh/2;
      if(e>0.002&&fig.style.animation!=='none') fig.style.animation='none'; // the entrance animation owns opacity; drop it once scrolling starts
      fig.style.opacity=String(Math.max(0,1-e*6)); // photo stays whole at rest, fades as the field takes over
      g.fillStyle='#0B0B0B'; g.globalAlpha=Math.max(0,1-e*2.5); g.fillRect(ox,oy,fw,fh); g.globalAlpha=1;
      if(e<0.002) return;
      for(const p of P){
        let x=p.x+p.vx*e, y=p.y+p.vy*e, z=p.vz*e;
        if(e>0.001){ const a=p.spin*e*2; const dx=x-cx, dy=y-cy; x=cx+dx*Math.cos(a)-dy*Math.sin(a); y=cy+dx*Math.sin(a)+dy*Math.cos(a); }
        const sc=FOV/(FOV+z); if(sc<=0||sc>12) continue;
        x=cx+(x-cx)*sc; y=cy+(y-cy)*sc;
        if(mx!=null&&e<0.2){const dx=x-mx,dy=y-my,dd=Math.hypot(dx,dy)+1; const f=Math.max(0,1-dd/(w*0.18)); x+=dx/dd*f*22; y+=dy/dd*f*22;}
        if(x<-40||y<-40||x>w+40||y>h+40) continue;
        const sz=p.sz*sc*(1+0.08*Math.sin(t*2+p.ph)), al=Math.max(0,1-e*0.5)*(sc>3?Math.max(0,1-(sc-3)/6):1);
        g.fillStyle=`rgba(${p.r},${p.g},${p.b},${al})`; g.fillRect(x-sz/2,y-sz/2,sz,sz);
      }
    }
    function onScroll(){ const r=fig.getBoundingClientRect(); const top=r.top+scrollY; target=Math.min(1,Math.max(0,(scrollY-top*0.1)/(r.height*2.2))); }
    function loop(now){ if(!on) return; draw((now-t0)/1000); raf=requestAnimationFrame(loop); }
    function start(){ build(); onScroll(); if(reduce){ draw(0); return; }
      new IntersectionObserver(es=>es.forEach(e=>{on=e.isIntersecting; if(on&&!raf) raf=requestAnimationFrame(loop); if(!on){cancelAnimationFrame(raf);raf=0;}}),{rootMargin:'200px'}).observe(c);
      addEventListener('scroll',onScroll,{passive:true});
      fig.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
      fig.addEventListener('pointerleave',()=>{mx=my=null;});
      let rt; addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{build();onScroll();},150);});
    }
    if(img.complete&&img.naturalWidth) start(); else img.addEventListener('load',start,{once:true});
  });
})();
