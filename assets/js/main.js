// Lalla Warda : point d'entrée. Contenus depuis config.<langue>.js (window.SITE), scènes 3D avec Three.js (window.THREE),
// une seule boucle d'animation qui ne calcule que les sections visibles.
import { $, $$, clamp01, lerp, k01, eo, esc, price, progress, loadImage, webglOK, reduced, isRTL } from './util.js';
import { createHero } from './hero.js';
import { initShop } from './shop.js';
import { initTextures } from './smear.js';
import { initFace } from './face.js';
import { initMicro, initHairPhoto } from './hair.js';
import { initMap } from './map.js';

const C = window.SITE, U = C.ui, THREE = window.THREE;
const GL = !!THREE && webglOK();
const RM = reduced();
const mobile = () => innerWidth <= 720;
const DPR = () => Math.min(devicePixelRatio || 1, mobile() ? 1.5 : 1.75);
document.documentElement.classList.toggle('no-gl', !GL);
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
$$('[data-cfg]').forEach(el => { const v = get(C, el.dataset.cfg); if (v != null && typeof v !== 'object') el.textContent = v; });
$('#demo-note').hidden = !C.demo;
const byId = Object.fromEntries(C.produits.map(p => [p.id, p]));
$$('[data-price]').forEach(el => { const p = byId[el.dataset.price]; if (p) el.textContent = price(p.prix, C.devise); });

/* ---------- Petits messages ---------- */
let toastT = 0;
export function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3200); }
function copyText(text, el, done) {
  const fallback = () => { const s = getSelection(), r = document.createRange(); r.selectNodeContents(el); s.removeAllRanges(); s.addRange(r); toast(U.selected); };
  try { navigator.clipboard.writeText(text).then(() => toast(done), fallback); } catch (e) { fallback(); }
}
$('#copy-phone').addEventListener('click', () => copyText(C.contact.telephone, $('[data-cfg="contact.telephone"]'), U.copied));

