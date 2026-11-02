import { Adapt } from "@/components/science/Adapt";
import { Descent } from "@/components/science/Descent";
import { Pull } from "@/components/science/Pull";
import { SameWeight } from "@/components/science/SameWeight";
import { ScienceNav } from "@/components/science/ScienceNav";
import { Sources } from "@/components/science/Sources";
import { TwoPaths } from "@/components/science/TwoPaths";
import { YourLog } from "@/components/science/YourLog";
import { Footer } from "@/components/sections/Closing";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

/**
 * Why does a weight that once felt heavy become easier? One article in seven chapters:
 * the curl, inside the muscle, how it pulls, how it adapts, the payoff, two ways on, and the log.
 * The editorial source is docs/the-weight-story.md.
 */
export default function Science() {
  return (
    <>
      <SmoothScroll />
      <ScienceNav />
      <main className="sci-main">
        <article className="sci-article">
          <Descent />
          <Pull />
          <Adapt />
          <SameWeight />
          <TwoPaths />
          <YourLog />
        </article>
        <Sources />
      </main>
      <Footer />
    </>
  );
}
