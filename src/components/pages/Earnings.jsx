import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";

const Earnings = () => {
    const [loading, setLoading] = useState(true);
  setLoading(false);
    
    
      if (loading) {
        return <CarLoader message="Loading your earnings..." />;
      }
    
    return (
        <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
            <h1 className="text-2xl font-bold mb-4">My Earnings</h1>
            <p className="text-lg mb-2">Earnings details will be displayed here.</p>
        </div>
    );
}

export default Earnings;