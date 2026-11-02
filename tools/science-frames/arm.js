import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const SIZE = 1280;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(SIZE, SIZE); renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); const BG = '#0c0b09'; scene.background = new THREE.Color(BG);
const camera = new THREE.PerspectiveCamera(24, 1, 0.02, 10);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.22;

scene.add(new THREE.HemisphereLight('#ffe6d2', '#120806', 0.35));
const key = new THREE.DirectionalLight('#fff0e0', 3.4); key.position.set(1.9, 2.4, 2.1); key.target.position.set(0.2, 1.15, 0.1);
key.castShadow = true; key.shadow.mapSize.set(4096, 4096); key.shadow.bias = -0.0002; key.shadow.normalBias = 0.002; key.shadow.intensity = 0.72; key.shadow.radius = 5;
Object.assign(key.shadow.camera, { left: -0.6, right: 0.6, top: 0.6, bottom: -0.6, near: 0.5, far: 5 });
scene.add(key, key.target);
const rim = new THREE.DirectionalLight('#ffb088', 3.0); rim.position.set(-0.8, 1.6, -2.0); scene.add(rim);
const fill = new THREE.DirectionalLight('#ff8f60', 0.5); fill.position.set(2.0, 0.7, -0.6); scene.add(fill);

const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const gltf = await loader.loadAsync('/model/ecorche.meshopt.glb');
gltf.scene.updateMatrixWorld(true);

const BONE = /humerus|radius|ulna|scapula|clavicle|capitate|hamate|lunate|pisiform|scaphoid|trapezium|trapezoid|triquetr|metacarpal|phalanx|rib|sternum|vertebra|skull|mandible|sacrum|hip bone|femur|cartilage/i;
const parts = [];
gltf.scene.traverse((o) => {
  if (!o.isMesh) return;
  const name = o.userData.name || o.parent.userData.name || o.name;
  const g = new THREE.BufferGeometry();
  const src = o.geometry.attributes.position;
  const arr = new Float32Array(src.count * 3); const p = new THREE.Vector3();
  let cy = 0, cx = 0, minY = 9, maxY = -9;
  for (let i = 0; i < src.count; i++) { p.fromBufferAttribute(src, i).applyMatrix4(o.matrixWorld); arr[i*3]=p.x; arr[i*3+1]=p.y; arr[i*3+2]=p.z; cx+=p.x; cy+=p.y; minY=Math.min(minY,p.y); maxY=Math.max(maxY,p.y); }
  cx/=src.count; cy/=src.count;
  if (maxY < 0.55) return;                 // legs never appear in frame
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  g.setIndex(o.geometry.index ? [...o.geometry.index.array] : null);
  parts.push({ name, g, rest: arr.slice(), cx, cy, minY, maxY });
});

const ELBOW = new THREE.Vector3(0.222, 1.122, 0.006);
const AXIS = new THREE.Vector3(-1, 0.05, 0.1).normalize();
const leftArm = (p) => /left/i.test(p.name) && p.cx > 0.13 && p.minY < ELBOW.y - 0.02 && !/iliotibial|tensor fasciae/i.test(p.name);
for (const p of parts) {
  p.kind = /left biceps brachii|left brachialis$/i.test(p.name) ? 'flexor'
    : /left triceps/i.test(p.name) ? 'blend'
    : /left (radius|ulna)$/i.test(p.name) ? 'rigid'
    : /left/i.test(p.name) && /humerus/i.test(p.name) ? 'upper'
    : leftArm(p) ? 'lower' : 'upper';
}
console.log('lower', parts.filter((p) => p.kind === 'lower').length, 'flexor', parts.filter((p) => p.kind === 'flexor').map((p) => p.name).join(','));

const tint = (p) => BONE.test(p.name) ? '#d6c9b4' : /left biceps brachii/i.test(p.name) ? '#c9452d' : /tendon|aponeurosis/i.test(p.name) ? '#e8dccb' : '#7a2d22';
for (const p of parts) {
  const arm = p.kind !== 'upper' || /deltoid|left .*(pectoralis)/i.test(p.name);
  const m = new THREE.MeshPhysicalMaterial({ color: tint(p), roughness: 0.46, clearcoat: 0.45, clearcoatRoughness: 0.42, sheen: 0.5, sheenRoughness: 0.5, sheenColor: new THREE.Color('#ff7a4a'), side: THREE.DoubleSide });
  if (!arm) m.color.multiplyScalar(0.34);
  if (/left biceps brachii/i.test(p.name)) { m.emissive = new THREE.Color('#ff4a1c'); p.glow = m; }
  p.base = { color: m.color.clone(), clearcoat: m.clearcoat, sheen: m.sheen };
  p.mesh = new THREE.Mesh(p.g, m); p.mesh.castShadow = p.mesh.receiveShadow = true; p.mesh.frustumCulled = false; scene.add(p.mesh);
}

