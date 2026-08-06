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
  activateStep,
  registerRef,
}: {
  readonly step: HowItWorksStep;
  readonly isActive: boolean;
  readonly activateStep: () => void;
  readonly registerRef: (element: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerRef}
      className={`how-step${isActive ? " how-step--active" : ""}`}
    >
      <button
        type="button"
        className="how-step__button"
        aria-pressed={isActive}
        onClick={activateStep}
      >
        <StepCopy step={step} />
        <span className="how-step__action" aria-hidden="true">
          View in Stack <span>↗</span>
        </span>
      </button>
    </div>
  );
}

export function HowItWorks() {
  const { activeId, activateStep, registerStep } =
    useActiveStep<HowItWorksStepId>("today");

  return (
    <section id="how-it-works" className="how-section scroll-mt-20" aria-labelledby="how-heading">
      <div className="how-intro">
        <div>
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
        </div>
        <RevealOnScroll delay={0.16}>
          <p className="how-paragraph">{howItWorksIntro.paragraph}</p>
        </RevealOnScroll>
      </div>

      <div className="how-layout">
        <div className="how-visual" aria-label="Stack product preview">
          <div className="how-visual__glow" aria-hidden="true" />
          <StackProductDemo state={activeId} />
        </div>
        <div className="how-steps">
          {howItWorksSteps.map((step) => (
            <DesktopStep
              key={step.id}
              step={step}
              isActive={activeId === step.id}
              activateStep={() => activateStep(step.id)}
              registerRef={registerStep(step.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
