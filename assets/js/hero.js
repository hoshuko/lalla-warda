// Hero « L'éclosion » : le bouton s'ouvre, les pétales s'envolent, le flacon sort du cœur de la rose,
// puis les ingrédients de la formule viennent se placer autour de lui. Tout dépend de p (0 → 1) : défilement ou vidéo.
import { createRose } from './rose.js';
import { createProduct } from './product.js';
import { studioEnv, gradientTexture, blobTexture, keyLight } from './studio.js';
import { lerp, clamp01, k01, smooth, eo, eio } from './util.js';

// caméra : [p, azimut, élévation, distance, hauteur visée, décalage de l'image]
const CAM = [
  [0, -.22, .1, 3.3, .42, .2],
  [.1, -.1, .2, 3.5, .45, .2],
  [.32, .25, .74, 3.9, .38, .12],
  [.46, .32, .42, 4.7, .3, .04],
  [.62, .08, .18, 4.7, .22, 0],
  [.82, -.2, .12, 5.3, .1, 0],
  [1, -.3, .1, 5.2, .02, 0],
];
// ingrédients : place finale à l'écran (coordonnées normalisées), en paysage et en portrait, et profondeur
const SLOTS = {
  land: [[-.44, .5, .1], [-.4, -.14, .5], [.44, .48, 0], [.4, -.12, .45], [.17, .68, -.2], [-.17, .68, -.2]],
  port: [[-.5, .58, .1], [-.52, -.06, .4], [.5, .56, 0], [.52, -.04, .4], [0, .84, -.2], [0, -.84, -.2]],
};