// ---- grip: curl the fingers around a handle, in the rest pose, once ----
const named = (n) => parts.find((p) => p.name === n);
const end = (p, top) => { const c = new THREE.Vector3(); let k = 0; const lim = top ? p.maxY - 0.004 : p.minY + 0.004; for (let i = 0; i < p.rest.length; i += 3) { const y = p.rest[i+1]; if (top ? y > lim : y < lim) { c.x += p.rest[i]; c.y += y; c.z += p.rest[i+2]; k++; } } return c.divideScalar(k); };
const axisX = new THREE.Vector3(-1, 0, 0);
const FINGERS = ['index', 'middle', 'ring', 'little'].map((f, i) => {
  const a = named(`Proximal phalanx of left ${f} finger`), b = named(`Middle phalanx of left ${f} finger`), c = named(`Distal phalanx of left ${f} finger`);
  return { f, joints: [end(a, true), end(b, true), end(c, true)], tip: end(c, false), angles: [46, 74, 42].map(THREE.MathUtils.degToRad), axis: axisX.clone().add(new THREE.Vector3(0, 0, (i - 1.5) * 0.05)).normalize() };
});
const thumbA = named('Proximal phalanx of left thumb'), thumbB = named('Distal phalanx of left thumb'), thumbM = named('Left first metacarpal bone');
const THUMB = { f: 'thumb', joints: [end(thumbM, true), end(thumbA, true), end(thumbB, true)], tip: end(thumbB, false), angles: [46, 18, 36].map(THREE.MathUtils.degToRad), axis: new THREE.Vector3(-1, 0, 0), axes: [new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-1, 0, 0)] };
console.log('THUMB', JSON.stringify([...THUMB.joints, THUMB.tip].map((v) => v.toArray().map((n) => +n.toFixed(3)))));
window.FINGERS = FINGERS; console.log('MCP', FINGERS.map((f) => f.joints[0].toArray().map((n) => n.toFixed(3)).join(',')).join(' | '), 'tip', FINGERS[1].tip.toArray().map((n) => n.toFixed(3)).join(','));
const segDist = (p, a, b) => { const ab = b.clone().sub(a); const t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1); return a.clone().addScaledVector(ab, t).distanceTo(p); };
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const WRIST_Y = FINGERS[1].joints[0].y + 0.11;
const q = new THREE.Quaternion(), v = new THREE.Vector3();
function past(p, joint, dir, soft) { return smooth(-soft, soft, p.clone().sub(joint).dot(dir)); }
function gripVertex(p) {
  let best = null, bd = 0.028;
  for (const F of [...FINGERS, THUMB]) {
    const pts = [...F.joints, F.tip];
    for (let i = 0; i < 3; i++) { const d = segDist(p, pts[i], pts[i + 1]); if (d < bd) { bd = d; best = F; } }
  }
  if (!best) return p;
  const pts = [...best.joints, best.tip]; let r = p.clone();
  for (let i = 2; i >= 0; i--) {
    const dir = pts[i + 1].clone().sub(pts[i]).normalize();
    const w = past(p, pts[i], dir, 0.006);
    if (w > 0) { q.setFromAxisAngle(best.axes ? best.axes[i] : best.axis, best.angles[i] * w); r.sub(pts[i]).applyQuaternion(q).add(pts[i]); }
  }
  return r;
}
for (const p of parts) {
  if (p.kind !== 'lower') continue;
  const n = p.rest.length / 3;
  for (let i = 0; i < n; i++) {
    v.set(p.rest[i*3], p.rest[i*3+1], p.rest[i*3+2]);
    if (v.y > WRIST_Y) continue;
    const r = gripVertex(v.clone());
    p.rest[i*3] = r.x; p.rest[i*3+1] = r.y; p.rest[i*3+2] = r.z;
  }
}

// ---- dumbbell: 10 kg, handle across the palm ----
const dumbbell = new THREE.Group();
const iron = new THREE.MeshPhysicalMaterial({ color: '#2a2724', roughness: 0.42, metalness: 0.15, clearcoat: 0.4, clearcoatRoughness: 0.5 });
const steel = new THREE.MeshPhysicalMaterial({ color: '#a7a196', roughness: 0.3, metalness: 1 });
const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.0155, 0.0155, 0.135, 48), steel); handle.rotation.z = Math.PI / 2; dumbbell.add(handle);
for (const s of [-1, 1]) {
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.078, 6, 1), iron); head.rotation.z = Math.PI / 2; head.position.x = s * 0.1085; dumbbell.add(head);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.012, 32), steel); collar.rotation.z = Math.PI / 2; collar.position.x = s * 0.0625; dumbbell.add(collar);
}
dumbbell.traverse((o) => { o.castShadow = o.receiveShadow = true; });
const H = FINGERS[1].joints[0];
const HANDLE0 = new THREE.Vector3(H.x - 0.002, H.y - 0.018, H.z + 0.04);
window.handle = HANDLE0; scene.add(dumbbell);

