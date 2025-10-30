import React from "react";
import { Button } from "primereact/button";
import carImg from "../../assets/car-hero2.svg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 py-20 gap-10 relative overflow-hidden">
      <div className="flex-1 space-y-6 z-10 animate-fadein">
        <h2 className="text-5xl font-extrabold leading-tight text-yellow-400 drop-shadow-[0_0_25px_rgba(255,255,0,0.3)]">
          Drive Smart. <br />
          Ride Safe. <br />
          <span className="text-gray-300">With HeavyDriver</span>
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
          The fastest and safest ride platform built for reliability and transparency.
          Track rides in real-time, earn more, and travel worry-free.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            label="Book a Ride"
            icon="pi pi-map-marker"
            className="p-button-warning font-semibold text-black hover:scale-105 transition-transform duration-300"
            onClick={() =>
              (window.location.href = import.meta.env.VITE_PASSENGER_FRONTEND)
            }
          />
          <Button
            label="Become a Driver"
            icon="pi pi-car"
            className="p-button-outlined p-button-warning font-semibold hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/register")}
          />
        </div>
      </div>

      <div className="flex-1 flex justify-center relative">
        <div className="absolute w-96 h-96 bg-yellow-500/10 blur-3xl rounded-full animate-pulse-slow" />
        <img
          src={carImg}
          alt="Hero Car"
          className="w-3/4 max-w-md drop-shadow-[0_0_50px_rgba(255,255,0,0.3)] animate-float"
        />
      </div>
    </section>
  );
};

export default HeroSection;
