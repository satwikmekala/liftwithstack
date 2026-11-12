import { Adapt } from "@/components/science/Adapt";
import { Effort } from "@/components/science/Effort";
import { Inside } from "@/components/science/Inside";
import { Lift, Opening } from "@/components/science/Lift";
import { Pull } from "@/components/science/Pull";
import { Recap } from "@/components/science/Recap";
import { ScienceNav } from "@/components/science/ScienceNav";
import { Sources } from "@/components/science/Sources";
import { YourLog } from "@/components/science/YourLog";
import { Footer } from "@/components/sections/Closing";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

/**
 * Why does a weight that once felt heavy become easier? One lesson in six stops: the lift, inside
 * the muscle, how it pulls, how it adapts, the same weight again, then the short version and the log.
 * Each stop gives the reader something to move and explains it beside the picture; a few ask a
 * question first. The editorial source is docs/the-weight-story.md.
 */
export default function Science() {
  return (
    <>
      <SmoothScroll />
      <ScienceNav />
      <main className="sci-main">
        <article className="sci-article">
          <Opening />
          <Lift />
          <Inside />
          <Pull />
          <Adapt />
          <Effort />
          <Recap />
          <YourLog />
        </article>
        <Sources />
      </main>
      <Footer />
    </>
  );
}
