/**
 * The muscle, from the outside in: a bundle of fascicles, then one fiber as a bundle of
 * myofibrils with their striations, then a single sarcomere with its thin and thick filaments
 * and the myosin heads that pull. One scene; the scroll position (0–1) drives the camera and
 * the cross-fades, time drives the contraction cycle and the power strokes.
 *
 * Proportions are schematic (a real sarcomere is ~2 µm long and a fiber ~50 µm across) but the
 * mechanics are the sliding filament model: thick filaments never shorten, the overlap grows.
 */
import {
  BoxGeometry, Color, CylinderGeometry, DoubleSide, Group, InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, Object3D,
  PerspectiveCamera, Scene, ShaderMaterial, SphereGeometry, Vector3, WebGLRenderer,
} from "three";

export type Quality = "full" | "lite";

const INK = new Color("#13110E");

const LIT_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uContract;
  uniform float uSqueeze;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying float vLocalX;
  varying float vSeed;
  void main() {
    vec3 p = position;
    // Contraction: shorter along the fiber axis, a little fatter across it.
    p.x *= 1.0 - uSqueeze * uContract;
    p.yz *= 1.0 + 0.5 * uSqueeze * uContract;
    vLocalX = position.x;
    vSeed = aSeed;
    mat4 m = modelMatrix;
    #ifdef USE_INSTANCING
      m = m * instanceMatrix;
    #endif
    vec4 world = m * vec4(p, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(m) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/** Lambert from one warm key light, a fresnel rim that carries the tension glow, and an optional striation pattern. */
const LIT_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform float uGlow;
  uniform float uOpacity;
  uniform float uStriate;
  uniform float uContract;
  uniform float uPeriod;
  uniform vec3 uCamera;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying float vLocalX;
  varying float vSeed;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 l = normalize(vec3(0.5, 0.9, 0.7));
    float diffuse = max(0.0, dot(n, l)) * 0.8 + 0.36;
    vec3 v = normalize(uCamera - vPosW);
    float rim = pow(1.0 - max(0.0, dot(n, v)), 2.6);
    vec3 base = uColor * (0.85 + 0.3 * vSeed);
    if (uStriate > 0.5) {
      // Sarcomere bands along the fiber: the A-band (thick filaments) keeps its width while the
      // I-band either side shrinks as the overlap grows.
      float period = uPeriod * (1.0 - 0.22 * uContract);
      float x = mod(vLocalX + vSeed * 0.3, period) / period;
      float a = 0.62 / (1.0 - 0.22 * uContract);
      float aHalf = min(0.49, a * 0.5);
      float d = abs(x - 0.5);
      float inA = 1.0 - smoothstep(aHalf - 0.03, aHalf + 0.03, d);
      float z = smoothstep(0.045, 0.0, min(x, 1.0 - x));
      float h = 1.0 - smoothstep(0.0, max(0.02, 0.12 - 0.11 * uContract), d);
      base = mix(base * 1.45, base * 0.5, inA);
      base = mix(base, base * 1.5, h * inA * 0.7);
      base = mix(base, vec3(0.96, 0.94, 0.9) * 0.7, z);
    }
    vec3 color = base * diffuse + uGlowColor * rim * (0.25 + uGlow) + uGlowColor * uGlow * 0.08;
    gl_FragColor = vec4(color, uOpacity);
  }
`;

type Lit = ShaderMaterial & { uniforms: Record<string, { value: unknown }> };

function lit(color: string, options: { striate?: boolean; squeeze?: number; period?: number; glow?: string } = {}): Lit {
  return new ShaderMaterial({
    vertexShader: LIT_VERTEX,
    fragmentShader: LIT_FRAGMENT,
    transparent: true,
    uniforms: {
      uColor: { value: new Color(color) },
      uGlowColor: { value: new Color(options.glow ?? "#FF7A3D") },
      uGlow: { value: 0 },
      uOpacity: { value: 1 },
      uStriate: { value: options.striate ? 1 : 0 },
      uContract: { value: 0 },
      uSqueeze: { value: options.squeeze ?? 0 },
      uPeriod: { value: options.period ?? 2.2 },
      uCamera: { value: new Vector3() },
    },
  }) as Lit;
}

/** A bundle of parallel cylinders packed on a hex lattice inside a circle, with a little jitter. */
function bundle(count: number, radius: number, spacing: number, seed: number) {
  const positions: [number, number][] = [];
  const rows = Math.ceil(radius / (spacing * 0.866)) + 1;
  let s = seed;
  const random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
  for (let row = -rows; row <= rows; row++) {
    for (let col = -rows; col <= rows; col++) {
      const y = row * spacing * 0.866;
      const z = (col + (row % 2 ? 0.5 : 0)) * spacing;
      const jitter = spacing * 0.12;
      const py = y + (random() - 0.5) * jitter;
      const pz = z + (random() - 0.5) * jitter;
      if (Math.hypot(py, pz) <= radius) positions.push([py, pz]);
    }
  }
  // Keep the densest centre so a lower count still reads as a bundle.
  positions.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
  return positions.slice(0, count);
}

function instanced(geometry: CylinderGeometry | SphereGeometry, material: Lit, placements: Matrix4[], seeds: number[]) {
  const mesh = new InstancedMesh(geometry, material, placements.length);
  placements.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
  mesh.instanceMatrix.needsUpdate = true;
  geometry.setAttribute("aSeed", new InstancedBufferAttribute(new Float32Array(seeds), 1));
  mesh.frustumCulled = false;
  return mesh;
}

const along = (y: number, z: number, length: number, radius: number, x = 0) =>
  new Matrix4().makeTranslation(x, y, z).multiply(new Matrix4().makeRotationZ(Math.PI / 2)).multiply(new Matrix4().makeScale(radius, length, radius));

export class FiberScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(34, 1, 0.1, 400);
  private width = 1;
  private height = 1;
  private muscle = new Group();
  private fiber = new Group();
  private sarcomere = new Group();
  private materials: Lit[] = [];
  private heads: InstancedMesh;
  private headBase: { x: number; angle: number; side: 1 | -1; phase: number }[] = [];
  private thinLeft: InstancedMesh;
  private thinRight: InstancedMesh;
  private zLeft: Mesh;
  private zRight: Mesh;
  private titinLeft: InstancedMesh;
  private titinRight: InstancedMesh;
  private thinCount: number;
  private readonly SARC = 12;
  private readonly THIN = 5.2;
  private readonly THICK = 7.6;
  private helper = new Object3D();
  private headThick: [number, number][] = [];

  constructor(private canvas: HTMLCanvasElement, quality: Quality) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(INK, 0);
    const lite = quality === "lite";

    // Whole muscle: fascicles, each a long rounded cylinder in muscle red.
    const fascicle = new CylinderGeometry(1, 1, 1, lite ? 10 : 16, 1, false);
    const fasciclePositions = bundle(lite ? 34 : 70, 9.5, 2.35, 7);
    const fascicleMaterial = lit("#8C3A2C", { squeeze: 0.08, glow: "#FF7A3D" });
    const fascicleMesh = instanced(fascicle, fascicleMaterial,
      fasciclePositions.map(([y, z]) => along(y, z, 46, 1.05)), fasciclePositions.map((_, i) => (i * 0.37) % 1));
    this.muscle.add(fascicleMesh);
    // Its sheath, faint and wide.
    const sheath = new Mesh(new CylinderGeometry(10.8, 10.8, 48, lite ? 24 : 40, 1, true), lit("#5A2A22", { glow: "#FF7A3D" }));
    sheath.rotation.z = Math.PI / 2;
    (sheath.material as Lit).uniforms.uOpacity.value = 0.14;
    (sheath.material as Lit).side = DoubleSide;
    this.muscle.add(sheath);
    this.materials.push(fascicleMaterial, sheath.material as Lit);

    // One fiber: a bundle of myofibrils, each striated.
    const myofibril = new CylinderGeometry(1, 1, 1, lite ? 8 : 12, 1, false);
    const myofibrilPositions = bundle(lite ? 40 : 90, 7.5, 1.55, 3);
    const myofibrilMaterial = lit("#C8603F", { striate: true, squeeze: 0.22, period: 3.2 });
    const myofibrilMesh = instanced(myofibril, myofibrilMaterial,
      myofibrilPositions.map(([y, z]) => along(y, z, 30, 0.66)), myofibrilPositions.map((_, i) => ((i * 0.618) % 1)));
    this.fiber.add(myofibrilMesh);
    const membrane = new Mesh(new CylinderGeometry(8.6, 8.6, 31, lite ? 24 : 40, 1, true), lit("#7A3A2C"));
    membrane.rotation.z = Math.PI / 2;
    (membrane.material as Lit).uniforms.uOpacity.value = 0.06;
    (membrane.material as Lit).side = DoubleSide;
    this.fiber.add(membrane);
    this.materials.push(myofibrilMaterial, membrane.material as Lit);

    // One sarcomere, large: Z-discs, thin filaments from each disc, thick filaments centred.
    const disc = new BoxGeometry(0.32, 9.2, 9.2);
    const discMaterial = lit("#E8DFD2");
    this.zLeft = new Mesh(disc, discMaterial);
    this.zRight = new Mesh(disc, discMaterial);
    this.sarcomere.add(this.zLeft, this.zRight);
    const thickLattice = bundle(7, 2.4, 2.2, 11);
    const thinLattice: [number, number][] = [];
    for (const [y, z] of thickLattice) {
      for (let k = 0; k < 6; k++) {
        const angle = (k / 6) * Math.PI * 2 + Math.PI / 6;
        const point: [number, number] = [y + Math.cos(angle) * 1.27, z + Math.sin(angle) * 1.27];
        if (!thinLattice.some(([a, b]) => Math.hypot(a - point[0], b - point[1]) < 0.3)) thinLattice.push(point);
      }
    }
    this.thinCount = thinLattice.length;
    const thinGeometry = new CylinderGeometry(1, 1, 1, 8, 1, false);
    const thinMaterial = lit("#D9A27C", { glow: "#FFE2C9" });
    this.thinLeft = instanced(thinGeometry, thinMaterial, thinLattice.map(([y, z]) => along(y, z, this.THIN, 0.11)), thinLattice.map((_, i) => (i * 0.31) % 1));
    this.thinRight = instanced(thinGeometry.clone(), thinMaterial, thinLattice.map(([y, z]) => along(y, z, this.THIN, 0.11)), thinLattice.map((_, i) => (i * 0.53) % 1));
    const thickMaterial = lit("#8F3B2A", { glow: "#FF7A3D" });
    const thick = instanced(new CylinderGeometry(1, 1, 1, 10, 1, false), thickMaterial,
      thickLattice.map(([y, z]) => along(y, z, this.THICK, 0.26)), thickLattice.map((_, i) => (i * 0.21) % 1));
    // Titin: the faint springs holding the thick filaments centred between the discs.
    const titinMaterial = lit("#6F6558");
    titinMaterial.uniforms.uOpacity.value = 0.45;
    this.titinLeft = instanced(new CylinderGeometry(1, 1, 1, 6, 1, false), titinMaterial, thickLattice.map(([y, z]) => along(y, z, 1, 0.04)), thickLattice.map(() => 0.5));
    this.titinRight = instanced(new CylinderGeometry(1, 1, 1, 6, 1, false), titinMaterial, thickLattice.map(([y, z]) => along(y, z, 1, 0.04)), thickLattice.map(() => 0.5));
    // Myosin heads along each thick filament, reaching toward the nearest thin filament.
    const headMaterial = lit("#FF9A62", { glow: "#FFB36B" });
    const perSide = lite ? 7 : 10;
    thickLattice.forEach(([y, z], t) => {
      for (const side of [1, -1] as const) {
        for (let i = 0; i < perSide; i++) {
          const x = side * (0.9 + (i / (perSide - 1)) * (this.THICK / 2 - 1.1));
          this.headBase.push({ x, angle: ((i * 2 + t) % 6) * (Math.PI / 3) + Math.PI / 6, side, phase: (i * 0.37 + t * 0.61 + side) % 1 });
        }
      }
    });
    this.heads = new InstancedMesh(new SphereGeometry(0.21, lite ? 8 : 12, lite ? 6 : 10), headMaterial, this.headBase.length);
    this.heads.frustumCulled = false;
    (this.heads.geometry as SphereGeometry).setAttribute("aSeed", new InstancedBufferAttribute(new Float32Array(this.headBase.map((h) => h.phase)), 1));
    this.headThick = thickLattice;
    this.sarcomere.add(this.thinLeft, this.thinRight, thick, this.titinLeft, this.titinRight, this.heads);
    this.materials.push(discMaterial, thinMaterial, thickMaterial, titinMaterial, headMaterial);

    this.scene.add(this.muscle, this.fiber, this.sarcomere);
    this.placeSarcomere(0, 0);
  }

  resize(width: number, height: number, dpr: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  /** Where the sarcomere's parts sit for a contraction (0 rest → 1 fully shortened) and a stroke phase. */
  private placeSarcomere(contract: number, time: number) {
    const length = this.SARC * (1 - 0.22 * contract);
    const half = length / 2;
    this.zLeft.position.x = -half;
    this.zRight.position.x = half;
    const thinCentre = half - this.THIN / 2;
    const thin = new Matrix4();
    for (let i = 0; i < this.thinCount; i++) {
      this.thinLeft.getMatrixAt(i, thin);
      const y = thin.elements[13], z = thin.elements[14];
      this.thinLeft.setMatrixAt(i, along(y, z, this.THIN, 0.11, -thinCentre));
      this.thinRight.setMatrixAt(i, along(y, z, this.THIN, 0.11, thinCentre));
    }
    this.thinLeft.instanceMatrix.needsUpdate = true;
    this.thinRight.instanceMatrix.needsUpdate = true;
    const titinLength = Math.max(0.2, half - this.THICK / 2);
    this.headThick.forEach(([y, z], i) => {
      this.titinLeft.setMatrixAt(i, along(y, z, titinLength, 0.04, -(this.THICK / 2 + titinLength / 2)));
      this.titinRight.setMatrixAt(i, along(y, z, titinLength, 0.04, this.THICK / 2 + titinLength / 2));
    });
    this.titinLeft.instanceMatrix.needsUpdate = true;
    this.titinRight.instanceMatrix.needsUpdate = true;
    // Each head: out from its thick filament, cocked back then swinging toward the disc (the power stroke).
    const perThick = this.headBase.length / this.headThick.length;
    this.headBase.forEach((head, i) => {
      const [y, z] = this.headThick[Math.floor(i / perThick)];
      const stroke = Math.max(0, Math.sin((time * 1.6 + head.phase) * Math.PI * 2));
      const reach = 0.72 + 0.28 * stroke;
      const swing = head.side * (0.35 - 0.7 * stroke);
      this.helper.position.set(head.x + swing * 0.5, y + Math.cos(head.angle) * reach, z + Math.sin(head.angle) * reach);
      this.helper.scale.setScalar(0.9 + 0.3 * stroke);
      this.helper.updateMatrix();
      this.heads.setMatrixAt(i, this.helper.matrix);
    });
    this.heads.instanceMatrix.needsUpdate = true;
  }

  /**
   * One frame. `t` is the scroll through the chapter (0–1), `time` seconds, `motion` false under
   * reduced motion (the contraction then follows the scroll instead of a clock).
   */
  render(t: number, time: number, motion: boolean) {
    const s = (a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
    const ease = (x: number) => x * x * (3 - 2 * x);
    // Contraction cycle: a slow squeeze and release, held mid-way without motion.
    const cycle = motion ? 0.5 - 0.5 * Math.cos(time * 1.15) : 0.45;
    // Only once we are inside does the muscle start working.
    const working = s(0.08, 0.3);
    const contract = cycle * working;

    const toFiber = ease(s(0.16, 0.4));
    const toSarcomere = ease(s(0.48, 0.66));
    const toHeads = ease(s(0.74, 0.9));

    // Camera: far outside the muscle, in past the fascicles, into the fiber, onto one sarcomere, then up close to the heads.
    const from = new Vector3(0, 10, 92);
    const fiberView = new Vector3(2, 9, 50);
    const sarcomereView = new Vector3(0, 5, 24);
    const headsView = new Vector3(3.5, 2.6, 9.5);
    const position = from.clone().lerp(fiberView, toFiber).lerp(sarcomereView, toSarcomere).lerp(headsView, toHeads);
    const target = new Vector3(0, 0, 0).lerp(new Vector3(0.8, 0.4, 0.3), toHeads);
    // On wide screens the copy sits on the left, so the subject sits right of centre.
    const wide = this.width / this.height > 1.1;
    const shift = wide ? 14 * (1 - toFiber) + 11 * toFiber * (1 - toSarcomere) + 4 * toSarcomere * (1 - toHeads) + 1.6 * toHeads : 0;
    this.scene.position.x = shift;
    position.x += shift;
    target.x += shift;
    // Drift a little while nothing else moves, so the frame breathes.
    if (motion) position.add(new Vector3(Math.sin(time * 0.35) * 0.4, Math.cos(time * 0.27) * 0.3, 0));
    this.camera.position.copy(position);
    this.camera.lookAt(target);

    // Cross-fades: the muscle gives way to the fiber, the fiber to the sarcomere.
    const muscleOpacity = 1 - ease(s(0.22, 0.36));
    const fiberOpacity = ease(s(0.14, 0.3)) * (1 - ease(s(0.5, 0.62)));
    const sarcomereOpacity = ease(s(0.5, 0.64));
    this.muscle.visible = muscleOpacity > 0.01;
    this.fiber.visible = fiberOpacity > 0.01;
    this.sarcomere.visible = sarcomereOpacity > 0.01;
    this.muscle.rotation.y = -0.75 + 0.2 * toFiber;
    this.muscle.rotation.z = 0.18;
    // Side-on enough that the striations run across the frame, angled enough to read as a cylinder.
    this.fiber.rotation.y = -0.3;
    this.fiber.rotation.z = 0.18;
    this.sarcomere.rotation.y = -0.3 + 0.15 * toHeads;
    this.sarcomere.rotation.x = 0.1;

    const glow = working * (0.15 + 0.85 * contract) * (0.6 + 0.4 * toHeads);
    for (const material of this.materials) {
      material.uniforms.uContract.value = contract;
      material.uniforms.uGlow.value = glow;
      material.uniforms.uCamera.value = this.camera.position;
    }
    const [fascicle, sheath, myofibril, membrane, disc, thin, thick, titin, head] = this.materials;
    fascicle.uniforms.uOpacity.value = muscleOpacity;
    sheath.uniforms.uOpacity.value = 0.35 * muscleOpacity;
    myofibril.uniforms.uOpacity.value = fiberOpacity;
    membrane.uniforms.uOpacity.value = 0.22 * fiberOpacity;
    for (const material of [disc, thin, thick, head]) material.uniforms.uOpacity.value = sarcomereOpacity;
    titin.uniforms.uOpacity.value = 0.45 * sarcomereOpacity;
    // The heads carry the tension: brighter as the camera arrives.
    head.uniforms.uGlow.value = 0.4 + glow * 1.4;
    thin.uniforms.uGlow.value = glow * 0.5;

    if (this.sarcomere.visible) this.placeSarcomere(contract, motion ? time : 0.35);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.scene.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
    });
    for (const material of this.materials) material.dispose();
    this.renderer.dispose();
  }
}
