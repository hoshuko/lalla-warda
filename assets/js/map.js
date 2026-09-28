// La route des fleurs : dix origines d'ingrédients reliées à l'atelier de Kénitra. Terres de Natural Earth,
// aucune frontière tracée ; les routes se dessinent au défilement, une à une, puis la carte réagit au survol de la liste.
import { $, $$, esc, clamp01, k01, eo, isRTL } from './util.js';
import { MAP, LAND } from './mapdata.js';

const NS = 'http://www.w3.org/2000/svg';
// placement des étiquettes (décalage en pixels du repère, ancrage du texte)
const LAB = {
  kenitra: [-24, 6, 'end'], maamora: [-14, 34, 'end'], gharb: [8, -30, 'start'], saiss: [14, 30, 'start'], ksabi: [18, 4, 'start'],
  oriental: [0, -24, 'middle'], mgouna: [14, 4, 'start'], taliouine: [14, 4, 'start'], aitbaha: [-16, -8, 'end'], ifni: [-16, 4, 'end']
};

// construction de la carte (sans le reste de la page) : set(k) dessine les routes jusqu'à k, focus(id) met une origine en avant
export function createMap(svg, C, U, rtl = isRTL(), imgBase = 'assets/img/') {
  const P = ({ lon, lat }) => [MAP.ox + (lon - MAP.lon0) * MAP.k * MAP.s, MAP.oy + (MAP.lat1 - lat) * MAP.s];
  const O = C.origines, home = O.find(o => o.atelier), H = P(home);
  const km = (a, b) => {
    const r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2;
    return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) / 5) * 5;
  };
  const el = (tag, attrs, parent = svg) => { const n = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); parent.appendChild(n); return n; };
  // fondu sur les bords est et sud : pas de coupure nette, pas de frontière
  const defs = el('defs', {});
  const gx = el('linearGradient', { id: 'fx', x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
  el('stop', { offset: '.72', 'stop-color': '#fff' }, gx); el('stop', { offset: '.98', 'stop-color': '#000' }, gx);
  const gy = el('linearGradient', { id: 'fy', x1: '0', x2: '0', y1: '0', y2: '1' }, defs);
  el('stop', { offset: '.78', 'stop-color': '#fff' }, gy); el('stop', { offset: '.97', 'stop-color': '#000' }, gy);
  const m1 = el('mask', { id: 'fade-x' }, defs); el('rect', { width: MAP.w, height: MAP.h, fill: 'url(#fx)' }, m1);
  const m2 = el('mask', { id: 'fade-y' }, defs); el('rect', { width: MAP.w, height: MAP.h, fill: 'url(#fy)' }, m2);
  const clipC = el('clipPath', { id: 'pin-clip' }, defs); el('circle', { r: 13 }, clipC);
  const g1 = el('g', { mask: 'url(#fade-y)' }), g2 = el('g', { mask: 'url(#fade-x)' }, g1);
  el('path', { d: LAND, class: 'land' }, g2);
  const sea = el('text', { x: 70, y: 330, class: 'label-sea', transform: 'rotate(-58 70 330)' }); sea.textContent = U.ocean;
  const med = el('text', { x: 420, y: 60, class: 'label-sea' }); med.textContent = U.med;
  // routes : courbes vers l'atelier
  const routes = [], pins = [];
  O.forEach((o, i) => {
    if (o.atelier) return;
    const [x, y] = P(o), mx = (x + H[0]) / 2, my = (y + H[1]) / 2, dx = H[0] - x, dy = H[1] - y;
    const bend = .18 * (i % 2 ? 1 : -1);
    const d = `M${x.toFixed(1)} ${y.toFixed(1)}Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${H[0].toFixed(1)} ${H[1].toFixed(1)}`;
    el('path', { d, class: 'route-dash' });
    const r = el('path', { d, class: 'route' });
    routes.push({ o, r, len: 1 });
  });
  O.forEach(o => {
    const [x, y] = P(o), g = el('g', { class: o.atelier ? 'atelier' : 'pin', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` });
    const [lx, ly, anchor] = LAB[o.id] || [14, 4, 'start'];
    const a = rtl ? { start: 'end', end: 'start', middle: 'middle' }[anchor] : anchor;
    if (o.atelier) {
      el('circle', { r: 16, fill: 'none', stroke: 'rgba(178,63,102,.35)', 'stroke-width': 1.5, class: 'pulse' }, g);
      el('circle', { r: 7 }, g);
      const t = el('text', { x: lx, y: ly, 'text-anchor': a }, g); t.textContent = `${o.lieu}`;
    } else {
      el('circle', { r: 15 }, g);
      if (o.img) el('image', { href: `${imgBase}${o.img}.webp`, x: -13, y: -13, width: 26, height: 26, preserveAspectRatio: 'xMidYMid meet', 'clip-path': 'url(#pin-clip)' }, g);
      else el('circle', { r: 5, class: 'core' }, g);
      const t = el('text', { x: lx, y: ly, 'text-anchor': a }, g); t.textContent = o.nom;
      const k = el('text', { x: lx, y: ly + 14, 'text-anchor': a, class: 'km' }, g); k.textContent = `${o.lieu} · ${km(o, home)} ${C.kmShort || 'km'}`;
    }
    pins.push({ o, g });
  });
  routes.forEach(r => { r.len = r.r.getTotalLength(); r.r.style.strokeDasharray = r.len; r.r.style.strokeDashoffset = r.len; });
  const focus = id => {
    pins.forEach(p => p.g.classList.toggle('on', p.o.id === id));
    routes.forEach(r => { r.r.style.stroke = !id || r.o.id === id ? '' : 'rgba(178,63,102,.25)'; r.r.style.strokeWidth = r.o.id === id ? '2.6' : ''; });
  };
  const set = k => {
    routes.forEach((r, i) => {
      const e = eo(k01(k, .1 + i * .07, .3));
      r.r.style.strokeDashoffset = (r.len * (1 - e)).toFixed(1);
    });
    pins.forEach((p, i) => {
      const e = p.o.atelier ? eo(k01(k, 0, .2)) : eo(k01(k, .05 + (i - 1) * .07, .2));
      p.g.style.opacity = e.toFixed(3);
    });
  };
  return { set, focus, km: o => km(o, home), home };
}

export function initMap({ C, U, RM }) {
  const svg = $('#map'); if (!svg) return null;
  const M = createMap(svg, C, U), O = C.origines;
  // liste
  const list = $('#orig-list');
  list.innerHTML = O.filter(o => !o.atelier).map(o => `<li data-o="${o.id}" tabindex="0"><i aria-hidden="true"></i><b>${esc(o.nom)}</b><span>${esc(o.lieu)} · ${M.km(o)} ${esc(C.km)}</span></li>`).join('');
  const focus = id => { M.focus(id); $$('li', list).forEach(li => li.classList.toggle('on', li.dataset.o === id)); };
  $$('li', list).forEach(li => {
    li.title = (O.find(o => o.id === li.dataset.o) || {}).texte || '';
    ['mouseenter', 'focus'].forEach(ev => li.addEventListener(ev, () => focus(li.dataset.o)));
    ['mouseleave', 'blur'].forEach(ev => li.addEventListener(ev, () => focus(null)));
  });
  const sec = $('#origines'), fig = $('.map');
  const st = { k: -1, lock: null };
  return {
    el: sec, on: false,
    frame(t) {
      // progression : de l'entrée de la carte dans l'écran jusqu'à son milieu
      let k = st.lock;
      if (k == null) { const r = fig.getBoundingClientRect(); k = clamp01((innerHeight * .95 - r.top) / (innerHeight * .75)); }
      if (RM) k = k > 0 ? 1 : 0;
      if (Math.abs(k - st.k) < .001) return false;
      st.k = k;
      M.set(k);
      return false;
    },
    debug(v) { st.lock = v; }
  };
}
