import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import carImg from "../../assets/car-hero2.svg";
import { useNavigate } from "react-router-dom";
import locationtracking from "../../assets/homepage/navigation.svg";
import verifieddrivers from "../../assets/homepage/verified-drivers-char.svg";
import fairpricing from "../../assets/homepage/fair-pricing.svg";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>HeavyDriver — Drive Smart, Ride Safe</title>
        <meta
          name="description"
          content="The fastest and safest ride platform built for reliability, transparency, and verified drivers. Join HeavyDriver today!"
        />
        <meta
          property="og:title"
          content="HeavyDriver — Drive Smart, Ride Safe"
        />
        <meta
          property="og:description"
          content="Join HeavyDriver for reliable, verified rides and real-time tracking. Drive smart, ride safe."
        />
        <meta property="og:type" content="website" />
      </Helmet>

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
                  (window.location.href =
                    import.meta.env.VITE_PASSENGER_FRONTEND)
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
            <Card className="bg-black border border-yellow-500 text-yellow-400 hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={locationtracking}
                  alt="Live Tracking"
                  className="w-25 h-25"
                />
                <h4 className="text-xl font-semibold">Live Tracking</h4>
                <p className="text-gray-400 max-w-xs">
                  Track your driver and rides in real-time with accurate GPS and
                  instant updates.
                </p>
              </div>
            </Card>

            <Card className="bg-black border border-yellow-500 text-yellow-400 hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={verifieddrivers}
                  alt="Verified Drivers"
                  className="w-25 h-25"
                />
                <h4 className="text-xl font-semibold">Verified Drivers</h4>
                <p className="text-gray-400 max-w-xs">
                  Every driver on HeavyDriver is verified and rated to ensure a
                  safe and reliable experience.
                </p>
              </div>
            </Card>

            <Card className="bg-black border border-yellow-500 text-yellow-400 hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={fairpricing}
                  alt="Fair Pricing"
                  className="w-25 h-25"
                />
                <h4 className="text-xl font-semibold">Fair Pricing</h4>
                <p className="text-gray-400 max-w-xs">
                  Transparent fares with no hidden charges. You pay exactly what
                  you see.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* 🔹 How It Works Section */}
        <section className="bg-black px-6 lg:px-20 py-16 text-center border-t border-yellow-600">
          <h3 className="text-3xl font-bold text-yellow-400 mb-10">
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-gray-300">
            <div className="flex flex-col items-center gap-3 p-4">
              <i className="pi pi-user-plus text-5xl text-yellow-400" />
              <h4 className="text-xl font-semibold text-yellow-400">
                Register
              </h4>
              <p>
                Sign up with your details and verify your driver documents
                securely.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <i className="pi pi-power-off text-5xl text-yellow-400" />
              <h4 className="text-xl font-semibold text-yellow-400">
                Go Online
              </h4>
              <p>
                Mark yourself available to start receiving ride requests
                instantly.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <i className="pi pi-map-marker text-5xl text-yellow-400" />
              <h4 className="text-xl font-semibold text-yellow-400">Pick Up</h4>
              <p>
                Use real-time tracking and navigation to reach your passengers
                quickly.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <i className="pi pi-wallet text-5xl text-yellow-400" />
              <h4 className="text-xl font-semibold text-yellow-400">Earn</h4>
              <p>
                Complete your ride and get paid instantly with transparent
                fares.
              </p>
            </div>
          </div>
        </section>

        {/* 🔹 Reviews Section */}
        <section className="bg-gray-900 px-6 lg:px-20 py-16 text-center border-t border-yellow-600">
          <h3 className="text-3xl font-bold text-yellow-400 mb-10">
            What Our Drivers Say
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-black border border-yellow-500 text-yellow-400 shadow-md hover:shadow-yellow-700/30 transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100?img=3"
                  alt="Driver 1"
                  className="rounded-full w-20 h-20 border-2 border-yellow-500"
                />
                <p className="italic text-gray-300 max-w-xs">
                  "HeavyDriver helped me increase my earnings with transparent
                  fares and regular rides. Best platform for part-time drivers!"
                </p>
                <h4 className="font-semibold text-yellow-400">Ravi Kumar</h4>
                <p className="text-sm text-gray-500">Driver, Lucknow</p>
              </div>
            </Card>

            <Card className="bg-black border border-yellow-500 text-yellow-400 shadow-md hover:shadow-yellow-700/30 transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100?img=6"
                  alt="Driver 2"
                  className="rounded-full w-20 h-20 border-2 border-yellow-500"
                />
                <p className="italic text-gray-300 max-w-xs">
                  "The real-time tracking and easy navigation make every ride
                  smooth. Passengers trust HeavyDriver, and so do I!"
                </p>
                <h4 className="font-semibold text-yellow-400">Sandeep Yadav</h4>
                <p className="text-sm text-gray-500">Driver, Prayagraj</p>
              </div>
            </Card>

            <Card className="bg-black border border-yellow-500 text-yellow-400 shadow-md hover:shadow-yellow-700/30 transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100?img=9"
                  alt="Driver 3"
                  className="rounded-full w-20 h-20 border-2 border-yellow-500"
                />
                <p className="italic text-gray-300 max-w-xs">
                  "The verification process ensures safety for everyone. I feel
                  secure knowing each passenger is verified too!"
                </p>
                <h4 className="font-semibold text-yellow-400">Amit Verma</h4>
                <p className="text-sm text-gray-500">Driver, Kanpur</p>
              </div>
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

        {/* 🔹 Contact Section */}
        <section className="bg-gray-900 px-6 lg:px-20 py-16 text-center border-t border-yellow-600">
          <h3 className="text-3xl font-bold text-yellow-400 mb-10">
            Get in Touch
          </h3>

          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Have questions or need help? Our team is available 24/7 to assist
            you. Reach out to us anytime — we’d love to hear from you!
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-300">
            <div className="flex items-center gap-3">
              <i className="pi pi-envelope text-yellow-400 text-2xl" />
              <span>support@heavydriver.in</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="pi pi-map-marker text-yellow-400 text-2xl" />
              <span>Prayagraj, India</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="pi pi-phone text-yellow-400 text-2xl" />
              <span>+91 9452549006</span>
            </div>
          </div>

          <div className="mt-10">
            <Button
              label="Contact Support"
              icon="pi pi-comments"
              className="p-button-warning text-black font-semibold"
              onClick={() =>
                (window.location.href = "mailto:support@heavydriver.in")
              }
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
