// Estudio 3D do Fiscal Boom!: modela personagens e objetos com Three.js
// e gera sprites (visao de cima 3/4) com fundo transparente.
import * as THREE from "three";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";

const TILE=48, ELEV=Math.atan2(1,.72);        // altura projetada = 0,72 x altura real
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.setClearColor(0x000000,0);

// ---------- materiais e formas ----------
const M=(color,o={})=>new THREE.MeshStandardMaterial({color,roughness:o.r??.62,metalness:o.m??0,emissive:o.e??0x000000,emissiveIntensity:o.ei??1,map:o.map||null,transparent:!!o.t,opacity:o.t??1});
const box=(w,h,d,mat,r=.03,seg=3)=>new THREE.Mesh(new RoundedBoxGeometry(w,h,d,seg,Math.min(r,w/2-.001,h/2-.001,d/2-.001)),mat);
const sph=(r,mat,ws=32,hs=24)=>new THREE.Mesh(new THREE.SphereGeometry(r,ws,hs),mat);
const cyl=(rt,rb,h,mat,seg=28)=>new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);
const cap=(r,len,mat)=>new THREE.Mesh(new THREE.CapsuleGeometry(r,len,8,20),mat);
const at=(m,x,y,z,rx=0,ry=0,rz=0,sx=1,sy=sx,sz=sx)=>{m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.scale.set(sx,sy,sz);return m};
const grp=(...ch)=>{const g=new THREE.Group();ch.forEach(c=>g.add(c));return g};
const tex=(w,h,draw)=>{const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};

// texturas
const woodTex=(base="#b5793f",line="#7a4a24")=>tex(128,128,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);
  for(let i=0;i<4;i++){g.fillStyle=line;g.fillRect(0,i*32+30,w,3)}
  g.globalAlpha=.25;for(let i=0;i<60;i++){g.fillStyle=i%2?"#fff3d0":"#3d2410";g.fillRect(Math.random()*w,Math.random()*h,8+Math.random()*30,1)}});
const barkTex=tex(128,64,(g,w,h)=>{g.fillStyle="#6b4527";g.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){g.fillStyle=i%3?"#4a2e17":"#8a6038";g.fillRect(Math.random()*w,Math.random()*h,10+Math.random()*25,2)}});
const ringTex=tex(64,64,(g,w,h)=>{g.fillStyle="#e2b47a";g.beginPath();g.arc(32,32,32,0,7);g.fill();
  g.strokeStyle="#a8784a";g.lineWidth=2;for(const r of [8,14,20,26]){g.beginPath();g.arc(32,32,r,0,7);g.stroke()}
  g.fillStyle="#8a5e36";g.beginPath();g.arc(32,32,3,0,7);g.fill()});
const textTex=(text,bg,fg,w=128,h=48,font="900 30px Arial")=>tex(w,h,(g)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font=font;g.textAlign="center";g.textBaseline="middle";g.fillText(text,w/2,h/2+2)});

