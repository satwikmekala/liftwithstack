"use client";

import {
  howItWorksIntro,
  howItWorksSteps,
  type HowItWorksStep,
  type HowItWorksStepId,
} from "@/components/sections/how-it-works-data";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { StackProductDemo } from "@/components/ui/StackProductDemo";
import { useActiveStep } from "@/lib/use-active-step";

function StepCopy({ step }: { readonly step: HowItWorksStep }) {
  return (
    <>
      <div className="how-step__label">{step.label}</div>
      <h3 className="how-step__title">{step.title}</h3>
      <div className="how-step__body">
        {step.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </>
  );
}

function DesktopStep({
  step,
  isActive,
  registerRef,
}: {
  readonly step: HowItWorksStep;
  readonly isActive: boolean;
  readonly registerRef: (element: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerRef}
      className={`how-step${isActive ? " how-step--active" : ""}`}
    >
      <StepCopy step={step} />
    </div>
  );
}

export function HowItWorks() {
  const { activeId, registerStep } = useActiveStep<HowItWorksStepId>("today");

  return (
    <section id="how" className="how-section scroll-mt-20" aria-labelledby="how-heading">
      <div className="how-intro">
        <RevealOnScroll className="how-eyebrow">
          {howItWorksIntro.eyebrow}
        </RevealOnScroll>
        <RevealOnScroll delay={0.08}>
          <h2 id="how-heading" className="how-heading">
            {howItWorksIntro.headline.map((segment, index) => (
              <span
                key={index}
                className={segment.emphasis ? "text-accent" : undefined}
              >
                {segment.text}
              </span>
            ))}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.16}>
          <p className="how-paragraph">{howItWorksIntro.paragraph}</p>
        </RevealOnScroll>
      </div>

      <div className="how-layout hidden lg:grid">
        <div className="how-visual">
          <StackProductDemo state={activeId} />
        </div>
        <div className="how-steps">
          {howItWorksSteps.map((step) => (
            <DesktopStep
              key={step.id}
              step={step}
              isActive={activeId === step.id}
              registerRef={registerStep(step.id)}
            />
          ))}
        </div>
      </div>

      <div className="how-sequence lg:hidden">
        {howItWorksSteps.map((step) => (
          <div key={step.id} className="how-sequence__item">
            <RevealOnScroll>
              <StepCopy step={step} />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1} className="how-sequence__demo">
              <StackProductDemo state={step.id} />
            </RevealOnScroll>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
