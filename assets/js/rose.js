// Rose de Damas procédurale. Chaque pétale est une surface courbée portant une vraie photo de pétale
// (texture détourée, sa transparence dessine le contour). Les pétales suivent la phyllotaxie (angle d'or).
//   bloom 0 → 1 : le bouton s'ouvre, l'extérieur d'abord ; scatter 0 → 1 : les pétales se détachent en spirale.
import { mulberry, lerp, clamp01, smooth } from './util.js';

export function createRose(THREE, tex, opts = {}) {
  const N = opts.petals || 34;          // pétales, du cœur (0) vers l'extérieur (N - 1)
  const SU = 10, SV = 14;               // subdivisions d'un pétale : largeur, longueur
  const rnd = mulberry(opts.seed || 7);
  const petals = [];
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1);
    petals.push({
      s, phi: i * 2.39996 + (rnd() - .5) * .22,
      L: lerp(.46, 1.0, Math.pow(s, .62)) * (1 + (rnd() - .5) * .08),
      Wk: lerp(.9, 1.08, s) * (1 + (rnd() - .5) * .08),
      tw: (rnd() - .5) * .16, jit: rnd(), jit2: rnd(), jit3: rnd(),
      // teinte multipliée à la photo : cœur plus profond, extérieur proche de la photo
      tint: new THREE.Color(lerp(.9, 1.06, s), lerp(.5, .97, Math.pow(s, .8)), lerp(.62, 1.0, Math.pow(s, .8))).multiplyScalar(1 + (rnd() - .5) * .08)
    });
  }
  const vPer = (SU + 1) * (SV + 1);
  const pos = new Float32Array(N * vPer * 3), uv = new Float32Array(N * vPer * 2), col = new Float32Array(N * vPer * 3);
  const idx = [];
  petals.forEach((p, k) => {
    for (let j = 0; j <= SV; j++) for (let i = 0; i <= SU; i++) {
      const o = k * vPer + j * (SU + 1) + i;
      uv[o * 2] = i / SU; uv[o * 2 + 1] = j / SV;
    }
    for (let j = 0; j < SV; j++) for (let i = 0; i < SU; i++) {
      const a = k * vPer + j * (SU + 1) + i, b = a + 1, c = a + SU + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setIndex(idx);
  const mat = new THREE.MeshPhysicalMaterial({
    map: tex, vertexColors: true, side: THREE.DoubleSide, alphaTest: .45, roughness: .62, metalness: 0,
    sheen: .8, sheenRoughness: .45, sheenColor: new THREE.Color('#ffd6e2'), clearcoat: .08, clearcoatRoughness: .5
  });
  // lumière qui traverse le pétale : vu à contre-jour, il s'éclaire (fausse diffusion sous la surface)
  mat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
      {
        vec3 bl = normalize(vec3(-.35, .55, -.75));
        float back = pow(max(0., dot(-normal, bl)), 1.2) * .55 + pow(max(0., dot(normal, -bl)), 2.) * .15;
        reflectedLight.indirectDiffuse += diffuseColor.rgb * vec3(1., .72, .8) * back * .9;
      }`);
  };
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.castShadow = mesh.receiveShadow = true;

  // sépales, réceptacle et tige
  const green = new THREE.MeshStandardMaterial({ color: '#557040', roughness: .7, side: THREE.DoubleSide });
  const SEP = 5, sSU = 4, sSV = 10, sPer = (sSU + 1) * (sSV + 1);
  const sPos = new Float32Array(SEP * sPer * 3), sUv = new Float32Array(SEP * sPer * 2), sIdx = [];
  for (let k = 0; k < SEP; k++) {
    for (let j = 0; j <= sSV; j++) for (let i = 0; i <= sSU; i++) { const o = k * sPer + j * (sSU + 1) + i; sUv[o * 2] = i / sSU; sUv[o * 2 + 1] = j / sSV; }
    for (let j = 0; j < sSV; j++) for (let i = 0; i < sSU; i++) { const a = k * sPer + j * (sSU + 1) + i, b = a + 1, c = a + sSU + 1, d = c + 1; sIdx.push(a, c, b, b, c, d); }
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3)); sGeo.setAttribute('uv', new THREE.BufferAttribute(sUv, 2)); sGeo.setIndex(sIdx);
  const sepals = new THREE.Mesh(sGeo, green); sepals.castShadow = true; sepals.frustumCulled = false;
  const recep = new THREE.Mesh(new THREE.SphereGeometry(.085, 24, 16), green); recep.position.y = -.16; recep.scale.set(1, 1.25, 1);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.034, .042, 2.6, 12), green); stem.position.y = -1.42;
  const group = new THREE.Group();
  group.add(mesh, sepals, recep, stem);

  // gouttes de rosée posées sur quelques pétales extérieurs
  const dewMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, thickness: .05, ior: 1.33, roughness: .02, envMapIntensity: 1.8 });
  const dews = [N - 2, N - 5, N - 7, N - 9, N - 12].map((k, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(.026 + (i % 2) * .01, 20, 14), dewMat);
    m.userData = { k, u: [.62, .35, .7, .45, .3][i], v: [.78, .86, .7, .9, .8][i] };
    m.scale.set(1, .72, 1);
    group.add(m); return m;
  });

  const st = { bloom: 0, scatter: 0 };
  const v3 = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler();

  function petalPoint(p, k, B, S, u, v, out) {
    const s = p.s;
    const o = smooth(clamp01((B * 1.25 - (1 - s) * .42) / .83)) * lerp(.55, 1, s);
    const baseTilt = lerp(lerp(.02, .2, s), lerp(.08, .98, Math.pow(s, 1.6)), o);
    const tipCurl = lerp(lerp(-.5, -.28, s), lerp(-.22, 1.55, Math.pow(s, 1.25)), o);
    const R = lerp(lerp(.11, .34, s), lerp(.14, 1.3, Math.pow(s, 1.4)), o) * p.Wk;
    const r0 = lerp(lerp(.0, .1, s), lerp(.02, .24, Math.pow(s, 1.2)), o);
    const L = p.L * lerp(1, 1.04, o), W = p.L * .92 * p.Wk;
    const y0 = lerp(.12, -.08, s) * lerp(1, .6, o);
    const sk = smooth(clamp01((S * 1.5 - (1 - s) * .5 - p.jit * .08) / .9));
    // ligne médiane : intégration de l'inclinaison le long du pétale
    let my = 0, mz = 0;
    for (let k2 = 1; k2 <= 6; k2++) { const vv = v * k2 / 6, a = baseTilt + tipCurl * Math.pow(vv, 1.6); my += Math.cos(a) * v / 6; mz += Math.sin(a) * v / 6; }
    my *= L; mz *= L;
    const th = baseTilt + tipCurl * Math.pow(v, 1.6);
    const cupR = R * (1 + v * .9);
    const x = u * W * lerp(.62, 1, Math.min(1, v * 2.2 + .15));
    const al = x / cupR;
    const lx = cupR * Math.sin(al);
    let lz = -cupR * (1 - Math.cos(al));
    lz += Math.pow(Math.abs(u) * 2, 3) * v * v * .09 * o * L;
    const ct = Math.cos(th), stt = Math.sin(th);
    const px = lx + p.tw * u * v, py = my - lz * stt, pz = mz + lz * ct;
    const cp = Math.cos(p.phi), sp = Math.sin(p.phi);
    let X = cp * (pz + r0) - sp * px, Y = y0 + py, Z = sp * (pz + r0) + cp * px;
    if (sk > 0) {
      const ang = p.phi + sk * (1.4 + p.jit * 1.2);
      const rad = sk * (2.4 + p.jit2 * 2.2) * (1 + s * .5);
      const cx = Math.cos(ang) * rad, cz = Math.sin(ang) * rad, cy = sk * (1.1 + p.jit3 * 1.8 - s * .8) + Math.sin(sk * 3 + p.jit * 6) * .2;
      e.set(sk * (2 + p.jit * 3), sk * (1.5 + p.jit2 * 2), sk * (p.jit3 - .5) * 3);
      q.setFromEuler(e);
      v3.set(X, Y, Z).applyQuaternion(q);
      const shrink = 1 - sk * .25;
      X = v3.x * shrink + cx; Y = v3.y * shrink + cy; Z = v3.z * shrink + cz;
    }
    out.x = X; out.y = Y; out.z = Z; out.o = o; out.sk = sk;
    return out;
  }

  const P = { x: 0, y: 0, z: 0, o: 0, sk: 0 };
  function update() {
    const B = st.bloom, S = st.scatter;
    petals.forEach((p, k) => {
      for (let j = 0; j <= SV; j++) {
        const v = j / SV;
        for (let i = 0; i <= SU; i++) {
          const u = i / SU - .5;
          petalPoint(p, k, B, S, u, v, P);
          const n = ((k * vPer) + j * (SU + 1) + i) * 3;
          pos[n] = P.x; pos[n + 1] = P.y; pos[n + 2] = P.z;
          // occlusion : base des pétales et cœur plus sombres (plutôt que des ombres portées coûteuses)
          const ao = lerp(lerp(.45, .72, p.s), 1, Math.pow(v, .6)) * lerp(lerp(.78, 1, p.s), 1, P.o * .5);
          const tone = lerp(ao, 1, P.sk);
          col[n] = p.tint.r * tone; col[n + 1] = p.tint.g * tone; col[n + 2] = p.tint.b * tone;
        }
      }
    });
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    geo.computeVertexNormals();
    // sépales : collés au bouton, puis rabattus sous la fleur
    const so = smooth(clamp01(B * 1.4));
    for (let k = 0; k < SEP; k++) {
      const a = k / SEP * Math.PI * 2 + .35, ca = Math.cos(a), sa = Math.sin(a);
      const tilt0 = lerp(.62, 2.1, so), curl = lerp(-.95, .5, so);
      for (let j = 0; j <= sSV; j++) {
        const v = j / sSV;
        let my = 0, mz = 0;
        for (let t = 1; t <= 5; t++) { const vv = v * t / 5, ang = tilt0 + curl * vv * vv; my += Math.cos(ang) * .8 * v / 5; mz += Math.sin(ang) * .8 * v / 5; }
        for (let i = 0; i <= sSU; i++) {
          const u = i / sSU - .5, w = .22 * Math.sin(Math.PI * Math.min(1, v * 1.1 + .06)) * (1 - v * .7) + .004;
          const lx = u * w, lz = -Math.abs(u) * w * .8;
          const X = ca * (mz + lz + .08) - sa * lx, Z = sa * (mz + lz + .08) + ca * lx;
          const n = (k * sPer + j * (sSU + 1) + i) * 3;
          sPos[n] = X; sPos[n + 1] = -.1 + my; sPos[n + 2] = Z;
        }
      }
    }
    sGeo.attributes.position.needsUpdate = true; sGeo.computeVertexNormals();
    const hide = 1 - smooth(clamp01(Math.max(S * 2.5, (B - .45) * 2.2)));
    sepals.visible = recep.visible = hide > .02;
    sepals.scale.setScalar(Math.max(.001, hide)); recep.scale.set(hide, 1.25 * hide, hide);
    stem.visible = S < .35;
    // rosée : suit son pétale, puis tombe quand il s'envole
    dews.forEach(d => {
      const { k, u, v } = d.userData, p = petals[k];
      petalPoint(p, k, B, S, u - .5, v, P);
      const fall = smooth(clamp01(S * 3));
      d.position.set(P.x * 1.012, P.y + .012 - fall * 1.6, P.z * 1.012);
      d.visible = fall < .98;
    });
  }
  return { group, mesh, material: mat, petals, setBloom(b) { st.bloom = b; }, setScatter(s) { st.scatter = s; }, update };
}
