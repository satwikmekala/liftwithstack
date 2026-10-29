import type { CSSProperties } from "react";
import { GOLD, type BuildSlab } from "@/lib/stack/model";

/*
 * A Stack drawn small (features/circle/MiniStack.tsx): My Stack's isometric slab as vector, so a
 * room of towers costs no WebGL. The footprint is drawn 100 units wide under the app's camera;
 * D is half its on-screen depth and GAP the space between loose blocks.
 */
const VB = 140;
const D = 21.2;
const GAP = 1.45;
const PLINTH = "#3C3328";

/** The GL slab's face lighting: pigment a little richer, then each face lit in linear light. */
const FACES = { front: 0.88, key: 1.08, side: 0.66, top: 1.05, gold: 1.35 } as const;
const shaded = new Map<string, string>();
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
function hslToRgb(h: number, s: number, l: number) {
  const k = (n: number) => (n + h * 12) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}
function rgbToHsl(r: number, g: number, b: number) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
export function faceColor(hex: string, face: keyof typeof FACES) {
  const key = `${hex}:${face}`;
  const hit = shaded.get(key);
  if (hit) return hit;
  let rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  if (hex.toUpperCase() !== GOLD) {
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    rgb = hslToRgb(h, Math.min(1, s * 1.18), Math.min(0.72, l + 0.035));
  }
  const value = `#${rgb.map((c) => Math.round(Math.min(1, toSrgb(toLinear(c) * FACES[face])) * 255).toString(16).padStart(2, "0")).join("")}`;
  shaded.set(key, value);
  return value;
}

const floorOffset = (base: string) => (base === "shadow" ? 6 : base === "ledge" ? 22 : base === "none" ? 4 : 26);

/** Height over width a Stack needs at this unit: ground, every block, the top face and a little air. */
export function stackAspect(slabs: readonly BuildSlab[], unit: number, min = 0.42, inset = 0, base = "shadow") {
  const total = slabs.reduce((sum, slab) => sum + slab.height, 0);
  const needed = Math.max(min * VB, floorOffset(base) + 2 * D + 4 + total * unit + GAP * Math.max(0, slabs.length - 1));
  return needed / (VB + VB * inset * 2);
}

/** The app's Circle tower scale: a block's true height under My Stack's camera. */
export const TRUE_UNIT = 9.02;

/**
 * Height is truthful across a room: every tower uses the same `unit` (viewBox units per block
 * height), so one block reads as one block everywhere; only a tower taller than its frame is
 * compressed. `base`: `plinth` stands it on its own plinth, `ledge` on a floor the caller draws.
 */
