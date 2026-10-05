import * as THREE from 'three';

const TAU = Math.PI * 2;
const N = 20; // card meshes — projects repeat to fill them
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rnd = (i, k) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const angD = (a, b) => {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
};

// `portrait` = group scale on portrait stages (phones). Larger than the
// aspect-fit the desktop uses, so cards read big and the layout is allowed
// to crop off the left / right edges; tuned per mode so nothing crops
// vertically.
export const GALLERY_MODES = {
  ring: { label: 'Ring', step: TAU / 10, drag: 0.006, drift: 0.0012, bend: 0.04, cam: [0, 2.4, 13.5], look: [0, -0.2, 0], portrait: 0.85 },
  arc: { label: 'Arc', step: 1, drag: 0.012, drift: 0.004, bend: -0.07, cam: [0, 0.3, 12], look: [0, 0, 0], portrait: 1.05 },
  pile: { label: 'Pile', step: TAU / 20, drag: 0.004, drift: 0.0008, bend: 0, cam: [0, 0, 12], look: [0, 0, 0], portrait: 0.75 },
};

// Desktop / landscape: shrink to fit once the stage gets narrower than 1.6:1.
const groupScale = (aspect, M) => (aspect < 1 ? M.portrait : Math.min(1, aspect / 1.6));

const VS = /* glsl */ `uniform float uBend; varying vec2 vUv;
void main(){ vUv=uv; vec3 p=position; p.z-=uBend*p.x*p.x; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`;

// Rounded-rect card, grayscale texture → duotone (hover swaps to the
// hover-light with a slight red-channel split), animated grain, dimmed back.
const FS = /* glsl */ `uniform sampler2D uTex; uniform vec3 uDark; uniform vec3 uLight; uniform vec3 uHi; uniform float uHover; uniform float uOp; uniform float uTime; uniform float uGrain; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 p=(vUv-0.5)*vec2(2.0,2.75); float r=0.07; float d=length(max(abs(p)-vec2(1.0,1.375)+r,0.0))-r;
  float a=1.0-smoothstep(-0.006,0.0,d);
  float sh=0.006*uHover; float l=texture2D(uTex,vUv).r; float lr=texture2D(uTex,vUv+vec2(sh,0.0)).r;
  vec3 col=mix(uDark,uLight,l); vec3 hov=mix(uDark,uHi,l); hov.r=mix(uDark.r,uHi.r,lr);
  col=mix(col,hov,uHover);
  col+=(h(vUv*vec2(512.0,704.0)+fract(uTime*0.37))-0.5)*uGrain;
  if(!gl_FrontFacing) col=mix(uDark,col,0.3);
  gl_FragColor=vec4(col,a*uOp);
}`;

function layout(i, mode, off, o) {
  if (mode === 'ring') {
    const ring = i < 10 ? 0 : 1;
    const j = i % 10;
    const a = (j / 10) * TAU + (ring ? -off * 0.8 + 0.31 : off);
    const R = 5.4;
    o.x = Math.sin(a) * R;
    o.z = Math.cos(a) * R;
    o.y = ring ? -1.55 : 1.55;
    o.rx = 0;
    o.ry = a;
    o.rz = 0;
    o.s = 1;
    o.o = 0.18 + 0.82 * ((Math.cos(a) + 1) / 2);
  } else if (mode === 'arc') {
    let k = (((i - off) % N) + N) % N;
    if (k > N / 2) k -= N;
    const th = k * 0.235;
    const R = 8.5;
    o.x = Math.sin(th) * R;
    o.z = 12 - Math.cos(th) * R;
    o.y = 0;
    o.rx = 0;
    o.ry = -th;
    o.rz = 0;
    o.s = 1;
    o.o = clamp(1.7 - Math.abs(th) * 1.15);
  } else {
    const ph = (i / N) * TAU + off + rnd(i, 1) * 0.2;
    const rad = 2.5 + rnd(i, 2) * 1.4;
    o.x = Math.cos(ph) * rad * 1.6;
    o.y = Math.sin(ph) * rad * 0.95;
    o.z = rnd(i, 3) * 1.4 - 0.7;
    o.rx = (rnd(i, 5) - 0.5) * 0.3;
    o.ry = (rnd(i, 6) - 0.5) * 0.4;
    o.rz = (rnd(i, 4) - 0.5) * 0.9;
    o.s = 0.8;
    o.o = 1;
  }
}

