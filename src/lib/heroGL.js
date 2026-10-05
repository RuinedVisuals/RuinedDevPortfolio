import * as THREE from 'three';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const HVS = /* glsl */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }`;

// Cover-fit poster, liquid lens + chromatic split around the pointer
// (stronger with velocity), hover duotone inside the lens, faint vertical
// ribs, grain, and a bottom-up reveal driven by uReveal.
const HFS = /* glsl */ `uniform sampler2D uTex; uniform vec2 uRes; uniform vec2 uImg; uniform vec2 uMouse; uniform float uVel; uniform float uTime; uniform float uReveal; uniform float uGrain; uniform float uLens; uniform vec3 uDark; uniform vec3 uLight; uniform vec3 uHi; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  float sc=max(uRes.x/uImg.x,uRes.y/uImg.y); vec2 ns=uImg*sc; vec2 uv=(vUv*uRes+(ns-uRes)*0.5)/ns;
  uv.y=uv.y*0.78+0.2;
  vec2 d=(vUv-uMouse)*vec2(uRes.x/uRes.y,1.0); float dist=length(d); float f=smoothstep(0.42,0.0,dist)*uLens;
  uv+=normalize(d+1e-4)*f*(0.025+uVel*0.06); uv.x+=sin(uv.y*22.0+uTime*1.4)*0.004*f;
  float sh=0.003+uVel*0.02*f;
  float l=texture2D(uTex,uv).r; float lr=texture2D(uTex,uv+vec2(sh,0.0)).r;
  vec3 col=mix(uDark,uLight,l); vec3 hi=mix(uDark,uHi,l); hi.r=mix(uDark.r,uHi.r,lr);
  col=mix(col,hi,f*0.85);
  float stripe=step(0.5,fract(vUv.x*uRes.x/14.0)); col=mix(col,col*0.82,stripe*0.35*(1.0-f));
  col+=(h(vUv*uRes+fract(uTime*0.37))-0.5)*uGrain;
  float rv=smoothstep(uReveal-0.08,uReveal,1.0-vUv.y);
  col=mix(col,uDark,rv);
  gl_FragColor=vec4(col,1.0);
}`;

/** Full-bleed WebGL hero for ProjectDetail. `poster` is a grayscale canvas. */
export function createHeroGL(el, poster, opt) {
  THREE.ColorManagement.enabled = false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const r = new THREE.WebGLRenderer({ antialias: false });
  r.outputColorSpace = THREE.LinearSRGBColorSpace;
  r.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  Object.assign(r.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  el.prepend(r.domElement);

  const c = opt.colors;
  const tex = new THREE.CanvasTexture(poster);
  const u = {
    uTex: { value: tex },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImg: { value: new THREE.Vector2(poster.width, poster.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVel: { value: 0 },
    uTime: { value: 0 },
    uReveal: { value: reduce ? 0 : 1 },
    uGrain: { value: opt.grain ?? 0.12 },
    uLens: { value: reduce ? 0 : 1 },
    uDark: { value: new THREE.Color(c.pd) },
    uLight: { value: new THREE.Color(c.pl) },
    uHi: { value: new THREE.Color(c.ph) },
  };
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.ShaderMaterial({ vertexShader: HVS, fragmentShader: HFS, uniforms: u });
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geo, mat));
  const cam = new THREE.Camera();

  const resize = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    r.setSize(w, h, false);
    u.uRes.value.set(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  const m = { x: 0.5, y: -1, tx: 0.5, ty: -1, v: 0 };
  const mv = (e) => {
    const b = el.getBoundingClientRect();
    m.tx = (e.clientX - b.left) / b.width;
    m.ty = 1 - (e.clientY - b.top) / b.height;
  };
  window.addEventListener('pointermove', mv);

  let dead = false;
  let vis = true;
  const io = new IntersectionObserver((es) => es.forEach((e) => (vis = e.isIntersecting)));
  io.observe(el);
  const t0 = performance.now();
  let raf = 0;
  const tick = () => {
    if (dead) return;
    raf = requestAnimationFrame(tick);
    if (!vis) return;
    const t = (performance.now() - t0) / 1000;
    const px = m.x;
    const py = m.y;
    m.x += (m.tx - m.x) * 0.08;
    m.y += (m.ty - m.y) * 0.08;
    m.v += (Math.min(1, Math.hypot(m.x - px, m.y - py) * 40) - m.v) * 0.1;
    u.uMouse.value.set(m.x, m.y);
    u.uVel.value = m.v;
    u.uTime.value = reduce ? 0 : t;
    if (!reduce) u.uReveal.value = 1 - ease(clamp((t - 0.3) / 1.4));
    r.render(scene, cam);
  };
  raf = requestAnimationFrame(tick);

  return {
    setColors(k) {
      u.uDark.value.set(k.pd);
      u.uLight.value.set(k.pl);
      u.uHi.value.set(k.ph);
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', mv);
      tex.dispose();
      geo.dispose();
      mat.dispose();
      r.dispose();
      r.domElement.remove();
    },
  };
}
