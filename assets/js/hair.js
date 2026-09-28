// Cheveux. 1) Au microscope (Three.js) : une fibre dont les écailles de cuticule sont soulevées ; une vague d'huile dorée
// la parcourt, les écailles se referment et la fibre devient brillante. 2) Le bain d'huile sur une vraie photo de cheveux.
import { $, $$, esc, clamp01, lerp, k01, eo, eio, smooth, mulberry, progress, loadImage } from './util.js';
import { studioEnv } from './studio.js';

// moteur de la scène (sans DOM) : la page et la vidéo promo l'utilisent ; p va de 0 (fibre abîmée) à 1 (fibre gainée, vue entière)
export function createMicro(THREE, canvas, { light = false, preserve = false, zoom = 1 } = {}) {
  const st = { w: 16, h: 9 };
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: preserve });
  r.toneMapping = THREE.NeutralToneMapping; r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.environment = studioEnv(THREE, r, { wall: '#1a0d12' }); scene.environmentIntensity = .55;
  scene.background = new THREE.Color('#150a0f');
  scene.fog = null;
  const cam = new THREE.PerspectiveCamera(32, 1, .05, 80);
  const key = new THREE.DirectionalLight('#ffe9d6', 2.4); key.position.set(-2, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight('#f3c46c', 3); rim.position.set(3, 1.5, -5); scene.add(rim);
  const graze = new THREE.DirectionalLight('#ffffff', 1.4); graze.position.set(-6, .5, 1); scene.add(graze);
  scene.add(new THREE.HemisphereLight('#5b3346', '#0d0508', .5));

  // la fibre : un tube légèrement ondulé
  const LEN = 20, R = .55;
  const curve = new THREE.CatmullRomCurve3([-10, -6, -2, 2, 6, 10].map((x, i) => new THREE.Vector3(x, Math.sin(i * 1.3) * .35, Math.cos(i * .9) * .25)));
  const cortex = new THREE.Mesh(new THREE.TubeGeometry(curve, 240, R * .96, 40, false), new THREE.MeshPhysicalMaterial({ color: '#2b160d', roughness: .55, clearcoat: .2 }));
  scene.add(cortex);
  // écailles de la cuticule : une tuile courbe, répétée en anneaux qui se chevauchent vers la pointe
  const PER = 16, SPACING = .17, RINGS = Math.floor(LEN / SPACING), TL = .3;
  const tile = new THREE.CylinderGeometry(R, R, TL, 6, 3, true, -Math.PI / PER * 1.18, Math.PI * 2 / PER * 1.18);
  tile.translate(0, TL / 2, -R);                      // charnière à la base de la tuile, sur la surface de la fibre
  const pa = tile.attributes.position;
  for (let i = 0; i < pa.count; i++) {             // bord libre légèrement dentelé et relevé
    const y = pa.getY(i) / TL, a = Math.atan2(pa.getX(i), pa.getZ(i));
    const k = 1 + y * y * .06 + Math.sin(a * 23) * .012 * y;
    pa.setX(i, pa.getX(i) * k); pa.setZ(i, pa.getZ(i) * k);
  }
  tile.computeVertexNormals();
  const scaleMat = new THREE.MeshPhysicalMaterial({ color: '#4d3226', roughness: .8, metalness: 0, clearcoat: 0, clearcoatRoughness: .2, side: THREE.DoubleSide, sheen: .3, sheenColor: new THREE.Color('#8a5a3a') });
  const scales = new THREE.InstancedMesh(tile, scaleMat, RINGS * PER);
  scales.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(RINGS * PER * 3), 3);
  scene.add(scales);
  const rnd = mulberry(9);
  const inst = [];
  for (let j = 0; j < RINGS; j++) for (let i = 0; i < PER; i++) inst.push({ j, i, u: (j + .5) / RINGS, th: (i + (j % 2) * .5) / PER * Math.PI * 2 + (rnd() - .5) * .1, lift: .12 + rnd() * .3, roll: (rnd() - .5) * .18, n: rnd() });
  // gaine d'huile : un tube un peu plus large, dessiné jusqu'au front de la vague ; une goutte bombée marque ce front
  const coatGeo = new THREE.TubeGeometry(curve, 240, R * 1.07, 40, false);
  const coat = new THREE.Mesh(coatGeo, new THREE.MeshPhysicalMaterial({ color: '#f0c070', roughness: .03, metalness: 0, transparent: true, opacity: .26, clearcoat: 1, clearcoatRoughness: .02, emissive: '#6a3c08', emissiveIntensity: .25, envMapIntensity: 2.2, depthWrite: false }));
  scene.add(coat);
  const bead = new THREE.Mesh(new THREE.SphereGeometry(R * 1.18, 40, 24), coat.material);
  scene.add(bead);
  // gouttelettes d'huile qui roulent devant la vague
  const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(.09, 16, 10), coat.material, 26);
  scene.add(drops);
  // poussières en suspension (flou d'arrière-plan)
  const dust = (() => {
    const n = light ? 140 : 320, pos = new Float32Array(n * 3), rr = mulberry(21);
    for (let i = 0; i < n; i++) { pos[i * 3] = (rr() - .5) * 26; pos[i * 3 + 1] = (rr() - .5) * 12; pos[i * 3 + 2] = -2 - rr() * 14; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,220,170,.9)'); gr.addColorStop(1, 'rgba(255,220,170,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    const m = new THREE.PointsMaterial({ size: .22, map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55 });
    const pts = new THREE.Points(g, m); scene.add(pts); return pts;
  })();

  const P = new THREE.Vector3(), T = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), Q2 = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1), X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
  const D = new THREE.Vector3(), XA = new THREE.Vector3(), O = new THREE.Vector3();
  function frameAt(u) {
    curve.getPointAt(u, P); curve.getTangentAt(u, T);
    N.copy(up).addScaledVector(T, -up.dot(T)).normalize(); B.crossVectors(T, N);
  }
  function update(p, t) {
    const w = lerp(-.08, 1.08, eio(k01(p, .16, .62)));     // front de la vague, en fraction de la fibre
    const shine = k01(p, .6, .3);
    inst.forEach((s, k) => {
      frameAt(s.u);
      const heal = smooth(clamp01((w - s.u) / .07));
      const lift = lerp(s.lift, .015, heal) + (1 - heal) * Math.sin(t * 1.3 + s.n * 9) * .02;
      // repère de la tuile : Y le long de la fibre, Z vers l'extérieur ; la charnière est à la base
      D.copy(N).multiplyScalar(Math.cos(s.th)).addScaledVector(B, Math.sin(s.th));
      XA.crossVectors(T, D);
      M.makeBasis(XA, T, D);
      Q.setFromRotationMatrix(M);
      Q2.setFromAxisAngle(X, lift); Q.multiply(Q2);             // la tuile se soulève autour de sa charnière
      Q2.setFromAxisAngle(Y, s.roll * (1 - heal)); Q.multiply(Q2);
      O.copy(P).addScaledVector(D, R).addScaledVector(T, -TL * .45);
      M.compose(O, Q, S);
      scales.setMatrixAt(k, M);
      // partie sèche : terne et grisée, bords plus clairs ; partie nourrie : ambrée
      const edge = .12 + s.n * .18;
      col.setRGB(lerp(1.05 + edge, 1.2, heal), lerp(.98 + edge, 1.05, heal), lerp(.95 + edge, .9, heal));
      scales.setColorAt(k, col);
    });
    scales.instanceMatrix.needsUpdate = true; scales.instanceColor.needsUpdate = true;
    scaleMat.roughness = lerp(.72, .28, shine); scaleMat.clearcoat = shine;
    const segs = coatGeo.parameters.tubularSegments, radial = coatGeo.parameters.radialSegments;
    const cw = clamp01(w);
    coat.geometry.setDrawRange(0, Math.floor(cw * segs) * radial * 6);
    coat.visible = cw > .005;
    frameAt(clamp01(w));
    bead.position.copy(P); bead.visible = w > 0 && w < 1;
    bead.scale.set(1, 1, 1);
    for (let i = 0; i < 26; i++) {
      const u = clamp01(w + .01 + (i % 13) * .004), a = i * 2.4 + t * 2;
      frameAt(u);
      D.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a));
      O.copy(P).addScaledVector(D, R * 1.12);
      M.compose(O, Q.identity(), S.setScalar(w > 0 && w < 1 ? .6 + (i % 5) * .15 : 0));
      drops.setMatrixAt(i, M);
    }
    S.set(1, 1, 1);
    drops.instanceMatrix.needsUpdate = true;
    // caméra : gros plan sur la fibre abîmée, suit la vague, puis recule pour montrer la fibre entière
    const back = eio(k01(p, .78, .22));
    const fu = Math.min(.8, Math.max(.2, w + .04));          // la caméra suit le front de la vague
    frameAt(fu);
    const aspect = st.w / st.h;
    const near = aspect < .8 ? 9 : 5.8, far = aspect < .8 ? 22 : 13;
    const dist = lerp(near, far, back) * zoom, orbit = Math.sin(p * 3.2) * .5 + Math.sin(t * .15) * .06;   // oscillation bornée, pas de dérive avec le temps
    const tx = lerp(P.x, 0, back), ty = lerp(P.y, 0, back);
    cam.position.set(tx + Math.sin(orbit) * dist * .3 - dist * .18, ty + lerp(1.6, 2.6, back), Math.cos(orbit) * dist);
    cam.lookAt(tx, ty, 0);
    dust.rotation.y = t * .01;
  }
  return {
    update, render() { r.render(scene, cam); }, renderer: r,
    resize(w, h, dpr = 1) { if (!w || !h) return; st.w = w; st.h = h; r.setPixelRatio(dpr); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  };
}
export const microPhase = p => (p < .34 ? 0 : p < .67 ? 1 : 2);

