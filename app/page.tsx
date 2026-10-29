import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { DemoJourney } from "@/components/stack/DemoJourney";
import { Circle } from "@/components/sections/Circle";
import { Closing, Footer } from "@/components/sections/Closing";
import { FormCheck } from "@/components/sections/FormCheck";
import { Hero, Nav } from "@/components/sections/Hero";
import { Moments } from "@/components/sections/Moments";
import { Progress } from "@/components/sections/Progress";
import { Routines } from "@/components/sections/Routines";
import { Story } from "@/components/sections/Story";
import { Thesis } from "@/components/sections/Thesis";
import { StackFinale } from "@/components/stack/StackFinale";

/**
 * One workout, carried through the page: logged your way, photographed, pressed into
 * Your Stack, kept as a Moment and shared with your circle.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Thesis />
        <DemoJourney>
          <Story />
          <StackFinale />
          <Moments />
          <Circle />
        </DemoJourney>
        <FormCheck />
        <Progress />
        <Routines />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
