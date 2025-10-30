import React from "react";

const HowItWorksSection = () => {
  const steps = [
    { icon: "pi pi-user-plus", title: "Register", desc: "Sign up and verify your documents securely." },
    { icon: "pi pi-power-off", title: "Go Online", desc: "Start receiving ride requests instantly." },
    { icon: "pi pi-map-marker", title: "Pick Up", desc: "Reach passengers quickly with live navigation." },
    { icon: "pi pi-wallet", title: "Earn", desc: "Complete your ride and get paid instantly." },
  ];

  return (
    <section className="bg-black px-6 lg:px-20 py-20 border-t border-yellow-600 text-center relative">
      <h4 className="text-3xl font-bold text-yellow-400 mb-14">
        How It Works?
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-gray-300">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-4 p-6 rounded-xl border border-yellow-500/30 bg-black/40
              transition-all duration-500 hover:border-yellow-400 hover:bg-yellow-500/10 
              hover:shadow-[0_0_35px_rgba(255,255,0,0.25)] group"
          >
            <div className="relative">
              <i
                className={`${step.icon} text-5xl text-yellow-400 transition-transform duration-500 
                  group-hover:scale-125 group-hover:rotate-12`}
              />
              <span
                className="absolute inset-0 blur-2xl bg-yellow-500/20 opacity-0 group-hover:opacity-100 
                  transition-all duration-700 rounded-full"
              ></span>
            </div>
            <h4 className="text-xl font-semibold text-yellow-400 transition-all duration-500 group-hover:scale-110">
              {step.title}
            </h4>
            <p className="text-gray-400 group-hover:text-gray-200 transition-all duration-500">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