// ---------- personagens ----------
const SKIN=0xe8ad80;
function eye(x,y,z,s=1){return grp(at(sph(.032,M(0x1a1410,{r:.3}),16,12),x,y,z,0,0,0,s,s*1.25,s*.6),at(sph(.011,M(0xffffff,{e:0xffffff,ei:.6}),8,6),x-.01*s,y+.014*s,z+.018))}
function legPair(pants,boot,phase){
  const g=new THREE.Group();
  for(const s of [-1,1]){
    const hip=new THREE.Group();hip.position.set(s*.075,.25,0);
    hip.add(at(cap(.062,.11,M(pants)),0,-.1,0));
    hip.add(at(box(.12,.075,.18,M(boot,{r:.45}),.03),0,-.2,.025));
    hip.rotation.x=Math.sin(phase*Math.PI*2)*.55*s;
    g.add(hip);
  }
  return g;
}
function arm(side,sleeve,phase,extra){
  const sh=new THREE.Group();sh.position.set(side*.2,.52,0);
  sh.add(at(cap(.052,.13,M(sleeve)),0,-.1,0));
  sh.add(at(sph(.058,M(SKIN)),0,-.21,0));
  if(extra)sh.add(extra);
  sh.rotation.x=-Math.sin(phase*Math.PI*2)*.5*side;sh.rotation.z=side*.12;
  return sh;
}
export function fiscal(dir=2,frame=0,hero=false){
  const phase=frame?(frame-1)/4:0, root=new THREE.Group(), body=new THREE.Group();
  root.add(body);
  body.position.y=frame?Math.abs(Math.sin(phase*Math.PI*2))*.03:0;
  body.add(legPair(0x2f3b2c,0x1d1a17,phase));
  // tronco: camisa + colete
  body.add(at(box(.36,.3,.24,M(0xc2a873),.08),0,.42,0));
  const vest=M(0x56733a,{r:.7});
  body.add(at(box(.37,.27,.25,vest,.08),0,.41,0));
  const stripe=M(0xeaf27c,{e:0x8a8f20,ei:.35,r:.3});
  body.add(at(box(.375,.035,.255,stripe,.012),0,.37,0));
  body.add(at(box(.38,.05,.26,M(0x2b2219),.015),0,.29,0));         // cinto
  body.add(at(box(.06,.04,.02,M(0xd9b25a,{m:.8,r:.3}),.008),0,.29,.13));
  // bolsos, distintivo, ziper
  for(const s of [-1,1])body.add(at(box(.085,.07,.02,M(0x44602b),.01),s*.09,.44,.125));
  body.add(at(box(.012,.22,.01,M(0xd8c99a)),0,.43,.128));
  body.add(at(cyl(.025,.025,.012,M(0xffd56a,{m:.9,r:.25})),.11,.5,.13,Math.PI/2));
  // costas: FISCAL
  const back=new THREE.Mesh(new THREE.PlaneGeometry(.32,.1),new THREE.MeshStandardMaterial({map:textTex("IBAMA","#2c3d22","#f4f7cf",180,52,"900 34px Arial"),roughness:.7}));
  body.add(at(back,0,.45,-.128,0,Math.PI));
  // radio no ombro
  body.add(at(box(.06,.09,.05,M(0x22302a),.015),-.17,.56,.07));
  body.add(at(sph(.012,M(0x7dff8a,{e:0x3dff5a,ei:1})),-.17,.62,.09));
  // bracos
  if(hero){
    // bracos cruzados
    for(const s of [-1,1]){
      const sh=new THREE.Group();sh.position.set(s*.2,.52,0);
      sh.add(at(cap(.052,.1,M(0xb39a66)),0,-.08,0));
      const fore=new THREE.Group();fore.position.set(0,-.16,0);
      fore.add(at(cap(.05,.14,M(0xb39a66)),-s*.09,0,.07,0,0,s*1.45));
      fore.add(at(sph(.055,M(SKIN)),-s*.2,0,.09));
      sh.add(fore);sh.rotation.x=-.35;sh.rotation.z=s*.1;body.add(sh);
    }
  }else{body.add(arm(-1,0xb39a66,phase));body.add(arm(1,0xb39a66,phase))}
  // cabeca
  const head=new THREE.Group();head.position.y=.76;body.add(head);
  head.add(sph(.2,M(SKIN,{r:.55})));
  head.add(at(sph(.2,M(0x3a2618)),0,-.02,-.03,0,0,0,1.0,.9,.95));     // cabelo atras
  head.add(at(sph(.2,M(SKIN,{r:.55})),0,0,.01));
  for(const s of [-1,1]){
    head.add(eye(s*.072,-.035,.18,1.1));
    head.add(at(sph(.03,M(0xf08f7a,{t:.6})),s*.12,-.09,.15,0,0,0,1,.6,.5));
    head.add(at(sph(.04,M(SKIN)),s*.2,-.01,0,0,0,0,.5,.8,.6));          // orelhas
  }
  head.add(at(sph(.022,M(0xdc9670)),0,-.07,.2));
  head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.035,.009,8,16,Math.PI),M(0x8a3e2c)),0,-.115,.175,Math.PI,0,0,hero?1.3:1,hero?.6:1,1));
  if(hero){
    // oculos escuros
    const lens=M(0x101418,{m:.7,r:.12});
    for(const s of [-1,1]){
      head.add(at(box(.11,.065,.03,lens,.025),s*.075,-.03,.198));
      head.add(at(box(.035,.012,.01,M(0xffffff,{e:0xffffff,ei:.7})),s*.075-.025,-.012,.215,0,0,.4));
      head.add(at(box(.012,.012,.2,M(0x101418)),s*.19,-.025,.1));
    }
    head.add(at(box(.05,.014,.015,M(0x101418)),0,-.02,.205));
  }
  // bone
  const capMat=M(0x64823c,{r:.7});
  head.add(at(new THREE.Mesh(new THREE.SphereGeometry(.218,32,16,0,Math.PI*2,0,Math.PI/2),capMat),0,.075,-.005,0,0,0,1,.92,1));
  head.add(at(cyl(.218,.218,.03,capMat,32),0,.085,0));
  head.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.025,32,1,false,-Math.PI/2,Math.PI),M(0x3c5224)),0,.08,.13,.18,0,0,1,1,.9));
  head.add(at(cyl(.04,.04,.012,M(0xffd56a,{m:.8,r:.3})),0,.18,.17,Math.PI/2.4));
  head.add(at(sph(.024,capMat),0,.28,0));
  root.rotation.y=[Math.PI,Math.PI/2,0,-Math.PI/2][dir];
  return root;
}
export function garimpeiro(frame=0){
  const phase=frame/4,root=new THREE.Group(),body=new THREE.Group();root.add(body);
  body.position.y=Math.abs(Math.sin(phase*Math.PI*2))*.035;
  body.add(legPair(0x3d5a8a,0x3b2a1c,phase));
  body.add(at(box(.34,.3,.23,M(0xe5763a,{r:.75}),.09),0,.42,0));
  body.add(at(box(.12,.05,.02,M(0xffffff,{t:.25})),-.06,.5,.12));
  body.add(arm(-1,0xe5763a,phase));
  const pan=at(grp(at(cyl(.13,.08,.04,M(0x9aa3a6,{m:.7,r:.35})),0,0,0),at(cyl(.09,.06,.01,M(0xe8c35a,{m:.6,r:.3})),0,.02,0)),0,-.26,.09,.5);
  body.add(arm(1,0xe5763a,phase+.5,pan));
  const head=new THREE.Group();head.position.y=.74;body.add(head);
  head.add(sph(.19,M(0xd89a6d,{r:.55})));
  for(const s of [-1,1])head.add(eye(s*.068,.0,.17,.95));
  head.add(at(cap(.025,.1,M(0x3a2418)),0,-.065,.175,0,0,Math.PI/2));
  head.add(at(sph(.026,M(0xc4825a)),0,-.035,.19));
  // chapeu de palha
  const straw=M(0xe6c06a,{r:.85}),band=M(0x8a3b26);
  head.add(at(cyl(.32,.32,.025,straw,40),0,.09,0));
  head.add(at(cyl(.14,.16,.14,straw,32),0,.17,0));
  head.add(at(cyl(.162,.162,.035,band,32),0,.12,0));
  root.rotation.y=.62;
  return root;
}
export function boss(enraged=false,windup=false){
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);body.scale.setScalar(1.45);
  body.add(legPair(0x1b2233,0x120f0c,0));
  const suit=M(0x24314f,{r:.55});
  body.add(at(box(.44,.36,.28,suit,.12),0,.44,0));
  body.add(at(new THREE.Mesh(new THREE.ConeGeometry(.09,.22,3),M(0xf5f1dd)),0,.53,.13,Math.PI,0,0,1,1,.3));
  body.add(at(box(.045,.2,.02,M(0xc42f45),.01),0,.47,.15));
  body.add(at(box(.07,.012,.01,M(0xd8b45a,{m:.8})),-.13,.52,.145));
  // motosserra na mao direita
  const saw=grp(at(box(.16,.12,.1,M(0xf07d1e,{r:.45}),.03),0,0,0),at(box(.07,.05,.06,M(0x2a2c2b),.02),0,.08,0),
    at(box(.3,.04,.06,M(0xb9bfbd,{m:.85,r:.25}),.02),.21,0,0));
  for(let i=0;i<8;i++)saw.add(at(box(.02,.015,.065,M(0x3a3d3f)),.08+i*.035,.025*(i%2?1:-1),0));
  body.add(arm(1,0x24314f,0,at(saw,.1,-.24,.05,0,-.3,windup?.9:.2)));
  const paper=at(new THREE.Mesh(new THREE.PlaneGeometry(.2,.26),new THREE.MeshStandardMaterial({map:textTex("PL","#fff6dd","#a3322b",64,84,"900 40px Arial"),side:THREE.DoubleSide,roughness:.8})),0,0,0);
  const left=arm(-1,0x24314f,0,null);if(windup){left.rotation.x=-2.7;left.rotation.z=-.25;body.add(at(paper,-.26,1.12,.16,-.15,0,.18))}
  body.add(left);
  const head=new THREE.Group();head.position.y=.8;body.add(head);
  const skin=enraged?0xe8604f:0xeab385;
  head.add(at(sph(.22,M(skin,{r:.5})),0,0,0,0,0,0,1.05,1,1));
  for(const s of [-1,1]){
    head.add(at(sph(.05,M(skin)),s*.22,0,0,0,0,0,.5,.8,.6));
    if(enraged){head.add(at(sph(.04,M(0xfff2d8)),s*.08,.02,.19,0,0,0,1,.7,.5));head.add(at(sph(.016,M(0x1c1714)),s*.08,.02,.215))}
    else head.add(eye(s*.08,.02,.2,1.05));
    head.add(at(box(.11,.026,.02,M(0x392723)),s*.08,.085,.205,0,0,enraged?s*.55:s*.3));
  }
  head.add(at(sph(.035,M(enraged?0xc84a3c:0xd99a70)),0,-.03,.22));
  if(enraged)head.add(at(box(.12,.04,.02,M(0x5a1d26),.015),0,-.11,.2));
  else head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.055,.012,8,16,Math.PI),M(0x763529)),0,-.1,.19,Math.PI,0,0));
  // chapeu de fazendeiro
  const hat=M(0xb98450,{r:.75});
  head.add(at(cyl(.36,.36,.035,hat,40),0,.14,0,0,0,0,1,1,.85));
  head.add(at(cyl(.17,.2,.2,hat,32),0,.25,0));
  head.add(at(cyl(.203,.203,.045,M(0x5a3622),32),0,.17,0));
  root.rotation.y=0;
  return root;
}

