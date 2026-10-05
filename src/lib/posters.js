import { projects } from '../data/projects';

const TAU = Math.PI * 2;
const W = 512;
const H = 704;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// One of five grayscale motifs (wave curves, ribbed glass, moon + rings,
// halftone, stacked echo type), stand-ins until real project shots exist.
function drawMotif(x, p, s) {
  if (s === 0) {
    for (let k = 0; k < 52; k++) {
      x.globalAlpha = 0.25 + 0.15 * (k % 5);
      x.lineWidth = 1.5;
      x.beginPath();
      const o = k * 12;
      x.moveTo(620 - o, -10);
      x.bezierCurveTo(420 - o, 200, 520 - o, 430, 160 - o, 720);
      x.stroke();
    }
  } else if (s === 1) {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#000');
    g.addColorStop(0.55, '#777');
    g.addColorStop(1, '#000');
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    x.fillStyle = '#000';
    for (let px = 0; px < W; px += 22) x.fillRect(px, 0, 9, H);
    x.globalAlpha = 0.9;
    x.fillStyle = '#fff';
    x.beginPath();
    x.ellipse(256, 300, 120, 200, 0.4, 0, TAU);
    x.globalCompositeOperation = 'overlay';
    x.fill();
    x.globalCompositeOperation = 'source-over';
  } else if (s === 2) {
    const g = x.createRadialGradient(256, 290, 10, 256, 290, 220);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.7, '#bbb');
    g.addColorStop(1, '#000');
    x.fillStyle = g;
    x.beginPath();
    x.arc(256, 290, 200, 0, TAU);
    x.fill();
    x.globalAlpha = 0.22;
    x.lineWidth = 1;
    for (let r = 230; r < 600; r += 14) {
      x.beginPath();
      x.arc(256, 290, r, 0, TAU);
      x.stroke();
    }
  } else if (s === 3) {
    for (let py = 8; py < H; py += 15) {
      for (let px = 8; px < W; px += 15) {
        const v = 0.5 + 0.5 * Math.sin(px * 0.017 + py * 0.009) * Math.cos(py * 0.021 - px * 0.006);
        x.beginPath();
        x.arc(px, py, v * 7.2, 0, TAU);
        x.fill();
      }
    }
  } else {
    const w = p.name.split(' ')[0].toUpperCase();
    x.font = '400 210px "Bigger Display", Anton, sans-serif';
    const sc = 470 / x.measureText(w).width;
    x.save();
    x.translate(22, 0);
    x.scale(sc, 1);
    for (let k = 0; k < 7; k++) {
      x.globalAlpha = 1 - k * 0.14;
      x.fillText(w, 0, 200 + k * 72);
    }
    x.restore();
  }
}

// Cover-fits a real photo, converted to grayscale so the duotone shader /
// tint() can recolor it per palette exactly like the generative posters.
function drawPhoto(x, img) {
  const sc = Math.max(W / img.width, H / img.height);
  const w = img.width * sc;
  const h = img.height * sc;
  x.filter = 'grayscale(1) contrast(1.1)';
  x.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  x.filter = 'none';
}

/** 512×704 (× scale) grayscale canvas for project `p` at index `i`. */
export function makePoster(p, i, scale = 1, img = null) {
  const c = document.createElement('canvas');
  c.width = W * scale;
  c.height = H * scale;
  const x = c.getContext('2d');
  x.scale(scale, scale);
  x.fillStyle = '#000';
  x.fillRect(0, 0, W, H);
  x.strokeStyle = '#fff';
  x.fillStyle = '#fff';

  const s = i % 5;
  if (img) drawPhoto(x, img);
  else drawMotif(x, p, s);

  x.globalAlpha = 1;
  const g2 = x.createLinearGradient(0, 520, 0, H);
  g2.addColorStop(0, 'rgba(0,0,0,0)');
  g2.addColorStop(1, 'rgba(0,0,0,.9)');
  x.fillStyle = g2;
  x.fillRect(0, 520, W, 184);
  x.fillStyle = '#fff';
  x.font = '600 15px Archivo, sans-serif';
  x.fillText(`(${String(i + 1).padStart(2, '0')})`, 26, 40);
  x.textAlign = 'right';
  x.fillText(p.year, 486, 40);
  x.textAlign = 'left';
  x.font = '400 44px Anton, sans-serif';
  x.fillText(p.name.toUpperCase(), 26, 640, 460);
  x.globalAlpha = 0.7;
  x.font = '600 15px Archivo, sans-serif';
  x.fillText(p.category, 26, 672);
  return c;
}

const imageCache = new Map();
function projectImage(p) {
  if (!p.image) return Promise.resolve(null);
  if (!imageCache.has(p.image)) imageCache.set(p.image, loadImage(p.image));
  return imageCache.get(p.image);
}

let postersPromise = null;
/** Grayscale poster canvases for every project, in data order. Cached. */
export function getPosters() {
  if (!postersPromise) {
    postersPromise = document.fonts.ready.then(() =>
      Promise.all(projects.map(async (p, i) => makePoster(p, i, 1, await projectImage(p))))
    );
  }
  return postersPromise;
}

/** Larger single poster (e.g. the ProjectDetail hero). */
export async function getPoster(index, scale) {
  await document.fonts.ready;
  const p = projects[index];
  return makePoster(p, index, scale, await projectImage(p));
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const tintCache = {};

/** Duotone (dark → light) data URL of a grayscale canvas, for DOM usage. */
export function tint(canvas, dark, light, key) {
  if (key && tintCache[key]) return tintCache[key];
  const c = document.createElement('canvas');
  c.width = canvas.width;
  c.height = canvas.height;
  const x = c.getContext('2d');
  x.drawImage(canvas, 0, 0);
  const im = x.getImageData(0, 0, c.width, c.height);
  const d = im.data;
  const A = hex(dark);
  const B = hex(light);
  for (let i = 0; i < d.length; i += 4) {
    const l = d[i] / 255;
    d[i] = A[0] + (B[0] - A[0]) * l;
    d[i + 1] = A[1] + (B[1] - A[1]) * l;
    d[i + 2] = A[2] + (B[2] - A[2]) * l;
  }
  x.putImageData(im, 0, 0);
  const url = c.toDataURL('image/jpeg', 0.86);
  if (key) tintCache[key] = url;
  return url;
}

/** Duotoned poster URLs for every project in the given theme colors. */
export async function getPosterURLs(colors) {
  const cs = await getPosters();
  return cs.map((cv, i) => tint(cv, colors.pd, colors.pl, `${i}-${colors.pd}-${colors.pl}`));
}
