import { BODY, BONES, ELBOW, hexagon, platePose } from "@/lib/science/arm";

/**
 * The arm as a scientific plate, in SVG: the same drawing the opening paints on its canvas,
 * for places that need it without scripts (the home teaser, the no-script fallback).
 */
export function Plate({ angle = 100, className = "", label }: { angle?: number; className?: string; label?: string }) {
  const p = platePose(angle);
  const [hx, hy] = p.hand;
  const id = `plate-${Math.round(angle)}`;
  return (
    <svg className={className} viewBox="50 160 560 560" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={`${id}-belly`} x1="0" x2="1"><stop offset="0" stopColor="#c94a24" /><stop offset="0.5" stopColor="#ff8048" /><stop offset="1" stopColor="#b83c1c" /></linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={8 + 14 * p.tension} /></filter>
      </defs>
      {BODY.map((d) => <path key={d} d={d} fill="none" stroke="rgba(232,220,203,0.13)" strokeWidth={1.4} />)}
      <path d={p.arc} fill="none" stroke="rgba(232,220,203,0.2)" strokeWidth={1.2} strokeDasharray="2 6" />
      <path d={BONES.clavicle} fill="#ece2d2" opacity={0.5} />
      <path d={BONES.humerus} fill="#ece2d2" opacity={0.9} />
      <g transform={p.forearm}>
        <path d={BONES.ulna} fill="#ece2d2" opacity={0.7} />
        <path d={BONES.radius} fill="#ece2d2" opacity={0.9} />
      </g>
      <circle cx={ELBOW[0]} cy={ELBOW[1]} r={5} fill="#0d0d0d" stroke="rgba(232,220,203,0.7)" strokeWidth={1.5} />
      {p.biceps.tendons.map((d) => <path key={d} d={d} fill="none" stroke="#ece2d2" strokeWidth={3} strokeLinecap="round" />)}
      <path d={p.biceps.outline} fill="#ff5a1f" opacity={0.25 + 0.4 * p.tension} filter={`url(#${id}-glow)`} />
      <path d={p.biceps.outline} fill={`url(#${id}-belly)`} />
      {p.biceps.fibres.map((d) => <path key={d} d={d} fill="none" stroke={`rgba(255,214,186,${0.35 + 0.3 * p.tension})`} strokeWidth={0.8} />)}
      <path d={hexagon(hx + 6, hy - 5, 44)} fill="#0f0e0d" stroke="rgba(232,220,203,0.18)" />
      <path d={hexagon(hx, hy, 44)} fill="#1b1917" stroke="rgba(232,220,203,0.6)" strokeWidth={1.4} />
      <text x={hx} y={hy + 5} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={13} letterSpacing={2} fill="rgba(232,220,203,0.85)">10 KG</text>
    </svg>
  );
}