export function initMicro({ C, THREE, DPR, RM, mobile }) {
  const sec = $('#micro'), cv = $('#micro-cv');
  const notes = $('#micro-notes');
  notes.innerHTML = C.cheveux.microscope.map(n => `<li><b>${esc(n.titre)}</b><p>${esc(n.texte)}</p></li>`).join('');
  $('#micro-scale').innerHTML = `<i aria-hidden="true"></i>${esc(C.cheveux.diametre)}`;
  const lis = $$('li', notes);
  const st = { p: -1, lock: null };
  if (!THREE) {
    return { el: sec, on: false, frame() { const p = progress(sec); lis.forEach((li, i) => li.classList.toggle('on', i === microPhase(p))); return false; }, debug() {} };
  }
  const M = createMicro(THREE, cv, { light: mobile() });
  const resize = () => { M.resize(cv.clientWidth, cv.clientHeight, DPR()); st.p = -1; };
  resize();
  return {
    el: sec, on: false, resize,
    frame(now) {
      const target = st.lock != null ? st.lock : progress(sec);
      st.p = st.p < 0 || RM ? target : st.p + (target - st.p) * .12;
      if (Math.abs(target - st.p) < .0005) st.p = target;
      M.update(st.p, RM ? 0 : now / 1000);
      M.render();
      lis.forEach((li, i) => li.classList.toggle('on', i === microPhase(st.p)));
      return true;
    },
    debug(v) { st.lock = v; }
  };
}

