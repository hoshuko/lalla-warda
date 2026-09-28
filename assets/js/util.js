// Petits outils partagés : sélecteurs, interpolations, courbes d'accélération, hasard reproductible.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const clamp01 = v => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const k01 = (v, a, d) => clamp01((v - a) / d);
export const smooth = t => t * t * (3 - 2 * t);
export const eo = t => 1 - Math.pow(1 - t, 3);
export const eio = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isRTL = () => document.documentElement.dir === 'rtl';

// générateur pseudo-aléatoire à graine : mêmes pétales, mêmes particules à chaque rendu (site et vidéo)
export function mulberry(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// progression d'une section épinglée : 0 quand son haut touche le haut de l'écran, 1 quand son bas touche le bas
export function progress(sec) {
  const r = sec.getBoundingClientRect(), len = sec.offsetHeight - innerHeight;
  return len > 0 ? clamp01(-r.top / len) : 0;
}

export function loadImage(src) {
  return new Promise(res => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
}

// WebGL 2 disponible et pas désactivé : sinon, images fixes
export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGL2RenderingContext && c.getContext('webgl2')); } catch (e) { return false; }
}

// prix au format de la langue : « 290 DH », « 290 MAD », « 290 درهم »
export function price(v, cur) { return cur.before ? `${cur.symbol} ${v}` : `${v}${cur.nbsp === false ? '' : ' '}${cur.symbol}`; }
