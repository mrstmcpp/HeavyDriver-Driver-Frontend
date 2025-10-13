import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";

const MyRides = () => {
    const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500); // 1.5 seconds simulated load
    
        return () => clearTimeout(timer);
      }, []);
    
      if (loading) {
        return <CarLoader message="Loading your rides..." />;
      }
    
    return (
        <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
            <h1 className="text-2xl font-bold mb-4">My Rides</h1>
            <p className="text-lg mb-2">Ride details will be displayed here.</p>
        </div>
    );
}

export default MyRides;