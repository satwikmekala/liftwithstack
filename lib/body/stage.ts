import {
  BufferAttribute, BufferGeometry, Color, Group, Matrix4, Mesh, MeshBasicMaterial, OrthographicCamera, Raycaster,
  Scene, ShaderMaterial, Vector2, Vector4, WebGLRenderer,
} from "three";
import { BODY_REGIONS, BODY_TONE, mix, regionFill, type BodyRegion, type BodySide, type RegionStates } from "./regions";

/**
 * The app's 3D Body Map figure on the web: the same sculpt (public/app/body.bin, packed from
 * assets/body-map/body-sculpt.glb by tools/body-model), the same per-vertex studio lighting and
 * paint shader (components/body-map/bodyModelMaterials.ts), the same turntable and framing
 * (components/body-map/BodyModel.native.tsx, features/body-map/sculpt.ts).
 */

type Part = { name: BodyRegion | "neutral"; vStart: number; vCount: number; iStart: number; iCount: number; min: number[]; max: number[] };
export type Figure = { positions: Float32Array; normals: Int8Array; regions: Uint8Array; indices: Uint32Array; partIndices: Uint16Array; parts: Part[]; min: number[]; max: number[] };

let shared: Promise<Figure> | null = null;

export function loadFigure(): Promise<Figure> {
  shared ??= (async () => {
    const response = await fetch("/app/body.bin");
    if (!response.ok) throw new Error("Body figure unavailable");
    const buffer = await response.arrayBuffer();
    const view = new DataView(buffer);
    const headerLength = view.getUint32(4, true);
    const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 8, headerLength))) as
      { count: number; indexCount: number; min: number[]; max: number[]; parts: Omit<Part, "min" | "max">[] };
    let offset = 8 + headerLength;
    const quantized = new Uint16Array(buffer, offset, header.count * 3);
    offset += header.count * 6;
    const normals = new Int8Array(buffer, offset, header.count * 3);
    offset += header.count * 3;
    offset += offset % 2;
    const partIndices = new Uint16Array(buffer, offset, header.indexCount);

    const positions = new Float32Array(header.count * 3);
    for (let i = 0; i < positions.length; i++) {
      const k = i % 3;
      positions[i] = header.min[k] + (quantized[i] / 65535) * (header.max[k] - header.min[k]);
    }
    const regions = new Uint8Array(header.count);
    const indices = new Uint32Array(header.indexCount);
    const parts = header.parts.map((part) => {
      const id = part.name === "neutral" ? BODY_REGIONS.length : BODY_REGIONS.indexOf(part.name as BodyRegion);
      regions.fill(id, part.vStart, part.vStart + part.vCount);
      for (let i = 0; i < part.iCount; i++) indices[part.iStart + i] = partIndices[part.iStart + i] + part.vStart;
      const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
      for (let v = part.vStart; v < part.vStart + part.vCount; v++) {
        for (let k = 0; k < 3; k++) {
          const value = positions[v * 3 + k];
          if (value < min[k]) min[k] = value;
          if (value > max[k]) max[k] = value;
        }
      }
      return { ...part, min, max } as Part;
    });
    return { positions, normals, regions, indices, partIndices, parts, min: header.min, max: header.max };
  })();
  shared.catch(() => { shared = null; });
  return shared;
}

const PAINT_COUNT = BODY_REGIONS.length + 1;
const id = (region: BodyRegion) => BODY_REGIONS.indexOf(region).toFixed(1);
const TRICEPS_TRANSITION = { x: 0.243, y: 1.065, slope: 0.36, curvature: 7.5, halfWidth: 0.006 };
const FOREARM_TRANSITION = { wrist: [0.898, 0.918], elbow: [1.036, 1.053], rear: [-0.044, -0.031], outer: [0.272, 0.284] } as const;
const CALF_TRANSITION = [0.147, 0.17] as const;