// ---------- garimpeiro bandido ----------
const stripeTex=tex(64,64,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?"#1d1f22":"#e8e4d8";g.fillRect(0,i*8,w,8)}});
export function bandido(mode="run",frame=0){
  const dig=mode==="dig",phase=frame/4,root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const swing=dig?[-2.5,-1.6,.25,-.6][frame]:0;      // picareta: ergue, desce, bate, volta
  body.rotation.x=dig?[.05,.12,.42,.28][frame]:.08;  // curva o corpo ao bater
  body.position.y=dig?0:Math.abs(Math.sin(phase*Math.PI*2))*.035;
  body.add(legPair(0x3a3026,0x1a1512,dig?0:phase));
  const shirt=M(0xffffff,{map:stripeTex,r:.8});
  body.add(at(box(.35,.3,.24,shirt,.09),0,.42,0));
  body.add(at(box(.37,.05,.25,M(0x2b2219),.015),0,.29,0));
  // saco de ouro nas costas
  const sack=grp(at(sph(.17,M(0x9b7448,{r:.95}),20,16),0,0,0,0,0,0,1,1.1,.9),
    at(cyl(.06,.09,.06,M(0x7a5634,{r:.95})),0,.18,0),
    at(sph(.05,M(0xffd34a,{m:.9,r:.2,e:0x8a6a10,ei:.4}),12,10),.03,.24,.02),
    at(sph(.04,M(0xffe27a,{m:.9,r:.2,e:0x8a6a10,ei:.4}),12,10),-.04,.22,-.02),
    at(new THREE.Mesh(new THREE.PlaneGeometry(.16,.12),new THREE.MeshStandardMaterial({map:textTex("$","#9b7448","#ffd34a",64,48,"900 40px Arial"),transparent:true})),0,.0,-.16,0,Math.PI));
  body.add(at(sack,0,.5,-.2));
  // bracos: picareta (garimpando) ou correndo
  const pick=grp(at(cyl(.022,.022,.5,M(0x7a5232,{r:.8})),0,0,0),
    at(new THREE.Mesh(new THREE.ConeGeometry(.035,.2,10),M(0x9aa3a6,{m:.8,r:.3})),.1,.24,0,0,0,-1.6),
    at(new THREE.Mesh(new THREE.ConeGeometry(.035,.2,10),M(0x9aa3a6,{m:.8,r:.3})),-.1,.24,0,0,0,1.6));
  if(dig){
    for(const s of [-1,1]){
      const sh=new THREE.Group();sh.position.set(s*.19,.52,.02);
      sh.add(at(cap(.05,.13,shirt),0,-.1,0));sh.add(at(sph(.055,M(SKIN)),0,-.2,0));
      sh.rotation.x=swing;sh.rotation.z=s*-.25;body.add(sh);
    }
    const holder=new THREE.Group();holder.position.set(0,.52,.02);holder.rotation.x=swing;body.add(holder);
    holder.add(at(pick,0,-.36,.08,Math.PI/2+.2));
  }else{
    body.add(arm(-1,0x1d1f22,phase));body.add(arm(1,0x1d1f22,phase+.5));
  }
  // cabeca com touca ninja
  const head=new THREE.Group();head.position.y=.76;body.add(head);
  head.add(sph(.2,M(0x26282e,{r:.85})));
  head.add(at(box(.32,.105,.12,M(SKIN,{r:.55}),.045),0,.0,.135));
  for(const s of [-1,1]){
    head.add(eye(s*.07,0,.195,1.2));
    head.add(at(box(.11,.03,.02,M(0x0d0d0f)),s*.07,.05,.2,0,0,s*.5));   // sobrancelha brava
  }
  head.add(at(sph(.035,M(0x2a2b30,{r:.85})),0,.2,0));
  head.add(at(box(.12,.025,.02,M(0x2a2b30)),0,-.1,.19));                     // boca da touca
  root.rotation.y=dig?.35:.62;
  return root;
}

// ---------- capa: fiscal tatico, arara e onca ----------
const patchTex=(t,bg="#1f3a6b",fg="#ffffff",w=160,h=56,font="900 34px Arial")=>textTex(t,bg,fg,w,h,font);
const flagTex=tex(96,64,(g)=>{g.fillStyle="#1f9e46";g.fillRect(0,0,96,64);g.fillStyle="#ffd21f";g.beginPath();g.moveTo(48,6);g.lineTo(90,32);g.lineTo(48,58);g.lineTo(6,32);g.closePath();g.fill();
  g.fillStyle="#1f3a8a";g.beginPath();g.arc(48,32,14,0,7);g.fill();g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.arc(48,40,18,-2.4,-.7);g.stroke()});
