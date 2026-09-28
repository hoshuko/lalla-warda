// Flacons de la gamme, modélisés au tour (LatheGeometry) : verre rosé, bouchons dorés, étiquette dessinée sur canvas.
// forme : dropper (sérum), spray (brume), jar (pot), bottle (flacon à bouchon), coffret (trois flacons)
export const GOLD = '#c8a064';

export function createProduct(THREE, spec) {
  if (spec.forme === 'coffret') return coffret(THREE, spec);
  const o = spec, g = new THREE.Group(), parts = {};
  // verre fin : transparent, reflets et bords plus denses (Fresnel) ; c'est le contenu qui réfracte,
  // car deux objets transmissifs ne se voient pas l'un à travers l'autre dans Three.js
  const glass = new THREE.MeshPhysicalMaterial({
    color: o.verre || '#f7dde2', roughness: o.depoli ? .3 : .03, transparent: true, opacity: o.depoli ? .5 : .16, depthWrite: false,
    clearcoat: 1, clearcoatRoughness: o.depoli ? .25 : .01, envMapIntensity: 2.4, side: THREE.DoubleSide
  });
  glass.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
      float fr = pow(1. - abs(dot(normalize(vViewPosition), normal)), 2.6);
      diffuseColor.a = mix(diffuseColor.a, .82, fr);
      #include <opaque_fragment>`);
  };
  const content = o.opaque
    ? new THREE.MeshPhysicalMaterial({ color: o.contenu, roughness: o.mat == null ? .85 : o.mat, sheen: .4, sheenColor: new THREE.Color('#ffffff'), clearcoat: o.brillant ? .8 : 0, clearcoatRoughness: .3 })
    : new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .02, transmission: 1, thickness: .55, ior: 1.46, attenuationColor: new THREE.Color(o.contenu || '#e3a23f'), attenuationDistance: o.att || 1.1, envMapIntensity: 1.4 });
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: .26, envMapIntensity: 1.3 });
  const bulbMat = new THREE.MeshPhysicalMaterial({ color: o.poire || '#e2a3b1', roughness: .5, sheen: .6, sheenColor: new THREE.Color('#fff0f3'), clearcoat: .25, clearcoatRoughness: .4 });
  const capMat = new THREE.MeshPhysicalMaterial({ color: o.capuchon || '#f3e3dc', roughness: .35, clearcoat: .6, clearcoatRoughness: .25 });
  const lathe = (pts, mat, seg = 96) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat);

  if (o.forme === 'jar') {
    const R = o.r || .5, Hj = o.h || .42;
    parts.glass = lathe([[0, 0], [R - .05, 0], [R, .05], [R, Hj - .03], [R - .04, Hj], [R - .06, Hj + .02], [0, Hj + .02]], glass);
    parts.glass.renderOrder = 2;
    const f = o.remplissage == null ? .8 : o.remplissage;
    parts.content = lathe([[0, .02], [R - .07, .02], [R - .05, .06], [R - .05, Hj * f], [R * .5, Hj * f + .015], [0, Hj * f + .025]], content);
    parts.lid = lathe([[0, 0], [R + .01, 0], [R + .02, .02], [R + .02, .18], [R, .2], [0, .2]], o.or ? gold : capMat);
    parts.lid.position.y = Hj;
    g.add(parts.glass, parts.content, parts.lid);
    if (o.etiquette) { parts.label = labelBand(THREE, R + .004, Hj * .62, o.etiquette, 1.3 * Math.PI); parts.label.position.y = Hj * .12; g.add(parts.label); }
  } else {
    const R = o.r || .36, Hb = o.h || .95, spray = o.forme === 'spray';
    parts.glass = lathe(profile(R, Hb, spray ? .11 : .13, spray ? .08 : .1), glass);
    parts.glass.renderOrder = 2;
    const f = o.remplissage == null ? .82 : o.remplissage;
    parts.content = lathe([[0, 0], [R - .085, 0], [R - .035, .05], [R - .035, Hb * f - .01], [R - .045, Hb * f], [0, Hb * f]], content);
    parts.content.position.y = .03;
    g.add(parts.glass, parts.content);
    const top = Hb + .2;
    if (o.forme === 'dropper') {
      parts.collar = lathe([[0, 0], [.15, 0], [.16, .02], [.16, .19], [.145, .21], [0, .21]], gold);
      parts.collar.position.y = top - .05;
      const bulb = [[0, 0], [.105, 0]];
      for (let i = 0; i <= 10; i++) { const t = i / 10; bulb.push([.105 + Math.sin(t * Math.PI) * .022 - t * .018, .02 + t * .3]); }
      for (let i = 1; i <= 8; i++) { const a = i / 8 * Math.PI / 2; bulb.push([.087 * Math.cos(a), .32 + .087 * Math.sin(a)]); }
      parts.bulb = lathe(bulb, bulbMat);
      parts.bulb.position.y = top + .15;
      parts.pipette = new THREE.Mesh(new THREE.CylinderGeometry(.028, .022, Hb * .95, 20, 1, true),
        new THREE.MeshPhysicalMaterial({ color: '#fff', roughness: .05, transparent: true, opacity: .35, depthWrite: false, clearcoat: 1 }));
      parts.pipette.position.y = top - Hb * .47;
      g.add(parts.collar, parts.bulb, parts.pipette);
    } else if (spray) {
      parts.collar = lathe([[0, 0], [.13, 0], [.135, .015], [.135, .13], [0, .13]], gold);
      parts.collar.position.y = top - .06;
      parts.head = lathe([[0, 0], [.1, 0], [.105, .02], [.105, .16], [.09, .19], [0, .19]], capMat);
      parts.head.position.y = top + .07;
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .06, 12), gold);
      nozzle.rotation.z = Math.PI / 2; nozzle.position.set(.1, top + .19, 0);
      g.add(parts.collar, parts.head, nozzle);
    } else {
      parts.cap = lathe([[0, 0], [.17, 0], [.18, .02], [.18, .3], [.165, .32], [0, .32]], o.or ? gold : capMat);
      parts.cap.position.y = top - .06;
      g.add(parts.cap);
    }
    if (o.etiquette) {
      parts.label = labelBand(THREE, R + .004, Hb * .5, o.etiquette, 1.15 * Math.PI);
      parts.label.position.y = Hb * .2;
      g.add(parts.label);
    }
  }
  g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  g.userData.parts = parts;
  return g;
}

