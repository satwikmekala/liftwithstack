/**
 * The opening figure, drawn on a canvas: the plate (bones, pivot, biceps) and, below it, one
 * continuous zoom through five nested levels. Every level is an original drawing in the same line
 * style. Level k+1 sits at the centre of level k at an eighth of its size, so the camera only ever
 * moves inward; `z` counts levels (0 = the whole plate, 5 = actin and myosin).
 */
import { BODY, BONES, ELBOW, hexagon, platePose, type Pt } from "./arm";

const STEP = 8;                       // each level is 8× smaller than the one before
const C = {
  bone: "#ece2d2", boneDim: "rgba(236,226,210,0.55)", line: "rgba(232,220,203,", bg: "#0d0d0d",
  muscle: "#b8401f", muscleLight: "#ff7a3d", fibre: "rgba(255,214,186,", sheath: "rgba(240,226,206,",
  actin: "#e8dccb", myosin: "#c4573a", head: "#ff7a3d",
};
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const rnd = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export type SceneState = { angle: number; z: number; dpr: number };

type Ctx = CanvasRenderingContext2D;

/** Plate units visible across the canvas at z = 0, and the point at the centre of the view. */
const PLATE_VIEW = { width: 640, center: [330, 476] as Pt };
const ZOOM_ANGLE = 104;               // the elbow angle held while the camera goes in

export function drawScene(ctx: Ctx, w: number, h: number, s: SceneState) {
  ctx.save();
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  const side = Math.min(w, h);
  if (s.z < 1) drawPlateAndFascicles(ctx, w, h, side, s);
  else drawDeep(ctx, w, h, side, s.z, s.dpr);
  ctx.restore();
}

/**
 * A magnifying glass: the next level appears inside a circle at the point being studied, then the
 * circle widens until it fills the view. `t` runs 0 → 1 over one level.
 */
