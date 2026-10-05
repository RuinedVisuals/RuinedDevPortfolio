const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Generative 2D canvas pattern: 'flow' | 'ascii' | 'moire'.
 *
 * Sized to its element at 1× DPR, pointer-reactive, paused off-screen.
 * `getColors()` returns the live { bg, ink } so palette switches apply on
 * the next frame; call `reset()` after one to repaint from scratch.
 *
 * opts: transparent (draw over the section background), alpha, cell
 * (ascii glyph size), chars, gap / lw (moire ring spacing / width),
 * particles (flow count override), local (only react to the pointer while
 * it's over this canvas — used by the Lab tiles).
 */
export function createSketch(cv, type, getColors, o = {}) {
  const ctx = cv.getContext('2d');
  const s = { w: 0, h: 0, mx: -1, my: -1, vis: true, reset: true, dead: false, parts: null };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alpha = o.alpha ?? 1;
  const clear = !!o.transparent;
  const cell = o.cell || 12;
  const t0 = performance.now();
  let raf = 0;

  const move = (e) => {
    const b = cv.getBoundingClientRect();
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    const inside = x >= 0 && y >= 0 && x <= b.width && y <= b.height;
    s.mx = inside ? x : -1;
    s.my = inside ? y : -1;
  };
  const leave = () => {
    s.mx = -1;
    s.my = -1;
  };
  const target = o.local ? cv : window;
  target.addEventListener('pointermove', move);
  if (o.local) cv.addEventListener('pointerleave', leave);

  const io = new IntersectionObserver((es) => es.forEach((e) => (s.vis = e.isIntersecting)));
  io.observe(cv);
  // With reduced motion there's no loop, so repaint the static frame
  // whenever the canvas gets (re)sized instead.
  const ro = reduce ? new ResizeObserver(() => requestAnimationFrame(draw)) : null;
  ro?.observe(cv);

  const draw = () => {
    if (s.dead) return;
    if (!reduce) raf = requestAnimationFrame(draw);
    if (!s.vis) return;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (!w || !h) return;
    if (w !== s.w || h !== s.h) {
      s.w = w;
      s.h = h;
      cv.width = w;
      cv.height = h;
      s.reset = true;
    }
    const t = (performance.now() - t0) / 1000;
    const C = getColors();
    const x = ctx;
    const bg = () => {
      if (clear) x.clearRect(0, 0, w, h);
      else {
        x.globalAlpha = 1;
        x.fillStyle = C.bg;
        x.fillRect(0, 0, w, h);
      }
    };

    if (type === 'flow') {
      if (s.reset) {
        const n = o.particles || Math.min(2400, Math.round((w * h) / 520));
        s.parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h }));
        bg();
        s.reset = false;
      }
      // Reduced motion: run the field forward a while so the single static
      // frame shows actual trails instead of scattered specks.
      const steps = reduce ? 90 : 1;
      for (let step = 0; step < steps; step++) {
        if (clear) {
          x.globalCompositeOperation = 'destination-out';
          x.globalAlpha = 0.07;
          x.fillRect(0, 0, w, h);
          x.globalCompositeOperation = 'source-over';
        } else {
          x.globalAlpha = 0.07;
          x.fillStyle = C.bg;
          x.fillRect(0, 0, w, h);
        }
        x.globalAlpha = 0.85 * alpha;
        x.strokeStyle = C.ink;
        x.lineWidth = 1;
        x.beginPath();
        for (const p of s.parts) {
          let a = (Math.sin(p.x * 0.008 + t * 0.3) + Math.cos(p.y * 0.01 - t * 0.2)) * Math.PI;
          if (s.mx >= 0) {
            const d = Math.hypot(s.mx - p.x, s.my - p.y);
            if (d < 160) a = Math.atan2(s.my - p.y, s.mx - p.x) + (Math.PI / 2) * (1 + (1 - d / 160));
          }
          const nx = p.x + Math.cos(a) * 1.8;
          const ny = p.y + Math.sin(a) * 1.8;
          x.moveTo(p.x, p.y);
          x.lineTo(nx, ny);
          p.x = nx;
          p.y = ny;
          if (nx < 0 || ny < 0 || nx > w || ny > h || Math.random() < 0.004) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
          }
        }
        x.stroke();
      }
      x.globalAlpha = 1;
    } else if (type === 'ascii') {
      const ch = o.chars || ' .:-=+*#%@';
      bg();
      x.globalAlpha = alpha;
      x.fillStyle = C.ink;
      x.font = `600 ${cell}px ui-monospace, Menlo, monospace`;
      for (let cy = 0; cy < h; cy += cell) {
        for (let cx = 0; cx < w; cx += cell) {
          let v =
            0.5 +
            0.5 * Math.sin(cx * 0.021 + t * 0.9) * Math.cos(cy * 0.017 - t * 0.6 + Math.sin(cx * 0.004 + t * 0.2) * 3);
          if (s.mx >= 0) {
            const d = Math.hypot(s.mx - cx, s.my - cy);
            v += Math.max(0, 1 - d / 130) * 0.9 * (0.6 + 0.4 * Math.sin(d * 0.15 - t * 6));
          }
          const k = Math.floor(clamp(v, 0, 0.999) * ch.length);
          if (ch[k] !== ' ') x.fillText(ch[k], cx, cy + cell);
        }
      }
      x.globalAlpha = 1;
    } else {
      bg();
      x.globalAlpha = alpha;
      x.strokeStyle = C.ink;
      x.lineWidth = o.lw || 1.6;
      const c1 = [w * 0.4, h * 0.45];
      const c2 =
        s.mx >= 0
          ? [s.mx, s.my]
          : [w * 0.6 + Math.sin(t * 0.7) * w * 0.12, h * 0.55 + Math.cos(t * 0.5) * h * 0.1];
      const max = Math.hypot(w, h);
      const gap = o.gap || 9;
      for (const c of [c1, c2]) {
        x.beginPath();
        for (let r = 6; r < max; r += gap) {
          x.moveTo(c[0] + r, c[1]);
          x.arc(c[0], c[1], r, 0, TAU);
        }
        x.stroke();
      }
      x.globalAlpha = 1;
    }
  };
  raf = requestAnimationFrame(draw);

  return {
    reset() {
      s.reset = true;
      if (reduce) requestAnimationFrame(draw);
    },
    destroy() {
      s.dead = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
      target.removeEventListener('pointermove', move);
      if (o.local) cv.removeEventListener('pointerleave', leave);
    },
  };
}
