import type { ReactNode } from "react";

import { heroDecisions } from "@/components/sections/hero-data";
import { DecisionChip } from "@/components/ui/DecisionChip";

export interface DecisionCloudProps {
  readonly children: ReactNode;
}

export function DecisionCloud({ children }: DecisionCloudProps) {
  return (
    <div className="relative mx-auto w-[min(340px,84vw)] py-9 sm:w-[min(360px,80vw)] sm:py-12">
      <div className="relative z-[1] flex justify-center">{children}</div>
      {heroDecisions.map((decision, index) => (
        <DecisionChip key={decision.id} decision={decision} index={index} />
      ))}
    </div>
  );
}

export default DecisionCloud;