export function heroTatico(){
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const olive=M(0x5d6b34,{r:.75}),dark=M(0x3e4824,{r:.8});
  // pernas e botas grandes
  for(const s of [-1,1]){
    body.add(at(cap(.075,.12,olive),s*.085,.17,0));
    body.add(at(box(.15,.1,.22,M(0x5a4127,{r:.6}),.04),s*.09,.05,.03));
    body.add(at(box(.155,.03,.225,M(0x2a1e14)),s*.09,.005,.03));
    for(let i=0;i<3;i++)body.add(at(box(.08,.01,.012,M(0xc9b48a)),s*.09,.07+i*.022,.142));
  }
  // tronco + colete tatico
  body.add(at(box(.38,.3,.25,olive,.09),0,.42,0));
  body.add(at(box(.4,.24,.27,dark,.06),0,.44,0));
  for(const x of [-.12,0,.12])body.add(at(box(.1,.09,.06,M(0x4a5528,{r:.8}),.02),x,.33,.14));
  body.add(at(box(.42,.05,.28,M(0x2b2219),.015),0,.29,0));
  body.add(at(box(.07,.045,.02,M(0xd9b25a,{m:.8,r:.3}),.008),0,.29,.145));
  const chest=new THREE.Mesh(new THREE.PlaneGeometry(.2,.07),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#141814","#f4f7f0",160,56,"900 36px Arial")}));
  body.add(at(chest,.0,.5,.137));
  body.add(at(box(.06,.1,.05,M(0x22302a),.015),-.11,.53,.15));
  body.add(at(sph(.012,M(0x7dff8a,{e:0x3dff5a,ei:1})),-.11,.6,.17));
  const back=new THREE.Mesh(new THREE.PlaneGeometry(.3,.1),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#2c3d22","#f4f7cf",180,52,"900 34px Arial")}));
  body.add(at(back,0,.47,-.137,0,Math.PI));
  // braco esquerdo: punho fechado ao lado
  const lsh=new THREE.Group();lsh.position.set(-.22,.53,0);body.add(lsh);
  lsh.add(at(cap(.06,.13,olive),0,-.1,0));
  lsh.add(at(sph(.075,M(0x2b2b28,{r:.7})),0,-.22,.02));
  lsh.rotation.z=-.25;lsh.rotation.x=-.2;
  // braco direito: joinha
  // braco direito dobrado, punho para cima com o polegar em joinha
  body.add(at(cap(.06,.12,olive),.31,.5,.04,0,0,1.25));
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(.08,.055),new THREE.MeshStandardMaterial({map:flagTex}));
  body.add(at(flag,.29,.525,.105,0,0,-.3));
  body.add(at(cap(.058,.13,olive),.42,.6,.07,0,0,-.15));
  body.add(at(sph(.082,M(0x2b2b28,{r:.7})),.43,.74,.08));
  body.add(at(cap(.03,.07,M(0x2b2b28,{r:.7})),.42,.84,.1,0,0,.1));
  // cabeca determinada + capacete
  const head=new THREE.Group();head.position.y=.8;body.add(head);
  head.add(sph(.21,M(SKIN,{r:.55})));
  for(const s of [-1,1]){
    head.add(eye(s*.075,-.06,.19,1.25));
    head.add(at(box(.1,.03,.025,M(0x3a2618)),s*.075,.0,.205,0,0,s*.42));
    head.add(at(sph(.045,M(SKIN)),s*.21,-.02,0,0,0,0,.5,.8,.6));
  }
  head.add(at(sph(.024,M(0xdc9670)),0,-.1,.21));
  head.add(at(box(.08,.014,.01,M(0x8a3e2c)),.01,-.15,.19,0,0,-.12));
  const helm=M(0x56632f,{r:.6});
  head.add(at(new THREE.Mesh(new THREE.SphereGeometry(.245,40,20,0,Math.PI*2,0,Math.PI/2),helm),0,.07,0,0,0,0,1,.95,1));
  head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.245,.03,10,48),helm),0,.07,0,Math.PI/2,0,0,1,1,1));
  head.add(at(cyl(.255,.27,.03,M(0x4a552a,{r:.6}),48),0,.06,.0));
  const hp=new THREE.Mesh(new THREE.PlaneGeometry(.17,.08),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#1f3a6b","#ffffff",160,72,"900 40px Arial")}));
  head.add(at(hp,0,.19,.225,-.55));
  root.rotation.y=-.12;
  return root;
}
const spotTex=tex(256,128,(g,w,h)=>{g.fillStyle="#e8a33c";g.fillRect(0,0,w,h);
  const rr=()=>Math.random();for(let i=0;i<60;i++){const x=rr()*w,y=rr()*h,r=4+rr()*6;g.strokeStyle="#2a1a0e";g.lineWidth=2.5;g.beginPath();g.arc(x,y,r,0,7);g.stroke();g.fillStyle="#c97a22";g.beginPath();g.arc(x,y,r*.5,0,7);g.fill()}});
export function onca(){
  const g=new THREE.Group(),fur=M(0xffffff,{map:spotTex,r:.85}),cream=M(0xf6e6c4,{r:.85});
  g.add(at(sph(.22,fur),0,.22,0,0,0,0,1.15,1,1));
  g.add(at(sph(.13,cream),0,.15,.16,0,0,0,1.2,.8,.8));
  g.add(at(sph(.04,M(0x3a2218)),0,.2,.27,0,0,0,1.3,.8,.8));
  for(const s of [-1,1]){
    g.add(at(sph(.075,fur),s*.17,.4,0,0,0,0,1,1,.6));
    g.add(at(sph(.045,M(0x2a1a0e)),s*.17,.4,.03,0,0,0,1,1,.4));
    g.add(at(sph(.045,M(0xf6d24a,{e:0x6a5010,ei:.4})),s*.09,.28,.2,0,0,0,1.2,1,.5));
    g.add(at(sph(.022,M(0x101010)),s*.09,.28,.225,0,0,0,.6,1.3,.5));
  }
  g.add(at(box(.06,.012,.01,M(0x3a2218)),0,.12,.25));
  return g;
}
export function arara(){
  const g=new THREE.Group(),red=M(0xd8231a,{r:.55});
  g.add(at(sph(.13,red),0,.3,0,0,0,0,.9,1.25,.9));
  g.add(at(sph(.1,red),0,.47,.03));
  g.add(at(sph(.045,M(0xf6f2e6)),.05,.48,.08,0,0,0,1,1,.6));
  g.add(at(sph(.016,M(0x111)),.06,.49,.105));
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.04,.1,12),M(0x2a2a2a,{r:.4}));g.add(at(beak,.04,.43,.12,1.9,0,0));
  // asa amarela/azul
  g.add(at(sph(.11,M(0x1f6fd1,{r:.55})),-.06,.27,-.02,0,0,.3,.6,1.3,.9));
  g.add(at(sph(.08,M(0xffc81f,{r:.55})),-.07,.33,0,0,0,.3,.55,.8,.85));
  // cauda longa
  g.add(at(box(.07,.42,.03,M(0x1f6fd1,{r:.55}),.03),-.02,.0,-.04,.2,0,.12));
  g.add(at(box(.05,.36,.025,red,.02),.02,.02,-.02,.2,0,.05));
  for(const s of [-1,1])g.add(at(cap(.015,.04,M(0x3a3a3a)),s*.04,.17,.03,0,0,0));
  g.rotation.y=.5;return g;
}

