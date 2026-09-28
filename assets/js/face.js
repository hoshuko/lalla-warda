// Rituel visage sur une vraie photo : brume de rose (gouttelettes), masque au ghassoul posé au pinceau puis séché,
// rinçage, et trois gouttes d'élixir massées jusqu'à l'éclat. Le masque de peau (repères Vision) évite yeux, sourcils et lèvres.
import { $, $$, esc, clamp01, lerp, k01, eo, eio, smooth, mulberry, progress, loadImage, price } from './util.js';
import { FACE } from './facedata.js';

const STEPS = [0, .2, .56, .7, 1];           // brume, masque (pose et séchage), rinçage, élixir

// moteur de rendu (sans DOM) : la page et la vidéo promo l'utilisent ; p va de 0 (visage nu) à 1 (éclat final)
export function createFace(canvas, { photo, peau, faceImg }, data = FACE) {
  const ctx = canvas.getContext('2d');
  const F = { photo, peau, faceImg, data, W: 1200, H: 1806, s: 1 };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  // les calques dépendent de la taille : on les (re)construit à partir des images d'origine
  const buildLayers = () => {
    const { W, H, s } = F;
    const draw = img => { const c = mk(W, H); c.getContext('2d').drawImage(img, 0, 0, W, H); return c; };
    F.base = draw(F.photo);
    F.skin = draw(F.peau); F.full = draw(F.faceImg);
    // ombrage : luminance de la photo, contrastée, pour que l'argile épouse les volumes du visage
    const sh = mk(W, H), sx = sh.getContext('2d');
    sx.filter = 'grayscale(1) contrast(1.35) brightness(1.18)'; sx.drawImage(F.photo, 0, 0, W, H); sx.filter = 'none';
    F.shade = sh;
    // reflets : hautes lumières de la photo, pour l'éclat final
    const hi = mk(W, H), hx = hi.getContext('2d');
    hx.filter = 'grayscale(1) contrast(3.2) brightness(.9)'; hx.drawImage(F.photo, 0, 0, W, H); hx.filter = 'none';
    hx.globalCompositeOperation = 'destination-in'; hx.drawImage(F.full, 0, 0);
    F.hi = hi;
    // grain de l'argile
    const gr = mk(W, H), gx = gr.getContext('2d'), rnd = mulberry(3);
    gx.fillStyle = '#808080'; gx.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 90; i++) {
      const v = 90 + rnd() * 90 | 0; gx.fillStyle = `rgb(${v},${v},${v})`;
      gx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2.2 * s, 1 + rnd() * 2.2 * s);
    }
    F.grain = gr;
    // relief de l'argile : traces de pinceau aléatoires, floutées, puis estampées (lumière venant du haut à gauche)
    const hs = mk(W, H), hc = hs.getContext('2d'), r3 = mulberry(5);
    hc.fillStyle = '#808080'; hc.fillRect(0, 0, W, H); hc.lineCap = 'round';
    for (let i = 0; i < 900; i++) {
      const x = r3() * W, y = r3() * H, a = r3() * Math.PI, l = (30 + r3() * 90) * s, v = 70 + r3() * 120 | 0;
      hc.strokeStyle = `rgba(${v},${v},${v},.5)`; hc.lineWidth = (4 + r3() * 14) * s;
      hc.beginPath(); hc.moveTo(x, y); hc.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * .35); hc.stroke();
    }
    hc.filter = `blur(${2.2 * s}px)`; hc.drawImage(hs, 0, 0); hc.filter = 'none';
    const src = hc.getImageData(0, 0, W, H), out = hc.createImageData(W, H), sd = src.data, od = out.data;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = (y * W + x) * 4, dx = sd[i + 4] - sd[i - 4], dy = sd[i + W * 4] - sd[i - W * 4];
      const v = Math.max(0, Math.min(255, 128 - (dx + dy) * 1.6));
      od[i] = od[i + 1] = od[i + 2] = v; od[i + 3] = 255;
    }
    const rel = mk(W, H); rel.getContext('2d').putImageData(out, 0, 0);
    F.relief = rel;
    F.clay = mk(W, H); F.brush = mk(W, H); F.wipe = mk(W, H); F.tmp = mk(W, H);
    // gouttelettes de brume : tirées dans le masque du visage
    const fd = F.full.getContext('2d').getImageData(0, 0, W, H).data;
    const r2 = mulberry(11); F.drops = [];
    let guard = 0;
    while (F.drops.length < 240 && guard++ < 20000) {
      const x = r2() * W, y = r2() * H;
      if (fd[((y | 0) * W + (x | 0)) * 4] > 160) F.drops.push({ x, y, r: (2 + r2() * r2() * 6) * s * 1.3, t: r2(), a: r2() });
    }
    // chemins du pinceau (coordonnées de la photo en 1200 px de large)
    const d = F.data, fh = d.forehead, cl = d.cheekL, cr = d.cheekR, ch = d.chin, nt = d.noseTip, lb = d.leftBrow, rb = d.rightBrow;
    const browY = Math.min(lb[1], rb[1]);
    F.paths = [
      [[fh[0] - 250, fh[1] - 30], [fh[0] + 250, fh[1] - 40]],
      [[fh[0] + 240, fh[1] + 60], [fh[0] - 240, fh[1] + 70]],
      [[nt[0], browY + 30], [nt[0], nt[1] - 10]],
      [[cl[0] + 110, cl[1] + 60], [cl[0] - 170, cl[1] - 50]],
      [[cl[0] + 90, cl[1] + 190], [cl[0] - 150, cl[1] + 110]],
      [[cr[0] - 110, cr[1] + 60], [cr[0] + 170, cr[1] - 50]],
      [[cr[0] - 90, cr[1] + 190], [cr[0] + 150, cr[1] + 110]],
      [[ch[0] - 170, ch[1] - 95], [ch[0] + 170, ch[1] - 95]],
    ].map(p => p.map(([x, y]) => [x * s, y * s]));
    F.dropT = [[fh[0] - 40, fh[1] + 10], [cl[0] + 20, cl[1] - 20], [cr[0] - 20, cr[1] - 20]].map(([x, y]) => [x * s, y * s]);
  };
  // largeur de travail en pixels (au plus celle de la photo) : les calques sont reconstruits à cette taille
  function resize(w) {
    w = Math.max(200, Math.min(1200, Math.round(w)));
    F.s = w / 1200; F.W = w; F.H = Math.round(1806 * F.s);
    canvas.width = F.W; canvas.height = F.H;
    buildLayers();
  }


  function render(p) {
    const { W, H } = F, g = ctx;
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.drawImage(F.base, 0, 0);
    // 1. brume : jet de gouttelettes depuis la droite, qui se posent puis s'évaporent pendant le masque
    const mist = k01(p, .02, .15), dry = k01(p, .24, .1);
    if (mist > 0 && dry < 1) {
      const ox = W * 1.05, oy = H * .22;
      F.drops.forEach(dp => {
        const k = clamp01((mist - dp.t * .7) / .3);
        if (k <= 0) return;
        const e = eo(k), x = lerp(ox, dp.x, e), y = lerp(oy, dp.y, e) - Math.sin(e * Math.PI) * 40 * F.s;
        const r = dp.r * lerp(.5, 1, e), a = (1 - dry) * (k < 1 ? .55 : .8);
        g.globalAlpha = a;
        g.fillStyle = 'rgba(40,20,20,.28)'; g.beginPath(); g.arc(x + r * .25, y + r * .35, r, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.arc(x - r * .35, y - r * .35, r * .32, 0, 7); g.fill();
      });
      g.globalAlpha = 1;
    }
    // 2. argile : pinceau, séchage, rinçage
    const app = k01(p, .22, .2), drying = k01(p, .42, .14), rinse = k01(p, .57, .12);
    if (app > 0 && rinse < 1) {
      // pinceau : tampons ovales le long de chaque trait, bords irréguliers ; à la fin, tout le masque de peau est couvert
      const B = F.brush.getContext('2d');
      B.clearRect(0, 0, W, H);
      const n = F.paths.length, R = 118 * F.s;
      F.paths.forEach(([[x0, y0], [x1, y1]], i) => {
        const k = eio(clamp01(app * 1.15 * n - i * .9));
        if (k <= 0) return;
        const len = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0), steps = Math.ceil(len * k / (R * .22));
        const rnd = mulberry(40 + i);
        for (let j = 0; j <= steps; j++) {
          const t = j / Math.max(1, steps) * k, jx = (rnd() - .5) * R * .5, jy = (rnd() - .5) * R * .5;
          const x = lerp(x0, x1, t) - Math.sin(ang) * jx, y = lerp(y0, y1, t) + Math.cos(ang) * jy, rr = R * (.78 + rnd() * .38);
          const gr = B.createRadialGradient(x, y, rr * .45, x, y, rr);
          gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
          B.fillStyle = gr; B.beginPath(); B.ellipse(x, y, rr * 1.25, rr * .82, ang, 0, 7); B.fill();
        }
      });
      const all = k01(app, .82, .18);
      if (all > 0) { B.globalAlpha = all; B.drawImage(F.skin, 0, 0); B.globalAlpha = 1; }
      const X = F.clay.getContext('2d');
      X.globalCompositeOperation = 'source-over'; X.globalAlpha = 1;
      const wet = [132, 102, 84], drc = [196, 178, 160], e = smooth(drying);
      X.fillStyle = `rgb(${wet.map((v, i) => Math.round(lerp(v, drc[i], e))).join(',')})`; X.fillRect(0, 0, W, H);
      X.globalCompositeOperation = 'overlay'; X.globalAlpha = lerp(.4, .7, e); X.drawImage(F.grain, 0, 0);
      X.globalCompositeOperation = 'overlay'; X.globalAlpha = lerp(.9, .55, e); X.drawImage(F.relief, 0, 0);
      X.globalCompositeOperation = 'multiply'; X.globalAlpha = lerp(.8, .55, e); X.drawImage(F.shade, 0, 0);
      // argile humide : brillante ; elle se matifie en séchant
      X.globalCompositeOperation = 'screen'; X.globalAlpha = (1 - e) * .22; X.drawImage(F.hi, 0, 0);
      X.globalAlpha = 1; X.globalCompositeOperation = 'destination-in'; X.drawImage(F.skin, 0, 0);
      X.globalCompositeOperation = 'destination-in'; X.drawImage(F.brush, 0, 0);
      if (rinse > 0) {
        // rinçage : une vague descend du front au menton
        const Wp = F.wipe.getContext('2d'); Wp.clearRect(0, 0, W, H); Wp.fillStyle = '#fff';
        const y = lerp(H * .12, H * .9, eio(rinse));
        Wp.beginPath(); Wp.moveTo(0, 0); Wp.lineTo(W, 0); Wp.lineTo(W, y);
        for (let x = W; x >= 0; x -= W / 24) Wp.lineTo(x, y + Math.sin(x / W * 12 + rinse * 9) * 26 * F.s);
        Wp.closePath(); Wp.filter = `blur(${8 * F.s}px)`; Wp.fill(); Wp.filter = 'none';
        X.globalCompositeOperation = 'destination-out'; X.drawImage(F.wipe, 0, 0);
      }
      X.globalCompositeOperation = 'source-over';
      g.globalAlpha = lerp(.92, .97, e); g.drawImage(F.clay, 0, 0); g.globalAlpha = 1;
    }
    // peau fraîche après rinçage, puis éclat de l'élixir
    const fresh = k01(p, .62, .08), glow = k01(p, .82, .16);
    if (fresh > 0) {
      g.globalCompositeOperation = 'soft-light'; g.globalAlpha = fresh * .22;
      g.drawImage(F.full, 0, 0);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    }
    // 3. élixir : trois gouttes tombent, s'étalent en voile doré, puis la peau brille
    const fall = k01(p, .72, .08), spread = k01(p, .79, .1);
    if (fall > 0) {
      F.dropT.forEach(([x, y], i) => {
        const k = eo(clamp01(fall * 1.6 - i * .3));
        if (k <= 0) return;
        const r = 16 * F.s, yy = lerp(y - H * .25, y, k * k);
        if (spread <= 0 || k < 1) {
          const gr = g.createRadialGradient(x - r * .3, yy - r * .4, 1, x, yy, r * 1.1);
          gr.addColorStop(0, 'rgba(255,240,200,.95)'); gr.addColorStop(.35, 'rgba(236,170,64,.9)'); gr.addColorStop(1, 'rgba(160,90,20,.85)');
          g.fillStyle = gr; g.beginPath(); g.ellipse(x, yy, r * .85, r * (k < 1 ? 1.25 : .9), 0, 0, 7); g.fill();
        }
        const sp = eo(spread);
        if (sp > 0) {
          const R = lerp(10, 210, sp) * F.s;
          const gg = g.createRadialGradient(x, y, 0, x, y, R);
          gg.addColorStop(0, `rgba(240,178,80,${.34 * (1 - glow)})`); gg.addColorStop(1, 'rgba(240,178,80,0)');
          g.globalCompositeOperation = 'soft-light'; g.fillStyle = gg; g.beginPath(); g.arc(x, y, R, 0, 7); g.fill();
          g.globalCompositeOperation = 'source-over';
        }
      });
    }
    if (glow > 0 || spread > 0) {
      const k = Math.max(glow, spread * .5);
      g.globalCompositeOperation = 'screen'; g.globalAlpha = k * .42; g.drawImage(F.hi, 0, 0);
      g.globalCompositeOperation = 'soft-light'; g.globalAlpha = k * .35; g.fillStyle = '#f2b36a'; g.fillRect(0, 0, W, H);
      // la teinte chaude ne déborde pas du visage : on repose la photo d'origine hors du masque
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      const T = F.tmp.getContext('2d'); T.clearRect(0, 0, W, H); T.globalCompositeOperation = 'source-over';
      T.drawImage(F.base, 0, 0); T.globalCompositeOperation = 'destination-out'; T.drawImage(F.full, 0, 0);
      g.drawImage(F.tmp, 0, 0);
    }
  }

  // annotations en SVG (repère de la photo, 1200 × 1806) : zones du masque (étape 2), gestes de massage (étape 4)
  function notes(step, z) {
    const d = F.data;
    const T = (x, y, t, a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="36">${esc(t)}</text>`;
    let h = '';
    if (step === 1) {
      h += `<ellipse class="zone" cx="${d.leftEye[0]}" cy="${d.leftEye[1] + 6}" rx="118" ry="72"/><ellipse class="zone" cx="${d.rightEye[0]}" cy="${d.rightEye[1] + 6}" rx="118" ry="72"/>`;
      h += T(d.forehead[0], d.forehead[1] - 90, z.front) + T(d.noseTip[0], d.noseTip[1] - 150, z.zoneT) + T(d.cheekL[0] - 60, d.cheekL[1] + 40, z.joues)
        + T(d.cheekR[0] + 60, d.cheekR[1] + 40, z.joues) + T(d.chin[0], d.chin[1] - 30, z.menton) + T(600, d.leftEye[1] + 150, z.yeux);
    }
    if (step === 3) {
      [[d.cheekL, -1], [d.cheekR, 1]].forEach(([c, sd]) => {
        const x = c[0], y = c[1];
        h += `<path class="gest" pathLength="1" d="M${x + sd * -40} ${y + 90} C${x + sd * 80} ${y + 60} ${x + sd * 110} ${y - 40} ${x + sd * 60} ${y - 120}"/>`;
        h += `<path class="arrow" d="M${x + sd * 60} ${y - 138} l${sd * 20} 26 l${sd * -32} 4 Z"/>`;
      });
      h += `<path class="gest" pathLength="1" d="M${d.forehead[0] - 170} ${d.forehead[1] + 10} C${d.forehead[0] - 60} ${d.forehead[1] - 70} ${d.forehead[0] + 60} ${d.forehead[1] - 70} ${d.forehead[0] + 170} ${d.forehead[1] + 10}"/>`;
    }
    return h;
  }


  // minuteur de pose : null en dehors de la pose, sinon le temps restant (10 min en accéléré)
  function timer(p) {
    const app = k01(p, .22, .2), drying = k01(p, .42, .14), rinse = k01(p, .57, .12);
    if (!(app > .98 && rinse === 0)) return null;
    const left = Math.round(600 * (1 - drying));
    return { left, frac: 1 - drying, text: `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` };
  }
  return { resize, render, notes, timer, get size() { return [F.W, F.H]; } };
}

export const stepAt = p => { let step = 0; STEPS.forEach((b, i) => { if (p >= b && i < 4) step = i; }); return step; };
export const gestureAt = p => k01(p, .84, .12);
export const notesOpacity = (p, step) => (step === 1 ? eo(k01(p, .22, .05)) * (1 - k01(p, .5, .06)) : step === 3 ? 1 : 0);
export const timerSVG = frac => `<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11" fill="none" stroke="#EAD4D0" stroke-width="3"/><circle cx="13" cy="13" r="11" fill="none" stroke="#B23F66" stroke-width="3" stroke-dasharray="${(69.1 * frac).toFixed(1)} 70" transform="rotate(-90 13 13)"/></svg>`;

export function initFace({ C, U, byId, RM, openSheet }) {
  const sec = $('#visage'), cv = $('#face-cv'); if (!sec || !cv) return null;
  const notes = $('#face-notes'), timer = $('#face-timer'), list = $('#face-steps');
  list.innerHTML = C.visage.map((s, i) => {
    const p = s.produit && byId[s.produit];
    return `<li data-n="0${i + 1}"><b>${esc(s.titre)}</b><span class="t">${esc(s.temps)}</span><p>${esc(s.texte)}</p>${p ? `<button class="prod" type="button" data-sheet="${p.id}"><img src="assets/img/${p.photo}.webp" alt="" width="34" height="34">${esc(p.nom)} · ${price(p.prix, C.devise)}</button>` : ''}</li>`;
  }).join('');
  const lis = $$('li', list);
  notes.setAttribute('viewBox', '0 0 1200 1806');
  const F = { face: null, p: -1, lock: null, step: -1 };
  Promise.all([loadImage('assets/img/visage.webp'), loadImage('assets/img/visage-peau.png'), loadImage('assets/img/visage-face.png')]).then(([photo, peau, faceImg]) => {
    if (!photo || !peau || !faceImg) return;
    F.face = createFace(cv, { photo, peau, faceImg });
    resize();
  });
  function resize() {
    if (!F.face) return;
    F.face.resize((cv.clientWidth || 600) * Math.min(devicePixelRatio || 1, 2));
    F.p = -1;
  }
  function render(p) {
    F.face.render(p);
    const tm = F.face.timer(p);
    timer.classList.toggle('on', !!tm);
    if (tm) timer.innerHTML = timerSVG(tm.frac) + tm.text;
    const step = stepAt(p);
    lis.forEach((li, i) => { li.classList.toggle('on', i === step); li.classList.toggle('done', i < step); });
    if (step !== F.step) { F.step = step; notes.innerHTML = F.face.notes(step, C.zonesVisage); }
    const gk = gestureAt(p);
    $$('.gest', notes).forEach(n => { n.style.strokeDasharray = 1; n.style.strokeDashoffset = (1 - gk).toFixed(3); });
    $$('.arrow', notes).forEach(n => { n.style.opacity = gk > .95 ? 1 : 0; });
    notes.style.opacity = notesOpacity(p, step);
  }
  return {
    el: sec, on: false, resize,
    frame() {
      if (!F.face) return true;
      const p = F.lock != null ? F.lock : progress(sec);
      if (Math.abs(p - F.p) < .0005) return false;
      F.p = RM || F.p < 0 ? p : F.p + (p - F.p) * .2;
      if (Math.abs(p - F.p) < .0005) F.p = p;
      render(F.p);
      return Math.abs(p - F.p) > .0005;
    },
    debug(v) { F.lock = v; }
  };
}
