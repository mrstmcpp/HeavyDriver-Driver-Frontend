import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CarLoader message="Loading your settings..." />;
  }

  return (
    <>
      <Helmet>
        <title>Settings | HeavyDriver — Customize Your Experience</title>
        <meta
          name="description"
          content="Manage your preferences, privacy options, and notifications. Control your HeavyDriver experience effortlessly."
        />
        <meta property="og:title" content="Settings | HeavyDriver" />
        <meta
          property="og:description"
          content="Personalize your driving preferences and app settings with HeavyDriver."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-lg mb-2">Settings details will be displayed here.</p>
      </div>
    </>
  );
};

export default Settings;
