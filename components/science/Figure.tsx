"use client";

import { useEffect, useRef, type RefObject } from "react";

/** The elbow, and where the bicep lens looks, in the figure's 1000-unit drawing. */
const ELBOW = { x: 470, y: 590 };
const FOREARM = 232;

export type FigureNodes = { forearm: SVGGElement | null; bicep: SVGPathElement | null; label: SVGTextElement | null };

/** Bends the arm: `curl` 0 hanging, 1 fully curled. The bicep shortens and bulges as it does. */
export function paintFigure({ forearm, bicep, label }: FigureNodes, curl: number) {
  // Hanging but not locked out, and never all the way into the shoulder.
  const angle = -8 - 124 * curl;
  forearm?.setAttribute("transform", `rotate(${angle.toFixed(2)} ${ELBOW.x} ${ELBOW.y})`);
  const bulge = 32 * curl;
  bicep?.setAttribute("d", `M490 368 C${(532 + bulge).toFixed(1)} 400 ${(544 + bulge).toFixed(1)} 500 498 ${(556 - 40 * curl).toFixed(1)} C470 ${(520 - 22 * curl).toFixed(1)} 464 430 490 368Z`);
  if (label) {
    const radians = (angle * Math.PI) / 180;
    label.setAttribute("x", (ELBOW.x - (FOREARM + 92) * Math.sin(radians)).toFixed(1));
    label.setAttribute("y", (ELBOW.y + (FOREARM + 92) * Math.cos(radians) + 10).toFixed(1));
  }
}

/** You, side on, curling 10 kg: the same plain mannequin the app's exercise art uses. */
export function FigureArt({ nodes, label = true }: { nodes: RefObject<FigureNodes>; label?: boolean }) {
  const set = (key: keyof FigureNodes) => (node: never) => { (nodes.current as Record<string, unknown>)[key] = node; };
  return (
    <g>
      <defs>
        <linearGradient id="fig-skin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8f867a" /><stop offset="0.55" stopColor="#d9d2c6" /><stop offset="1" stopColor="#efe9df" /></linearGradient>
        <linearGradient id="fig-torso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfc7ba" /><stop offset="0.6" stopColor="#a79e91" /><stop offset="1" stopColor="#a79e91" stopOpacity="0" /></linearGradient>
        <linearGradient id="fig-bicep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffa877" /><stop offset="1" stopColor="#ff7a3d" /></linearGradient>
      </defs>
      <path d="M372 302 Q440 270 522 306 Q552 430 522 570 L506 790 L376 790 L358 570 Q338 430 372 302Z" fill="url(#fig-torso)" />
      <line x1="440" y1="244" x2="440" y2="310" stroke="#bdb4a7" strokeWidth="58" strokeLinecap="round" />
      <ellipse cx="444" cy="184" rx="66" ry="80" fill="url(#fig-skin)" />
      <ellipse cx="452" cy="338" rx="58" ry="52" fill="#e4ddd2" />
      <line x1="454" y1="334" x2="470" y2="590" stroke="#d9d2c6" strokeWidth="82" strokeLinecap="round" />
      <path ref={set("bicep")} d="M490 368 C532 400 544 500 498 556 C470 520 464 430 490 368Z" fill="url(#fig-bicep)" />
      <g ref={set("forearm")}>
        <line x1={ELBOW.x} y1={ELBOW.y} x2={ELBOW.x} y2={ELBOW.y + FOREARM} stroke="#cfc7ba" strokeWidth="60" strokeLinecap="round" />
        <rect x={ELBOW.x - 92} y={ELBOW.y + FOREARM + 16} width="184" height="16" rx="6" fill="#6f6558" />
        <rect x={ELBOW.x - 112} y={ELBOW.y + FOREARM - 22} width="42" height="92" rx="10" fill="#3d3228" stroke="#6f6558" strokeWidth="3" />
        <rect x={ELBOW.x + 70} y={ELBOW.y + FOREARM - 22} width="42" height="92" rx="10" fill="#3d3228" stroke="#6f6558" strokeWidth="3" />
        <circle cx={ELBOW.x} cy={ELBOW.y + FOREARM + 22} r="33" fill="#e4ddd2" />
      </g>
      {label && <text ref={set("label")} className="j-text j-text--strong" textAnchor="middle">10 kg</text>}
    </g>
  );
}

/** The figure on its own, curling in a slow loop: the home-page teaser's door into the story. */
export function CurlingFigure() {
  const svg = useRef<SVGSVGElement>(null);
  const nodes = useRef<FigureNodes>({ forearm: null, bicep: null, label: null });
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    paintFigure(nodes.current, 0.55);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const tick = (now: number) => {
      paintFigure(nodes.current, 0.5 - 0.5 * Math.cos(now / 1000 * 1.9));
      frame = requestAnimationFrame(tick);
    };
    const view = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    view.observe(element);
    return () => { view.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <svg ref={svg} viewBox="180 80 640 760" aria-hidden="true" focusable="false"><FigureArt nodes={nodes} label={false} /></svg>;
}
