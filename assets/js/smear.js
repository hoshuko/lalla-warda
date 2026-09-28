// « Du bout des doigts » : chaque texture tracée sur une vraie peau. Une carte de hauteur est dessinée au fil du geste
// (canvas 2D), puis un shader WebGL en tire le relief, les reflets, la transparence et la réfraction de l'huile.
// createSmear() ne dépend pas de la page : la vidéo promo s'en sert aussi.
import { $, $$, esc, clamp01, eio, mulberry, loadImage, price } from './util.js';

export const TYPES = {
  // col : couleur du soin ; opac : opacité du corps ; bump : relief ; shin/spec : taille et force du reflet ; refr : réfraction
  huile: { col: [.93, .6, .16], tint: [1.07, .93, .74], opac: .16, bump: 7, shin: 70, spec: 2.2, refr: .012, w: 72, h: .5 },
  baume: { col: [.97, .79, .45], tint: [1, 1, 1], opac: .8, bump: 7, shin: 36, spec: .5, refr: 0, w: 104, h: .62 },
  argile: { col: [.55, .43, .35], tint: [1, 1, 1], opac: .96, bump: 9, shin: 6, spec: .06, refr: 0, w: 124, h: .72 },
  brume: { col: [1, 1, 1], tint: [1.02, 1, 1.02], opac: 0, bump: 22, shin: 120, spec: 2.6, refr: .035, w: 0, h: 1 },
};
const VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
const FRAG = `
precision highp float;
uniform sampler2D uSkin, uH, uC; uniform vec3 uCol, uTint; uniform float uOpac, uBump, uShin, uSpec, uRefr; uniform vec2 uPx, uCover;
varying vec2 vUv;
void main() {
  vec2 suv = (vUv - .5) * uCover + .5;
  float c = texture2D(uC, vUv).r;
  float hx = texture2D(uH, vUv + vec2(uPx.x, 0.)).r - texture2D(uH, vUv - vec2(uPx.x, 0.)).r;
  float hy = texture2D(uH, vUv + vec2(0., uPx.y)).r - texture2D(uH, vUv - vec2(0., uPx.y)).r;
  vec3 n = normalize(vec3(-hx * uBump, -hy * uBump, 1.));
  vec3 skin = texture2D(uSkin, suv + n.xy * uRefr * c).rgb;
  vec3 L = normalize(vec3(-.45, .55, .7)), Hv = normalize(L + vec3(0., 0., 1.));
  float diff = clamp(dot(n, L), 0., 1.);
  float spec = pow(max(dot(n, Hv), 0.), uShin) * uSpec;
  float fres = pow(1. - n.z, 2.5);
  vec3 body = mix(skin * uTint, uCol * (.62 + .45 * diff), uOpac);
  // ombre douce du soin sur la peau, un peu décalée vers le bas à droite
  float sh = texture2D(uC, vUv - vec2(.006, -.008)).r * (1. - c) * uOpac * .35;
  vec3 col = mix(skin * (1. - sh), body, c);
  col += (spec + fres * .12) * c * vec3(1., .97, .92);
  gl_FragColor = vec4(col, 1.);
}`;

