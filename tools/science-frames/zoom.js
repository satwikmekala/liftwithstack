import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const SIZE = 1100;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: false });
renderer.setSize(SIZE, SIZE); renderer.setPixelRatio(new URLSearchParams(location.search).get('hi') ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); const BG = new THREE.Color('#0c0b09'); scene.background = BG;
scene.fog = new THREE.Fog(BG, 1, 10);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.2;
const camera = new THREE.PerspectiveCamera(24, 1, 0.01, 100);
scene.add(new THREE.HemisphereLight('#ffe6d2', '#160a07', 0.5));
const key = new THREE.DirectionalLight('#fff0e0', 3.2); key.position.set(0.5, 1.6, 1.5); scene.add(key);
const rim = new THREE.DirectionalLight('#ffb088', 2.4); rim.position.set(-1.2, 0.8, -1.2); scene.add(rim);

// ---- scale of the chain, largest to smallest; x = 0 is the middle of the exposed sarcomere ----
const L = 0.004;                     // sarcomere length
const R = { muscle: 1, fascicle: 0.13, fiber: 0.024, myofibril: 0.0024 };
const X = { muscleEnd: -1.6, fascicleEnd: -0.45, fiberEnd: -0.07, myoEnd: -L / 2 };

const COLORS = { flesh: '#b23a26', meat: '#9c2f20', pale: '#e6d6c2', actin: '#e8dccb', myosinBody: '#a8452c', myosinHead: '#ff7a3d', fiber: '#c2452d', myo: '#e27b5e' };
const mat = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.5, sheen: 0.45, sheenRoughness: 0.5, sheenColor: new THREE.Color('#ff7a4a'), ...o });