const rotateAboutElbow = (out, p, angle) => { q.setFromAxisAngle(AXIS, angle); out.copy(p).sub(ELBOW).applyQuaternion(q).add(ELBOW); };
function flexor(p, angle) {
  const pts = p.rest; const n = pts.length / 3;
  const top = new THREE.Vector3(), bottom = new THREE.Vector3(); let topN = 0, botN = 0;
  for (let i = 0; i < n; i++) { const y = pts[i*3+1]; v.set(pts[i*3], y, pts[i*3+2]); if (y > p.maxY - 0.01) { top.add(v); topN++; } if (y < p.minY + 0.006) { bottom.add(v); botN++; } }
  top.divideScalar(topN); bottom.divideScalar(botN);
  const e = new THREE.Vector3(); rotateAboutElbow(e, bottom, angle);
  const a0 = bottom.clone().sub(top), L0 = a0.length(); a0.normalize();
  const a1 = e.clone().sub(top), L1 = a1.length(); a1.normalize();
  const turn = new THREE.Quaternion().setFromUnitVectors(a0, a1);
  const bulge = Math.pow(L0 / L1, 0.9);
  const arr = p.g.attributes.position.array, c = new THREE.Vector3(), r = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.set(pts[i*3], pts[i*3+1], pts[i*3+2]).sub(top);
    const s = v.dot(a0) / L0; c.copy(a0).multiplyScalar(s * L0); r.copy(v).sub(c);
    const belly = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, s))), 1.4);
    r.multiplyScalar(1 + (bulge - 1) * belly * 1.5).applyQuaternion(turn);
    c.copy(a1).multiplyScalar(s * L1); v.copy(top).add(c).add(r);
    arr[i*3] = v.x; arr[i*3+1] = v.y; arr[i*3+2] = v.z;
  }
}
const fresh = new Set();
function pose(deg) {
  const angle = THREE.MathUtils.degToRad(deg);
  for (const p of parts) {
    if (p.kind === 'upper') { if (!fresh.has(p)) { p.g.computeVertexNormals(); fresh.add(p); } continue; }
    const arr = p.g.attributes.position.array, pts = p.rest, n = pts.length / 3;
    if (p.kind === 'flexor') flexor(p, angle);
    else for (let i = 0; i < n; i++) {
      v.set(pts[i*3], pts[i*3+1], pts[i*3+2]);
      const w = p.kind === 'rigid' ? 1 : p.kind === 'lower' ? smooth(ELBOW.y + 0.03, ELBOW.y - 0.03, v.y) : smooth(ELBOW.y + 0.025, ELBOW.y - 0.025, v.y);
      if (w > 0) rotateAboutElbow(v, v.clone(), angle * w);
      arr[i*3] = v.x; arr[i*3+1] = v.y; arr[i*3+2] = v.z;
    }
    p.g.attributes.position.needsUpdate = true; p.g.computeVertexNormals();
  }
  for (const p of parts) if (p.glow) p.glow.emissiveIntensity = 0.02 + 0.13 * smooth(10, 110, deg);
  const hp = new THREE.Vector3(); rotateAboutElbow(hp, HANDLE0, angle);
  dumbbell.position.copy(hp); q.setFromAxisAngle(AXIS, angle); dumbbell.quaternion.copy(q);
}
const iso = (fade) => {
  for (const p of parts) {
    if (p.glow) continue;
    const m = p.mesh.material, k = 1 - fade;
    m.color.copy(p.base.color).multiplyScalar(k * k); m.clearcoat = p.base.clearcoat * k; m.sheen = p.base.sheen * k; m.envMapIntensity = k;
    p.mesh.visible = k > 0.01;
  }
  dumbbell.traverse((o) => { if (o.material) { o.material.transparent = fade > 0; o.material.opacity = 1 - fade; } });
  dumbbell.visible = fade < 0.99;
};
const box = new THREE.Box3();
window.shot = (deg, eye, look, fov = 24, fade = 0, glow, toward = 0) => {
  pose(deg); iso(fade);
  if (toward > 0) {
    box.makeEmpty(); for (const p of parts) if (p.glow) { p.g.computeBoundingBox(); box.union(p.g.boundingBox); }
    const c = box.getCenter(new THREE.Vector3());
    look = look.map((n, i) => n + (c.getComponent(i) - n) * toward);
  }
  if (glow !== undefined) for (const p of parts) if (p.glow) p.glow.emissiveIntensity = glow;
  camera.fov = fov; camera.updateProjectionMatrix();
  camera.position.set(...eye); camera.lookAt(...look);
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/png');
};
window.ready = true;
