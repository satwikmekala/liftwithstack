import { BeatLastWeek } from "@/components/science/BeatLastWeek";
import { Journey } from "@/components/science/Journey";
import { ScienceNav } from "@/components/science/ScienceNav";
import { Sources } from "@/components/science/Sources";
import { Slower, WhyStack } from "@/components/science/WhyStack";
import { Footer } from "@/components/sections/Closing";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

/**
 * Why showing up isn't always enough, for someone who has never read a physiology paper: from
 * your curl down to the tiny hands and back out onto one line, then your turn, then why Stack.
 */
export default function Science() {
  return (
    <>
      <SmoothScroll />
      <ScienceNav />
      <main className="sci-main">
        <Journey />
        <BeatLastWeek />
        <Slower />
        <WhyStack />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