// Bain d'huile sur une vraie photo : gouttes sur la raie, massage du cuir chevelu, reflet qui descend jusqu'aux pointes
export function initHairPhoto({ C, U, RM }) {
  const fig = $('.hair-photo'), cv = $('#hair-cv'), list = $('#hair-steps'); if (!cv) return null;
  list.innerHTML = C.cheveux.etapes.map((s, i) => `<li tabindex="0" data-i="${i}" data-n="0${i + 1}"><b>${esc(s.titre)}</b><span class="t">${esc(s.temps)}</span><p>${esc(s.texte)}</p></li>`).join('');
  const lis = $$('li', list);
  const g = cv.getContext('2d');
  const H = { step: 0, t0: 0, ready: false, manual: 0 };
  const DUR = 3.2;
  lis.forEach(li => {
    const go = () => { H.step = +li.dataset.i; H.t0 = performance.now(); H.manual = performance.now(); };
    li.addEventListener('click', go); li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  Promise.all([loadImage('assets/img/cheveux.webp'), loadImage('assets/img/cheveux-masque.png')]).then(([photo, mask]) => {
    if (!photo || !mask) return;
    const W = 1200, Hh = Math.round(1200 * photo.height / photo.width);
    cv.width = W; cv.height = Hh;
    const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = Hh; return c; };
    const base = mk(); base.getContext('2d').drawImage(photo, 0, 0, W, Hh);
    const m = mk(); m.getContext('2d').drawImage(mask, 0, 0, W, Hh);
    // reflets des mèches : hautes lumières de la photo, limitées aux cheveux
    const hi = mk(), hx = hi.getContext('2d');
    hx.filter = 'grayscale(1) contrast(2.6) brightness(1.25)'; hx.drawImage(photo, 0, 0, W, Hh); hx.filter = 'none';
    hx.globalCompositeOperation = 'destination-in'; hx.drawImage(m, 0, 0);
    Object.assign(H, { W, Hh, base, m, hi, band: mk(), ready: true, t0: performance.now() });
  });
  function draw(now) {
    const { W, Hh } = H;
    let t = (now - H.t0) / 1000;
    if (!RM && t > DUR && now - H.manual > 9000) { H.step = (H.step + 1) % 4; H.t0 = now; t = 0; }
    const k = RM ? 1 : clamp01(t / DUR), s = H.step;
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.drawImage(H.base, 0, 0);
    const gloss = s >= 2 ? (s === 2 ? eio(k) : 1) : 0;
    // reflet doré qui descend des racines aux pointes (étape 3), puis reste
    if (gloss > 0) {
      const b = H.band.getContext('2d'); b.clearRect(0, 0, W, Hh); b.globalCompositeOperation = 'source-over';
      const y = lerp(-.1, 1.15, gloss) * Hh;
      const gr = b.createLinearGradient(0, y - Hh * .35, 0, y);
      gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(.85, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      b.fillStyle = gr; b.fillRect(0, 0, W, Hh);
      if (s > 2) { b.fillStyle = 'rgba(255,255,255,.75)'; b.fillRect(0, 0, W, Hh); }
      b.globalCompositeOperation = 'destination-in'; b.drawImage(H.hi, 0, 0);
      g.globalCompositeOperation = 'screen'; g.globalAlpha = .75; g.drawImage(H.band, 0, 0);
      g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .35; g.fillStyle = '#e0a13c';
      b.globalCompositeOperation = 'source-over';
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    }
    // gouttes sur la raie (étape 1) et cercles de massage (étape 2)
    const crown = [[.47, .1], [.53, .16], [.44, .2], [.56, .26], [.5, .3], [.46, .36], [.54, .4], [.5, .46]];
    if (s === 0 || s === 1) {
      crown.forEach(([x, y], i) => {
        const a = s === 0 ? eo(clamp01(k * 2.2 - i * .15)) : 1 - eo(k01(k, .3, .5));
        if (a <= 0) return;
        const X = x * W, Y = lerp(y * Hh - 80, y * Hh, s === 0 ? a : 1), rr = 9;
        const gg = g.createRadialGradient(X - 3, Y - 4, 1, X, Y, rr * 1.3);
        gg.addColorStop(0, 'rgba(255,244,210,.95)'); gg.addColorStop(.4, 'rgba(232,166,60,.92)'); gg.addColorStop(1, 'rgba(150,84,18,.85)');
        g.globalAlpha = a; g.fillStyle = gg; g.beginPath(); g.ellipse(X, Y, rr * .85, rr * 1.15, 0, 0, 7); g.fill(); g.globalAlpha = 1;
      });
    }
    if (s === 1) {
      [[.42, .2], [.58, .24], [.5, .38]].forEach(([x, y], i) => {
        const X = x * W, Y = y * Hh, a0 = k * Math.PI * 4 + i;
        g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 4; g.lineCap = 'round';
        g.beginPath(); g.arc(X, Y, 46, a0, a0 + Math.PI * 1.3); g.stroke();
        const ex = X + Math.cos(a0 + Math.PI * 1.3) * 46, ey = Y + Math.sin(a0 + Math.PI * 1.3) * 46, ta = a0 + Math.PI * 1.3 + Math.PI / 2;
        g.fillStyle = '#fff'; g.beginPath(); g.moveTo(ex + Math.cos(ta) * 14, ey + Math.sin(ta) * 14); g.lineTo(ex + Math.cos(ta + 2.4) * 12, ey + Math.sin(ta + 2.4) * 12); g.lineTo(ex + Math.cos(ta - 2.4) * 12, ey + Math.sin(ta - 2.4) * 12); g.fill();
      });
    }
    // étape 4 : minuteur de pose et petits éclats
    if (s === 3) {
      const rnd = mulberry(4);
      for (let i = 0; i < 26; i++) {
        const x = (.2 + rnd() * .6) * W, y = (.15 + rnd() * .8) * Hh, ph = (k * 2 + rnd()) % 1, a = Math.sin(ph * Math.PI);
        g.globalAlpha = a * .9; g.fillStyle = '#fff';
        g.beginPath(); g.moveTo(x, y - 10 * a); g.lineTo(x + 2.2, y); g.lineTo(x, y + 10 * a); g.lineTo(x - 2.2, y); g.fill();
        g.beginPath(); g.moveTo(x - 10 * a, y); g.lineTo(x, y + 2.2); g.lineTo(x + 10 * a, y); g.lineTo(x, y - 2.2); g.fill();
      }
      g.globalAlpha = 1;
      const left = Math.round(30 * (1 - k)), txt = `${String(left).padStart(2, '0')}:00`;
      g.fillStyle = 'rgba(251,243,239,.92)'; g.beginPath(); g.roundRect(W - 190, 26, 160, 56, 28); g.fill();
      g.fillStyle = '#2E1620'; g.font = '600 26px Geist, sans-serif'; g.textAlign = 'center'; g.fillText(txt, W - 110, 64);
    }
    lis.forEach((li, i) => { li.classList.toggle('on', i === s); li.classList.toggle('done', i < s); });
  }
  return {
    el: fig, on: false,
    frame(now) { if (!H.ready) return true; draw(now); return !RM; }
  };
}
