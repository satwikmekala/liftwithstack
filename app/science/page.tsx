import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Accumulate } from "@/components/science/Accumulate";
import { Adapt } from "@/components/science/Adapt";
import { FiberChapter } from "@/components/science/FiberChapter";
import { Opening, ScienceNav, Interlude } from "@/components/science/Opening";
import { OverloadLab } from "@/components/science/OverloadLab";
import { SameChallenge } from "@/components/science/SameChallenge";
import { Sources } from "@/components/science/Sources";
import { WhyTrack } from "@/components/science/WhyTrack";
import { Footer } from "@/components/sections/Closing";

/**
 * The invisible work: six acts on progressive overload. Inside the lift, the body answering,
 * the same challenge, the principle, small steps stacking, and why you write it down.
 */
export default function Science() {
  return (
    <>
      <SmoothScroll />
      <ScienceNav />
      <main className="sci-main">
        <Opening />
        <FiberChapter />
        <Interlude line="Every rep changes something." detail="Not the muscle, yet. A message." />
        <Adapt />
        <Interlude line="So what happens when the message never changes?" />
        <SameChallenge />
        <OverloadLab />
        <Interlude line="Progress doesn’t need to be dramatic." detail="It needs to be there." />
        <Accumulate />
        <WhyTrack />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
