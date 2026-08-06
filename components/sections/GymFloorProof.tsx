import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WorkoutExerciseFlow } from "@/components/ui/WorkoutExerciseFlow";

const gymFloorBenefits = [
  "Arm's-length legible",
  "One-tap logging",
  "Auto rest timer",
  "Works offline",
] as const;

function WorkoutPhone() {
  return (
    <PhoneFrame className="w-[min(340px,90vw)]" screenClassName="px-[15px] pb-[22px] pt-[18px]">
      <div className="stack-session-status">
        <strong>2:38</strong><span>▮▮▮&nbsp; ᯤ&nbsp; 87</span>
      </div>
      <WorkoutExerciseFlow compact interactive />
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
