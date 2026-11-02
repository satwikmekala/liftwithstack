import type { ReactNode } from "react";

/** Optional depth, closed by default: the story reads without it. */
export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="note">
      <summary><span className="note__mark mono">MORE</span>{title}</summary>
      <div className="note__body">{children}</div>
    </details>
  );
}