export function MiniStack({ slabs, width = 140, height = 160, unit = 11, base = "plinth", inset = 0, variant = "stack", glow = false, quietHistory = false,
  flash = false, sweep = false, selected = null, className = "", style }: {
  slabs: readonly BuildSlab[];
  width?: number;
  height?: number;
  unit?: number;
  /** `shadow`: a soft contact shadow on the room's floor, as the Circle draws everyone. */
  base?: "plinth" | "ledge" | "shadow" | "none";
  /** Share of the width left as air on each side, so a gallery of towers doesn't crowd its columns. */
  inset?: number;
  /** `private`: an empty plinth, nothing shared. `invite`: a dashed outline waiting for someone. */
  variant?: "stack" | "private" | "invite";
  glow?: boolean;
  quietHistory?: boolean;
  /** Lights the newest block warm, as a nudge landing does; `sweep` runs the light up every block. */
  flash?: boolean;
  sweep?: boolean;
  selected?: string | null;
  className?: string;
  style?: CSSProperties;
}) {
  // Inset widens the viewBox around the same drawing, so blocks stay exactly in proportion.
  const pad = VB * inset;
  const vbHeight = (VB + pad * 2) * height / width;
  const floor = vbHeight - floorOffset(base);
  const stack = variant === "stack" ? slabs : [];
  const total = stack.reduce((sum, slab) => sum + slab.height, 0);
  const room = floor - (2 * D + 4) - GAP * Math.max(0, stack.length - 1);
  const scale = Math.min(unit, room / Math.max(1, total));
  const invite = variant === "invite";
  // Each slab's floor, bottom up.
  const bottoms = stack.reduce<number[]>((list, slab, index) => [...list, index === 0 ? floor : list[index - 1] - stack[index - 1].height * scale - GAP], []);
  return (
    <svg className={`mini-stack${flash ? " is-flashing" : ""}${sweep ? " is-sweeping" : ""} ${className}`} style={style}
      width={width} height={height} viewBox={`${-pad} 0 ${VB + pad * 2} ${vbHeight}`} aria-hidden="true" focusable="false">
      {glow && <>
        <defs>
          <radialGradient id="mini-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#5A3A22" stopOpacity="0.55" />
            <stop offset="1" stopColor="#5A3A22" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={70} cy={floor + 2} rx={70} ry={26} fill="url(#mini-pool)" />
      </>}
      {base === "shadow" && <>
        <defs>
          <radialGradient id="mini-contact" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#000" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#000" stopOpacity="0.22" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={70} cy={floor - D + 2} rx={stack.length ? 58 : 48} ry={D + 4} fill="url(#mini-contact)" />
      </>}
      {base === "plinth" && <g>
        <polygon points={`10,${floor} 70,${floor - 24} 130,${floor} 70,${floor + 24}`} fill={invite ? "transparent" : PLINTH}
          stroke={invite ? "#6F6558" : undefined} strokeDasharray={invite ? "4 4" : undefined} strokeWidth={invite ? 1.2 : 0} />
        {!invite && <>
          <polygon points={`10,${floor} 70,${floor + 24} 70,${floor + 27} 10,${floor + 3}`} fill="#2A231C" />
          <polygon points={`70,${floor + 24} 130,${floor} 130,${floor + 3} 70,${floor + 27}`} fill="#221C16" />
        </>}
      </g>}
      {invite && <g stroke="#A99F91" strokeWidth={1.4} strokeLinecap="round">
        <line x1={64} y1={floor} x2={76} y2={floor} />
        <line x1={70} y1={floor - 6} x2={70} y2={floor + 6} />
      </g>}
      {stack.map((slab, slabIndex) => {
        const h = slab.height * scale;
        const sum = slab.layers.reduce((value, layer) => value + layer.height, 0);
        const b = bottoms[slabIndex];
        const outline = `20,${b - D} 67,${b} 76,${b} 120,${b - D} 120,${b - h - D} 70,${b - h - 2 * D} 20,${b - h - D}`;
        let y = b;
        return (
          <g key={slab.id} className="mini-stack__slab" style={{ "--i": slabIndex } as CSSProperties}>
            {slab.layers.map((layer, index) => {
              const start = y;
              const end = y - (h * layer.height) / sum;
              y = end;
              return (
                <g key={index}>
                  <polygon points={`20,${start - D} 67,${start} 67,${end} 20,${end - D}`} fill={faceColor(layer.color, "front")} />
                  <polygon points={`67,${start} 76,${start} 76,${end} 67,${end}`} fill={faceColor(layer.color, "key")} />
                  <polygon points={`76,${start} 120,${start - D} 120,${end - D} 76,${end}`} fill={faceColor(layer.color, "side")} />
                  {layer.record && <polyline points={`20,${end - D + 0.4} 67,${end + 0.4} 76,${end + 0.4} 120,${end - D + 0.4}`}
                    fill="none" stroke={faceColor(GOLD, "gold")} strokeWidth={0.8} />}
                </g>
              );
            })}
            <polygon points={`20,${b - h - D} 70,${b - h - 2 * D} 120,${b - h - D} 76,${b - h} 67,${b - h}`}
              fill={faceColor(slab.layers[slab.layers.length - 1]?.color ?? "#51483A", "top")} />
            {quietHistory && slab.sealed && <polygon points={outline} fill="rgba(19,17,14,0.32)" />}
            {selected === slab.id && <polygon points={outline} fill="rgba(255,255,255,0.12)" stroke="rgba(245,240,232,0.55)" strokeWidth={0.8} />}
            {(flash || sweep) && (sweep || slabIndex === stack.length - 1) && (
              <polygon className="mini-stack__flash" points={outline} fill="#FFB36B" stroke="#FF7A3D" strokeWidth={2.2} strokeLinejoin="round" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
