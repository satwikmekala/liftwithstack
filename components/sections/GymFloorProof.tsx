import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const gymFloorBenefits = [
  "Arm's-length legible",
  "One-tap logging",
  "Auto rest timer",
  "Works offline",
] as const;

function Stepper({
  label,
  value,
  unit,
  accent = false,
}: {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-[15px] border border-white/[0.08] bg-surface-2 px-1.5 py-3 min-[380px]:px-2">
      <div className="mb-2 text-center font-mono text-[9px] font-medium tracking-[0.12em] text-text-dim">
        {label}
      </div>
      <div className="flex items-center justify-between gap-0.5">
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center rounded-[7px] bg-surface-3 text-base leading-none text-text-muted min-[380px]:size-[26px] min-[380px]:rounded-[9px] min-[380px]:text-lg"
        >
          −
        </span>
        <span
          className={`font-display text-[24px] font-bold leading-none min-[380px]:text-[28px] ${
            accent ? "text-accent" : "text-text"
          }`}
        >
          {value}
        </span>
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center rounded-[7px] bg-surface-3 text-sm leading-none text-text-muted min-[380px]:size-[26px] min-[380px]:rounded-[9px] min-[380px]:text-base"
        >
          +
        </span>
      </div>
      <div className="mt-1.5 text-center font-mono text-[10px] font-medium text-text-dim">
        {unit}
      </div>
    </div>
  );
}

function WorkoutPhone() {
  return (
    <PhoneFrame screenClassName="flex flex-col gap-[15px] px-5 pb-[22px] pt-6">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-[9px] font-mono text-[11px] font-bold tracking-[0.14em] text-text-muted">
          <span className="size-2 rounded-full bg-accent" />
          CHEST DAY
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 font-body text-xs font-medium text-text-muted">
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 2l4 4-4 4" />
            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
            <path d="M7 22l-4-4 4-4" />
            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
          </svg>
          Change
        </span>
      </div>

      <div className="font-display text-[32px] font-extrabold tracking-[-0.01em] text-text">
        Bench Press
      </div>

      <div className="flex gap-1.5" aria-hidden="true">
        <span className="h-[5px] flex-1 rounded-[3px] bg-accent" />
        <span className="h-[5px] flex-1 rounded-[3px] bg-surface-3" />
        <span className="h-[5px] flex-1 rounded-[3px] bg-surface-3" />
        <span className="h-[5px] flex-1 rounded-[3px] bg-surface-3" />
      </div>

      <div className="mt-1 rounded-[22px] border-[1.5px] border-dashed border-accent/50 px-4 py-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-display text-xl font-extrabold text-text">
            Set 1
          </span>
          <span className="rounded-full border border-accent/50 px-2.5 py-[5px] font-mono text-[9.5px] font-bold tracking-[0.14em] text-accent">
            RECOMMENDED
          </span>
        </div>

        <div className="flex gap-1.5 min-[380px]:gap-2.5">
          <Stepper label="WEIGHT" value="40" unit="kg" accent />
          <Stepper label="REPS" value="8" unit="reps" />
        </div>

        <div className="mt-3.5 flex gap-2.5">
          <div
            aria-hidden="true"
            className="flex-[1.6] rounded-[13px] bg-accent p-[13px] text-center font-display text-[15px] font-extrabold text-bg"
          >
            ✓ Log
          </div>
          <div
            aria-hidden="true"
            className="flex-1 rounded-[13px] border-[1.5px] border-dashed border-white/[0.16] bg-transparent p-[13px] text-center font-body text-sm font-bold text-text-muted"
          >
            Skip
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[11px] rounded-[14px] bg-surface-2 px-[15px] py-3">
        <span className="relative size-6 flex-none" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border-2 border-accent" />
          <span className="absolute inset-0 animate-restpulse rounded-full bg-accent motion-reduce:animate-none motion-reduce:opacity-0" />
        </span>
        <span className="font-body text-xs font-medium text-text-muted">
          Rest — <span className="font-mono text-text">1:30</span>
        </span>
        <span className="ml-auto font-mono text-[11px] font-semibold tracking-[0.08em] text-text-dim">
          UP NEXT · INCLINE DB ›
        </span>
      </div>
    </PhoneFrame>
  );
}

export function GymFloorProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,32px)] pb-[clamp(60px,8vw,90px)] pt-[clamp(40px,6vw,60px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(32px,5vw,64px)]">
        <RevealOnScroll
          delay={0.08}
          className="order-2 flex justify-center"
        >
          <WorkoutPhone />
        </RevealOnScroll>

        <RevealOnScroll className="order-1">
          <div className="mb-[18px] font-mono text-xs font-bold tracking-[0.1em] text-accent">
            BUILT FOR THE MOMENT BETWEEN SETS
          </div>
          <h2 className="mb-4 font-display text-[clamp(28px,4vw,50px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-text">
            Made for the gym, not a spreadsheet.
          </h2>
          <p className="mb-[26px] max-w-[46ch] font-body text-[clamp(16px,1.9vw,19px)] leading-[1.6] text-text-muted">
            Big targets. Fast logging. Rest when you need it. Edit anything in
            a tap. Your training is ready even when the signal is not.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {gymFloorBenefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full border border-white/[0.08] bg-surface-2 px-[15px] py-[9px] font-body text-[13px] font-semibold text-text-muted"
              >
                {benefit}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default GymFloorProof;