// ---------- fiscal tatico jogavel (4 direcoes, caminhada) ----------
export function fiscalTatico(dir=2,frame=0){
  const phase=frame?(frame-1)/4:0,root=new THREE.Group(),body=new THREE.Group();root.add(body);
  body.position.y=frame?Math.abs(Math.sin(phase*Math.PI*2))*.03:0;
  const olive=M(0x5d6b34,{r:.75}),dark=M(0x3e4824,{r:.8}),glove=M(0x2b2b28,{r:.7});
  // pernas com botas grandes
  for(const s of [-1,1]){
    const hip=new THREE.Group();hip.position.set(s*.085,.25,0);
    hip.add(at(cap(.068,.1,olive),0,-.09,0));
    hip.add(at(box(.14,.1,.21,M(0x5a4127,{r:.6}),.04),0,-.2,.03));
    hip.add(at(box(.145,.025,.215,M(0x2a1e14)),0,-.245,.03));
    hip.rotation.x=Math.sin(phase*Math.PI*2)*.55*s;body.add(hip);
  }
  body.add(at(box(.37,.3,.25,olive,.09),0,.42,0));
  body.add(at(box(.39,.24,.27,dark,.06),0,.44,0));
  for(const x of [-.12,0,.12])body.add(at(box(.1,.085,.06,M(0x4a5528,{r:.8}),.02),x,.33,.14));
  body.add(at(box(.41,.05,.28,M(0x2b2219),.015),0,.29,0));
  body.add(at(box(.07,.045,.02,M(0xd9b25a,{m:.8,r:.3}),.008),0,.29,.145));
  const chest=new THREE.Mesh(new THREE.PlaneGeometry(.2,.07),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#141814","#f4f7f0",160,56,"900 36px Arial")}));
  body.add(at(chest,0,.5,.137));
  body.add(at(box(.06,.1,.05,M(0x22302a),.015),-.11,.53,.15));
  body.add(at(sph(.012,M(0x7dff8a,{e:0x3dff5a,ei:1})),-.11,.6,.17));
  const back=new THREE.Mesh(new THREE.PlaneGeometry(.3,.1),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#2c3d22","#f4f7cf",180,52,"900 34px Arial")}));
  body.add(at(back,0,.47,-.137,0,Math.PI));
  // bracos balancando, luvas taticas
  for(const side of [-1,1]){
    const sh=new THREE.Group();sh.position.set(side*.215,.53,0);
    sh.add(at(cap(.058,.13,olive),0,-.1,0));
    sh.add(at(sph(.07,glove),0,-.22,.01));
    if(side===1){const flag=new THREE.Mesh(new THREE.PlaneGeometry(.075,.05),new THREE.MeshStandardMaterial({map:flagTex}));sh.add(at(flag,.06,-.05,0,0,Math.PI/2))}
    sh.rotation.x=-Math.sin(phase*Math.PI*2)*.5*side;sh.rotation.z=side*.14;
    body.add(sh);
  }
  // cabeca determinada + capacete
  const head=new THREE.Group();head.position.y=.8;body.add(head);
  head.add(sph(.21,M(SKIN,{r:.55})));
  head.add(at(sph(.2,M(0x3a2618)),0,-.03,-.04,0,0,0,1,.85,.95));
  head.add(at(sph(.21,M(SKIN,{r:.55})),0,0,.012));
  for(const s of [-1,1]){
    head.add(eye(s*.075,-.06,.19,1.25));
    head.add(at(box(.1,.03,.025,M(0x3a2618)),s*.075,.0,.205,0,0,s*.42));
    head.add(at(sph(.045,M(SKIN)),s*.21,-.02,0,0,0,0,.5,.8,.6));
  }
  head.add(at(sph(.024,M(0xdc9670)),0,-.1,.21));
  head.add(at(box(.08,.014,.01,M(0x8a3e2c)),.01,-.15,.19,0,0,-.12));
  const helm=M(0x56632f,{r:.6});
  head.add(at(new THREE.Mesh(new THREE.SphereGeometry(.245,40,20,0,Math.PI*2,0,Math.PI/2),helm),0,.07,0,0,0,0,1,.95,1));
  head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.245,.03,10,48),helm),0,.07,0,Math.PI/2,0,0,1,1,1));
  head.add(at(cyl(.255,.27,.03,M(0x4a552a,{r:.6}),48),0,.06,0));
  const hp=new THREE.Mesh(new THREE.PlaneGeometry(.17,.08),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#1f3a6b","#ffffff",160,72,"900 40px Arial")}));
  head.add(at(hp,0,.19,.225,-.55));
  const hb=new THREE.Mesh(new THREE.PlaneGeometry(.17,.08),new THREE.MeshStandardMaterial({map:patchTex("IBAMA","#1f3a6b","#ffffff",160,72,"900 40px Arial")}));
  head.add(at(hb,0,.19,-.225,.55,Math.PI));
  root.rotation.y=[Math.PI,Math.PI/2,0,-Math.PI/2][dir];
  return root;
}

