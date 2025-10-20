import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";
import DriverMap from "../maps/DriverMap";

const RideDetailsOnMap = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  const pickup = { lat: 25.437, lng: 81.842 };
  const dropoff = { lat: 25.453, lng: 81.862 };

  return (
    <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
      <h1 className="text-2xl font-bold mb-4">Current Ride Details</h1>
      <p className="text-lg mb-2">Ride details will be displayed here.</p>

      <DriverMap
        pickup={pickup}
        dropoff={dropoff}
        rideStatus="incoming"
      />
    </div>
  );
};

export default RideDetailsOnMap;
