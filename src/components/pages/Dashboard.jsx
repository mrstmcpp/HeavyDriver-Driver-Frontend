import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader.jsx";
import useAuthStore from "../../contexts/AuthContext.jsx";
import BookingsTable from "../reusables/BookingsTable.jsx";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import PageMeta from "../common/PageMeta.jsx";

const DashboardPage = () => {
  const { authUser, loading: authLoading } = useAuthStore();
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!authUser || !authUser.userId) {
      setBookingsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setBookingsLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BOOKING_BACKEND_URL}/driver/${
            authUser.userId
          }/today-booking`,
          {
            params: { pageSize: 5 },
            withCredentials: true,
          }
        );

        const data = res.data;
        // console.log("Fetched dashboard bookings:", data);
        setBookings(data.bookingList || []);
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [authUser, authLoading]);
  if (authLoading || bookingsLoading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-500 text-lg font-semibold">
        <i className="pi pi-exclamation-triangle mr-2" />
        {error}
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <>
      <PageMeta page={"dashboard"} />

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

        {/* Stats Grid */}
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
            <p className="text-3xl font-bold text-green-500">{totalItems}</p>
            <p className="text-sm opacity-70 mt-1">Today</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-400/10 via-purple-400/5 to-transparent border border-purple-500/30 shadow-md hover:shadow-purple-500/10 transition">
            <h2 className="text-lg font-semibold mb-2">Rating</h2>
            <p className="text-3xl font-bold text-purple-500">4.8 ★</p>
            <p className="text-sm opacity-70 mt-1">Based on 18 rides</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-400/10 via-orange-400/5 to-transparent border border-orange-500/30 shadow-md hover:shadow-orange-500/10 transition">
            <h2 className="text-lg font-semibold mb-2">Test Section</h2>
            <p className="text-3xl font-bold text-orange-500">
              Current Address
            </p>
            <p className="text-sm opacity-70 mt-1">—</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Today's Activity</h2>
          <BookingsTable bookings={bookings} loading={bookingsLoading} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
