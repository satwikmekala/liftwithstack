import { SiteJsonLd } from "@/components/seo/JsonLd";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { DemoJourney } from "@/components/stack/DemoJourney";
import { BodyMap } from "@/components/sections/BodyMap";
import { Recap } from "@/components/sections/Recap";
import { Circle } from "@/components/sections/Circle";
import { Closing, Footer } from "@/components/sections/Closing";
import { Extras } from "@/components/sections/Extras";
import { Hero, Nav } from "@/components/sections/Hero";
import { Moments } from "@/components/sections/Moments";
import { Progress } from "@/components/sections/Progress";
import { Routines } from "@/components/sections/Routines";
import { ScienceTeaser } from "@/components/sections/ScienceTeaser";
import { Story } from "@/components/sections/Story";
import { Thesis } from "@/components/sections/Thesis";
import { StackFinale } from "@/components/stack/StackFinale";

/**
 * One workout, carried through the page: started, logged, checked, pressed into Your Stack,
 * stacked up next to your friends' and remembered in a photo. Then: getting your training in.
 */
export default function Home() {
  return (
    <>
      <SiteJsonLd />
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Thesis />
        <DemoJourney>
          <Story />
          <StackFinale />
          <Circle />
          <Moments />
        </DemoJourney>
        <BodyMap />
        <Recap />
        <Extras />
        <Progress />
        <ScienceTeaser />
        <Routines />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
