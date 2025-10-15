import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import CarLoader from "../reusables/CarLoader.jsx";
const DashboardPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  setLoading(false);

  if (loading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  return (
    <div
      className="px-6 py-8 transition-colors duration-300
                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide mb-2">
          Welcome Back,{" "}
          <span className="text-yellow-500 dark:text-yellow-400">Driver!</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Here’s your activity overview and stats for today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-transparent
                     dark:from-yellow-500/10 dark:via-yellow-400/5
                     border border-yellow-500/30 shadow-md hover:shadow-yellow-500/10 transition"
        >
          <h2 className="text-lg font-semibold mb-2">Earnings</h2>
          <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
            ₹ 2,340
          </p>
          <p className="text-sm opacity-70 mt-1">Today</p>
        </div>

        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-green-400/10 via-green-400/5 to-transparent
                     border border-green-500/30 shadow-md hover:shadow-green-500/10 transition"
        >
          <h2 className="text-lg font-semibold mb-2">Completed Rides</h2>
          <p className="text-3xl font-bold text-green-500">18</p>
        </div>

        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-400/10 via-purple-400/5 to-transparent
                     border border-purple-500/30 shadow-md hover:shadow-purple-500/10 transition"
        >
          <h2 className="text-lg font-semibold mb-2">Rating</h2>
          <p className="text-3xl font-bold text-purple-500">4.8 ★</p>
          <p className="text-sm opacity-70 mt-1">Based on 18 rides</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 
                     dark:border-gray-700 shadow-md overflow-hidden"
        >
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3">Ride ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Earnings</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "R1234", date: "Oct 13, 2025", earn: "₹220", status: "Completed" },
                { id: "R1235", date: "Oct 13, 2025", earn: "₹145", status: "Completed" },
                { id: "R1236", date: "Oct 12, 2025", earn: "₹180", status: "Cancelled" },
                { id: "R1237", date: "Oct 12, 2025", earn: "₹260", status: "Completed" },
              ].map((ride) => (
                <tr
                  key={ride.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                >
                  <td className="p-3">{ride.id}</td>
                  <td className="p-3">{ride.date}</td>
                  <td className="p-3 text-yellow-500">{ride.earn}</td>
                  <td
                    className={`p-3 font-semibold ${
                      ride.status === "Completed"
                        ? "text-green-500"
                        : "text-red-400"
                    }`}
                  >
                    {ride.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
