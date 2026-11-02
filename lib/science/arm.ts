/**
 * Our own arm for /science, drawn as a scientific plate rather than a body: the bones as a lever,
 * the elbow as its pivot, and the biceps as a spindle of fibres that pulls the forearm up.
 * Pure geometry, so it renders on the server and animates in the browser.
 * Side view, facing right. Angles in degrees: 0 = hanging, 120 = fully curled.
 */
export type Pt = [number, number];
export type Plate = {
  forearm: string;            // transform for everything that moves with the forearm
  biceps: { outline: string; fibres: string[]; tendons: string[] };
  tension: number;            // 0 at rest, 1 fully shortened
  hand: Pt;                   // where the dumbbell sits
  arc: string;                // the path the hand travels
  shortening: number;         // how much shorter the biceps is than at rest, 0–1
  belly: { center: Pt; angle: number; width: number };  // where the zoom dives in
};

const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const len = (a: Pt) => Math.hypot(a[0], a[1]);
const unit = (a: Pt): Pt => mul(a, 1 / (len(a) || 1));
const perp = (a: Pt): Pt => [a[1], -a[0]];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f = (n: number) => (Math.round(n * 10) / 10).toString();

function bezier(p: Pt[], t: number): Pt {
  const [a, b, c, d] = p, u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
}
const polyline = (pts: Pt[]) => pts.map((q, i) => `${i ? "L" : "M"}${f(q[0])} ${f(q[1])}`).join("");

/** The shoulder joint and the elbow pivot, in the plate's 600 × 800 space. */
export const SHOULDER: Pt = [262, 200];
export const ELBOW: Pt = [270, 470];
export const FOREARM = 250;
const ORIGIN: Pt = [284, 176];              // biceps origin, on the shoulder blade above the joint
const INSERT: Pt = [36, 10];                // biceps insertion on the radius, in forearm (u, v)

export const forearmDirection = (angle: number): Pt => {
  const a = ((angle + 6) * Math.PI) / 180;
  return [Math.sin(a), Math.cos(a)];
};
const onForearm = (angle: number, u: number, v: number): Pt => {
  const dir = forearmDirection(angle), n = perp(dir);
  return add(add(ELBOW, mul(dir, u)), mul(n, v));
};
const restLength = len(sub(onForearm(0, ...INSERT), ORIGIN));

/** The plate at one elbow angle. */
export function platePose(angle: number): Plate {
  const insertion = onForearm(angle, ...INSERT);
  const length = len(sub(insertion, ORIGIN));
  const shortening = Math.max(0, 1 - length / restLength);
  // Same volume, shorter muscle: the belly gets thicker.
  const thick = Math.sqrt(restLength / length);
  const axis = unit(sub(insertion, ORIGIN));
  const out = mul(perp(axis), -1);                                   // toward the front
  const tendonA = 0.2, tendonB = 0.86;                                // where the belly starts and ends
  const line: Pt[] = [ORIGIN, add(lerp(ORIGIN, insertion, 0.35), mul(out, 26 + 40 * (thick - 1))), add(lerp(ORIGIN, insertion, 0.7), mul(out, 20 + 34 * (thick - 1))), insertion];
  const width = (s: number) => {
    if (s < tendonA || s > tendonB) return 1.2;
    const t = (s - tendonA) / (tendonB - tendonA);
    return 1.2 + 26 * thick * Math.pow(Math.sin(Math.PI * t), 0.8);
  };
  const M = 48;
  const samples = Array.from({ length: M + 1 }, (_, i) => {
    const s = i / M, p = bezier(line, s);
    const d = unit(sub(bezier(line, Math.min(1, s + 0.01)), bezier(line, Math.max(0, s - 0.01))));
    return { s, p, n: perp(d), w: width(s) };
  });
  const at = (k: number, from = 0, to = 1) => samples.filter(({ s }) => s >= from - 1e-9 && s <= to + 1e-9).map(({ p, n, w }) => add(p, mul(n, w * k)));
  const belly = samples.filter(({ s }) => s >= tendonA - 0.02 && s <= tendonB + 0.02);
  const left = belly.map(({ p, n, w }) => add(p, mul(n, -w))), right = belly.map(({ p, n, w }) => add(p, mul(n, w))).reverse();
  const outline = `${polyline([...left, ...right])}Z`;
  const fibres = Array.from({ length: 15 }, (_, i) => polyline(at(-0.9 + (1.8 * i) / 14, tendonA - 0.02, tendonB + 0.02)));
  const tendons = [polyline(at(0, 0, tendonA + 0.02)), polyline(at(0, tendonB - 0.02, 1))];

  const dir = forearmDirection(angle);
  const rotate = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI - 90;
  const hand = onForearm(angle, FOREARM + 26, 2);
  const arcPts = Array.from({ length: 33 }, (_, i) => onForearm((i / 32) * 125, FOREARM + 26, 2));
  return {
    forearm: `rotate(${f(rotate)} ${ELBOW[0]} ${ELBOW[1]})`,
    biceps: { outline, fibres, tendons },
    tension: Math.min(1, shortening / 0.33),
    hand, arc: polyline(arcPts), shortening,
    belly: { center: bezier(line, 0.52), angle: Math.atan2(axis[1], axis[0]), width: width(0.52) },
  };
}

/** Bones, drawn once. The humerus stays still; the forearm bones are drawn hanging and rotated. */
export const BONES = {
  // The clavicle runs forward over the shoulder joint.
  clavicle: "M262 150 C 290 146, 320 150, 352 162 C 358 166, 356 172, 350 172 C 320 164, 292 160, 264 162 C 256 160, 256 152, 262 150 Z",
  humerus:
    "M262 172 C 280 172, 290 186, 288 204 C 286 220, 274 228, 270 240 C 266 300, 268 380, 274 438 C 286 446, 294 458, 290 474 C 280 484, 262 484, 250 476 C 244 462, 250 448, 258 440 C 252 380, 250 300, 252 240 C 244 230, 236 216, 238 200 C 240 184, 248 172, 262 172 Z",
  // Hanging forearm (rotated by Plate.forearm): radius on the front, ulna behind with the olecranon.
  radius: "M276 486 C 286 486, 290 498, 286 510 C 288 580, 292 650, 292 712 C 296 722, 288 732, 276 730 C 270 720, 272 712, 278 706 C 276 650, 274 580, 272 510 C 266 500, 268 488, 276 486 Z",
  ulna: "M244 452 C 254 450, 266 462, 266 476 C 262 490, 262 500, 262 512 C 266 580, 270 650, 272 712 C 274 722, 268 728, 262 724 C 258 650, 254 580, 250 512 C 246 496, 238 482, 238 468 C 238 460, 240 454, 244 452 Z",
};

/** A hexagonal plate as a path, flat top and bottom. */
export function hexagon(cx: number, cy: number, r: number, angle = 0) {
  return Array.from({ length: 6 }, (_, i) => {
    const t = ((i * 60 + angle) * Math.PI) / 180;
    return `${i ? "L" : "M"}${f(cx + r * Math.cos(t))} ${f(cy + r * Math.sin(t))}`;
  }).join("") + "Z";
}

/** A faint outline of the body around the plate, so the bones read as someone's arm. */
export const BODY = [
  "M236 0 C 238 52, 232 92, 206 122 C 178 150, 166 200, 166 270 C 166 380, 178 480, 174 600 C 172 680, 170 740, 170 800",
  "M318 0 C 316 50, 322 92, 352 118 C 382 146, 398 200, 392 262 C 386 320, 376 380, 378 460 C 380 560, 392 680, 398 800",
];
