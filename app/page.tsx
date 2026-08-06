import Footer from "@/components/sections/Footer";
import FinalCtaSection from "@/components/sections/FinalCtaSection";
import GymFloorProof from "@/components/sections/GymFloorProof";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Nav from "@/components/sections/Nav";
import PillarAdapt from "@/components/sections/PillarAdapt";
import PillarPlan from "@/components/sections/PillarPlan";
import PillarProgress from "@/components/sections/PillarProgress";
import ProblemBeat from "@/components/sections/ProblemBeat";
import SeeWorkStackUp from "@/components/sections/SeeWorkStackUp";
import WhyStackExistsSection from "@/components/sections/WhyStackExistsSection";

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
        <GymFloorProof />
        <SeeWorkStackUp />
        <WhyStackExistsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
