import DownloadCTA from "@/components/sections/DownloadCTA";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import GymFloorProof from "@/components/sections/GymFloorProof";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Nav from "@/components/sections/Nav";
import PillarAdapt from "@/components/sections/PillarAdapt";
import PillarPlan from "@/components/sections/PillarPlan";
import PillarProgress from "@/components/sections/PillarProgress";
import Principles from "@/components/sections/Principles";
import ProblemBeat from "@/components/sections/ProblemBeat";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemBeat />
        <HowItWorks />
        <PillarPlan />
        <PillarProgress />
        <PillarAdapt />
        <Principles />
        <GymFloorProof />
        <FAQ />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
