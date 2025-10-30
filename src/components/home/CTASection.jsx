import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center justify-center py-20 bg-black border-t border-yellow-600 overflow-hidden">
      <div className="absolute w-[80%] h-[80%] bg-yellow-500/5 blur-3xl rounded-full animate-pulse-slow"></div>

      <h4 className="text-3xl font-semibold text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(255,255,0,0.4)]">
        Ready to Get Started?
      </h4>

      <p className="text-gray-400 mb-6 text-center px-6 max-w-2xl">
        Join the community of smart drivers and happy passengers. Get on the road
        with HeavyDriver today!
      </p>

      <div className="flex gap-4 z-10">
        <Button
          label="Join as Driver"
          icon="pi pi-car"
          className="p-button-warning text-black font-semibold hover:scale-110 transition-transform duration-300"
          onClick={() => navigate("/register")}
        />
        <Button
          label="Book Your Ride"
          icon="pi pi-map"
          className="p-button-outlined p-button-warning font-semibold hover:scale-110 transition-transform duration-300"
          onClick={() =>
            (window.location.href = import.meta.env.VITE_PASSENGER_FRONTEND)
          }
        />
      </div>
    </section>
  );
};

export default CTASection;
