import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";

const ActiveRide = () => {
    const [loading, setLoading] = useState(true);
  setLoading(false);

    
      if (loading) {
        return <CarLoader message="Loading your dashboard..." />;
      }
    
    return (
        <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
            <h1 className="text-2xl font-bold mb-4">Active Ride</h1>
            <p className="text-lg mb-2">Ride details will be displayed here.</p>
            {/* Additional content for the active ride can be added here */}
        </div>
    );
}

export default ActiveRide;