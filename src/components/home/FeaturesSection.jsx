import React from "react";
import { Card } from "primereact/card";
import locationtracking from "../../assets/homepage/navigation.svg";
import verifieddrivers from "../../assets/homepage/verified-drivers-char.svg";
import fairpricing from "../../assets/homepage/fair-pricing.svg";

const FeaturesSection = () => {
  const features = [
    {
      img: locationtracking,
      title: "Live Tracking",
      desc: "Track your driver and rides in real time with accurate GPS and instant updates.",
    },
    {
      img: verifieddrivers,
      title: "Verified Drivers",
      desc: "Every driver on HeavyDriver is verified and rated to ensure a safe and reliable experience.",
    },
    {
      img: fairpricing,
      title: "Fair Pricing",
      desc: "Transparent fares with no hidden charges. You pay exactly what you see.",
    },
  ];

  return (
    <section className="bg-gray-900 px-6 lg:px-20 py-20 text-center relative overflow-hidden">
      <h3 className="text-3xl font-bold text-yellow-400 mb-14">
        Why Choose HeavyDriver?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center group transition-all duration-500"
          >
            <div className="relative z-10 -mb-14 animate-float">
              <img
                src={item.img}
                alt={item.title}
                className="w-56 h-56 drop-shadow-[0_0_25px_rgba(255,255,0,0.3)] group-hover:drop-shadow-[0_0_35px_rgba(255,255,0,0.6)] transition-all duration-500"
              />
            </div>
            <div className="bg-black border-t-4 border-yellow-500 rounded-xl pt-20 pb-8 px-6 shadow-[0_0_25px_rgba(255,255,0,0.1)] hover:shadow-[0_0_40px_rgba(255,255,0,0.3)] transform group-hover:scale-105 transition-all duration-500">
              <h4 className="text-xl font-semibold text-yellow-400 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-400 max-w-xs mx-auto">{item.desc}</p>
            </div>
            <div className="absolute -top-10 w-60 h-60 bg-yellow-500/10 blur-3xl rounded-full group-hover:bg-yellow-500/20 transition-all duration-700"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
