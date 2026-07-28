import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

function BoltIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[14px]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M13 2 3 14h7l-1 8 11-13h-8z" />
    </svg>
  );
}

export function PillarAdapt() {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,32px)] py-[clamp(50px,7vw,80px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(32px,5vw,64px)]">
        <RevealOnScroll>
          <div className="mb-[18px] font-mono text-xs font-bold tracking-[0.1em] text-accent">
            03 — ADAPT TO THE WEEK YOU GOT
          </div>
          <h3 className="mb-4 font-display text-[clamp(27px,3.8vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Miss a workout. Don&apos;t restart your progress.
          </h3>
          <p className="m-0 max-w-[46ch] font-body text-[clamp(16px,1.8vw,18px)] font-normal leading-[1.6] text-text-muted">
            Stack doesn&apos;t punish you for a busy Wednesday. When you come
            back, it surfaces the session that keeps your training moving
            forward — relief and momentum, not guilt or streak pressure.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="flex justify-center">
          <PhoneFrame screenClassName="flex flex-col gap-[13px] px-5 pb-[22px] pt-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-text">
                2:38
              </span>
              <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-text-dim">
                FRI · BACK IN
              </span>
            </div>

            <div className="font-display text-[21px] font-extrabold tracking-[-0.01em]">
              Welcome back.
            </div>

            <div className="mt-0.5 font-mono text-[10px] font-medium tracking-[0.14em] text-text-dim">
              THIS WEEK
            </div>

            <div className="flex items-center gap-3 rounded-[14px] bg-surface-2 px-[15px] py-[13px]">
              <span className="w-8 font-mono text-[11px] font-bold text-text-dim">
                MON
              </span>
              <span className="font-body text-sm font-semibold text-text-muted">
                Push
              </span>
              <span className="ml-auto inline-flex size-5 items-center justify-center rounded-full bg-success text-xs font-extrabold text-bg">
                ✓
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-[14px] bg-surface-2 px-[15px] py-[13px] opacity-50">
              <span className="w-8 font-mono text-[11px] font-bold text-text-dim">
                WED
              </span>
              <span className="font-body text-sm font-semibold text-text-muted line-through decoration-text-dim">
                Missed
              </span>
              <span className="ml-auto size-[14px] rounded-full border-[1.5px] border-day" />
            </div>

            <div className="relative mt-0.5 overflow-hidden rounded-[20px] border border-accent/55 bg-warm-card px-4 py-[18px] shadow-warm-card">
              <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-accent">
                FRI · NEXT UP
              </div>
              <div className="mt-[7px] font-display text-[26px] font-extrabold tracking-[-0.01em]">
                Pull Day
              </div>
              <div className="mt-[5px] font-mono text-[11px] font-medium tracking-[0.06em] text-text-soft">
                KEEPS YOUR ROTATION BALANCED
              </div>
              <div
                aria-hidden="true"
                className="mt-[15px] flex w-full items-center justify-center gap-2 rounded-[13px] border-0 bg-accent p-[13px] font-display text-[15px] font-extrabold text-ink"
              >
                <BoltIcon />
                Start workout
              </div>
            </div>
          </PhoneFrame>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default PillarAdapt;
