import React, { useState, useEffect } from "react";

import CarLoader from "../reusables/CarLoader.jsx";
import useAuthStore from "../../contexts/AuthContext.jsx";
import BookingsTable from "../reusables/BookingsTable.jsx";
import axios from "axios";

const DashboardPage = () => {
  const { authUser, loading: authLoading } = useAuthStore();
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authUser && authUser.userId) {
      const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BOOKING_BACKEND_URL}/driver/${
              authUser.userId
            }/all-booking?pageSize=5`
          );
          if (!res.ok) throw new Error("Failed to fetch bookings");
          const data = await res.json();
          console.log(data);
          setBookings(data.bookingList || []);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        } finally {
          setBookingsLoading(false);
        }
      };

      fetchBookings();
    } else {
      setBookingsLoading(false);
    }
  }, [authLoading, authUser]);

  if (authLoading || bookingsLoading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  if (!authUser) {
    return null;
  }
  

  return (
    <div
      className="px-6 py-8 transition-colors duration-300
                bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide mb-2">
          Welcome Back,{" "}
          <span className="text-yellow-500 dark:text-yellow-400">
            {authUser.name}!
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Here’s your activity overview and stats for today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-transparent border border-yellow-500/30 shadow-md hover:shadow-yellow-500/10 transition">
          <h2 className="text-lg font-semibold mb-2">Earnings</h2>
          <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
            ₹ 2,340
          </p>
          <p className="text-sm opacity-70 mt-1">Today</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-400/10 via-green-400/5 to-transparent border border-green-500/30 shadow-md hover:shadow-green-500/10 transition">
          <h2 className="text-lg font-semibold mb-2">Completed Rides</h2>
          <p className="text-3xl font-bold text-green-500">
            {bookings.filter((b) => b.status === "COMPLETED").length}
          </p>
          <p className="text-sm opacity-70 mt-1">Today</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-400/10 via-purple-400/5 to-transparent border border-purple-500/30 shadow-md hover:shadow-purple-500/1D transition">
          <h2 className="text-lg font-semibold mb-2">Rating</h2>
          <p className="text-3xl font-bold text-purple-500">4.8 ★</p>
          <p className="text-sm opacity-70 mt-1">Based on 18 rides</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-400/10 via-purple-400/5 to-transparent border border-purple-500/30 shadow-md hover:shadow-purple-500/1D transition">
          <h2 className="text-lg font-semibold mb-2">Test Section</h2>
          <p className="text-3xl font-bold text-purple-500">Current Address</p>
          <p className="text-sm opacity-70 mt-1">{}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <BookingsTable bookings={bookings} loading={bookingsLoading} />
      </div>
    </div>
  );
};

export default DashboardPage;
