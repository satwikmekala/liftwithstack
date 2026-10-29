import type { CSSProperties } from "react";

/**
 * One sarcomere, flat: Z-discs at either end, thin filaments reaching in from each, thick
 * filaments with their heads in the middle. `contraction` slides the thin filaments inward;
 * the thick filaments never change length, which is the whole point of the sliding filament
 * model. Used in the teaser, the lab, and wherever WebGL can't run.
 */
export function Sarcomere({ contraction = 0.3, glow = 0.6, width = 320, animate = false, className = "" }: {
  contraction?: number; glow?: number; width?: number; animate?: boolean; className?: string;
}) {
  const H = 120;
  const rest = 300;
  const length = rest * (1 - 0.22 * contraction);
  const left = (320 - length) / 2;
  const right = left + length;
  const thin = 112;
  const thick = 150;
  const rows = [28, 52, 76, 100];
  return (
    <svg className={`sarcomere${animate ? " is-animating" : ""} ${className}`} viewBox={`0 0 320 ${H}`} width={width} height={(width * H) / 320}
      style={{ "--glow": glow } as CSSProperties} aria-hidden="true" focusable="false">
      {/* Z-discs */}
      <rect className="sarcomere__z" x={left - 2} y={14} width={4} height={H - 28} rx={1} />
      <rect className="sarcomere__z" x={right - 2} y={14} width={4} height={H - 28} rx={1} />
      {/* Thin filaments (actin), from each Z-disc toward the middle */}
      {rows.map((y) => (
        <g key={y}>
          <rect className="sarcomere__thin" x={left} y={y - 1.5} width={thin} height={3} rx={1.5} />
          <rect className="sarcomere__thin" x={right - thin} y={y - 1.5} width={thin} height={3} rx={1.5} />
        </g>
      ))}
      {/* Thick filaments (myosin), fixed length, centred */}
      {[40, 64, 88].map((y, row) => (
        <g key={y} className="sarcomere__thick-row" style={{ "--row": row } as CSSProperties}>
          <rect className="sarcomere__thick" x={160 - thick / 2} y={y - 3} width={thick} height={6} rx={3} />
          {Array.from({ length: 10 }, (_, i) => {
            const x = 160 - thick / 2 + 10 + i * ((thick - 20) / 9);
            const up = i % 2 === 0 ? -1 : 1;
            return <circle key={i} className="sarcomere__head" cx={x} cy={y + up * 6.5} r={2.6} style={{ "--i": i } as CSSProperties} />;
          })}
        </g>
      ))}
    </svg>
  );
}
