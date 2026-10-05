import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { DemoJourney } from "@/components/stack/DemoJourney";
import { Closing, Footer } from "@/components/sections/Closing";
import { Hero, Nav } from "@/components/sections/Hero";
import { Progress } from "@/components/sections/Progress";
import { Routines } from "@/components/sections/Routines";
import { Story } from "@/components/sections/Story";
import { Thesis } from "@/components/sections/Thesis";
import { StackFinale } from "@/components/stack/StackFinale";

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
        </DemoJourney>
        <Progress />
        <Routines />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
