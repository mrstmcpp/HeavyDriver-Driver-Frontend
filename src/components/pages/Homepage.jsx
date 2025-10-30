import React from "react";
import PageMeta from "../common/PageMeta";
import HeroSection from "../home/HeroSection";
import FeaturesSection from "../home/FeaturesSection";
import HowItWorksSection from "../home/HowItWorksSection";
import ReviewsSection from "../home/ReviewsSection";
import CTASection from "../home/CTASection";
import ContactSection from "../home/ContactSection";

const Home = () => {
  return (
    <>
      <PageMeta page={"homepage"} />
      <div className="flex flex-col bg-black text-yellow-400 font-[Poppins] overflow-hidden">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ReviewsSection />
        <CTASection />
        <ContactSection />
      </div>
    </>
  );
};

export default Home;