/* ---------- Navigation ---------- */
const nav = $('#nav'), burger = $('#nav-burger');
burger.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? U.menuClose : U.menuOpen);
});
$$('#nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
const darkSecs = ['#cheveux', '#contact'].map(s => $(s));

/* ---------- Boutique : panier, fiches, collection, routine ---------- */
const shop = initShop({ C, U, THREE: GL ? THREE : null, toast, copyText, DPR });

/* ---------- 1. Hero ---------- */
const H = { sec: $('#accueil'), pin: $('#hero-pin'), cv: $('#hero-cv'), copy: $('#hero-copy'), end: $('#hero-end'), hint: $('#scroll-hint'),
  labels: $('#hero-labels'), svg: $('#hero-lines'), p: 0, lock: null, lis: [], lines: [], ok: false };
$('#hero-total').innerHTML = C.hero.total.map(t => `<li>${esc(t)}</li>`).join('');
$('#hero-price').textContent = price(byId[C.hero.produit].prix, C.devise);
C.hero.ingredients.forEach(it => {
  const li = document.createElement('li');
  li.innerHTML = `<span class="pct">${esc(it.pct)}</span><b>${esc(it.nom)}</b><small>${esc(it.origine)}</small>`;
  H.labels.appendChild(li); H.lis.push(li);
  const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'); H.svg.appendChild(ln); H.lines.push(ln);
});
async function heroInit() {
  if (!GL) return;
  const load = async (src) => { const im = await loadImage(src); if (!im) return null; const t = new THREE.Texture(im); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; };
  await Promise.all([document.fonts.ready, ...['italic 40px "Instrument Serif"', '500 20px Geist', '30px Amiri', '600 20px "IBM Plex Sans Arabic"'].map(f => document.fonts.load(f, 'Lalla Warda لالة وردة').catch(() => {}))]);
  const [petal, ...tex] = await Promise.all([load('assets/img/petale.webp'), ...C.hero.ingredients.map(i => (i.img ? load(`assets/img/${i.img}.webp`) : null))]);
  const p = byId[C.hero.produit];
  H.hero = createHero(THREE, {
    canvas: H.cv, petal, mobile: mobile(), dpr: DPR(),
    ingredients: C.hero.ingredients.map((it, i) => ({ tex: tex[i], size: it.size })),
    bottle: { ...p, etiquette: { nom: p.nom, sous: p.sous, ar: C.marque.ar } }
  });
  heroSize();
  H.ok = true;
  kick();
}
function heroSize() {
  if (!H.hero) return;
  H.hero.setSize(H.pin.clientWidth, H.pin.clientHeight);
}
function heroFrame(t) {
  const target = H.lock != null ? H.lock : progress(H.sec);
  H.p += RM ? target - H.p : (target - H.p) * .12;
  if (Math.abs(target - H.p) < .0005) H.p = target;
  const p = H.p;
  const ck = k01(p, .02, .1);
  H.copy.style.opacity = (1 - ck).toFixed(3);
  H.copy.style.visibility = ck >= 1 ? 'hidden' : 'visible';
  H.copy.style.translate = `0 ${(-ck * 40).toFixed(1)}px`;
  H.hint.style.opacity = (1 - k01(p, 0, .04)).toFixed(3);
  const ek = eo(k01(p, .86, .08));
  H.end.style.opacity = ek.toFixed(3); H.end.style.visibility = ek > .01 ? 'visible' : 'hidden';
  H.end.style.translate = `0 ${((1 - ek) * 24).toFixed(1)}px`;
  if (!H.ok) return Math.abs(target - H.p) > .0005;
  H.hero.update(p, RM ? 0 : t / 1000);
  H.hero.render();
  // étiquettes : à côté de chaque ingrédient, du côté extérieur ; sur mobile, dessous
  const an = H.hero.anchors(), W = H.pin.clientWidth, narrow = W < 720;
  an.forEach((a, i) => {
    const li = H.lis[i], ln = H.lines[i];
    // l'étiquette n'apparaît qu'à l'arrivée de l'ingrédient : pas de texte qui traverse l'écran avec lui
    const lk = Math.min(1, Math.max(0, (a.k - .85) / .15));
    if (!lk) { li.style.opacity = 0; ln.style.opacity = 0; return; }
    const lw = li.offsetWidth, lh = li.offsetHeight;
    let x, y, x1, x2;
    if (narrow) { x = a.x - lw / 2; y = a.y + a.r * .75 + 6; li.classList.remove('end'); }
    else if (a.side < 0) { x = a.x - a.r - 26 - lw; y = a.y - lh / 2; x1 = a.x - a.r * .8; x2 = a.x - a.r - 18; li.classList.add('end'); }
    else { x = a.x + a.r + 26; y = a.y - lh / 2; x1 = a.x + a.r * .8; x2 = a.x + a.r + 18; li.classList.remove('end'); }
    x = Math.max(8, Math.min(W - lw - 8, x));
    li.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    li.style.opacity = lk.toFixed(3);
    if (!narrow) { ln.setAttribute('x1', x1.toFixed(1)); ln.setAttribute('y1', a.y.toFixed(1)); ln.setAttribute('x2', x2.toFixed(1)); ln.setAttribute('y2', a.y.toFixed(1)); }
    ln.style.opacity = narrow ? 0 : lk.toFixed(3);
  });
  return true;
}

/* ---------- 2 à 7. Sections animées ---------- */
const scenes = [];
scenes.push({ el: H.sec, frame: heroFrame, on: true });
const tex = initTextures({ C, U, THREE: GL ? THREE : null, byId, DPR, RM });
if (tex) scenes.push(tex);
const face = initFace({ C, U, byId, RM, openSheet: shop.openSheet });
if (face) scenes.push(face);
const micro = initMicro({ C, THREE: GL ? THREE : null, DPR, RM, mobile });
if (micro) scenes.push(micro);
const hairPhoto = initHairPhoto({ C, U, RM });
if (hairPhoto) scenes.push(hairPhoto);
const map = initMap({ C, U, RM });
if (map) scenes.push(map);

/* ---------- 8 à 11. Listes ---------- */
$('#chiffres').innerHTML = C.chiffres.map(c => `<div class="chiffre rv"><b data-n="${c.n}">0${c.unite ? `<small>${esc(c.unite)}</small>` : ''}</b><p>${esc(c.texte)}</p></div>`).join('');
$('#avis').innerHTML = C.avis.map(([q, n, w]) => `<blockquote class="rv"><q>${esc(q)}</q><cite>${esc(n)} · ${esc(w)}</cite></blockquote>`).join('');
$('#faq-list').innerHTML = C.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}<i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join('');
$('#hours').innerHTML = C.contact.horaires.map(([d, h]) => `${esc(d)} · ${esc(h)}`).join('<br>');
$('#credits').innerHTML = C.credits.map(([w, a, l]) => `<li><b>${esc(w)}</b>${U.colon}${esc(a)} (${esc(l)})</li>`).join('');
$('#delivery-note').textContent = U.deliveryNote(price(C.livraison.prix, C.devise), price(C.livraison.offerte, C.devise), C.livraison.delai);
const insta = C.demo ? 'https://www.instagram.com/' : `https://www.instagram.com/${encodeURIComponent(C.contact.instagram)}/`;
$('#insta-link').href = insta;
$('#insta-link').addEventListener('click', e => { if (C.demo) { e.preventDefault(); toast(U.demoInsta(C.contact.instagram)); } });
$('#contact-cart').addEventListener('click', () => shop.openCart());

