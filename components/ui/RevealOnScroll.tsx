"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface RevealOnScrollProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-reveal={delay}
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 24,
            }
      }
      animate={
        prefersReducedMotion
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.14,
        margin: "0px 0px -6% 0px",
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.85,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default RevealOnScroll;