const LENS = { start: 0.12, end: 0.94, mag: 3.2 };
function lensRadius(t: number, w: number, h: number, side: number) {
  const e = smooth(LENS.start, LENS.end, t);
  const full = Math.hypot(w, h) / 2 + 4;
  return Math.exp(Math.log(side * 0.15) * (1 - e) + Math.log(full) * e);
}
function lensMagnification(t: number) { return 1 + (LENS.mag - 1) * (1 - smooth(LENS.start, LENS.end, t)); }
function withLens(ctx: Ctx, x: number, y: number, r: number, w: number, h: number, dpr: number, inside: () => void) {
  const covering = r >= Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  if (!covering) {
    // Dim the world outside the glass a little, so the eye goes to it.
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(13,13,13,0.38)"; ctx.fill("evenodd"); ctx.restore();
  }
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = C.bg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  ctx.save(); inside(); ctx.restore();
  if (!covering) {
    // Curved glass: darker at the rim, a soft highlight near the top.
    const v = ctx.createRadialGradient(x, y, r * 0.55, x, y, r);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = v; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  ctx.restore();
  if (covering) return;
  ctx.save();
  ctx.lineWidth = 1.6 * dpr; ctx.strokeStyle = "rgba(240,230,216,0.75)";
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 6 * dpr; ctx.strokeStyle = "rgba(240,230,216,0.08)";
  ctx.beginPath(); ctx.arc(x, y, r + 4 * dpr, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 2 * dpr; ctx.lineCap = "round"; ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath(); ctx.arc(x, y, r * 0.86, Math.PI * 1.08, Math.PI * 1.36); ctx.stroke();
  ctx.restore();
}

/** z ∈ [0, 1): the plate; the camera turns toward the biceps and a lens opens on its belly. */
function drawPlateAndFascicles(ctx: Ctx, w: number, h: number, side: number, s: SceneState) {
  const e = smooth(0, 1, s.z);
  const angle = s.z > 0 ? ZOOM_ANGLE : s.angle;
  const pose = platePose(angle);
  const { center, angle: axis } = pose.belly;
  // The camera moves in on the biceps, but only so far: the lens does the rest.
  const width = Math.exp(Math.log(PLATE_VIEW.width) * (1 - e) + Math.log(170) * e);
  const cx = PLATE_VIEW.center[0] + (center[0] - PLATE_VIEW.center[0]) * smooth(0, 0.6, s.z);
  const cy = PLATE_VIEW.center[1] + (center[1] - PLATE_VIEW.center[1]) * smooth(0, 0.6, s.z);
  const rot = -axis * e;                                    // the muscle turns to lie flat as we go in
  const k = side / width;
  ctx.save();
  ctx.translate(w / 2, h / 2); ctx.rotate(rot); ctx.scale(k, k); ctx.translate(-cx, -cy);
  drawPlate(ctx, pose, k);
  ctx.restore();
  if (s.z <= LENS.start) return;
  // Where the belly is on screen.
  const ox = (center[0] - cx) * k, oy = (center[1] - cy) * k;
  const x = w / 2 + ox * Math.cos(rot) - oy * Math.sin(rot), y = h / 2 + ox * Math.sin(rot) + oy * Math.cos(rot);
  const r = lensRadius(s.z, w, h, side);
  const scale = (side / 1000) * Math.pow(STEP, s.z - 1) * lensMagnification(s.z);
  withLens(ctx, x, y, r, w, h, s.dpr, () => {
    ctx.translate(x, y); ctx.rotate(axis * (1 - e)); ctx.scale(scale, scale);
    drawFascicles(ctx, scale);
  });
}

/** z ∈ [1, 5]: one level fills the view and the next opens in a lens at its centre. */
function drawDeep(ctx: Ctx, w: number, h: number, side: number, z: number, dpr: number) {
  const draw = [drawFascicles, drawFibres, drawMyofibrils, drawSarcomere, drawFilaments];
  const level = Math.min(5, Math.floor(z)), t = z - level;
  const base = (side / 1000) * Math.pow(STEP, t);
  ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(base, base); draw[level - 1](ctx, base); ctx.restore();
  if (level >= 5 || t <= LENS.start) return;
  const r = lensRadius(t, w, h, side);
  const scale = (side / 1000) * Math.pow(STEP, t - 1) * lensMagnification(t);
  withLens(ctx, w / 2, h / 2, r, w, h, dpr, () => {
    ctx.translate(w / 2, h / 2); ctx.scale(scale, scale); draw[level](ctx, scale);
  });
}

// ── Level 0: the plate ───────────────────────────────────────────────
const paths = new Map<string, Path2D>();
const p2d = (d: string) => { let p = paths.get(d); if (!p) { p = new Path2D(d); paths.set(d, p); } return p; };

export function drawPlate(ctx: Ctx, pose: ReturnType<typeof platePose>, k: number, alpha = 1) {
  ctx.globalAlpha = alpha;
  const lw = 1 / k;                                         // one CSS-ish pixel at any zoom
  ctx.lineWidth = 1.4 * lw; ctx.strokeStyle = `${C.line}0.13)`;
  for (const d of BODY) ctx.stroke(p2d(d));
  ctx.setLineDash([2 * lw, 6 * lw]); ctx.strokeStyle = `${C.line}0.2)`; ctx.lineWidth = 1.2 * lw;
  ctx.stroke(p2d(pose.arc)); ctx.setLineDash([]);
  const bone = (d: string, a: number) => { ctx.globalAlpha = alpha * a; ctx.fillStyle = C.bone; ctx.fill(p2d(d)); };
  bone(BONES.clavicle, 0.5);
  bone(BONES.humerus, 0.9);
  ctx.save();
  const m = /rotate\(([-\d.]+) /.exec(pose.forearm);
  ctx.translate(ELBOW[0], ELBOW[1]); ctx.rotate(((m ? Number(m[1]) : 0) * Math.PI) / 180); ctx.translate(-ELBOW[0], -ELBOW[1]);
  bone(BONES.ulna, 0.7); bone(BONES.radius, 0.9);
  ctx.restore();
  ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.arc(ELBOW[0], ELBOW[1], 5, 0, Math.PI * 2); ctx.fillStyle = C.bg; ctx.fill();
  ctx.lineWidth = 1.5 * lw; ctx.strokeStyle = `${C.line}0.7)`; ctx.stroke();
  // Biceps: tendons, a soft glow that grows with tension, the belly, its fibres.
  ctx.strokeStyle = C.bone; ctx.lineWidth = 3; ctx.lineCap = "round";
  for (const d of pose.biceps.tendons) ctx.stroke(p2d(d));
  const belly = p2d(pose.biceps.outline);
  ctx.save(); ctx.shadowColor = `rgba(255,90,31,${0.25 + 0.5 * pose.tension})`; ctx.shadowBlur = (14 + 26 * pose.tension) * k;
  ctx.fillStyle = C.muscle; ctx.fill(belly); ctx.restore();
  const g = ctx.createLinearGradient(pose.belly.center[0] - 30, 0, pose.belly.center[0] + 30, 0);
  g.addColorStop(0, "#c94a24"); g.addColorStop(0.5, "#ff8048"); g.addColorStop(1, "#b83c1c");
  ctx.fillStyle = g; ctx.fill(belly);
  ctx.strokeStyle = `${C.fibre}${0.35 + 0.3 * pose.tension})`; ctx.lineWidth = 0.8 * Math.max(lw, 0.6);
  for (const d of pose.biceps.fibres) ctx.stroke(p2d(d));
  // The dumbbell, end-on.
  const [hx, hy] = pose.hand;
  ctx.fillStyle = "#0f0e0d"; ctx.strokeStyle = `${C.line}0.18)`; ctx.lineWidth = lw;
  const back = p2d(hexagon(hx + 6, hy - 5, 44)); ctx.fill(back); ctx.stroke(back);
  const face = p2d(hexagon(hx, hy, 44)); ctx.fillStyle = "#1b1917"; ctx.fill(face);
  ctx.strokeStyle = `${C.line}0.6)`; ctx.lineWidth = 1.4 * lw; ctx.stroke(face);
  ctx.fillStyle = `${C.line}0.85)`; ctx.font = `500 13px ui-monospace, "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("10 KG", hx, hy + 1);
  ctx.globalAlpha = 1;
}

// ── Level 1: fascicles inside the biceps ─────────────────────────────
function capsule(ctx: Ctx, x0: number, x1: number, y: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x0 + r, y - r); ctx.lineTo(x1 - r, y - r); ctx.arc(x1 - r, y, r, -Math.PI / 2, Math.PI / 2); ctx.lineTo(x0 + r, y + r); ctx.arc(x0 + r, y, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
}
function drawFascicles(ctx: Ctx, k: number) {
  const lw = 1 / k;
  // the biceps' own sheath, far above and below
  ctx.fillStyle = "#3f150b"; ctx.fillRect(-9000, -760, 18000, 1520);
  ctx.strokeStyle = `${C.sheath}0.5)`; ctx.lineWidth = 2.5 * lw;
  ctx.beginPath(); ctx.moveTo(-9000, -760); ctx.lineTo(9000, -760); ctx.moveTo(-9000, 760); ctx.lineTo(9000, 760); ctx.stroke();
  for (let row = -5; row <= 5; row++) {
    const y = row * 135 + (row ? (rnd(row) - 0.5) * 16 : 0), r = row ? 58 + rnd(row + 9) * 6 : 62.5;
    if (Math.abs(y) + r > 760) continue;
    for (let seg = -3; seg <= 3; seg++) {
      const x0 = seg * 2600 - 1300 + (row ? rnd(row * 7 + seg) * 300 : 0), x1 = x0 + 2400;
      if (!row && seg !== 0) continue;
      const a = row === 0 ? -6000 : x0, b = row === 0 ? 6000 : x1;
      capsule(ctx, a, b, y, r);
      const g = ctx.createLinearGradient(0, y - r, 0, y + r);
      g.addColorStop(0, "#9e351b"); g.addColorStop(0.42, "#dc6438"); g.addColorStop(1, "#6e2210");
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = `${C.sheath}0.55)`; ctx.lineWidth = 1.4 * lw; ctx.stroke();
      // fibre grain
      ctx.strokeStyle = `${C.fibre}0.28)`; ctx.lineWidth = 0.8 * lw;
      ctx.beginPath();
      for (let i = 1; i < 7; i++) { const yy = y - r + (2 * r * i) / 7; ctx.moveTo(a + r, yy); ctx.lineTo(b - r, yy); }
      ctx.stroke();
    }
  }
}

// ── Level 2: muscle fibres inside one fascicle ───────────────────────
function drawFibres(ctx: Ctx, k: number) {
  const lw = 1 / k;
  ctx.fillStyle = "#3a130a"; ctx.fillRect(-9000, -500, 18000, 1000);
  ctx.strokeStyle = `${C.sheath}0.6)`; ctx.lineWidth = 3 * lw;
  ctx.beginPath(); ctx.moveTo(-9000, -500); ctx.lineTo(9000, -500); ctx.moveTo(-9000, 500); ctx.lineTo(9000, 500); ctx.stroke();
  for (let row = -3; row <= 3; row++) {
    const y = row * 132, r = row ? 60 : 62.5;
    if (Math.abs(y) + r > 500) continue;
    capsule(ctx, -7000, 7000, y, r);
    const g = ctx.createLinearGradient(0, y - r, 0, y + r);
    g.addColorStop(0, "#a63c1f"); g.addColorStop(0.4, "#e8784c"); g.addColorStop(1, "#6a200f");
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = `${C.sheath}0.45)`; ctx.lineWidth = 1.2 * lw; ctx.stroke();
    // cross-striations, only once they're wide enough to see
    const period = 12.5;
    if (period * k > 3) {
      ctx.strokeStyle = `rgba(90,24,12,${Math.min(0.45, (period * k - 3) / 10)})`; ctx.lineWidth = 0.45 * period;
      ctx.beginPath();
      const span = 1000 / k;
      for (let x = Math.floor(-span / period) * period; x < span; x += period) { ctx.moveTo(x, y - r * 0.92); ctx.lineTo(x, y + r * 0.92); }
      ctx.stroke();
    }
    // nuclei sit just under the membrane
    if (row !== 0 || true) {
      ctx.fillStyle = "rgba(244,214,180,0.85)";
      for (let i = -12; i <= 12; i++) {
        const x = i * 420 + rnd(i * 3 + row) * 200, top = rnd(i + row * 5) > 0.5 ? -1 : 1;
        ctx.beginPath(); ctx.ellipse(x, y + top * (r - 9), 26, 7, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}

// ── Level 3: myofibrils inside one fibre ─────────────────────────────
const SARC3 = 100;                                          // one sarcomere, in level-3 units
function bands(ctx: Ctx, y: number, r: number, period: number, k: number, x0: number, x1: number, shift = 0) {
  // A band dark, I band light, Z line darkest: the striped pattern of skeletal muscle.
  ctx.save(); capsule(ctx, x0, x1, y, r); ctx.clip();
  ctx.fillStyle = "#e9a588"; ctx.fillRect(x0, y - r, x1 - x0, 2 * r);
  const start = Math.floor((x0 - shift) / period) * period + shift;
  for (let x = start; x < x1; x += period) {
    ctx.fillStyle = "#a8432a"; ctx.fillRect(x + period * 0.2, y - r, period * 0.6, 2 * r);
    ctx.fillStyle = "rgba(255,190,160,0.55)"; ctx.fillRect(x + period * 0.46, y - r, period * 0.08, 2 * r);   // H zone
    ctx.fillStyle = "#6f2010"; ctx.fillRect(x - period * 0.015, y - r, period * 0.03, 2 * r);                 // Z line
  }
  const g = ctx.createLinearGradient(0, y - r, 0, y + r);
  g.addColorStop(0, "rgba(0,0,0,0.25)"); g.addColorStop(0.4, "rgba(255,255,255,0.08)"); g.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = g; ctx.fillRect(x0, y - r, x1 - x0, 2 * r);
  ctx.restore();
  ctx.strokeStyle = `${C.sheath}0.35)`; ctx.lineWidth = 1 / k; capsule(ctx, x0, x1, y, r); ctx.stroke();
}
function drawMyofibrils(ctx: Ctx, k: number) {
  ctx.fillStyle = "#33110a"; ctx.fillRect(-9000, -500, 18000, 1000);
  for (let row = -3; row <= 3; row++) {
    const y = row * 131, r = row ? 58 : 62.5;
    bands(ctx, y, r, SARC3, k, -9000, 9000, row ? rnd(row) * 30 - 15 : 18.75);
  }
  ctx.strokeStyle = `${C.sheath}0.55)`; ctx.lineWidth = 3 / k;
  ctx.beginPath(); ctx.moveTo(-9000, -500); ctx.lineTo(9000, -500); ctx.moveTo(-9000, 500); ctx.lineTo(9000, 500); ctx.stroke();
}

// ── Level 4: one sarcomere, Z-disc to Z-disc ─────────────────────────
// Level 4 shows one myofibril (1000 tall). Its sarcomere runs from Z at −650 to Z at +150, so the
// zone where actin and myosin overlap sits at the centre, where level 5 waits.
const Z4 = [-650, 150, 950, -1450];
function drawSarcomere(ctx: Ctx, k: number) {
  const lw = 1 / k;
  ctx.fillStyle = "#3a120a"; ctx.fillRect(-9000, -500, 18000, 1000);
  const L = 800, thickHalf = 270, thinLen = 330;
  for (let sIdx = -3; sIdx <= 3; sIdx++) {
    const zl = -650 + sIdx * L, mid = zl + L / 2;
    // thin filaments from each Z-disc
    ctx.strokeStyle = C.actin; ctx.lineWidth = 7;
    ctx.beginPath();
    for (let y = -437.5; y <= 437.5; y += 125) { ctx.moveTo(zl, y); ctx.lineTo(zl + thinLen, y); ctx.moveTo(zl + L, y); ctx.lineTo(zl + L - thinLen, y); }
    ctx.stroke();
    // thick filaments in the middle, with heads
    for (let y = -375; y <= 375; y += 125) {
      ctx.fillStyle = C.myosin; capsule(ctx, mid - thickHalf, mid + thickHalf, y, 12); ctx.fill();
      ctx.strokeStyle = C.head; ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.beginPath();
      for (let x = mid - thickHalf + 14; x < mid + thickHalf - 10; x += 22) {
        if (Math.abs(x - mid) < 40) continue;
        const s = x < mid ? -1 : 1;
        ctx.moveTo(x, y - 10); ctx.lineTo(x + s * 14, y - 30); ctx.moveTo(x, y + 10); ctx.lineTo(x + s * 14, y + 30);
      }
      ctx.stroke();
    }
    // Z-disc
    ctx.strokeStyle = C.bone; ctx.lineWidth = 10; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(zl, -500);
    for (let y = -500, i = 0; y <= 500; y += 62.5, i++) ctx.lineTo(zl + (i % 2 ? 14 : -14), y);
    ctx.stroke();
  }
  ctx.strokeStyle = `${C.sheath}0.55)`; ctx.lineWidth = 3 * lw;
  ctx.beginPath(); ctx.moveTo(-9000, -500); ctx.lineTo(9000, -500); ctx.moveTo(-9000, 500); ctx.lineTo(9000, 500); ctx.stroke();
  void Z4;
}

// ── Level 5: actin and myosin, where they overlap ────────────────────
function drawFilaments(ctx: Ctx, k: number) {
  void k;
  ctx.scale(0.62, 0.62);              // step back a little: the heads read better with more of them in view
  ctx.fillStyle = "#2a0e08"; ctx.fillRect(-9000, -1200, 18000, 2400);
  // Two actin filaments, above and below one myosin filament: beads in a twisted double strand.
  for (const y of [-500, 500]) {
    for (let i = -60; i <= 60; i++) {
      const x = i * 46;
      for (const strand of [0, 1]) {
        const phase = i * 0.42 + strand * Math.PI;
        const yy = y + Math.sin(phase) * 22, depth = Math.cos(phase);
        ctx.beginPath(); ctx.arc(x + strand * 23, yy, 27 + depth * 3, 0, Math.PI * 2);
        ctx.fillStyle = depth > 0 ? C.actin : "#bfb2a0"; ctx.fill();
        ctx.strokeStyle = "#2a0e08"; ctx.lineWidth = 3; ctx.stroke();
      }
    }
  }
  // Myosin: the thick filament's body, heads reaching toward both actin filaments.
  ctx.fillStyle = C.myosin; capsule(ctx, -9000, 9000, 0, 90); ctx.fill();
  for (let i = -40; i <= 40; i++) {
    const x = i * 150 + 20;
    for (const side of [-1, 1]) {
      const bound = (i + (side > 0 ? 1 : 0)) % 3 === 0;
      const tilt = bound ? -0.35 : 0.5;                  // bound heads lean toward the middle of the sarcomere
      const bx = x, by = side * 80;
      const len = bound ? 330 : 250;
      const tx = bx + Math.sin(tilt) * len, ty = by + side * Math.cos(tilt) * len;
      ctx.strokeStyle = "#d3633f"; ctx.lineWidth = 22; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(Math.atan2(ty - by, tx - bx));
      ctx.beginPath(); ctx.ellipse(30, 0, 64, 38, 0, 0, Math.PI * 2);
      ctx.fillStyle = bound ? C.head : "#e86a3f"; ctx.fill();
      ctx.restore();
    }
  }
}