// ---------- fiscal "desenho animado" (estilo da capa): cabecao, olhos grandes, punhos e botas enormes ----------
const toonGrad=(()=>{const d=new Uint8Array([150,150,150,255,205,205,205,255,255,255,255,255]);const t=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.needsUpdate=true;return t})();
const T=(color,o={})=>new THREE.MeshToonMaterial({color,gradientMap:toonGrad,map:o.map||null,emissive:o.e??0x000000,emissiveIntensity:o.ei??1});
export const PALETTES=[
  {uni:0x5a8530,vest:0x3c6220,pouch:0x4f7a28,helm:0x507a2a,band:0xff8a2a,patch:"#1f3a6b"},   // verde: fiscal
  {uni:0x3f6fb8,vest:0x24477e,pouch:0x335e9e,helm:0x2f5a9a,band:0xffd34a,patch:"#0f2a52"},   // azul: fluvial
  {uni:0xf08a28,vest:0xc8601a,pouch:0xdb7422,helm:0xe8a020,band:0xfff1a0,patch:"#5a2a0a"},   // laranja: brigadista
  {uni:0x3a3f46,vest:0x23272c,pouch:0x30353b,helm:0x2b3036,band:0x7ee04a,patch:"#111418"}    // preto: tatico
];
export function fiscalToon(dir=2,frame=0,pal=0,pose=null){
  const P=PALETTES[pal],phase=frame?(frame-1)/4:0,root=new THREE.Group(),body=new THREE.Group();root.add(body);
  if(pose)dir=2;
  body.position.y=pose==="cheer"?.07:frame?Math.abs(Math.sin(phase*Math.PI*2))*.035:0;
  const olive=T(P.uni),dark=T(P.vest),pouch=T(P.pouch),glove=T(0x2f3328),boot=T(0x7a5230),skin=T(0xd9915e);
  for(const s of [-1,1]){
    const hip=new THREE.Group();hip.position.set(s*.1,.22,0);
    hip.add(at(cap(.07,.06,olive),0,-.06,0));
    const b=grp(at(box(.19,.13,.27,boot,.06),0,0,.03),at(box(.2,.035,.28,T(0x3a2614)),0,-.06,.03));
    for(let i=0;i<3;i++)b.add(at(box(.1,.012,.012,T(0xf4e2bc)),0,.02+i*.03,.17));
    hip.add(at(b,0,-.17,0));
    hip.rotation.x=pose?0:Math.sin(phase*Math.PI*2)*.5*s;
    if(pose==="cheer")hip.rotation.z=s*.12;
    body.add(hip);
  }
  body.add(at(box(.42,.27,.29,olive,.11),0,.38,0));
  body.add(at(box(.44,.21,.31,dark,.08),0,.4,0));
  body.add(at(box(.445,.035,.315,T(0xf2ff8a,{e:0x9aa020,ei:.35}),.012),0,.43,0));   // faixa refletiva
  for(const x of [-.14,0,.14])body.add(at(box(.11,.09,.07,pouch,.025),x,.3,.16));
  body.add(at(box(.46,.05,.31,T(0x2b2219),.02),0,.26,0));
  body.add(at(box(.08,.05,.02,T(0xe0b84a),.01),0,.26,.16));
  const chest=new THREE.Mesh(new THREE.PlaneGeometry(.22,.075),new THREE.MeshBasicMaterial({map:patchTex("IBAMA","#141814","#ffffff",170,56,"900 38px Arial")}));
  body.add(at(chest,0,.37,.162));
  body.add(at(box(.07,.11,.05,T(0x22302a),.02),-.13,.5,.17));
  body.add(at(sph(.014,new THREE.MeshBasicMaterial({color:0x7dff8a})),-.13,.57,.19));
  const back=new THREE.Mesh(new THREE.PlaneGeometry(.32,.1),new THREE.MeshBasicMaterial({map:patchTex("IBAMA",P.patch,"#ffffff",180,52,"900 34px Arial")}));
  body.add(at(back,0,.38,-.162,0,Math.PI));
  // bracos
  const arm=(side,rx,rz,fistUp=false)=>{
    const sh=new THREE.Group();sh.position.set(side*.25,.47,0);
    sh.add(at(cap(.06,.08,olive),0,-.07,0));
    sh.add(at(sph(.095,glove,24,18),0,-.18,.02));
    if(fistUp)sh.add(at(cap(.032,.06,glove),side*-.02,-.26,.05,Math.PI,0,0));
    if(side===1){const flag=new THREE.Mesh(new THREE.PlaneGeometry(.075,.05),new THREE.MeshBasicMaterial({map:flagTex}));sh.add(at(flag,.062,-.04,0,0,Math.PI/2))}
    sh.rotation.x=rx;sh.rotation.z=rz;body.add(sh);return sh;
  };
  if(pose==="thumbs"){
    arm(-1,-.2,-.6);                                          // mao na cintura
    body.add(at(cap(.06,.1,olive),.31,.47,.04,0,0,1.25));      // braco direito dobrado
    body.add(at(cap(.058,.09,olive),.4,.56,.06,0,0,-.1));
    body.add(at(sph(.09,glove,24,18),.41,.67,.07));
    body.add(at(cap(.032,.06,glove),.4,.77,.09,0,0,.1));
    const flag=new THREE.Mesh(new THREE.PlaneGeometry(.075,.05),new THREE.MeshBasicMaterial({map:flagTex}));body.add(at(flag,.3,.5,.11,0,0,-.3));
  }else if(pose==="cheer"){arm(-1,0,-2.7);arm(1,0,2.7)}
  else if(pose==="hurt"){arm(-1,-.4,-1.3);arm(1,-.4,1.3)}
  else for(const side of [-1,1])arm(side,-Math.sin(phase*Math.PI*2)*.55*side,side*.22);
  // cabecao
  const head=new THREE.Group();head.position.y=.78;body.add(head);
  if(pose==="hurt")head.rotation.z=.18;
  head.add(at(sph(.28,skin,40,30),0,0,0,0,0,0,1.05,.95,1));
  head.add(at(sph(.275,T(0x3a2414),32,24),0,-.02,-.035,0,0,0,1.04,.9,.95));
  head.add(at(sph(.28,skin,40,30),0,0,.012,0,0,0,1.03,.94,1));
  const ink=T(0x111111),white=new THREE.MeshBasicMaterial({color:0xffffff});
  for(const s of [-1,1]){
    if(pose==="hurt"){
      for(const r of [.7,-.7])head.add(at(box(.1,.025,.02,ink,.008),s*.1,-.04,.262,0,0,r));
    }else if(pose==="thumbs"||pose==="cheer"){
      head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.045,.014,8,16,Math.PI),ink),s*.1,-.05,.258));   // olho feliz ^
    }else{
      head.add(at(sph(.06,ink,24,18),s*.1,-.045,.25,0,0,0,.8,1.25,.45));
      head.add(at(sph(.02,white,12,10),s*.1-.014,-.015,.275));
      head.add(at(box(.15,.05,.03,skin,.01),s*.1,.03,.262,0,0,s*.45));            // palpebra brava
    }
    if(pose!=="hurt")head.add(at(box(.15,.045,.03,T(0x2a1c12),.014),s*.1,pose?.07:.055,.27,0,0,pose?s*.15:s*.45));
    head.add(at(sph(.055,skin),s*.285,-.02,0,0,0,0,.45,.75,.6));
    if(pose)head.add(at(sph(.035,T(0xf08a7a)),s*.17,-.11,.22,0,0,0,1,.6,.4));
  }
  if(pose==="cheer"||pose==="thumbs"){
    head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.06,.016,8,16,Math.PI),T(0x8a3e2c)),0,-.13,.245,Math.PI,0,0));
  }else if(pose==="hurt"){
    head.add(at(sph(.04,T(0x5a1d26)),0,-.15,.24,0,0,0,1,1.2,.5));
  }else head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.05,.014,8,16,Math.PI),T(0x6a2a1c)),0,-.17,.245));   // careta
  // capacete grande com faixa colorida
  const helm=T(P.helm);
  head.add(at(new THREE.Mesh(new THREE.SphereGeometry(.3,40,20,0,Math.PI*2,0,Math.PI/2),helm),0,.12,0,0,0,0,1.06,.95,1.04));
  head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.315,.035,10,48),helm),0,.12,0,Math.PI/2,0,0,1,1,1));
  head.add(at(new THREE.Mesh(new THREE.TorusGeometry(.305,.018,8,48),T(P.band)),0,.17,0,Math.PI/2,0,0,1.02,1,1));
  const hp=new THREE.Mesh(new THREE.PlaneGeometry(.21,.1),new THREE.MeshBasicMaterial({map:patchTex("IBAMA",P.patch,"#ffffff",160,80,"900 42px Arial")}));
  head.add(at(hp,0,.27,.28,-.56));
  const hb=new THREE.Mesh(new THREE.PlaneGeometry(.21,.1),new THREE.MeshBasicMaterial({map:patchTex("IBAMA",P.patch,"#ffffff",160,80,"900 42px Arial")}));
  head.add(at(hb,0,.27,-.28,.56,Math.PI));
  root.scale.setScalar(.86);
  root.rotation.y=[Math.PI,Math.PI/2,0,-Math.PI/2][dir];
  return root;
}

// ---------- obstaculos claros: pedras (nao quebram) e caixas do garimpo (quebram) ----------
export function rocks(){
  const g=new THREE.Group();
  const rock=(r,x,y,z,col,seed,sy=.8)=>{
    const geo=new THREE.IcosahedronGeometry(r,2),pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){const X=pos.getX(i),Y=pos.getY(i),Z=pos.getZ(i);
      const n=Math.sin(X*9.1+seed)*Math.cos(Z*8.3+seed*1.7)*Math.sin(Y*7.7+seed*.6);const k=1+n*.16;
      pos.setXYZ(i,X*k,Y*k*sy,Z*k)}
    geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:col,roughness:.95,flatShading:true}));
    m.position.set(x,y,z);g.add(m);return m;
  };
  rock(.4,0,.3,-.02,0x7d837f,1,.85);rock(.27,-.26,.2,.18,0x6c726e,2);rock(.25,.28,.19,.16,0x8a908b,3);rock(.2,.14,.56,-.08,0x939893,4);
  for(const [x,y,z,sx] of [[-.08,.6,.06,1.4],[.22,.4,.26,1.1],[-.3,.36,.24,1],[.1,.66,-.1,.9],[-.32,.16,.36,.9]])
    g.add(at(sph(.1,M(0x4f8a3a,{r:.95}),12,10),x,y,z,0,0,0,sx,.35,sx));
  for(let i=0;i<5;i++)g.add(at(new THREE.Mesh(new THREE.ConeGeometry(.035,.2,5),M(0x5aa040,{r:.9})),-.42+i*.05,.12,.32,0,0,(i-2)*.25));
  return g;
}
const garimpoTex=tex(128,128,(g,w,h)=>{g.fillStyle="#c9874a";g.fillRect(0,0,w,h);
  g.globalAlpha=.25;for(let i=0;i<4;i++){g.fillStyle="#7a4a24";g.fillRect(0,i*32+30,w,3)}g.globalAlpha=1;
  for(let i=-2;i<10;i++){g.fillStyle=i%2?"#1a1a1a":"#ffd21f";g.beginPath();g.moveTo(i*16,0);g.lineTo(i*16+16,0);g.lineTo(i*16+4,22);g.lineTo(i*16-12,22);g.closePath();g.fill()}
  g.fillStyle="#2a1608";g.font="900 26px Arial";g.textAlign="center";g.fillText("GARIMPO",64,74);
  g.fillStyle="#ffd21f";g.strokeStyle="#2a1608";g.lineWidth=3;
  for(const [x,y,r] of [[52,102,9],[66,98,10],[78,104,8]]){g.beginPath();g.moveTo(x-r,y+3);g.lineTo(x-r*.4,y-r);g.lineTo(x+r*.6,y-r*.7);g.lineTo(x+r,y+4);g.closePath();g.fill();g.stroke()}});
