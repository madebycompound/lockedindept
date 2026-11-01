import math,sys
W=H=1200; cx,cy=600,520; R=250
# sphere rotated so the pole shows top-left like the reference
def rot(x,y,z):
    a=-0.95; y,z = y*math.cos(a)-z*math.sin(a), y*math.sin(a)+z*math.cos(a)   # tilt toward viewer
    b=-0.45; x,y = x*math.cos(b)-y*math.sin(b), x*math.sin(b)+y*math.cos(b)   # roll
    return x,y,z
def pt(lat,lon):
    x=R*math.cos(lat)*math.sin(lon); y=-R*math.sin(lat); z=R*math.cos(lat)*math.cos(lon)
    return rot(x,y,z)
def smooth(t): t=max(0,min(1,t)); return t*t*(3-2*t)
# liquify field: flow toward lower-right with drips
N=(0.40,0.92)  # flow direction
DRIPS=[(-0.22,0.45,0.7),(0.08,0.9,0.72),(0.38,0.6,0.62),(0.66,1.1,0.75),(0.92,0.75,0.65),(1.15,0.4,0.6)]  # position along edge (t), length, width
DRIPS=[(0.05,0.85,0.75),(0.42,1.15,0.8),(0.78,0.7,0.7),(1.08,0.4,0.6)]
def field(X,Y,strength):
    px,py=X-cx,Y-cy
    s=(px*N[0]+py*N[1])/R
    q=(-px*N[1]+py*N[0])/R
    g=smooth((s+0.15)/1.0)
    m=g*g*strength*120
    dx,dy=N[0]*m,N[1]*m
    for (qc,ln,wd) in DRIPS:
        qq=qc-0.6
        w=math.exp(-((q-qq)/(0.2*wd))**2)
        pull=w*g*g*g*strength*ln*210
        dx+=N[0]*pull; dy+=N[1]*pull
    wave=g*g*strength*(24*math.sin(s*5.0+q*2.2)+5*math.sin(s*11+q*5))
    dx+=-N[1]*wave; dy+=N[0]*wave
    return X+dx,Y+dy,math.hypot(dx,dy)
def sphere(nlat=8,nlon=12,strength=1.0,steps=360):
    paths=[]
    def width(d): return 2.0+5.5*smooth(d/230.0)
    def emit_pts(pts):
        # short runs of 5 points, each with its own continuous width; round caps hide the joins
        n=len(pts); i=0
        while i<n-1:
            run=pts[i:i+6]
            w=sum(width(p[2]) for p in run)/len(run)
            paths.append(("M"+" L".join(f"{a:.1f},{b:.1f}" for a,b,_ in run), True, w))
            i+=5
    def emit(points):
        # front hemisphere only; interpolate the exact silhouette crossing so lines end on the rim
        segs=[]; seg=[]
        prev=None
        for (x,y,z) in points:
            if prev is not None and (z>=0)!=(prev[2]>=0):
                t=prev[2]/(prev[2]-z); mx=prev[0]+(x-prev[0])*t; my=prev[1]+(y-prev[1])*t
                if z>=0: seg=[(mx,my,0.0)]
                else: seg.append((mx,my,0.0)); segs.append(seg); seg=[]
            if z>=0: seg.append((x,y,z))
            prev=(x,y,z)
        if seg: segs.append(seg)
        for sg in segs:
            if len(sg)<2: continue
            pts=[]
            for (x,y,z) in sg:
                X,Y=cx+x,cy+y; X,Y,d=field(X,Y,strength); pts.append((X,Y,d))
            emit_pts(pts)
    # latitudes: regular spacing, plus extra rings tightening toward the pole
    lats=[-math.pi/2+math.pi*i/nlat for i in range(1,nlat)]
    lats+=[math.radians(a) for a in (87,83,78,72,66)]
    for lat in sorted(set(lats)): emit([pt(lat,2*math.pi*k/steps) for k in range(steps+1)])
    for j in range(nlon): emit([pt(-math.pi/2+math.pi*k/steps,2*math.pi*j/nlon) for k in range(steps+1)])
    # silhouette: circle of radius R in screen space, through the field
    pts=[]
    for k in range(steps+1):
        t=2*math.pi*k/steps; X,Y,d=field(cx+R*math.cos(t),cy+R*math.sin(t),strength); pts.append((X,Y,d))
    emit_pts(pts)
    return paths
def ring(rx,ry,rotd,strength):
    out=[]; seg=[]
    for k in range(721):
        t=2*math.pi*k/720; x=rx*math.cos(t); y=ry*math.sin(t)
        xr=x*math.cos(rotd)-y*math.sin(rotd); yr=x*math.sin(rotd)+y*math.cos(rotd)
        behind = (math.sin(t)<0) and (math.hypot(xr,yr)<R-2)   # upper half of the ellipse, inside the sphere disc
        if behind:
            if len(seg)>1: out.append(seg)
            seg=[]; continue
        X,Y,_=field(cx+xr,cy+yr,strength*0.35); seg.append((X,Y))
    if len(seg)>1: out.append(seg)
    return ["M"+" L".join(f"{a:.1f},{b:.1f}" for a,b in sg) for sg in out]
def arctext(text,r,fs,start_deg,end_deg,id_):
    a0=math.radians(start_deg); a1=math.radians(end_deg)
    x0,y0=cx+r*math.cos(a0),cy+r*math.sin(a0); x1,y1=cx+r*math.cos(a1),cy+r*math.sin(a1)
    L=round(r*(a1-a0))
    return f'<defs><path id="{id_}" d="M {x0:.1f},{y0:.1f} A {r},{r} 0 {1 if a1-a0>math.pi else 0},1 {x1:.1f},{y1:.1f}"/></defs><text font-family="Archivo, Helvetica, Arial, sans-serif" font-weight="800" font-size="{fs}" fill="#fff"><textPath href="#{id_}" textLength="{L}" lengthAdjust="spacing">{text}</textPath></text>'
ST='fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"'
def make(name,text="LOCKED IN DEPT. · EST. 2026",strength=1.0,reg=True):
    body=''.join(f'<path d="{d}" {ST}/>' for d in ring(430,120,-0.35,strength))
    body+=''.join(f'<path d="{p}" fill="none" stroke="#fff" stroke-width="{bk:.2f}" stroke-linecap="round" stroke-linejoin="round" opacity="1"/>' for p,fr,bk in sphere(nlat=8,nlon=16,strength=strength))
    body+=arctext(text,300,54,-208,-8,"t"+name)
    if reg: body+='<text x="930" y="760" font-family="Archivo, Helvetica, Arial, sans-serif" font-weight="800" font-size="40" fill="#fff">®</text>'
    open(name+'.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><rect width="100%" height="100%" fill="#000"/>{body}</svg>')
if __name__=="__main__":
    make("E1",strength=float(sys.argv[1]) if len(sys.argv)>1 else 1.0)
