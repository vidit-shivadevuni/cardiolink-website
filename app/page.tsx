import { Audience } from "@/components/landing/Audience";
import { DemoInvitation } from "@/components/landing/DemoInvitation";
import { Faq } from "@/components/landing/Faq";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Insight } from "@/components/landing/Insight";
import { Integration } from "@/components/landing/Integration";
import { PatientExperience } from "@/components/landing/PatientExperience";

export default function Home() {
  return (
    <>
      <Hero />
      <Audience />
      <Features />
      <HowItWorks />
      <Insight />
      <Integration />
      <PatientExperience />
      <Faq />
      <DemoInvitation />
      <Footer />
    </>
  );
}
