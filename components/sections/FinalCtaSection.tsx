"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

function FinalWorkoutVisual() {
  const reducedMotion = useReducedMotion();
  const layers = ["Upper Body", "Full Body A", "Lower Body"];
  return (
    <motion.div aria-hidden="true" initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.2, 0.7, 0.2, 1] }} className="relative flex justify-center">
      <div aria-hidden="true" className="absolute top-1/2 size-[300px] -translate-y-1/2 rounded-full bg-phone-glow blur-[30px]" />
      <PhoneFrame showHardware className="relative z-10 w-[min(326px,78vw)] rounded-[46px] p-[9px]" screenClassName="flex aspect-[9/19.4] flex-col px-5 pb-5 pt-10">
        <div aria-hidden="true" className="absolute left-1/2 top-[10px] h-[22px] w-[82px] -translate-x-1/2 rounded-full bg-black" />
        <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-text-dim">GOOD MORNING</p>
        <div className="relative mt-7 flex-1">
          {layers.map((name, index) => <div key={name} aria-hidden="true" className="absolute inset-x-2 rounded-[18px] border border-white/[0.06] bg-surface-2 px-4 py-3 opacity-60" style={{ top: `${index * 14}px`, transform: `scale(${1 - index * 0.035})` }}><span className="font-display text-sm font-bold text-text-muted">{name}</span></div>)}
          <div className="relative mt-[42px] rounded-[22px] border border-accent/55 bg-warm-card px-[17px] pb-[18px] pt-5 shadow-warm-card">
            <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-accent">TODAY</p>
            <h3 className="mt-2 font-display text-[27px] font-extrabold tracking-[-0.025em] text-text">Full Body B</h3>
            <p className="mt-1 font-mono text-[10px] font-medium tracking-[0.06em] text-text-soft">6 EXERCISES · 45 MIN</p>
          </div>
        </div>
        <div aria-hidden="true" className="flex items-center justify-center rounded-[14px] bg-accent px-4 py-[15px] font-display text-[15px] font-extrabold text-ink">Start workout</div>
        <div aria-hidden="true" className="mx-auto mt-3 h-1 w-24 rounded-full bg-text/75" />
      </PhoneFrame>
    </motion.div>
  );
}

export function FinalCtaSection() {
  return (
    <section id="download" className="scroll-mt-24 bg-bg px-[clamp(20px,5vw,40px)] py-[clamp(64px,9vw,112px)]" aria-labelledby="download-heading">
      <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(48px,8vw,110px)] overflow-hidden rounded-[30px] border border-white/[0.08] bg-surface px-[clamp(24px,5vw,70px)] py-[clamp(52px,7vw,88px)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,.7fr)]">
        <RevealOnScroll>
          <p className="font-mono text-[11px] font-bold tracking-[0.19em] text-text-dim">READY WHEN YOU ARE</p>
          <h2 id="download-heading" className="mt-5 max-w-[12ch] text-balance font-display text-[clamp(42px,5.5vw,72px)] font-extrabold leading-[1] tracking-[-0.055em] text-text">Show up. Stack will have the workout ready.</h2>
          <p className="mt-6 max-w-[44ch] text-pretty font-body text-[clamp(16px,1.8vw,19px)] leading-[1.6] text-text-muted">Every workout remembered. Every week adjusted. Every session building on the last.</p>
          <div className="mt-9">
            <button type="button" disabled title="Launch updates are not available yet" className="min-h-11 cursor-not-allowed rounded-[12px] bg-accent px-6 py-3 font-body text-[15px] font-bold text-ink opacity-65">Get launch updates</button>
            <p className="mt-4 font-body text-sm text-text-muted">Strength training for busy people.</p>
          </div>
        </RevealOnScroll>
        <FinalWorkoutVisual />
      </div>
    </section>
  );
}

export default FinalCtaSection;