// compteurs des chiffres : défilent une fois à l'apparition
function countUp(el) {
  const n = +el.dataset.n, small = el.querySelector('small'), t0 = performance.now(), fmt = new Intl.NumberFormat(document.documentElement.lang === 'ar' ? 'ar-MA' : document.documentElement.lang);
  const step = now => {
    const k = RM ? 1 : eo(clamp01((now - t0) / 1600));
    el.firstChild.nodeValue = fmt.format(Math.round(n * k));
    if (k < 1) requestAnimationFrame(step);
  };
  el.firstChild.nodeValue = '0'; if (!small) el.textContent = '0';
  requestAnimationFrame(step);
}

/* ---------- Apparitions ---------- */
$$('.sec-head, .tex-stage, .card, .hist-photos, .hist-copy, .quiz, .map, .orig-list li').forEach(el => el.classList.add('rv'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    const b = e.target.querySelector && e.target.querySelector('b[data-n]'); if (b) countUp(b);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));
  // sections animées : on ne calcule que celles qui sont à l'écran
  const vis = new IntersectionObserver(es => es.forEach(e => { const s = scenes.find(x => x.el === e.target); if (s) { s.on = e.isIntersecting; if (s.on) kick(); } }), { rootMargin: '10% 0px' });
  scenes.forEach(s => vis.observe(s.el));
} else { $$('.rv').forEach(el => el.classList.add('in')); scenes.forEach(s => { s.on = true; }); }

/* ---------- Boucle ---------- */
let raf = 0;
function tick(now) {
  raf = 0;
  let again = false;
  for (const s of scenes) if (s.on && s.el.offsetHeight && s.frame(now)) again = true;
  // navigation claire sur les sections sombres
  const dark = darkSecs.some(el => { const r = el.getBoundingClientRect(); return r.top < 40 && r.bottom > 40; });
  nav.classList.toggle('dark', dark);
  if (again || !RM) raf = requestAnimationFrame(tick);
}
function kick() { if (!raf) raf = requestAnimationFrame(tick); }
addEventListener('scroll', kick, { passive: true });
let rt = 0;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { heroSize(); scenes.forEach(s => s.resize && s.resize()); kick(); }, 150); });

/* ---------- Démarrage ---------- */
const intro = $('#intro');
const start = () => { document.documentElement.classList.add('ready'); intro.classList.add('out'); };
if (RM) start(); else setTimeout(start, 1500);
heroInit().catch(err => { console.warn('WebGL indisponible', err); document.documentElement.classList.add('no-gl'); });
kick();

