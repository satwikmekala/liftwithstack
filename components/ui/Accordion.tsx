"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  type ReactNode,
  useId,
  useState,
} from "react";

export interface AccordionProps {
  readonly title: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly buttonClassName?: string;
  readonly titleClassName?: string;
  readonly contentClassName?: string;
  readonly defaultOpen?: boolean;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly id?: string;
}

function joinClasses(
  ...classes: readonly (string | false | null | undefined)[]
): string {
  return classes
    .filter((className): className is string => Boolean(className))
    .join(" ");
}

export function Accordion({
  title,
  children,
  className,
  buttonClassName,
  titleClassName,
  contentClassName,
  defaultOpen = false,
  open,
  onOpenChange,
  id,
}: AccordionProps) {
  const generatedId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion();
  const isOpen = open ?? internalOpen;
  const stableId = id ?? generatedId;
  const buttonId = `${stableId}-trigger`;
  const regionId = `${stableId}-content`;

  const handleToggle = () => {
    const nextOpen = !isOpen;

    if (open === undefined) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  return (
    <div
      className={joinClasses(
        "overflow-hidden rounded-[18px] border border-white/[0.08] bg-surface",
        className,
      )}
    >
      <button
        id={buttonId}
        type="button"
        aria-controls={regionId}
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={joinClasses(
          "flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 bg-transparent px-[22px] py-5 text-left text-text",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent",
          buttonClassName,
        )}
      >
        <span className={titleClassName}>{title}</span>
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
          className="shrink-0 text-accent"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: [0.2, 0.7, 0.2, 1],
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={regionId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{
              height: {
                duration: prefersReducedMotion ? 0 : 0.42,
                ease: [0.2, 0.7, 0.2, 1],
              },
              opacity: {
                duration: prefersReducedMotion ? 0 : 0.22,
              },
            }}
            className="overflow-hidden"
          >
            <div className={contentClassName}>{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default Accordion;
