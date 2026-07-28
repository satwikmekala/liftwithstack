import { heroCopy } from "@/components/sections/hero-data";
import { DecisionCloud } from "@/components/ui/DecisionCloud";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { StackPhone } from "@/components/ui/StackPhone";

function DownArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative md:min-h-[calc(100svh-84px)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[clamp(40px,6vw,64px)] px-[clamp(20px,5vw,32px)] pb-16 pt-[128px] md:grid-cols-[56%_44%] md:pb-20 md:pt-[148px]">
        <div>
          <RevealOnScroll className="mb-[26px] inline-flex items-center gap-[9px] font-mono text-[11px] font-medium tracking-[0.18em] text-text-muted">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent animate-breathe motion-reduce:animate-none"
            />
            {heroCopy.eyebrow}
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <h1 className="m-0 max-w-[21ch] font-display text-[clamp(36px,6.2vw,68px)] font-extrabold leading-[1.06] tracking-[-0.025em]">
              {heroCopy.headline.map((segment, index) => (
                <span
                  key={index}
                  className={segment.emphasis ? "text-accent" : undefined}
                >
                  {segment.text}
                </span>
              ))}
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.16}>
            <p className="mt-[26px] max-w-[46ch] font-body text-[clamp(16px,1.9vw,19px)] font-normal leading-[1.6] text-text-muted">
              {heroCopy.paragraph}
            </p>
          </RevealOnScroll>

          <RevealOnScroll
            delay={0.24}
            className="mt-9 flex flex-wrap items-center gap-[14px]"
          >
            <a
              href={heroCopy.primaryCta.href}
              className="rounded-[13px] bg-accent px-7 py-4 font-body text-base font-bold text-ink shadow-accent-button transition-colors hover:bg-accent-hover hover:text-ink"
            >
              {heroCopy.primaryCta.label}
            </a>
            <a
              href={heroCopy.secondaryCta.href}
              className="px-1.5 py-4 font-body text-[15px] font-semibold text-text transition-colors hover:text-accent-hover"
            >
              {heroCopy.secondaryCta.label}
            </a>
          </RevealOnScroll>
        </div>

        <DecisionCloud>
          <StackPhone />
        </DecisionCloud>
      </div>

      <div
        aria-hidden="true"
        className="mx-auto flex max-w-[1240px] flex-col items-center gap-3 px-[clamp(20px,5vw,32px)] pb-10 md:pb-14"
      >
        <div className="h-px w-full max-w-[220px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="text-text-dim animate-arrowdrift motion-reduce:animate-none">
          <DownArrowIcon />
        </div>
      </div>
    </section>
  );
}

export default Hero;
