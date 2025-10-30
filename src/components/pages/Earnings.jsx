import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";
import { Helmet } from "react-helmet-async";

const Earnings = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    //simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CarLoader message="Loading your earnings..." />;
  }

  return (
    <>
      <Helmet>
        <title>Earnings | HeavyDriver — Track Your Income</title>
        <meta
          name="description"
          content="Check your daily, weekly, and monthly earnings. Track performance, bonuses, and payouts easily with HeavyDriver."
        />
        <meta property="og:title" content="Earnings | HeavyDriver" />
        <meta
          property="og:description"
          content="Stay on top of your income and performance. Track your progress with HeavyDriver."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
        <h1 className="text-2xl font-bold mb-4">My Earnings</h1>
        <p className="text-lg mb-2">Earnings details will be displayed here.</p>
      </div>
    </>
  );
};

export default Earnings;
