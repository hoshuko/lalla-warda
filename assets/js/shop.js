// Boutique sans serveur : collection filtrable, fiche produit (flacon 3D et vue éclatée), routine en trois questions,
// panier mémorisé dans le navigateur, commande envoyée par WhatsApp avec un message déjà rédigé. Aucun paiement en ligne.
import { $, $$, esc, price, clamp01, lerp, eo, k01, isRTL } from './util.js';
import { createProduct } from './product.js';
import { studioEnv, blobTexture, keyLight, studioSweep } from './studio.js';

export function initShop({ C, U, THREE, toast, copyText, DPR }) {
  const byId = Object.fromEntries(C.produits.map(p => [p.id, p]));
  const P = id => byId[id];
  const img = id => `assets/img/${P(id).photo}.webp`;
  const money = v => price(v, C.devise);
  const labelOf = p => ({ nom: p.nom, sous: p.sous || p.format, ar: C.marque.ar });

  /* ---------- Collection ---------- */
  const grid = $('#products');
  grid.innerHTML = C.produits.map(p => `
    <article class="card" data-type="${p.type}" data-id="${p.id}">
      <button class="card-visual" type="button" data-sheet="${p.id}" aria-label="${esc(U.see)} : ${esc(p.nom)}">
        <img src="${img(p.id)}" alt="${esc(p.nom)}, ${esc(p.format)}" width="800" height="800" loading="lazy" decoding="async">
        ${p.badge ? `<span class="card-badge">${esc(p.badge)}</span>` : ''}
      </button>
      <div class="card-body">
        <p class="card-cat">${esc(p.categorie)} · ${esc(p.format)}</p>
        <h3>${esc(p.nom)}</h3>
        <p>${esc(p.accroche)}</p>
        <div class="card-row">
          <span class="card-price">${money(p.prix)}${p.avant ? `<s aria-label="${esc(U.before)} ${money(p.avant)}">${money(p.avant)}</s>` : ''}</span>
          <button class="btn btn-rose btn-sm" type="button" data-add="${p.id}">${esc(U.add)}</button>
        </div>
      </div>
    </article>`).join('');
  const filters = $('#col-filters');
  U.filters.forEach(([id, label]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label; b.dataset.f = id; b.setAttribute('aria-pressed', id === 'tout');
    b.addEventListener('click', () => {
      $$('.chip', filters).forEach(c => c.setAttribute('aria-pressed', c === b));
      $$('.card', grid).forEach((card, i) => {
        const on = id === 'tout' || card.dataset.type === id;
        card.hidden = !on;
        if (on) { card.classList.remove('pop'); void card.offsetWidth; card.style.animationDelay = (i % 8) * 45 + 'ms'; card.classList.add('pop'); }
      });
    });
    filters.appendChild(b);
  });

  /* ---------- Panier ---------- */
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem('lw-cart') || '{}') || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(id => { if (!byId[id]) delete cart[id]; });
  const save = () => { try { localStorage.setItem('lw-cart', JSON.stringify(cart)); } catch (e) { /* stockage indisponible */ } };
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(cart).reduce((a, [id, n]) => a + P(id).prix * n, 0);
  const cartEl = $('#cart'), cartBtn = $('#cart-btn');
  let back = null;
  function badge(bump) {
    const n = count();
    $('#cart-count').textContent = n;
    $('#cart-count').classList.toggle('on', n > 0);
    cartBtn.setAttribute('aria-label', U.cartCount(n));
    if (bump) { cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump'); }
  }
  function add(id, n = 1, quiet) {
    if (!P(id)) return;
    cart[id] = (cart[id] || 0) + n;
    if (cart[id] <= 0) delete cart[id];
    save(); badge(n > 0); renderCart();
    if (!quiet && n > 0) toast(`${U.added} · ${P(id).nom}`);
  }
  function renderCart() {
    const items = Object.entries(cart);
    $('#cart-items').innerHTML = items.length ? items.map(([id, n]) => { const p = P(id); return `
      <div class="line"><img src="${img(id)}" alt="" width="64" height="64">
        <div><b>${esc(p.nom)}</b><small>${esc(p.format)}</small>
          <div class="qty"><button type="button" data-q="${id}" data-d="-1" aria-label="${esc(U.less)}">−</button><span aria-label="${esc(U.qty)}">${n}</span><button type="button" data-q="${id}" data-d="1" aria-label="${esc(U.more)}">+</button></div></div>
        <span class="line-price">${money(p.prix * n)}</span></div>`; }).join('') : `<p class="cart-empty">${esc(U.cartEmpty)}</p>`;
    const st = subtotal(), L = C.livraison, free = st >= L.offerte, fee = st === 0 || free ? 0 : L.prix;
    $('#cart-foot').innerHTML = items.length ? `
      <div class="free-bar" aria-hidden="true"><i style="width:${Math.min(100, st / L.offerte * 100).toFixed(1)}%"></i></div>
      <p class="free-txt">${free ? esc(U.freeFrom(money(L.offerte))) : esc(U.freeLeft(money(L.offerte - st)))}</p>
      <div class="sum"><span>${esc(U.subtotal)}</span><span>${money(st)}</span></div>
      <div class="sum"><span>${esc(U.delivery)}</span><span>${fee ? money(fee) : esc(U.free)}</span></div>
      <div class="sum total"><span>${esc(U.total)}</span><span>${money(st + fee)}</span></div>
      <div class="fields"><input id="f-name" autocomplete="given-name" placeholder="${esc(U.name)}" aria-label="${esc(U.name)}"><input id="f-city" autocomplete="address-level2" placeholder="${esc(U.city)}" aria-label="${esc(U.city)}"></div>
      <a class="btn wa-btn" id="wa" href="#" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>${esc(U.order)}</a>
      <button class="btn btn-line btn-sm" type="button" id="wa-copy">${esc(U.copy)}</button>` : '';
    const wa = $('#wa');
    if (wa) {
      const refresh = () => { wa.href = C.demo ? '#' : `https://wa.me/${encodeURIComponent(C.contact.whatsapp)}?text=${encodeURIComponent(message())}`; };
      refresh();
      ['#f-name', '#f-city'].forEach(s => $(s).addEventListener('input', refresh));
      wa.addEventListener('click', e => { if (C.demo) { e.preventDefault(); toast(U.demoWa); } });
      $('#wa-copy').addEventListener('click', () => copyText(message(), $('#cart-items'), U.copied));
    }
  }
  function message() {
    const st = subtotal(), L = C.livraison, fee = st >= L.offerte ? 0 : L.prix;
    const name = ($('#f-name') || {}).value || '', city = ($('#f-city') || {}).value || '';
    return [U.msgHello, ...Object.entries(cart).map(([id, n]) => `• ${n} × ${P(id).nom} (${P(id).format}) · ${money(P(id).prix * n)}`),
      `${U.msgDelivery}${U.colon}${fee ? money(fee) : U.free}`, `${U.msgTotal}${U.colon}${money(st + fee)}`,
      name.trim() ? `${U.msgName}${U.colon}${name.trim()}` : '', city.trim() ? `${U.msgCity}${U.colon}${city.trim()}` : '', U.msgPay].filter(Boolean).join('\n');
  }
  $('#cart-items').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (b) add(b.dataset.q, +b.dataset.d, true); });
  function openCart() { back = document.activeElement; renderCart(); cartEl.hidden = false; cartBtn.setAttribute('aria-expanded', 'true'); document.documentElement.style.overflow = 'hidden'; $('#cart-close').focus({ preventScroll: true }); }
  function closeCart() { cartEl.hidden = true; cartBtn.setAttribute('aria-expanded', 'false'); document.documentElement.style.overflow = ''; if (back && back.focus) back.focus({ preventScroll: true }); }
  cartBtn.addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  cartEl.addEventListener('click', e => { if (e.target === cartEl) closeCart(); });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (a) { add(a.dataset.add); return; }
    const s = e.target.closest('[data-sheet]'); if (s) openSheet(s.dataset.sheet);
  });

  /* ---------- Fiche produit ---------- */
  const sheet = $('#sheet'), S = { id: null, three: null, explode: false, ex: 0, rot: 0, vel: .004, drag: null, raf: 0 };
  function openSheet(id, explode = false) {
    const p = P(id); if (!p) return;
    back = document.activeElement;
    S.id = id; S.explode = explode; S.ex = explode ? 1 : 0;
    $('#sheet-img').src = img(id); $('#sheet-img').alt = `${p.nom}, ${p.format}`;
    const ing = p.ingredients || [];
    $('#sheet-body').innerHTML = `
      <p class="eyebrow">${esc(p.categorie)} · ${esc(p.format)}</p>
      <h2 id="sheet-title">${esc(p.nom)}</h2>
      <p class="sec-lede">${esc(p.texte)}</p>
      <div class="sheet-price">${money(p.prix)}${p.avant ? ` <small>${esc(U.before)} ${money(p.avant)}</small>` : ''}</div>
      <div class="ctas"><button class="btn btn-rose" type="button" data-add="${p.id}">${esc(U.add)}</button></div>
      ${ing.length ? `<div><p class="eyebrow">${esc(U.compo)}</p><ul class="bars">${ing.map(i => `<li style="--w:${i.pct}%"><b>${esc(i.nom)}</b><em>${U.pct(i.pct)}</em><span>${esc(i.origine)}</span><i></i></li>`).join('')}</ul></div>` : ''}
      <dl class="sheet-dl">
        <div><dt>${esc(U.usage)}</dt><dd>${esc(p.usage)}</dd></div>
        <div><dt>${esc(U.pour)}</dt><dd>${esc(p.pour)}</dd></div>
        <div><dt>${esc(U.texture)}</dt><dd>${esc(p.texture)}</dd></div>
        ${p.inci ? `<div><dt>${esc(U.inci)}</dt><dd class="inci">${esc(p.inci)}</dd></div>` : ''}
      </dl>`;
    $('#sheet-explode').hidden = !THREE || !ing.some(i => i.img);
    $('#sheet-explode').setAttribute('aria-pressed', S.explode);
    sheet.hidden = false; document.documentElement.style.overflow = 'hidden';
    $('#sheet-close').focus({ preventScroll: true });
    // flacon 3D quand WebGL est là ; sinon, la photo du flacon
    $('#sheet-img').hidden = !!THREE;
    if (THREE) { sheet3d(p); } else { $('#sheet-cv').hidden = true; $('#sheet-hint').hidden = true; }
  }
  function closeSheet() {
    sheet.hidden = true; document.documentElement.style.overflow = '';
    cancelAnimationFrame(S.raf); S.raf = 0;
    if (back && back.focus) back.focus({ preventScroll: true });
  }
  $('#sheet-close').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  $('#sheet-explode').addEventListener('click', () => { S.explode = !S.explode; $('#sheet-explode').setAttribute('aria-pressed', S.explode); loop3d(); });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!sheet.hidden) closeSheet(); else if (!cartEl.hidden) closeCart();
  });

  // flacon 3D de la fiche : on le fait tourner au doigt, la vue éclatée sépare les pièces et fait venir les ingrédients
  function sheet3d(p) {
    const cv = $('#sheet-cv'); cv.hidden = false; $('#sheet-hint').hidden = false;
    if (!S.three) {
      const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
      r.toneMapping = THREE.NeutralToneMapping; r.outputColorSpace = THREE.SRGBColorSpace; r.shadowMap.enabled = true;
      const scene = new THREE.Scene();
      scene.environment = studioEnv(THREE, r); scene.environmentIntensity = .8; scene.background = new THREE.Color('#f4dcd8');
      keyLight(THREE, scene, { shadow: 1024 });
      const floor = studioSweep(THREE, scene, { z: -1.4 });
      const cam = new THREE.PerspectiveCamera(28, 1, .05, 50);
      S.three = { r, scene, cam, floor, model: null, ing: [], blob: blobTexture(THREE), tex: {} };
      cv.addEventListener('pointerdown', e => { S.drag = { x: e.clientX, r: S.rot }; cv.setPointerCapture(e.pointerId); S.vel = 0; });
      cv.addEventListener('pointermove', e => { if (!S.drag) return; const dx = (e.clientX - S.drag.x) * (isRTL() ? -1 : 1); S.rot = S.drag.r + dx * .01; S.vel = dx * .0004; loop3d(); });
      const end = () => { S.drag = null; if (Math.abs(S.vel) < .002) S.vel = .004; };
      cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    }
    const T = S.three;
    if (T.model) { T.scene.remove(T.model); }
    T.ing.forEach(m => T.scene.remove(m)); T.ing = [];
    const spec = p.forme === 'coffret'
      ? { ...p, contenu_coffret: p.contenu_coffret.map(id => ({ ...P(id), etiquette: labelOf(P(id)) })) }
      : { ...p, etiquette: labelOf(p) };
    T.model = createProduct(THREE, spec);
    T.scene.add(T.model);
    const box = new THREE.Box3().setFromObject(T.model), size = box.getSize(new THREE.Vector3());
    T.h = size.y; T.w = Math.max(size.x, size.z);
    // ingrédients détourés pour la vue éclatée
    const list = (p.ingredients || []).filter(i => i.img);
    T.labels = list;
    $('#sheet-labels').innerHTML = list.map(i => `<li><b>${U.pct(i.pct)}</b>${esc(i.nom)}</li>`).join('');
    list.forEach((it, i) => {
      const holder = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, opacity: 0 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(.5, .5), mat);
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(.5, .2), new THREE.MeshBasicMaterial({ map: T.blob, transparent: true, depthWrite: false, opacity: 0 }));
      sh.position.set(.04, -.3, -.02);
      holder.add(sh, mesh); holder.userData = { i, n: list.length, mesh, sh };
      const t = T.tex[it.img] || (T.tex[it.img] = new THREE.TextureLoader().load(`assets/img/${it.img}.webp`, tx => { const a = tx.image.width / tx.image.height; mesh.scale.set(Math.sqrt(a), 1 / Math.sqrt(a), 1); loop3d(); }));
      t.colorSpace = THREE.SRGBColorSpace;
      if (t.image) { const a = t.image.width / t.image.height; mesh.scale.set(Math.sqrt(a), 1 / Math.sqrt(a), 1); }
      mat.map = t;
      T.scene.add(holder); T.ing.push(holder);
    });
    resize3d(); S.rot = -.4; S.vel = .004; loop3d();
  }
  function resize3d() {
    const T = S.three, cv = $('#sheet-cv'); if (!T) return;
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    T.r.setPixelRatio(DPR()); T.r.setSize(w, h, false); T.cam.aspect = w / h; T.cam.updateProjectionMatrix();
  }
  addEventListener('resize', () => { if (!sheet.hidden) { resize3d(); loop3d(); } });
  function loop3d() {
    if (S.raf || sheet.hidden) return;
    const step = () => {
      S.raf = 0;
      const T = S.three; if (!T || sheet.hidden) return;
      const target = S.explode ? 1 : 0;
      S.ex += (target - S.ex) * .09; if (Math.abs(target - S.ex) < .001) S.ex = target;
      if (!S.drag) S.rot += S.vel;
      const ex = eo(S.ex), H = T.h || 1.4, parts = T.model.userData.parts || {};
      T.model.rotation.y = S.rot;
      // pièces qui s'écartent : bouchon ou poire vers le haut, verre vers le bas, étiquette qui tourne
      const lift = (m, dy) => { if (m) { m.userData.y0 ??= m.position.y; m.position.y = m.userData.y0 + dy * ex; } };
      lift(parts.bulb, .55); lift(parts.collar, .36); lift(parts.pipette, .5); lift(parts.cap, .45); lift(parts.lid, .38); lift(parts.head, .45);
      lift(parts.glass, -.18); lift(parts.label, -.06);
      if (parts.label) parts.label.rotation.y = ex * .6;
      // cadrage : en vue éclatée, la caméra recule assez pour que la ronde des ingrédients tienne dans la largeur
      // (le panneau est en portrait sur ordinateur, plus carré sur mobile)
      const tv = Math.tan(T.cam.fov * Math.PI / 360), asp = T.cam.aspect || 1;
      const dist = Math.max(Math.max(H * 1.9, T.w * 2.6) * (1 + ex * .55), ex * (T.w * .5 + .7) / (tv * asp));
      T.cam.position.set(0, H * .62 + ex * .15, dist); T.cam.lookAt(0, H * .45 + ex * .1, 0);
      const W = T.r.domElement.clientWidth, Hh = T.r.domElement.clientHeight, v = new THREE.Vector3();
      const radX = Math.min(T.w * .5 + .75, dist * tv * asp - .3), ampY = .35 + Math.max(0, 1 / asp - 1) * .3;
      const lis = $$('#sheet-labels li'), boxes = [];
      T.ing.forEach((g, i) => {
        const u = g.userData, k = eo(clamp01(S.ex * 1.4 - i * .08));
        const a = (i / u.n) * Math.PI * 2 + .5 + S.rot * .15;
        const rad = lerp(.2, radX, k);
        g.position.set(Math.cos(a) * rad, H * .45 + Math.sin(a * 1.7) * ampY * k + (i % 2 ? .25 : -.1) * k, Math.sin(a) * rad * .45 + .3 * k);
        g.quaternion.copy(T.cam.quaternion);
        g.scale.setScalar(lerp(.3, 1, k));
        u.mesh.material.opacity = k; u.sh.material.opacity = k * .8;
        g.visible = k > .01;
        const li = lis[i];
        if (li) {
          // étiquette centrée sous l'ingrédient, gardée dans le panneau
          v.copy(g.position).project(T.cam);
          const half = .25 * g.scale.x / (T.cam.position.distanceTo(g.position) * tv) * Hh / 2, lw = li.offsetWidth, lh = li.offsetHeight;
          const x = Math.max(6, Math.min(W - lw - 6, (v.x * .5 + .5) * W - lw / 2)), y = Math.max(6, Math.min(Hh - lh - 6, (-v.y * .5 + .5) * Hh + half * .8));
          boxes.push({ li, x, y, w: lw, h: lh });
          li.style.opacity = k > .6 ? ((k - .6) / .4).toFixed(2) : 0;
        }
      });
      // étiquettes qui se chevauchent : la plus basse descend juste sous l'autre
      boxes.sort((a, b) => a.y - b.y);
      boxes.forEach((b, i) => {
        for (let j = 0; j < i; j++) {
          const a = boxes[j];
          if (b.x < a.x + a.w + 4 && a.x < b.x + b.w + 4 && b.y < a.y + a.h + 4) b.y = Math.min(Hh - b.h - 6, a.y + a.h + 4);
        }
        b.li.style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px)`;
      });
      T.r.render(T.scene, T.cam);
      if (!sheet.hidden && (Math.abs(S.vel) > 0 || S.ex !== target || S.drag)) S.raf = requestAnimationFrame(step);
    };
    S.raf = requestAnimationFrame(step);
  }

  /* ---------- Routine en trois questions ---------- */
  const Q = C.quiz, quiz = $('#quiz'), answers = {};
  function ask(i) {
    const q = Q.questions[i];
    quiz.innerHTML = `<div class="quiz-slide"><div class="quiz-top"><span>${esc(U.step)} ${i + 1} ${esc(U.of)} ${Q.questions.length}</span><span class="quiz-bar"><i style="width:${(i / Q.questions.length * 100).toFixed(0)}%"></i></span></div>
      <h3>${esc(q.titre)}</h3><div class="quiz-choices">${q.choix.map(([id, t]) => `<button type="button" data-a="${id}">${esc(t)}</button>`).join('')}</div></div>`;
    $$('[data-a]', quiz).forEach(b => b.addEventListener('click', () => { answers[q.id] = b.dataset.a; if (i + 1 < Q.questions.length) ask(i + 1); else result(); }));
  }
  function result() {
    const score = {};
    Object.values(answers).forEach(a => Object.entries(Q.points[a] || {}).forEach(([id, n]) => { score[id] = (score[id] || 0) + n; }));
    const best = ids => ids.slice().sort((a, b) => (score[b] || 0) - (score[a] || 0))[0];
    const rows = [
      [Q.matin, answers.peau === 'seche' ? 'elixir' : 'eau-rose'],
      [Q.soir, best(['elixir', 'baume'])],
      [Q.hebdo, best(['masque', 'savon'])],
      [Q.cheveux, best(['racines', 'oranger'])]
    ];
    const ids = [...new Set(rows.map(r => r[1]))];
    quiz.innerHTML = `<div class="quiz-slide routine-res"><div class="quiz-top"><span>${esc(U.result)}</span><span class="quiz-bar"><i style="width:100%"></i></span></div>
      <h3>${esc(U.result)}</h3>
      ${rows.map(([when, id]) => `<div class="routine-row"><img src="${img(id)}" alt="" width="64" height="64"><div><small>${esc(when)}</small><b>${esc(P(id).nom)}</b></div><span>${money(P(id).prix)}</span></div>`).join('')}
      <div class="routine-actions"><button class="btn btn-rose" type="button" id="routine-add">${esc(U.addRoutine)} · ${money(ids.reduce((a, id) => a + P(id).prix, 0))}</button><button class="btn btn-line btn-sm" type="button" id="routine-again">${esc(U.restart)}</button></div></div>`;
    $('#routine-add').addEventListener('click', () => { ids.forEach(id => add(id, 1, true)); toast(`${U.added} · ${ids.length}`); openCart(); });
    $('#routine-again').addEventListener('click', () => ask(0));
  }
  ask(0);

  badge(false); renderCart();
  return {
    add, openCart, openSheet,
    debugQuiz(rest) { if (rest && rest[0]) { rest[0].split('+').forEach((a, i) => { answers[Q.questions[i].id] = a; }); result(); } }
  };
}