// options pour la vidéo : shift(p) → [x, y] remplace le décalage de l'image (fractions de l'écran), slots remplace les places des ingrédients
export function createHero(THREE, { canvas, petal, ingredients, bottle: bottleSpec, mobile = false, dpr = 1, preserve = false, shift = null, slots = null, zoom = 1 }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, preserveDrawingBuffer: preserve, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.environment = studioEnv(THREE, renderer);
  scene.environmentIntensity = .75;
  scene.background = gradientTexture(THREE, [[0, '#fbeee9'], [.5, '#f4d6d4'], [1, '#e8b7bc']]);
  const camera = new THREE.PerspectiveCamera(30, 1, .05, 60);
  keyLight(THREE, scene, { shadow: mobile ? 1024 : 2048 });

  const rose = createRose(THREE, petal, { petals: mobile ? 28 : 34 });
  scene.add(rose.group);
  const bottle = createProduct(THREE, bottleSpec);
  bottle.scale.setScalar(.001);
  scene.add(bottle);

  // ingrédients : vraies photos détourées face à la caméra, avec une ombre douce ; la vitamine E est une goutte 3D
  const blob = blobTexture(THREE);
  const ING = ingredients.map((it, i) => {
    const holder = new THREE.Group();
    let mesh;
    if (it.tex) {
      const a = it.tex.image.width / it.tex.image.height;
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(it.size * Math.sqrt(a), it.size / Math.sqrt(a)),
        new THREE.MeshBasicMaterial({ map: it.tex, transparent: true, alphaTest: .02, depthWrite: false, toneMapped: false }));
      mesh.renderOrder = 5;
    } else {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(it.size * .5, 48, 32),
        new THREE.MeshPhysicalMaterial({ color: '#fff', transmission: 1, thickness: .3, ior: 1.46, roughness: .02, attenuationColor: new THREE.Color('#e7a33a'), attenuationDistance: .25, envMapIntensity: 1.6, transparent: true }));
      mesh.scale.set(1, 1.18, 1);
    }
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(it.size * 1.1, it.size * .45), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
    sh.position.set(it.size * .1, -it.size * .6, -.05); sh.renderOrder = 4;
    holder.add(sh, mesh);
    holder.userData = { mesh, sh, i, seed: Math.abs(Math.sin(i * 12.9898)) };
    holder.visible = false;
    scene.add(holder);
    return holder;
  });

  const st = { p: -1, t: 0, W: 1, H: 1, slots: [] };
  const tmp = new THREE.Vector3(), camFinal = new THREE.PerspectiveCamera(30, 1, .05, 60);

  function camAt(p) {
    let a = CAM[0], b = CAM[CAM.length - 1];
    for (let i = 0; i < CAM.length - 1; i++) if (p >= CAM[i][0] && p <= CAM[i + 1][0]) { a = CAM[i]; b = CAM[i + 1]; break; }
    const k = eio(clamp01((p - a[0]) / Math.max(1e-6, b[0] - a[0])));
    return a.map((v, i) => lerp(v, b[i], k));
  }
  function place(cam, p) {
    const [, az, el, dist, ty] = camAt(p);
    const aspect = st.W / st.H, narrow = aspect < .8;
    const d = dist * (typeof zoom === 'function' ? zoom(p) : zoom) * (narrow ? lerp(1.75, 1.3, clamp01((aspect - .45) / .35)) : aspect < 1.25 ? 1.15 : 1);
    cam.position.set(Math.sin(az) * Math.cos(el) * d, ty + Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
    cam.lookAt(0, ty, 0);
  }
  function setSize(w, h) {
    st.W = w; st.H = h;
    renderer.setSize(w, h, false);
    camera.aspect = camFinal.aspect = w / h;
    camera.updateProjectionMatrix(); camFinal.updateProjectionMatrix();
    // places finales des ingrédients : rayon depuis la caméra finale, intersecté avec le plan de profondeur voulu
    place(camFinal, 1); camFinal.updateMatrixWorld();
    const list = slots || (w / h < .8 ? SLOTS.port : SLOTS.land);
    st.slots = ING.map((h2, i) => {
      const [nx, ny, z] = list[i] || [0, 0, 0];
      tmp.set(nx, ny, .5).unproject(camFinal).sub(camFinal.position).normalize();
      const t = (z - camFinal.position.z) / tmp.z;
      return camFinal.position.clone().addScaledVector(tmp, t);
    });
    st.p = -1;
  }

  function update(p, t = 0) {
    st.t = t;
    if (p !== st.p) {
      st.p = p;
      rose.setBloom(smooth(k01(p, .05, .3)));
      rose.setScatter(eio(k01(p, .36, .32)));
      rose.update();
    }
    rose.group.rotation.y = t * .05 + p * 1.2;
    rose.group.position.y = lerp(0, .15, smooth(k01(p, .05, .3)));
    const rise = eo(k01(p, .42, .28));
    bottle.scale.setScalar(rise > 0 ? lerp(.25, 1, rise) : .001);
    bottle.position.set(0, lerp(-.1, -.5, rise) + Math.sin(t * .8) * .02 * rise, 0);
    bottle.rotation.y = lerp(-1.2, -.2, rise) + Math.sin(t * .35) * .06;
    place(camera, p);
    const [, , , , , off] = camAt(p);
    const narrow = st.W / st.H < .8;
    // sur mobile le texte est en bas : le sujet remonte ; en arabe il passe à gauche du texte
    const rtl = document.documentElement.dir === 'rtl';
    const [sx, sy] = shift ? shift(p) : [narrow ? 0 : (rtl ? off : -off), narrow ? off * 1.6 : 0];
    camera.setViewOffset(st.W, st.H, sx * st.W, sy * st.H, st.W, st.H);
    ING.forEach(h => {
      const u = h.userData, target = st.slots[u.i];
      const k = eo(k01(p, .6 + u.i * .045, .2));
      h.visible = k > .001 && !!target;
      if (!h.visible) return;
      const from = [Math.cos(u.i * 2.4) * 3.2, 2.4 + u.seed, Math.sin(u.i * 2.4) * 3.2];
      h.position.set(lerp(from[0], target.x, k), lerp(from[1], target.y, k) + Math.sin(t * .9 + u.i) * .035 * k, lerp(from[2], target.z, k));
      h.quaternion.copy(camera.quaternion);
      h.rotateZ((1 - k) * (u.seed - .5) * 2.5 + Math.sin(t * .6 + u.i * 2) * .04);
      h.scale.setScalar(lerp(.2, 1, k));
      u.mesh.material.opacity = k; u.sh.material.opacity = k * .9;
    });
  }
  function render() { renderer.render(scene, camera); }
  // ancrages des étiquettes (pixels) : centre et demi-largeur à l'écran de chaque ingrédient
  function anchors() {
    return ING.map(h => {
      if (!h.visible) return { k: 0 };
      tmp.copy(h.position).project(camera);
      const x = (tmp.x * .5 + .5) * st.W, y = (-tmp.y * .5 + .5) * st.H;
      const dist = camera.position.distanceTo(h.position);
      const half = h.userData.mesh.geometry.parameters?.width ? h.userData.mesh.geometry.parameters.width / 2 : .12;
      const r = half * h.scale.x / (2 * dist * Math.tan(camera.fov * Math.PI / 360)) * st.H;
      return { x, y, r, k: h.userData.mesh.material.opacity, side: tmp.x < 0 ? -1 : 1 };
    });
  }
  return { renderer, scene, camera, update, render, setSize, anchors, rose, bottle };
}
