function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[10px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function ExerciseProgressCard() {
  return (
    <div className="rounded-[18px] border border-white/[0.08] bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-[17px] font-extrabold">
          Bench Press
        </span>
        <span
          aria-hidden="true"
          className="size-[7px] rounded-full bg-accent"
        />
      </div>

      <div className="mt-[13px] flex items-center justify-between">
        <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-text-dim">
          LAST TIME
        </span>
        <span className="font-mono text-[13px] font-medium text-text-muted">
          60 kg × 8
        </span>
      </div>

      <div className="my-3 h-px bg-white/[0.07]" />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-accent">
          SUGGESTED NEXT
        </span>
        <span className="font-mono text-sm font-bold text-text">
          62.5 kg × 8
        </span>
      </div>

      <div className="mt-[11px] inline-flex items-center gap-1.5 rounded-full bg-surface-3 px-[11px] py-[5px] font-mono text-[10.5px] font-semibold tracking-[0.04em] text-text-muted">
        <EditIcon />
        Adjust anytime
      </div>
    </div>
  );
}

export default ExerciseProgressCard;
