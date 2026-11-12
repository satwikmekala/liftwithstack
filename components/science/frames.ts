"use client";

import { CLASSIC_CURL } from "@/lib/science/story";

/**
 * The small anatomical arm beside the sarcomere in stop 3 is an image sequence: 28 WebP
 * frames of the curl, rendered from the Écorché model. Phones get the smaller set (`s/`).
 */
const BASE = "/science/";

class Sequence {
  private images: (HTMLImageElement | null)[] = [];
  private started = false;
  private listeners = new Set<() => void>();
  constructor(private paths: string[]) {}

  get length() { return this.paths.length; }

  /** Start fetching every frame: every fourth one first, so a rough version is ready fast. */
  load(widthCss: number) {
    if (this.started) return;
    this.started = true;
    const small = widthCss * Math.min(2, window.devicePixelRatio || 1) < 760;
    const order = [...this.paths.keys()].sort((a, b) => (a % 4 === 0 ? 0 : 1) - (b % 4 === 0 ? 0 : 1) || a - b);
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const index = order[next++];
      const image = new Image();
      image.decoding = "async";
      image.onload = () => { this.images[index] = image; this.listeners.forEach((fn) => fn()); pump(); };
      image.onerror = () => pump();
      const path = this.paths[index];
      image.src = BASE + (small ? path.replace(/^([a-z]+)\//, "$1/s/") : path);
    };
    for (let i = 0; i < 4; i++) pump();
  }

  onFrame(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  private nearest(index: number) {
    const { images } = this;
    if (images[index]) return images[index];
    for (let d = 1; d < 12; d++) {
      if (images[index - d]) return images[index - d];
      if (images[index + d]) return images[index + d];
    }
    return null;
  }

  /** Paint frame `f` (fractional frames cross-fade) to fill a canvas, cropping like object-fit: cover. */
  paint(canvas: HTMLCanvasElement, f: number, zoom = 1) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, w, h);
    const clamped = Math.min(this.paths.length - 1, Math.max(0, f));
    const a = Math.floor(clamped), t = clamped - a;
    const draw = (image: HTMLImageElement | null, alpha: number) => {
      if (!image || alpha <= 0) return;
      const side = Math.max(w, h) * zoom;
      ctx.globalAlpha = alpha;
      ctx.drawImage(image, (w - side) / 2, (h - side) / 2, side, side);
    };
    const first = this.nearest(a), second = t > 0.001 ? this.nearest(a + 1) : null;
    draw(first, 1);
    if (second && second !== first) draw(second, t);
    ctx.globalAlpha = 1;
  }
}

/** The anatomical arm beside the sarcomere in stop 3. */
export const classicCurl = new Sequence(CLASSIC_CURL);

