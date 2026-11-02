"use client";

import { framePaths } from "@/lib/science/story";

/**
 * The rendered figures on /science are image sequences, not live 3D: the browser only ever
 * loads small WebP frames. Two sizes exist; phones get the smaller one.
 */
const BASE = "/science/";

type Store = { paths: string[]; images: (HTMLImageElement | null)[]; small: boolean; started: boolean; listeners: Set<() => void> };
let store: Store | null = null;

function get() {
  if (!store) store = { paths: framePaths(), images: [], small: false, started: false, listeners: new Set() };
  return store;
}

/** Start fetching every frame: every fourth one first, so a rough version is ready fast. */
export function loadFrames(widthCss: number) {
  const s = get();
  if (s.started) return;
  s.started = true;
  s.small = widthCss * Math.min(2, window.devicePixelRatio || 1) < 760;
  const order = [...s.paths.keys()].sort((a, b) => (a % 4 === 0 ? 0 : 1) - (b % 4 === 0 ? 0 : 1) || a - b);
  let next = 0;
  const pump = () => {
    if (next >= order.length) return;
    const index = order[next++];
    const image = new Image();
    image.decoding = "async";
    image.onload = () => { s.images[index] = image; s.listeners.forEach((fn) => fn()); pump(); };
    image.onerror = () => pump();
    const path = s.paths[index];
    image.src = BASE + (s.small ? path.replace(/^(arm|zoom)\//, "$1/s/") : path);
  };
  for (let i = 0; i < 4; i++) pump();
}

export function onFrame(fn: () => void) {
  const s = get();
  s.listeners.add(fn);
  return () => { s.listeners.delete(fn); };
}

function nearest(index: number) {
  const { images } = get();
  if (images[index]) return images[index];
  for (let d = 1; d < 12; d++) {
    if (images[index - d]) return images[index - d];
    if (images[index + d]) return images[index + d];
  }
  return null;
}

/** Paint frame `f` (fractional frames cross-fade) to fill a canvas, cropping like object-fit: cover. */
export function paint(canvas: HTMLCanvasElement, f: number, zoom = 1) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, w, h);
  const total = get().paths.length;
  const clamped = Math.min(total - 1, Math.max(0, f));
  const a = Math.floor(clamped), t = clamped - a;
  const draw = (image: HTMLImageElement | null, alpha: number) => {
    if (!image || alpha <= 0) return;
    const side = Math.max(w, h) * zoom;
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, (w - side) / 2, (h - side) / 2, side, side);
  };
  const first = nearest(a), second = t > 0.001 ? nearest(a + 1) : null;
  draw(first, 1);
  if (second && second !== first) draw(second, t);
  ctx.globalAlpha = 1;
}

export const frameUrl = (path: string) => BASE + path;