/** Cross-striations: the A band, I band, H zone and Z line of a sarcomere, painted by world x. */
function striate(m, { strength = 1, opts = {} } = {}) {
  m.onBeforeCompile = (s) => {
    s.uniforms.uL = { value: L }; s.uniforms.uK = { value: strength };
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWX;').replace('#include <project_vertex>', `#include <project_vertex>
      vec4 wp4 = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
      wp4 = instanceMatrix * wp4;
      #endif
      vWX = (modelMatrix * wp4).x;`);
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vWX; uniform float uL; uniform float uK;').replace('#include <color_fragment>', `#include <color_fragment>
      float sn = vWX / uL + 0.5;
      float u = abs(fract(sn) - 0.5) * 2.0;
      float shade = mix(0.62, 1.12, smoothstep(0.56, 0.62, u));
      shade *= mix(1.0, 1.08, 1.0 - smoothstep(0.1, 0.14, u));
      shade *= mix(1.0, 0.45, smoothstep(0.93, 0.96, u));
      float w = fwidth(sn);
      float keep = 1.0 - smoothstep(0.1, 0.42, w);
      diffuseColor.rgb *= mix(1.0, mix(0.72, shade, keep), uK);`);
  };
  return m;
}
const hex = (spacing, radius) => { const out = []; const a = spacing, h = a * Math.sqrt(3) / 2; const n = Math.ceil(radius / h) + 1; for (let j = -n; j <= n; j++) for (let i = -n; i <= n; i++) { const x = (i + (j % 2 ? 0.5 : 0)) * a, y = j * h; if (Math.hypot(x, y) <= radius) out.push([x, y]); } return out; };
const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const rnd = seeded(7);
const axisRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2);      // cylinder y → world x
const dummy = new THREE.Object3D();
function instanced(geo, material, n, fn) {
  const m = new THREE.InstancedMesh(geo, material, n);
  for (let i = 0; i < n; i++) { fn(i, dummy); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); }
  m.frustumCulled = false; scene.add(m); return m;
}
const cyl = (r, seg = 24, h = 1) => new THREE.CylinderGeometry(r, r, 1, seg, h);

// ---- biceps: the whole muscle, cut across its belly ----
{
  const profile = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60; const x = -9 + t * (9 + X.muscleEnd); const r = R.muscle * Math.pow(Math.sin(Math.PI * (0.13 + t * 0.42)), 1.5) * 1.02; profile.push(new THREE.Vector2(Math.max(0.02, r), x)); }
  const g = new THREE.LatheGeometry(profile, 96); g.rotateZ(-Math.PI / 2); g.computeVertexNormals();
  scene.add(new THREE.Mesh(g, mat('#a93523', { side: THREE.DoubleSide, roughness: 0.42, clearcoat: 0.6 })));
  const face = new THREE.Mesh(new THREE.CircleGeometry(R.muscle * 1.0, 96), mat(COLORS.pale, { sheen: 0, clearcoat: 0.1 }));
  face.rotation.y = Math.PI / 2; face.position.x = X.muscleEnd - 0.012; scene.add(face);
  const rim2 = new THREE.Mesh(new THREE.TorusGeometry(R.muscle * 1.0, 0.012, 12, 128), mat(COLORS.pale)); rim2.rotation.y = Math.PI / 2; rim2.position.x = X.muscleEnd - 0.012; scene.add(rim2);
  const pts = hex(0.272, R.muscle - 0.11).filter(([y, z]) => Math.hypot(y, z) > 0.1);
  instanced(cyl(0.128, 28), mat(COLORS.meat), pts.length, (i, d) => { const [y, z] = pts[i]; const len = 0.01 + rnd() * 0.035; d.position.set(X.muscleEnd - 0.01 + len / 2 - 0.02, y, z); d.quaternion.copy(axisRot); d.scale.set(1 + (rnd() - 0.5) * 0.1, len + 0.04, 1 + (rnd() - 0.5) * 0.1); });
}
// ---- fascicle: a bundle of fibers leaving the muscle in a thin sheath ----
{
  const pts = hex(0.05, R.fascicle - 0.02);
  const fibre = striate(mat(COLORS.fiber));
  const ends = [];
  instanced(cyl(R.fiber, 24, 160), fibre, pts.length, (i, d) => { const [y, z] = pts[i]; const centre = y === 0 && z === 0; const end = centre ? X.fiberEnd : X.fascicleEnd - 0.02 + rnd() * 0.05; const start = X.muscleEnd - 0.06; d.position.set((start + end) / 2, y, z); d.quaternion.copy(axisRot); d.scale.set(1, end - start, 1); ends.push(end); });
  const sheath = new THREE.Mesh(new THREE.CylinderGeometry(R.fascicle * 1.03, R.fascicle * 1.03, X.fascicleEnd - X.muscleEnd - 0.12, 64, 1, true), mat(COLORS.pale, { transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide }));
  sheath.quaternion.copy(axisRot); sheath.position.x = (X.muscleEnd + X.fascicleEnd) / 2 - 0.06; scene.add(sheath);
}
// ---- fiber: nuclei under the membrane, myofibrils inside ----
{
  const nuclei = 26;
  instanced(new THREE.SphereGeometry(1, 16, 12), mat('#d9a67e', { roughness: 0.4 }), nuclei, (i, d) => { const a = rnd() * Math.PI * 2; const x = X.fascicleEnd - 0.04 + rnd() * (X.fiberEnd - X.fascicleEnd - 0.1); d.position.set(x, Math.cos(a) * R.fiber * 0.98, Math.sin(a) * R.fiber * 0.98); d.scale.set(0.011, 0.0038, 0.0058); d.lookAt(d.position.x, 0, 0); d.rotateX(Math.PI / 2); d.scale.set(0.0058, 0.0038, 0.011); });
  const pts = hex(0.00505, R.fiber - 0.0015);
  instanced(cyl(R.myofibril, 20, 260), striate(mat(COLORS.myo, { roughness: 0.46 })), pts.length, (i, d) => { const [y, z] = pts[i]; const centre = y === 0 && z === 0; const end = centre ? X.myoEnd : X.fiberEnd + 0.0005 + rnd() * 0.0035 + (Math.hypot(y, z) < 0.012 ? 0.002 : 0); const start = X.fiberEnd - 0.01; d.position.set((start + end) / 2, y, z); d.quaternion.copy(axisRot); d.scale.set(1, end - start, 1); });
}
// ---- the exposed sarcomere: Z-discs, thin actin filaments, thick myosin filaments ----
const SPACING = 0.00052, THICK_LEN = 0.0027, THIN_LEN = 0.00135, LR = R.myofibril * 0.94;
{
  for (const s of [-1, 1]) {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(R.myofibril, R.myofibril, 0.00011, 48), mat(COLORS.pale, { sheen: 0 })); disc.quaternion.copy(axisRot); disc.position.x = s * L / 2; scene.add(disc);
  }
  const thick = hex(SPACING, LR);
  const a = [SPACING, 0], b = [SPACING / 2, SPACING * Math.sqrt(3) / 2];
  const thin = [];
  for (const p of hex(SPACING, LR + SPACING)) for (const k of [1 / 3, 2 / 3]) { const q = [p[0] + (a[0] + b[0]) * k, p[1] + (a[1] + b[1]) * k]; if (Math.hypot(...q) <= LR) thin.push(q); }
  console.log('thick', thick.length, 'thin', thin.length);
  // thick filament bodies
  instanced(new THREE.CapsuleGeometry(0.000105, 1, 8, 16), mat(COLORS.myosinBody), thick.length, (i, d) => { d.position.set(0, thick[i][0], thick[i][1]); d.quaternion.copy(axisRot); d.scale.set(1, THICK_LEN / 1, 1); d.scale.set(1, 1, 1); });
  // the capsule's length is built in, so rebuild it at true length
  // myosin heads: a lever and a head, angled away from the M-line
  const lever = new THREE.CapsuleGeometry(0.000011, 0.00006, 6, 12); lever.translate(0, 0.00003, 0);
  const head = new THREE.SphereGeometry(1, 28, 20); head.scale(0.000027, 0.000052, 0.000027); head.translate(0, 0.000105, 0);
  const myosin = mergeGeometries([lever.toNonIndexed(), head.toNonIndexed()]);
  myosin.computeVertexNormals();
  const heads = [];
  for (const [ty, tz] of thick) for (const side of [-1, 1]) for (let c = 0; c < 13; c++) for (let k = 0; k < 3; k++) {
    heads.push({ x: side * (0.00024 + c * 0.000088), a: Math.PI / 6 + (Math.PI / 3) * ((k * 2 + c) % 6), ty, tz, side, bound: (c * 7 + k * 3 + Math.round(ty * 1e5)) % 5 === 0 });
  }
  const tilt = new THREE.Quaternion(), spin = new THREE.Quaternion(), base = new THREE.Vector3();
  const headMat = mat(COLORS.myosinHead, { side: THREE.DoubleSide, emissive: new THREE.Color('#ff4a1c'), emissiveIntensity: 0.12, roughness: 0.4 });
  instanced(myosin, headMat, heads.length, (i, d) => {
    const h = heads[i]; const r = 0.0001;
    d.position.set(h.x, h.ty + Math.cos(h.a) * r, h.tz + Math.sin(h.a) * r);
    // point outward, leaning toward the nearer Z-disc
    const out = new THREE.Vector3(h.side * (h.bound ? 0.15 : 0.62), Math.cos(h.a), Math.sin(h.a)).normalize();
    d.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), out); d.scale.set(1, 1, 1);
  });
  // thin filaments: two twisted strands of globular actin
  const bead = new THREE.IcosahedronGeometry(0.000031, 3);
  const actinMat = mat(COLORS.actin, { sheen: 0.1, sheenColor: new THREE.Color('#ffd9b8'), roughness: 0.42, side: THREE.DoubleSide });
  const beads = [];
  for (const [ty, tz] of thin) for (const side of [-1, 1]) for (let s = 0; s < 2; s++) for (let i = 0; i < 22; i++) {
    const x = side * (L / 2 - 0.00005 - i * 0.0000604); const a = s * Math.PI + i * 0.23 + ty * 9000 + tz * 7000;
    beads.push([x, ty + Math.cos(a) * 0.00003, tz + Math.sin(a) * 0.00003]);
  }
  console.log('beads', beads.length, 'heads', heads.length);
  instanced(bead, actinMat, beads.length, (i, d) => { d.position.set(...beads[i]); d.quaternion.identity(); d.scale.set(1, 1, 1); });
}
scene.children.filter((o) => o.isInstancedMesh && o.geometry.type === 'CapsuleGeometry').forEach((o) => scene.remove(o));
{
  const thick = hex(SPACING, LR);
  const body = new THREE.CapsuleGeometry(0.000105, THICK_LEN, 8, 16);
  instanced(body, mat(COLORS.myosinBody, { side: THREE.DoubleSide }), thick.length, (i, d) => { d.position.set(0, thick[i][0], thick[i][1]); d.quaternion.copy(axisRot); d.scale.set(1, 1, 1); });
}

// ---- the shot ----
const dirs = { wide: new THREE.Vector3(0.62, 0.3, 0.72), side: new THREE.Vector3(0.1, 0.16, 0.98) };
const STOPS = [
  { x: -2.6, d: 7.4, dir: 0.0 },    // biceps, cut
  { x: -1.3, d: 1.6, dir: 0.1 },    // fascicle
  { x: -0.36, d: 0.3, dir: 0.25 },  // fiber
  { x: -0.045, d: 0.036, dir: 0.5 },  // myofibril
  { x: 0, d: 0.0118, dir: 0.9 },     // sarcomere
  { x: 0.00098, d: 0.00125, dir: 1 },// actin and myosin
];
let ROLL = +(new URLSearchParams(location.search).get('roll') || 0);
const ease = (t) => t * t * t * (t * (6 * t - 15) + 10);
window.frame = (t) => {            // t: 0..STOPS.length-1
  const i = Math.min(STOPS.length - 2, Math.floor(t)), f = ease(t - i), a = STOPS[i], b = STOPS[i + 1];
  const d = Math.exp(THREE.MathUtils.lerp(Math.log(a.d), Math.log(b.d), f));
  // pan in step with the zoom, so nothing rushes past at the end of a move
  const k = (a.d - d) / (a.d - b.d);
  const x = THREE.MathUtils.lerp(a.x, b.x, k);
  const dirK = THREE.MathUtils.lerp(a.dir, b.dir, f);
  const dir = dirs.wide.clone().lerp(dirs.side, dirK).normalize();
  camera.position.set(x, 0, 0).addScaledVector(dir, d);
  const roll = ROLL * (1 - ease(Math.min(1, t)));
  camera.up.set(0, 1, 0).applyAxisAngle(dir, roll); camera.lookAt(x, 0, 0);
  camera.near = d * (0.2 + 0.45 * smooth(3.4, 4.6, t)); camera.far = d * 7; camera.updateProjectionMatrix();
  scene.fog.near = d * (0.95); scene.fog.far = d * (t > 3 ? 2.2 : 3.2);
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/png');
};
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
window.ready = true;
