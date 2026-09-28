// Studio photo virtuel : fond neutre chaud et softbox rectangulaires, précalculés en carte d'environnement (PMREM).
// Donne aux verres et aux métaux les longs reflets verticaux des photos de produits.
export function studioEnv(THREE, renderer, o = {}) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(o.wall || '#4a3438'), side: THREE.BackSide })));
  const box = (w, h, x, y, z, c, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, y * .3, 0); env.add(m);
  };
  box(3.2, 12, -7, 1, 5, '#fff4ee', 9);      // grande softbox à gauche
  box(2.2, 10, 7.5, 0, 3.5, '#ffe3e8', 6);   // réflecteur rosé à droite
  box(10, 3, 0, 9, 0, '#ffffff', 4);         // plafond
  box(3, 8, 3, 1, -8, '#ffd2dc', 3.5);       // contre-jour
  box(20, 6, 0, -7, 0, '#e8c3c3', 1.2);      // sol clair
  const pm = new THREE.PMREMGenerator(renderer);
  const t = pm.fromScene(env, .02).texture;
  pm.dispose();
  return t;
}

// dégradé vertical dessiné sur canvas (fond des scènes : le liquide des flacons le réfracte)
export function gradientTexture(THREE, stops) {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256);
  stops.forEach(([k, col]) => g.addColorStop(k, col));
  x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ombre douce ronde (sous les ingrédients)
export function blobTexture(THREE, rgb = '90,30,45', a = .55) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function keyLight(THREE, scene, o = {}) {
  const key = new THREE.DirectionalLight('#fff1e6', o.key || 3.1);
  key.position.set(2.4, 4.6, 3); key.castShadow = true;
  key.shadow.mapSize.set(o.shadow || 2048, o.shadow || 2048);
  Object.assign(key.shadow.camera, { left: -2.6, right: 2.6, top: 2.6, bottom: -2.6, near: .5, far: 14 });
  key.shadow.bias = -.0004; key.shadow.normalBias = .015; key.shadow.radius = 4;
  const rim = new THREE.DirectionalLight('#ffc9d6', o.rim || 1.7); rim.position.set(-3, 2.2, -4);
  const hemi = new THREE.HemisphereLight('#fff6f2', '#c98893', o.hemi || .35);
  scene.add(key, rim, hemi);
  return { key, rim, hemi };
}

// fond de studio incurvé (sol qui remonte en mur, sans raccord) : reçoit les ombres, et les liquides le réfractent
export function studioSweep(THREE, scene, o = {}) {
  const g = new THREE.PlaneGeometry(40, 30, 1, 60), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const v = p.getY(i) + 15;                 // 0 (devant) → 30 (fond)
    const R = 4, flat = 14;
    let y = 0, z = 15 - v;
    if (v > flat) { const a = Math.min((v - flat) / R, Math.PI / 2); y = R - R * Math.cos(a); z = 15 - flat - R * Math.sin(a); if (v - flat > R * Math.PI / 2) { y += v - flat - R * Math.PI / 2; z = 15 - flat - R; } }
    p.setXYZ(i, p.getX(i), y, z);
  }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: o.color || '#f4dcd8', roughness: .95, metalness: 0 }));
  m.receiveShadow = true;
  m.position.z = o.z || 0;
  scene.add(m);
  return m;
}