// moteur : set(type, k) trace le geste jusqu'à k (0 → 1), render() dessine ; sans état caché entre deux types
export function createSmear(THREE, canvas, skinImage, { preserve = false } = {}) {
  const HW = 512, HH = 410;
  const hc = document.createElement('canvas'), cc = document.createElement('canvas');
  hc.width = cc.width = HW; hc.height = cc.height = HH;
  const hx = hc.getContext('2d'), cx = cc.getContext('2d');
  const S = { type: null, last: 0 };
  const clear = () => { hx.globalCompositeOperation = cx.globalCompositeOperation = 'source-over'; hx.fillStyle = cx.fillStyle = '#000'; hx.fillRect(0, 0, HW, HH); cx.fillRect(0, 0, HW, HH); S.last = 0; };
  // geste : une courbe douce de gauche à droite
  const path = t => {
    const p0 = [.16, .66], p1 = [.38, .2], p2 = [.62, .9], p3 = [.86, .38], u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    return [x * HW, y * HH];
  };
  const stamp = (ctx, x, y, r, a, soft = .35) => {
    const g = ctx.createRadialGradient(x, y, r * soft, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  };
  function paint(type, k) {
    const P = TYPES[type];
    hx.globalCompositeOperation = cx.globalCompositeOperation = 'lighter';
    if (type === 'brume') {
      const rnd = mulberry(8), n = 200;
      for (let i = 0; i < Math.floor(k * n); i++) {
        const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()), x = HW * (.5 + Math.cos(a) * d * .44), y = HH * (.5 + Math.sin(a) * d * .38), r = 3 + rnd() * rnd() * 13;
        if (i >= Math.floor(S.last * n)) { stamp(hx, x, y, r, .9, 0); stamp(cx, x, y, r, 1, .8); }
      }
      S.last = k; return;
    }
    const from = S.last, steps = Math.max(1, Math.ceil((k - from) * 160)), rnd = mulberry(Math.floor(from * 1000) + 3);
    for (let s = 1; s <= steps; s++) {
      const t = from + (k - from) * s / steps, [x, y] = path(t), taper = Math.sin(Math.PI * Math.min(1, t * 1.25 + .1)) * .7 + .3;
      const w = P.w * taper;
      stamp(cx, x, y, w * .62, 1, .7);
      stamp(hx, x, y, w * .55, P.h * .12, .1);
      if (type !== 'huile') {
        // stries du doigt : fines crêtes parallèles au geste
        const [nx0, ny0] = path(Math.min(1, t + .004)), dx = nx0 - x, dy = ny0 - y, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L;
        for (let j = -4; j <= 4; j++) { const o = j / 4 * w * .48 + (rnd() - .5) * 3; stamp(hx, x + px * o, y + py * o, 3 + rnd() * 3, P.h * (.05 + rnd() * .06), 0); }
        if (type === 'argile') for (let j = 0; j < 3; j++) stamp(hx, x + (rnd() - .5) * w, y + (rnd() - .5) * w, 2 + rnd() * 5, .08, 0);
      }
    }
    if (type === 'huile' && from === 0) { const [x, y] = path(0); stamp(hx, x, y, 38, .9, 0); stamp(cx, x, y, 40, 1, .8); }
    if (type === 'huile') { const [x, y] = path(k); stamp(hx, x, y, 16, .1, 0); }
    S.last = k;
  }
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: preserve });
  const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const tH = new THREE.CanvasTexture(hc), tC = new THREE.CanvasTexture(cc);
  [tH, tC].forEach(t => { t.colorSpace = THREE.NoColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; });
  const skin = new THREE.Texture(skinImage); skin.colorSpace = THREE.NoColorSpace; skin.needsUpdate = true;
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: { uSkin: { value: skin }, uH: { value: tH }, uC: { value: tC }, uCol: { value: new THREE.Vector3() }, uTint: { value: new THREE.Vector3() },
      uOpac: { value: 0 }, uBump: { value: 1 }, uShin: { value: 10 }, uSpec: { value: 0 }, uRefr: { value: 0 }, uPx: { value: new THREE.Vector2(1 / HW, 1 / HH) }, uCover: { value: new THREE.Vector2(1, 1) } }
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  const skinAspect = skinImage.width / skinImage.height;
  clear();
  return {
    set(type, k) {
      const kk = type === 'brume' ? k : eio(k);
      if (type !== S.type || kk < S.last) { clear(); S.type = type; }
      if (kk > S.last) { paint(type, kk); tH.needsUpdate = tC.needsUpdate = true; }
      const P = TYPES[type], u = mat.uniforms;
      u.uCol.value.set(...P.col); u.uTint.value.set(...P.tint); u.uOpac.value = P.opac; u.uBump.value = P.bump; u.uShin.value = P.shin; u.uSpec.value = P.spec; u.uRefr.value = P.refr;
    },
    render() { r.render(scene, cam); },
    resize(w, h, dpr = 1) {
      if (!w || !h) return;
      r.setPixelRatio(dpr); r.setSize(w, h, false);
      const a = w / h;
      mat.uniforms.uCover.value.set(a < skinAspect ? a / skinAspect : 1, a < skinAspect ? 1 : skinAspect / a);
    },
    renderer: r
  };
}

export function initTextures({ C, U, THREE, byId, DPR, RM }) {
  const sec = $('#textures'), cv = $('#tex-cv'), tabs = $('#tex-tabs'); if (!sec || !cv) return null;
  const T = { i: 0, t0: 0, lock: null, smear: null, played: false };
  C.textures.forEach((x, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip tex-tab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', i === 0);
    const col = TYPES[x.id].col.map(v => Math.round(v * 255)).join(',');
    b.style.setProperty('--c', x.id === 'brume' ? '#f3c9d3' : `rgb(${col})`);
    b.innerHTML = `<i aria-hidden="true"></i>${esc(x.nom)}`;
    b.addEventListener('click', () => select(i));
    tabs.appendChild(b);
  });
  const cap = $('#tex-cap'), note = $('#tex-note');
  const api = { el: sec, on: false };
  function select(i) {
    T.i = i; T.t0 = performance.now();
    $$('.tex-tab', tabs).forEach((b, j) => b.setAttribute('aria-selected', j === i));
    const x = C.textures[i], p = byId[x.produit];
    note.textContent = x.note;
    cap.innerHTML = `<img src="assets/img/${p.photo}.webp" alt="" width="34" height="34"><span>${esc(p.nom)} · ${price(p.prix, C.devise)}</span>`;
    cv.setAttribute('aria-label', `${x.nom} : ${x.note}`);
    api.on = true; window.dispatchEvent(new Event('scroll'));
  }
  $('#tex-replay').addEventListener('click', () => select(T.i));
  select(0);
  if (!THREE) return Object.assign(api, { frame() { return false; }, debug() {} });
  loadImage('assets/img/peau.webp').then(im => {
    if (!im) return;
    T.smear = createSmear(THREE, cv, im);
    api.resize();
  });
  api.resize = () => { if (T.smear) T.smear.resize(cv.clientWidth, cv.clientHeight, DPR()); };
  api.frame = now => {
    if (!T.smear) return true;
    if (!T.played) { T.played = true; T.t0 = now; }
    const type = C.textures[T.i].id, dur = type === 'brume' ? 1300 : 1700;
    const k = T.lock != null ? T.lock : RM ? 1 : clamp01((now - T.t0) / dur);
    T.smear.set(type, k); T.smear.render();
    return k < 1;
  };
  api.debug = (v, rest) => { if (rest && rest[0]) { const i = C.textures.findIndex(x => x.id === rest[0]); if (i >= 0) select(i); } T.lock = v || 1; T.played = true; };
  return api;
}