/**
 * Three.js project gallery with three morphing layouts (ring / arc / pile).
 * Every card property lerps toward its layout target each frame, so
 * switching mode or filtering items animates rather than jumps.
 *
 * opts: posters (grayscale canvases, one per project), colors ({pd,pl,ph}),
 * mode, items (project indices to show), grain, onActive(i), onOpen(i).
 */
export function createGallery(el, opt) {
  THREE.ColorManagement.enabled = false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const g = {
    mode: opt.mode || 'ring',
    off: 0,
    offT: 0,
    items: opt.items?.length ? opt.items : opt.posters.map((_, i) => i),
    hovered: -1,
    visible: true,
    dead: false,
    down: null,
    active: -1,
    grain: opt.grain ?? 0.12,
    mx: 0,
    scale: 0,
  };

  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  r.outputColorSpace = THREE.LinearSRGBColorSpace;
  r.setPixelRatio(Math.min(2, window.devicePixelRatio));
  Object.assign(r.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  el.prepend(r.domElement);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);
  const geo = new THREE.PlaneGeometry(2, 2.75, 24, 1);
  const tex = opt.posters.map((c) => {
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  });

  const c0 = opt.colors;
  const cards = [];
  for (let i = 0; i < N; i++) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: VS,
      fragmentShader: FS,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTex: { value: tex[0] },
        uDark: { value: new THREE.Color(c0.pd) },
        uLight: { value: new THREE.Color(c0.pl) },
        uHi: { value: new THREE.Color(c0.ph) },
        uHover: { value: 0 },
        uOp: { value: 0 },
        uTime: { value: 0 },
        uGrain: { value: g.grain },
        uBend: { value: 0 },
      },
    });
    const m = new THREE.Mesh(geo, mat);
    m.userData = { i, p: 0, cur: { x: 0, y: -6, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 0 }, tgt: {}, hov: 0 };
    group.add(m);
    cards.push(m);
  }

  // Ring 2 is offset by two items so the two rings never line up the same
  // project directly above/below itself.
  const assign = () =>
    cards.forEach((m, i) => {
      const p = g.items[(i < 10 ? i : i + 2) % g.items.length];
      m.userData.p = p;
      m.material.uniforms.uTex.value = tex[p];
    });
  assign();

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const camPos = new THREE.Vector3(...GALLERY_MODES[g.mode].cam);
  const look = new THREE.Vector3(...GALLERY_MODES[g.mode].look);
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  let W = 1;
  let H = 1;

  const resize = () => {
    W = el.clientWidth || 1;
    H = el.clientHeight || 1;
    r.setSize(W, H, false);
    cam.aspect = W / H;
    cam.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();
  const io = new IntersectionObserver((es) => es.forEach((e) => (g.visible = e.isIntersecting)));
  io.observe(el);

  const aim = (e) => {
    const b = el.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    g.mx = e.pointerType === 'touch' ? 0 : ndc.x;
  };
  // Narrow (touch) stages have fewer pixels to swipe across, so each px
  // moves the gallery further — a full-width swipe travels about as far
  // as on a ~900px wide stage.
  const dragGain = () => Math.max(1, 900 / Math.max(W, 1)) * 0.75 + 0.25;
  const pd = (e) => {
    // Taps never fire a pointermove first, so aim the raycast here too.
    aim(e);
    g.down = { last: e.clientX, moved: 0 };
    el.setPointerCapture?.(e.pointerId);
  };
  const pm = (e) => {
    aim(e);
    if (g.down) {
      const dx = e.clientX - g.down.last;
      g.down.last = e.clientX;
      g.down.moved += Math.abs(dx);
      g.offT -= dx * GALLERY_MODES[g.mode].drag * dragGain() * (g.mode === 'arc' ? 1 : -1);
    }
  };
  const release = (e) => {
    g.down = null;
    // No hover on touch: drop the aim once the finger lifts.
    if (e.pointerType === 'touch') ndc.set(9, 9);
  };
  const pu = (e) => {
    if (g.down && g.down.moved < 6 && g.hovered >= 0) opt.onOpen?.(cards[g.hovered].userData.p);
    release(e);
  };
  const pl = () => {
    ndc.set(9, 9);
    g.mx = 0;
  };
  el.addEventListener('pointerdown', pd);
  el.addEventListener('pointermove', pm);
  el.addEventListener('pointerup', pu);
  el.addEventListener('pointercancel', release); // e.g. the browser took over for a vertical scroll
  el.addEventListener('pointerleave', pl);

  const t0 = performance.now();
  let raf = 0;
  const tick = () => {
    if (g.dead) return;
    raf = requestAnimationFrame(tick);
    if (!g.visible) return;
    const t = (performance.now() - t0) / 1000;
    const M = GALLERY_MODES[g.mode];
    if (!g.down && !reduce) g.offT += M.drift;
    g.off += (g.offT - g.off) * 0.08;
    const vel = g.offT - g.off;
    camPos.lerp(tmpA.set(...M.cam), 0.05);
    look.lerp(tmpB.set(...M.look), 0.05);
    cam.position.copy(camPos);
    cam.lookAt(look);
    // Lerped so a mode switch on mobile zooms rather than jumps.
    const ts = groupScale(W / H, M);
    g.scale = g.scale ? g.scale + (ts - g.scale) * 0.06 : ts;
    group.scale.setScalar(g.scale);
    group.rotation.y += (g.mx * 0.08 - group.rotation.y) * 0.05;

    ray.setFromCamera(ndc, cam);
    const hits = ray
      .intersectObjects(cards.filter((m) => m.userData.cur.o > 0.45), false)
      .sort((a, b) => b.object.renderOrder - a.object.renderOrder);
    g.hovered = hits.length ? hits[0].object.userData.i : -1;

    let best = -1;
    let bx = 1e9;
    for (const m of cards) {
      const u = m.userData;
      const c = u.cur;
      const tg = u.tgt;
      layout(u.i, g.mode, g.off, tg);
      // A card wrapping around the far side snaps instead of sweeping
      // through the middle of the scene while invisible.
      if (Math.hypot(tg.x - c.x, tg.z - c.z) > 6 && c.o < 0.05) {
        Object.assign(c, tg);
        c.o = 0;
      }
      const k = 0.075;
      c.x += (tg.x - c.x) * k;
      c.y += (tg.y - c.y) * k;
      c.z += (tg.z - c.z) * k;
      c.s += (tg.s - c.s) * k;
      c.o += (tg.o - c.o) * k;
      c.rx += angD(c.rx, tg.rx) * k;
      c.ry += angD(c.ry, tg.ry) * k;
      c.rz += angD(c.rz, tg.rz) * k;
      u.hov += ((g.hovered === u.i ? 1 : 0) - u.hov) * 0.12;
      m.position.set(c.x, c.y, c.z);
      m.rotation.set(c.rx, c.ry, c.rz);
      m.scale.setScalar(c.s * (1 + 0.05 * u.hov));
      const un = m.material.uniforms;
      un.uOp.value = c.o;
      un.uHover.value = u.hov;
      un.uTime.value = t;
      un.uGrain.value = g.grain;
      un.uBend.value = M.bend + clamp(vel * (g.mode === 'arc' ? 0.25 : 1.5), -0.15, 0.15);
      m.renderOrder = Math.round(-m.position.distanceTo(cam.position) * 100 + 10000);
      if (
        g.mode !== 'pile' &&
        c.o > 0.6 &&
        (g.mode !== 'ring' || (u.i < 10 && c.z > 0)) &&
        Math.abs(c.x) < bx
      ) {
        bx = Math.abs(c.x);
        best = u.p;
      }
    }
    const act = g.hovered >= 0 ? cards[g.hovered].userData.p : best;
    if (act >= 0 && act !== g.active) {
      g.active = act;
      opt.onActive?.(act);
    }
    el.style.cursor = g.hovered >= 0 ? 'pointer' : '';
    r.render(scene, cam);
  };
  raf = requestAnimationFrame(tick);

  return {
    setMode(m) {
      g.mode = m;
    },
    setGrain(v) {
      g.grain = v;
    },
    setColors(c) {
      cards.forEach((m) => {
        const u = m.material.uniforms;
        u.uDark.value.set(c.pd);
        u.uLight.value.set(c.pl);
        u.uHi.value.set(c.ph);
      });
    },
    setItems(items) {
      if (!items.length) return;
      g.items = items;
      assign();
      cards.forEach((m) => {
        m.userData.cur.o = 0;
        m.userData.cur.s = 0.5;
      });
      g.active = -1;
    },
    step(dir) {
      g.offT += dir * GALLERY_MODES[g.mode].step * (g.mode === 'arc' ? 1 : -1);
    },
    destroy() {
      g.dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerdown', pd);
      el.removeEventListener('pointermove', pm);
      el.removeEventListener('pointerup', pu);
      el.removeEventListener('pointercancel', release);
      el.removeEventListener('pointerleave', pl);
      geo.dispose();
      tex.forEach((t) => t.dispose());
      cards.forEach((m) => m.material.dispose());
      r.dispose();
      r.domElement.remove();
    },
  };
}
