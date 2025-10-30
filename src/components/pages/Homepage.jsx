import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import carImg from "../../assets/car-hero2.svg";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../contexts/AuthContext.jsx"; // for redirect

const Home = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  // 🔁 Redirect logged-in users to dashboard
  useEffect(() => {
    if (authUser) {
      navigate("/dashboard");
    }
  }, [authUser, navigate]);

  // 🚗 Animation state for live tracker car
  const [carPos, setCarPos] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCarPos((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-black text-yellow-400">
      {/* 🔹 Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 py-12 lg:py-20 gap-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight text-yellow-400">
            Drive Smart. <br />
            Ride Safe. <br />
            <span className="text-gray-300">With HeavyDriver</span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            The fastest and safest ride platform built for reliability and
            transparency. Track rides in real time, earn more, and travel
            worry-free.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              label="Book a Ride"
              icon="pi pi-map-marker"
              className="p-button-warning font-semibold text-black"
              onClick={() =>
                (window.location.href = import.meta.env.VITE_PASSENGER_FRONTEND)
              }
            />
            <Button
              label="Become a Driver"
              icon="pi pi-car"
              className="p-button-outlined p-button-warning font-semibold"
              onClick={() => navigate("/register")}
            />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={carImg}
            alt="Hero Car"
            className="w-3/4 max-w-md drop-shadow-2xl animate-fadein"
          />
        </div>
      </section>

      {/* 🔹 Features Section */}
      <section className="bg-gray-900 px-6 lg:px-20 py-16 text-center">
        <h3 className="text-3xl font-bold text-yellow-400 mb-10">
          Why Choose HeavyDriver?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card
            title="Live Tracking"
            className="bg-black border border-yellow-500 text-yellow-400"
          >
            <p className="text-gray-400">
              Track your driver and rides in real-time with accurate GPS and
              instant updates.
            </p>
          </Card>

          <Card
            title="Verified Drivers"
            className="bg-black border border-yellow-500 text-yellow-400"
          >
            <p className="text-gray-400">
              Every driver on HeavyDriver is verified and rated to ensure a safe
              and reliable experience.
            </p>
          </Card>

          <Card
            title="Fair Pricing"
            className="bg-black border border-yellow-500 text-yellow-400"
          >
            <p className="text-gray-400">
              Transparent fares with no hidden charges. You pay exactly what you
              see.
            </p>
          </Card>
        </div>
      </section>

      

      {/* 🔹 CTA Section */}
      <section className="flex flex-col items-center justify-center py-16 bg-black border-t border-yellow-600">
        <h4 className="text-2xl font-semibold text-yellow-400 mb-3">
          Ready to Get Started?
        </h4>
        <p className="text-gray-400 mb-5 text-center px-6 max-w-2xl">
          Join the community of smart drivers and happy passengers. Get on the
          road with HeavyDriver today!
        </p>
        <div className="flex gap-3">
          <Button
            label="Join as Driver"
            icon="pi pi-car"
            className="p-button-warning text-black font-semibold"
            onClick={() => navigate("/register")}
          />
          <Button
            label="Book Your Ride"
            icon="pi pi-map"
            className="p-button-outlined p-button-warning font-semibold"
            onClick={() =>
              (window.location.href = import.meta.env.VITE_PASSENGER_FRONTEND)
            }
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
