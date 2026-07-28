"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function PillarProgress() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    amount: 0.4,
    once: true,
  });
  const prefersReducedMotion = useReducedMotion();
  const [hasProgressed, setHasProgressed] = useState(false);
  const showEndState = prefersReducedMotion === true || hasProgressed;
  const showArrow = prefersReducedMotion === true || isInView;

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      return;
    }

    const progressionTimer = window.setTimeout(() => {
      setHasProgressed(true);
    }, 620);

    return () => window.clearTimeout(progressionTimer);
  }, [isInView, prefersReducedMotion]);

  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,32px)] py-[clamp(50px,7vw,80px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(32px,5vw,64px)]">
        <RevealOnScroll
          delay={0.08}
          className="order-2 rounded-[26px] border border-white/[0.08] bg-surface p-[clamp(24px,3.4vw,34px)]"
        >
          <div ref={cardRef} data-progress>
            <div className="mb-[22px] flex items-center justify-between">
              <span className="font-mono text-xs font-bold tracking-[0.14em] text-accent">
                BENCH PRESS
              </span>
              <span
                aria-hidden="true"
                className="h-[9px] w-[9px] rounded-full bg-accent"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between rounded-[14px] border border-white/[0.06] bg-surface-2 px-4 py-3.5">
                <span className="font-mono text-xs font-bold text-text-dim">
                  MON
                </span>
                <span className="font-mono text-base font-medium text-text-muted">
                  60 kg × 7
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[14px] border border-white/[0.06] bg-surface-2 px-4 py-3.5">
                <span className="font-mono text-xs font-bold text-text-dim">
                  THU
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-base font-medium text-text">
                  60 kg × 8
                  <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-success font-body text-[11px] font-extrabold text-bg">
                    ✓
                  </span>
                </span>
              </div>

              <div className="flex justify-center py-0.5 text-accent">
                <motion.svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showArrow ? 1 : 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.5,
                    delay:
                      showArrow && !prefersReducedMotion
                        ? 0.3
                        : 0,
                  }}
                >
                  <path d="M12 19V5" />
                  <path d="m6 11 6-6 6 6" />
                </motion.svg>
              </div>

              <motion.div
                data-progress-next
                animate={
                  showEndState && !prefersReducedMotion
                    ? {
                        y: [0, -4, 0],
                      }
                    : {
                        y: 0,
                      }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.55,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
                className="flex items-center justify-between rounded-2xl border border-accent/50 bg-reroute px-4 py-4 shadow-accent-card"
              >
                <span className="font-mono text-xs font-bold tracking-[0.06em] text-accent">
                  NEXT
                </span>
                <span className="inline-flex items-baseline gap-[9px]">
                  <span className="inline-flex items-baseline font-mono text-xl font-medium text-text">
                    <span className="inline-grid min-w-[4ch] [perspective:200px]">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          key={showEndState ? "62.5" : "60"}
                          initial={
                            prefersReducedMotion
                              ? false
                              : {
                                  opacity: 0,
                                  rotateX: -65,
                                  y: 8,
                                }
                          }
                          animate={{
                            opacity: 1,
                            rotateX: 0,
                            y: 0,
                          }}
                          exit={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  opacity: 0,
                                  rotateX: 65,
                                  y: -8,
                                }
                          }
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.22,
                          }}
                          className="col-start-1 row-start-1 inline-block origin-center text-right"
                        >
                          {showEndState ? "62.5" : "60"}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span>&nbsp;kg × 8</span>
                  </span>
                  <motion.span
                    data-step-badge
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: showEndState ? 1 : 0,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                    }}
                    className="font-mono text-[11px] font-bold text-success"
                  >
                    +2.5
                  </motion.span>
                </span>
              </motion.div>
            </div>

            <div className="mt-[18px] inline-flex items-center gap-[7px] rounded-full bg-surface-3 px-[13px] py-[7px] font-mono text-[11px] font-semibold text-text-muted">
              <svg
                aria-hidden="true"
                width="11"
                height="11"
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
              Every target stays editable
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="order-1">
          <div className="mb-[18px] font-mono text-xs font-bold tracking-[0.1em] text-accent">
            02 — STACK YOUR PROGRESS
          </div>
          <h3 className="mb-4 font-display text-[clamp(27px,3.8vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text">
            Your last lift becomes your next target.
          </h3>
          <p className="max-w-[46ch] font-body text-[clamp(16px,1.8vw,18px)] leading-[1.6] text-text-muted">
            Log what you did. Stack remembers the weight, reps, and working
            sets, then prepares the next sensible step. Hit the target? Add a
            little. Need another session at the same load? Keep building there.
            Every recommendation stays editable.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default PillarProgress;