export function crateGarimpo(){
  const g=new THREE.Group();
  const side=new THREE.MeshStandardMaterial({map:garimpoTex,roughness:.75});
  const top=M(0xffffff,{map:woodTex("#d99a58","#8d5a31"),r:.7});
  const b=new THREE.Mesh(new RoundedBoxGeometry(.8,.7,.8,3,.05),[side,side,top,top,side,side]);
  b.position.y=.35;g.add(b);
  for(const x of [-.38,.38])for(const z of [-.38,.38])for(const y of [.05,.66])g.add(at(box(.07,.07,.07,M(0x9aa3a0,{m:.8,r:.3}),.012),x,y,z));
  g.rotation.y=.1;return g;
}
// ---------- maquinas ----------
export function balsa(){
  const g=new THREE.Group();
  const deck=box(.92,.1,.66,M(0xa0703f,{map:woodTex("#a3713f","#6b4325")}),.03);g.add(at(deck,0,.12,0));
  for(const z of [-.27,.27])g.add(at(cyl(.09,.09,.86,M(0x3c74a0,{r:.4}),24),0,.06,z,0,0,Math.PI/2));
  // barraco com lona azul
  g.add(at(box(.36,.22,.34,M(0xc89a62,{map:woodTex("#cfa067","#8a5e36")}),.02),-.16,.28,-.04));
  const tarpM=M(0x2f7fc1,{r:.55});
  for(const s of [-1,1])g.add(at(box(.44,.025,.26,tarpM,.01),-.16,.45,-.04+s*.09,s*.6,0,0));
  g.add(at(box(.1,.12,.02,M(0x2a1d14)),-.16,.26,.135));
  // motor, cano de escape e mangote
  g.add(at(box(.2,.16,.18,M(0x5b5f61,{m:.6,r:.4}),.03),.22,.25,.1));
  g.add(at(cyl(.025,.025,.2,M(0x3a3d3f,{m:.5})),.28,.4,.06));
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(.3,.22,.15),new THREE.Vector3(.48,.2,.2),new THREE.Vector3(.52,.02,.24)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,20,.035,12),M(0x8f9493,{r:.5})));
  g.rotation.y=-.35;return g;
}
export function escavadeira(frame=0){
  const g=new THREE.Group(),dig=Math.sin(frame/4*Math.PI*2)*.28;
  const track=M(0x2a2c2b,{r:.8});
  for(const z of [-.2,.2]){
    g.add(at(box(.72,.16,.15,track,.07),0,.08,z));
    for(let i=0;i<4;i++)g.add(at(cyl(.045,.045,.155,M(0x7a7f7b,{m:.5})),-.24+i*.16,.08,z,Math.PI/2));
  }
  const yel=M(0xf2b232,{r:.45});
  g.add(at(box(.56,.2,.44,yel,.05),-.04,.27,0));
  g.add(at(box(.12,.18,.44,M(0x8e6a2a,{r:.5}),.04),-.31,.3,0));
  g.add(at(box(.24,.26,.28,yel,.04),-.1,.48,.06));
  g.add(at(box(.2,.17,.29,M(0x7fc3d6,{r:.1,m:.2}),.02),-.07,.51,.065));
  g.add(at(cyl(.022,.022,.2,M(0x3a3d3f)),-.25,.52,-.12));
  // braco articulado
  const boom=new THREE.Group();boom.position.set(.18,.36,-.05);boom.rotation.z=.55+dig;g.add(boom);
  boom.add(at(box(.42,.08,.09,yel,.03),.2,0,0));
  const stick=new THREE.Group();stick.position.set(.4,0,0);stick.rotation.z=-1.6-dig*1.4;boom.add(stick);
  stick.add(at(box(.3,.065,.075,M(0xe8a133,{r:.45}),.025),.14,0,0));
  const bucket=grp(at(box(.12,.12,.16,M(0x8a8f8c,{m:.6,r:.4}),.03),0,0,0),at(box(.08,.06,.14,M(0x6b4a2c)),.01,.03,0));
  stick.add(at(bucket,.3,-.02,0,0,0,-.5));
  g.rotation.y=-.3;return g;
}
export function dragagem(frame=0){
  const g=new THREE.Group();
  g.add(at(box(.96,.18,.7,M(0xb85a32,{r:.6}),.05),0,.1,0));
  g.add(at(box(.98,.03,.72,M(0x6e2f19)),0,.2,0));
  g.add(at(box(.42,.3,.42,M(0xe6e1cf,{r:.5}),.04),-.12,.37,0));
  for(const x of [-.22,-.03])g.add(at(box(.13,.09,.02,M(0x5aa2c0,{r:.1,m:.3})),x,.42,.215));
  g.add(at(box(.48,.05,.48,M(0x9a4a2a),.02),-.12,.54,0));
  g.add(at(cyl(.045,.05,.26,M(0x3a3d3f,{m:.4})),.08,.62,-.12));
  g.add(at(cyl(.052,.052,.04,M(0xd8452e)),.08,.66,-.12));
  // escada de corte com cabeca giratoria (frente = +x)
  const ladder=at(box(.4,.06,.08,M(0x8f9493,{m:.6,r:.4}),.02),.5,.12,0,0,0,-.35);g.add(ladder);
  const head=new THREE.Group();head.position.set(.68,.02,0);g.add(head);
  head.add(at(sph(.075,M(0x5b5f61,{m:.6}),16,12),0,0,0));
  for(let i=0;i<6;i++){const b=at(box(.03,.16,.03,M(0x8a8f8c,{m:.7})),0,0,0,i/6*Math.PI*2+frame/4*Math.PI/3,0,0);b.translateY(.07);head.add(b)}
  head.rotation.z=Math.PI/2;
  g.rotation.y=-.3;return g;
}
export function helicopter(){
  const g=new THREE.Group(),green=M(0x6c8f45,{r:.45});
  g.add(at(sph(.3,green),0,.35,0,0,0,0,1.25,.85,.9));
  g.add(at(sph(.2,M(0x9ed6e6,{r:.05,m:.3})),.2,.38,0,0,0,0,1,.85,.95));
  g.add(at(cyl(.05,.08,.6,green),-.5,.4,0,0,0,Math.PI/2));
  g.add(at(box(.04,.18,.14,green,.02),-.8,.48,0));
  for(const z of [-.2,.2]){g.add(at(cyl(.015,.015,.6,M(0x2a332f)),0,.08,z,0,0,Math.PI/2));
    for(const x of [-.15,.15])g.add(at(cyl(.012,.012,.16,M(0x2a332f)),x,.16,z))}
  g.add(at(cyl(.025,.025,.1,M(0x2a332f)),0,.65,0));
  const t=new THREE.Mesh(new THREE.PlaneGeometry(.26,.08),new THREE.MeshStandardMaterial({map:textTex("IBAMA","#6c8f45","#f2f6c9",140,40,"900 26px Arial"),transparent:true}));
  g.add(at(t,-.08,.33,.265));
  g.rotation.y=-.25;return g;
}
export function drone(){
  const g=new THREE.Group();
  g.add(at(box(.22,.08,.22,M(0x6f8597,{m:.4,r:.4}),.03),0,.2,0));
  g.add(at(sph(.04,M(0x65e2ff,{e:0x2bb6e0,ei:.6})),0,.16,.1));
  for(const [x,z] of [[-1,-1],[1,-1],[-1,1],[1,1]]){
    g.add(at(box(.2,.025,.03,M(0xcfe4ee)),x*.1,.2,z*.1,0,Math.atan2(z,x)*-1));
    g.add(at(cyl(.025,.025,.04,M(0x2a332f)),x*.18,.23,z*.18));
  }
  g.rotation.y=.4;return g;
}
// ---------- objetos ----------
export function crate(){
  const g=new THREE.Group(),wood=woodTex("#c88a4a","#7d4e2a");
  g.add(at(box(.8,.72,.8,M(0xffffff,{map:wood,r:.75}),.05),0,.36,0));
  const brace=M(0x8d5a31,{r:.8});
  for(const side of [[0,.32,.405,0],[.405,.32,0,Math.PI/2]]){
    const b=at(box(.98,.07,.025,brace,.01),side[0],.36,side[2],0,side[3],.7);g.add(b);
  }
  g.add(at(box(.82,.04,.82,M(0xffffff,{map:woodTex("#d49a58","#8d5a31"),r:.7}),.01),0,.74,0,0,Math.PI/2,0));
  for(const x of [-.38,.38])for(const z of [-.38,.38])for(const y of [.05,.68])g.add(at(box(.07,.07,.07,M(0x9aa3a0,{m:.8,r:.3}),.012),x,y,z));
  return g;
}
export function logs(){
  const g=new THREE.Group(),bark=M(0xffffff,{map:barkTex,r:.9}),end=M(0xffffff,{map:ringTex,r:.8});
  const log=(x,y,z,r,len)=>{
    const lg=grp(new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,24,1,true),bark));
    for(const s of [-1,1])lg.add(at(new THREE.Mesh(new THREE.CircleGeometry(r,24),end),0,s*len/2,0,s*-Math.PI/2));
    return at(lg,x,y,z,Math.PI/2,0,0);
  };
  g.add(log(-.2,.15,0,.15,.8));g.add(log(.2,.15,.02,.15,.78));g.add(log(0,.4,.01,.145,.76));
  g.add(at(sph(.06,M(0x5c8a3f,{r:.9})),-.2,.48,.05,0,0,0,1.4,.4,1));
  g.add(at(sph(.05,M(0x5c8a3f,{r:.9})),.25,.27,.3,0,0,0,1.2,.5,1));
  g.rotation.y=-.08;return g;
}
export function papers(){
  const g=new THREE.Group();
  for(let i=0;i<6;i++)g.add(at(box(.6,.06,.46,M(i%2?0xf6f0de:0xe8dfc6,{r:.9}),.01),(i%3-1)*.03,.04+i*.065,(i%2-.5)*.04,0,(i%3-1)*.06));
  const tag=new THREE.Mesh(new THREE.PlaneGeometry(.3,.13),new THREE.MeshStandardMaterial({map:textTex("PL","#c9483a","#fff2d8",96,42,"900 30px Arial")}));
  g.add(at(tag,0,.43,0,-Math.PI/2));
  return g;
}
export function desk(){
  const g=new THREE.Group(),wood=M(0xffffff,{map:woodTex("#9b6a41","#6b4325"),r:.6});
  g.add(at(box(.86,.5,.7,wood,.05),0,.25,0));
  g.add(at(box(.8,.04,.6,M(0x2f6b4a,{r:.9}),.015),0,.51,0));
  g.add(at(box(.24,.08,.03,M(0xe9e3cf),.01),-.18,.53,.25));
  g.add(at(cyl(.008,.008,.2,M(0x333)),.22,.62,-.05,.3));
  g.add(at(sph(.025,M(0x222)),.22,.72,.0));
  return g;
}
export function bomb(red=false){
  const g=new THREE.Group();
  g.add(at(sph(.27,M(red?0xc23238:0x1d2630,{m:.35,r:.22,e:red?0x5a0d14:0,ei:.6})),0,.27,0));
  g.add(at(cyl(.07,.08,.08,M(0x9a7a52,{m:.7,r:.35})),.08,.53,.02,0,0,-.3));
  return g;
}