function coffret(THREE, spec) {
  const g = new THREE.Group();
  spec.contenu_coffret.forEach((s, i) => {
    const p = createProduct(THREE, s);
    p.position.set([-.62, .1, .78][i], 0, [.15, -.25, .2][i]);
    p.scale.setScalar(.82);
    p.rotation.y = [.35, 0, -.3][i];
    g.add(p);
  });
  return g;
}

function profile(R, H, neckR, shoulder) {
  // flacon « boston » : fond arrondi, épaule douce, col étroit
  const pts = [[0, 0], [R - .06, 0], [R - .015, .015], [R, .06], [R, H - shoulder - .05]];
  for (let i = 1; i <= 8; i++) { const a = i / 8 * Math.PI / 2; pts.push([neckR + (R - neckR) * Math.cos(a) ** 1.4, H - .05 + Math.sin(a) * shoulder]); }
  pts.push([neckR, H + shoulder], [neckR, H + .2], [neckR - .02, H + .2]);
  return pts;
}

// étiquette : bande cylindrique centrée face à la caméra, texture dessinée sur canvas
export function labelBand(THREE, r, h, spec, arc) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = Math.round(1024 * h / (r * arc));
  drawLabel(c.getContext('2d'), c.width, c.height, spec);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, true, -arc / 2, arc),
    new THREE.MeshPhysicalMaterial({ map: t, roughness: .7, sheen: .2 }));
  m.position.y = h / 2;
  return m;
}

export function drawLabel(x, W, H, s) {
  const u = Math.min(H, W * .42);             // unité typographique : suit la place disponible
  x.fillStyle = s.papier || '#fbf3ee'; x.fillRect(0, 0, W, H);
  x.strokeStyle = GOLD; x.lineWidth = 3; x.strokeRect(18, 18, W - 36, H - 36);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const cx = W / 2;
  // petite rose au trait
  x.strokeStyle = s.accent || '#b8436b'; x.lineWidth = 2.4;
  const ry = H * .15, k = u * .05;
  x.beginPath(); x.arc(cx, ry, k * .45, 0, Math.PI * 2); x.stroke();
  x.beginPath(); x.arc(cx - k * .2, ry - k * .05, k * .85, Math.PI * .9, Math.PI * 1.9); x.stroke();
  x.beginPath(); x.arc(cx + k * .15, ry + k * .1, k * .95, Math.PI * 1.9, Math.PI * .85); x.stroke();
  x.fillStyle = s.encre || '#3a1a26';
  x.font = `italic ${Math.round(u * .17)}px "Instrument Serif", Georgia, serif`;
  x.fillText('Lalla Warda', cx, H * .38);
  // nom du soin : capitales espacées en alphabet latin ; en arabe, police arabe et lettres liées (pas d'espacement)
  const arab = t => /[\u0600-\u06FF]/.test(t || '');
  if (arab(s.nom)) {
    x.font = `600 ${Math.round(u * .085)}px "IBM Plex Sans Arabic", "Geeza Pro", sans-serif`;
    x.fillText(s.nom, cx, H * .56);
  } else {
    x.font = `500 ${Math.round(u * .066)}px Geist, "Helvetica Neue", Arial, sans-serif`;
    if ('letterSpacing' in x) x.letterSpacing = `${Math.round(u * .014)}px`;
    x.fillText((s.nom || '').toUpperCase(), cx, H * .56);
    if ('letterSpacing' in x) x.letterSpacing = '0px';
  }
  x.font = `${Math.round(u * .085)}px Amiri, "Geeza Pro", serif`;
  x.fillText(s.ar || 'لالة وردة', cx, H * .72);
  x.font = arab(s.sous) ? `400 ${Math.round(u * .06)}px "IBM Plex Sans Arabic", "Geeza Pro", sans-serif` : `400 ${Math.round(u * .052)}px Geist, "Helvetica Neue", Arial, sans-serif`;
  x.fillStyle = '#8a6a72';
  x.fillText(s.sous || '', cx, H * .86);
}