const smooth = ([start, end]: readonly [number, number] | readonly number[], value: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
/** Colour fades out where muscle tails meet the hands, feet or elbow; a tap there is the body, not the muscle. */
function paintCoverage(region: BodyRegion, x: number, y: number, z: number) {
  if (region === "triceps") {
    const { x: cx, y: cy, slope, curvature, halfWidth } = TRICEPS_TRANSITION;
    const lateral = Math.abs(x) - cx;
    return smooth([-halfWidth, halfWidth], y - (cy + slope * lateral + curvature * lateral * lateral));
  }
  if (region === "forearms") {
    const { wrist, elbow, rear, outer } = FOREARM_TRANSITION;
    return smooth(wrist, y) * (1 - smooth(elbow, y) * (1 - smooth(rear, z)) * (1 - smooth(outer, Math.abs(x))));
  }
  return region === "calves" ? smooth(CALF_TRANSITION, y) : 1;
}

function bodyMaterial() {
  return new ShaderMaterial({
    uniforms: {
      paints: { value: Array.from({ length: PAINT_COUNT }, () => new Vector4()) },
      viewport: { value: new Vector2(1, 1) },
      feather: { value: new Vector4() },
    },
    vertexShader: `
      attribute float region;
      uniform vec4 paints[${PAINT_COUNT}];
      varying vec3 litColor;
      varying vec3 neutralColor;
      varying vec3 modelPoint;
      varying float regionId;
      void main() {
        vec3 n = normalize(normalMatrix * normal);
        vec4 paint = paints[int(region)];
        vec3 light = mix(vec3(0.008, 0.006, 0.005), vec3(0.398, 0.36, 0.32), n.y * 0.5 + 0.5);
        light += vec3(0.509, 0.465, 0.419) * max(dot(n, normalize(vec3(-1.7, 2.6, 3.0))), 0.0);
        light += vec3(0.104, 0.119, 0.134) * max(dot(n, normalize(vec3(2.4, 0.6, 2.2))), 0.0);
        light += vec3(0.430) * max(dot(n, normalize(vec3(0.4, 1.8, -3.4))), 0.0);
        litColor = paint.rgb * (light + paint.a);
        neutralColor = paints[${PAINT_COUNT - 1}].rgb * light;
        modelPoint = position;
        regionId = region;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 viewport;
      uniform vec4 feather;
      varying vec3 litColor;
      varying vec3 neutralColor;
      varying vec3 modelPoint;
      varying float regionId;
      float edge(float amount, float distance) { return amount > 0.0 ? smoothstep(0.0, amount, distance) : 1.0; }
      void main() {
        float coverage = 1.0;
        if (abs(regionId - ${id("triceps")}) < 0.5) {
          float lateral = abs(modelPoint.x) - ${TRICEPS_TRANSITION.x.toFixed(3)};
          float elbow = ${TRICEPS_TRANSITION.y.toFixed(3)} + ${TRICEPS_TRANSITION.slope.toFixed(3)} * lateral + ${TRICEPS_TRANSITION.curvature.toFixed(3)} * lateral * lateral;
          coverage = smoothstep(-${TRICEPS_TRANSITION.halfWidth.toFixed(3)}, ${TRICEPS_TRANSITION.halfWidth.toFixed(3)}, modelPoint.y - elbow);
        } else if (abs(regionId - ${id("forearms")}) < 0.5) {
          float wrist = smoothstep(${FOREARM_TRANSITION.wrist.join(", ")}, modelPoint.y);
          float overlap = smoothstep(${FOREARM_TRANSITION.elbow.join(", ")}, modelPoint.y)
            * (1.0 - smoothstep(${FOREARM_TRANSITION.rear.join(", ")}, modelPoint.z))
            * (1.0 - smoothstep(${FOREARM_TRANSITION.outer.join(", ")}, abs(modelPoint.x)));
          coverage = wrist * (1.0 - overlap);
        } else if (abs(regionId - ${id("calves")}) < 0.5) {
          coverage = smoothstep(${CALF_TRANSITION[0]}, ${CALF_TRANSITION[1].toFixed(3)}, modelPoint.y);
        }
        gl_FragColor = vec4(mix(neutralColor, litColor, coverage), 1.0);
        #include <colorspace_fragment>
        vec2 uv = gl_FragCoord.xy / viewport;
        float fade = edge(feather.x, 1.0 - uv.y) * edge(feather.y, uv.y) * edge(feather.z, uv.x) * edge(feather.w, 1.0 - uv.x);
        gl_FragColor = vec4(gl_FragColor.rgb * fade, fade);
      }
    `,
  });
}

function spring(current: number, goal: number, velocity: number, dt: number, time: number) {
  const omega = 2 / time;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - goal;
  const temp = (velocity + omega * change) * dt;
  return { value: goal + (change + temp) * decay, velocity: (velocity - omega * temp) * decay };
}

const PRIMARY_GLOW = 0.16, SELECTED_GLOW = 0.22, PULSE_GLOW = 0.34;
const FEATHER = { vertical: 0.2, side: 0.12, ramp: 0.06 };
const faceOf = (angle: number): BodySide => Math.abs(Math.round(angle / Math.PI) % 2) === 0 ? "front" : "back";

export type Paint = { states: RegionStates; selected?: BodyRegion | null; glow?: boolean };

export class BodyStage {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
  private group = new Group();
  private material = bodyMaterial();
  private geometry = new BufferGeometry();
  private picks: Mesh[] = [];
  private raycaster = new Raycaster();
  private size = { width: 1, height: 1 };
  private turn = { angle: 0, goal: 0, velocity: 0, start: 0, dragging: false, time: 0.22 };
  private frame: { centerY: number; height: number } | null = null;
  private frameVelocity = { centerY: 0, height: 0 };
  private goal = { centerY: 1, height: 2 };
  private focus: readonly BodyRegion[] | null = null;
  private focusOptions: { pad?: number; minHeight?: number } = {};
  private current: Paint = { states: {} };
  private pulses: { region: BodyRegion; until: number }[] = [];
  /** Glow per region eases toward its target, so muscles light up rather than switch on. */
  private levels = new Float32Array(BODY_REGIONS.length);
  private colors = BODY_REGIONS.map(() => new Color(BODY_TONE.plate));
  private targets = BODY_REGIONS.map(() => new Color(BODY_TONE.plate));
  private bodyColor = new Color(BODY_TONE.figure);
  private bodyTarget = new Color(BODY_TONE.figure);
  dirty = true;

  constructor(private canvas: HTMLCanvasElement, private figure: Figure, private reducedMotion = false) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    this.geometry.setAttribute("position", new BufferAttribute(figure.positions, 3));
    this.geometry.setAttribute("normal", new BufferAttribute(figure.normals, 3, true));
    this.geometry.setAttribute("region", new BufferAttribute(figure.regions, 1));
    this.geometry.setIndex(new BufferAttribute(figure.indices, 1));
    this.geometry.computeBoundingSphere();
    this.group.add(new Mesh(this.geometry, this.material));
    this.scene.add(this.group);
    const pickMaterial = new MeshBasicMaterial();
    for (const part of figure.parts) {
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(figure.positions.subarray(part.vStart * 3, (part.vStart + part.vCount) * 3), 3));
      geometry.setIndex(new BufferAttribute(figure.partIndices.subarray(part.iStart, part.iStart + part.iCount), 1));
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      const mesh = new Mesh(geometry, pickMaterial);
      mesh.name = part.name;
      this.picks.push(mesh);
    }
    this.applyPaint(true);
  }

  resize(width: number, height: number) {
    if (!width || !height) return;
    this.size = { width, height };
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.camera.left = -width / 2; this.camera.right = width / 2;
    this.camera.top = height / 2; this.camera.bottom = -height / 2;
    this.refocus();
    this.dirty = true;
  }

  setPaint(paint: Paint) {
    const before = this.current;
    this.current = paint;
    const now = performance.now();
    if (paint.selected && paint.selected !== before.selected && !this.reducedMotion) this.pulses.push({ region: paint.selected, until: now + 220 });
    this.applyPaint(false);
  }

  /** Lift these muscles briefly: an exercise was just added, or the figure wants a glance. */
  pulse(regions: readonly BodyRegion[], ms = 420) {
    if (this.reducedMotion) return;
    const until = performance.now() + ms;
    for (const region of regions) this.pulses.push({ region, until });
    this.dirty = true;
  }

  private applyPaint(immediate: boolean) {
    const { states, selected = null } = this.current;
    BODY_REGIONS.forEach((region, index) => {
      this.targets[index].set(regionFill(region, states, selected));
      if (immediate || this.reducedMotion) this.colors[index].copy(this.targets[index]);
    });
    this.bodyTarget.set(selected ? mix(BODY_TONE.figure, BODY_TONE.body, 0.6) : BODY_TONE.figure);
    if (immediate || this.reducedMotion) this.bodyColor.copy(this.bodyTarget);
    this.dirty = true;
  }

  setFocus(regions: readonly BodyRegion[] | null, options: { pad?: number; minHeight?: number } = {}) {
    this.focus = regions;
    this.focusOptions = options;
    this.refocus();
    this.dirty = true;
  }

  private refocus() {
    const { figure } = this;
    const aspect = this.size.width / this.size.height;
    const pad = this.focusOptions.pad ?? 0.07;
    const full = { x: Math.max(Math.abs(figure.min[0]), Math.abs(figure.max[0])), y0: figure.min[1], y1: figure.max[1] };
    const fullHeight = Math.max(full.y1 - full.y0, (2 * full.x) / aspect) * 1.04;
    let box: { x: number; y0: number; y1: number } | null = null;
    for (const region of this.focus ?? []) {
      const part = figure.parts.find((item) => item.name === region);
      if (!part) continue;
      const x = Math.max(Math.abs(part.min[0]), Math.abs(part.max[0]));
      box = box ? { x: Math.max(box.x, x), y0: Math.min(box.y0, part.min[1]), y1: Math.max(box.y1, part.max[1]) } : { x, y0: part.min[1], y1: part.max[1] };
    }
    if (!box) { this.goal = { centerY: (full.y0 + full.y1) / 2, height: fullHeight }; return; }
    const height = Math.min(fullHeight, Math.max(this.focusOptions.minHeight ?? 0.42, box.y1 - box.y0 + pad * 2, (2 * box.x + pad * 2) / aspect));
    const half = height / 2;
    this.goal = { centerY: Math.min(Math.max((box.y0 + box.y1) / 2, full.y0 + half), full.y1 + 0.02 - half), height };
  }

  get side(): BodySide { return faceOf(this.turn.goal); }

  setSide(side: BodySide) {
    const t = this.turn;
    if (faceOf(t.goal) === side) return;
    t.goal = (Math.round(t.angle / Math.PI) + 1) * Math.PI;
    if (faceOf(t.goal) !== side) t.goal -= Math.PI;
    t.time = 0.22;
    this.dirty = true;
  }

  /** One slow revolution into place, as the app's figure arrives. */
  spinIn() {
    if (this.reducedMotion) return;
    const t = this.turn;
    t.angle = t.goal - 2 * Math.PI;
    t.velocity = 0;
    t.time = 0.42;
    this.dirty = true;
  }

  panBegin() { const t = this.turn; t.start = t.angle; t.dragging = true; }
  panUpdate(dx: number) {
    const t = this.turn;
    if (!t.dragging) return;
    t.angle = t.start + dx * 0.0105;
    t.velocity = 0;
    this.dirty = true;
  }
  panEnd(vx: number): BodySide {
    const t = this.turn;
    t.dragging = false;
    t.time = 0.22;
    t.goal = Math.round((t.angle + Math.max(-1.9, Math.min(1.9, vx * 0.0021))) / Math.PI) * Math.PI;
    this.dirty = true;
    return faceOf(t.goal);
  }

  /** The muscle under a point, in CSS pixels from the canvas's top-left corner. */
  pick(x: number, y: number): BodyRegion | null {
    const point = new Vector2((x / this.size.width) * 2 - 1, 1 - (y / this.size.height) * 2);
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(point, this.camera);
    this.group.updateMatrixWorld();
    this.raycaster.ray.applyMatrix4(new Matrix4().copy(this.group.matrixWorld).invert());
    const hit = this.raycaster.intersectObjects(this.picks, false)[0];
    const name = hit?.object.name;
    if (!hit || !name || name === "neutral") return null;
    const region = name as BodyRegion;
    return paintCoverage(region, hit.point.x, hit.point.y, hit.point.z) >= 0.5 ? region : null;
  }

  /** Advance and draw if anything moved. Returns whether another frame is needed. */
  tick(dt: number, now: number) {
    let moving = false;
    if (!this.frame || this.reducedMotion) {
      if (!this.frame || this.frame.centerY !== this.goal.centerY || this.frame.height !== this.goal.height) this.dirty = true;
      this.frame = { ...this.goal };
    } else {
      for (const key of ["centerY", "height"] as const) {
        const step = spring(this.frame[key], this.goal[key], this.frameVelocity[key], dt, 0.24);
        if (Math.abs(step.value - this.goal[key]) > 0.0003 || Math.abs(step.velocity) > 0.003) {
          this.frame[key] = step.value; this.frameVelocity[key] = step.velocity; moving = true;
        } else if (this.frame[key] !== this.goal[key]) { this.frame[key] = this.goal[key]; this.frameVelocity[key] = 0; this.dirty = true; }
      }
    }
    const t = this.turn;
    if (!t.dragging && (t.angle !== t.goal || t.velocity !== 0)) {
      const step = spring(t.angle, t.goal, t.velocity, dt, t.time);
      if (!this.reducedMotion && (Math.abs(step.value - t.goal) > 0.001 || Math.abs(step.velocity) > 0.01)) {
        t.angle = step.value; t.velocity = step.velocity; moving = true;
      } else { t.angle = t.goal %= 2 * Math.PI; t.velocity = 0; this.dirty = true; }
    }

    // Paint: colours and glow ease toward their targets.
    const { states, selected = null, glow = true } = this.current;
    this.pulses = this.pulses.filter((pulse) => pulse.until > now);
    const ease = Math.min(1, dt * 9);
    BODY_REGIONS.forEach((region, index) => {
      const pulsing = this.pulses.some((pulse) => pulse.region === region);
      const target = pulsing ? PULSE_GLOW : selected === region ? SELECTED_GLOW : glow && !selected && states[region] === "primary" ? PRIMARY_GLOW : 0;
      const color = this.colors[index];
      const goal = this.targets[index];
      if (Math.abs(color.r - goal.r) + Math.abs(color.g - goal.g) + Math.abs(color.b - goal.b) > 0.002) { color.lerp(goal, ease); moving = true; } else color.copy(goal);
      if (Math.abs(this.levels[index] - target) > 0.002) { this.levels[index] += (target - this.levels[index]) * Math.min(1, dt * 12); moving = true; } else this.levels[index] = target;
      this.material.uniforms.paints.value[index].set(color.r, color.g, color.b, this.levels[index]);
    });
    if (Math.abs(this.bodyColor.r - this.bodyTarget.r) > 0.001) { this.bodyColor.lerp(this.bodyTarget, ease); moving = true; } else this.bodyColor.copy(this.bodyTarget);
    this.material.uniforms.paints.value[BODY_REGIONS.length].set(this.bodyColor.r, this.bodyColor.g, this.bodyColor.b, 0);
    if (this.pulses.length) moving = true;

    if (moving || this.dirty) {
      this.dirty = false;
      const frame = this.frame;
      this.camera.position.set(0, frame.centerY, 6);
      this.camera.zoom = this.size.height / frame.height;
      this.camera.updateProjectionMatrix();
      this.group.rotation.y = t.angle;
      this.renderer.getDrawingBufferSize(this.material.uniforms.viewport.value);
      const half = frame.height / 2;
      const aspect = this.size.width / this.size.height;
      const reach = Math.max(Math.abs(this.figure.min[0]), Math.abs(this.figure.max[0]));
      const ramp = (cut: number) => Math.min(1, Math.max(0, cut / (frame.height * FEATHER.ramp)));
      const side = ramp(reach - half * aspect) * FEATHER.side;
      this.material.uniforms.feather.value.set(
        ramp(this.figure.max[1] - (frame.centerY + half)) * FEATHER.vertical,
        ramp(frame.centerY - half - this.figure.min[1]) * FEATHER.vertical, side, side);
      this.renderer.render(this.scene, this.camera);
    }
    return moving;
  }

  dispose() {
    this.geometry.dispose();
    this.picks.forEach((mesh) => mesh.geometry.dispose());
    this.material.dispose();
    this.renderer.dispose();
  }
}