// ---------- renderizacao do sprite ----------
const scene=new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xfff6e6,0x2a3a2a,1.35));
const sun=new THREE.DirectionalLight(0xffffff,2.6);sun.position.set(-1.6,3,2.2);scene.add(sun);
const rim=new THREE.DirectionalLight(0xb8e0ff,.9);rim.position.set(2,1.5,-2);scene.add(rim);
const fill=new THREE.DirectionalLight(0xffe6c8,.6);fill.position.set(1.5,.6,2.5);scene.add(fill);

// size: lado do quadro em px logicos; groundY: onde o chao (origem) cai, em px a partir do centro
export function render(obj,size,groundY=0,elevDeg=30,scale=2,outline=true,thick=1.1){
  const SS=3,px=size*scale*SS,u=size/TILE,el=elevDeg*Math.PI/180;
  renderer.setSize(px,px,false);
  const cam=new THREE.OrthographicCamera(-u/2,u/2,u/2,-u/2,.1,50);
  // o ponto do chao na origem deve cair groundY px abaixo do centro do quadro
  const dir=new THREE.Vector3(0,Math.sin(el),Math.cos(el));
  const up=new THREE.Vector3(0,Math.cos(el),-Math.sin(el));
  const target=up.clone().multiplyScalar(groundY/TILE);
  cam.position.copy(target).add(dir.clone().multiplyScalar(20));cam.up.copy(up);
  cam.lookAt(target);cam.updateProjectionMatrix();
  scene.add(obj);renderer.render(scene,cam);scene.remove(obj);
  // reduz (supersampling) e aplica contorno
  const out=document.createElement("canvas"),n=size*scale;out.width=out.height=n;
  const g=out.getContext("2d");g.imageSmoothingQuality="high";
  const tmp=document.createElement("canvas");tmp.width=tmp.height=n;const tg=tmp.getContext("2d");tg.imageSmoothingQuality="high";
  tg.drawImage(renderer.domElement,0,0,n,n);
  if(outline){
    const sil=document.createElement("canvas");sil.width=sil.height=n;const sg=sil.getContext("2d");
    sg.drawImage(tmp,0,0);sg.globalCompositeOperation="source-in";sg.fillStyle="#0c1611";sg.fillRect(0,0,n,n);
    const w=scale*thick;
    for(let a=0;a<16;a++)g.drawImage(sil,Math.cos(a/16*Math.PI*2)*w,Math.sin(a/16*Math.PI*2)*w);
  }
  g.drawImage(tmp,0,0);
  return out;
}
window.STUDIO={THREE,render,rocks,crateGarimpo,fiscal,fiscalTatico,fiscalToon,garimpeiro,bandido,heroTatico,onca,arara,boss,balsa,escavadeira,dragagem,helicopter,drone,crate,logs,papers,desk,bomb};
window.studioReady=true;
