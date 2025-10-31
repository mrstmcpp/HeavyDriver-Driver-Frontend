import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader.jsx";
import useAuthStore from "../../contexts/AuthContext.jsx";
import BookingsTable from "../reusables/BookingsTable.jsx";
import axios from "axios";
import PageMeta from "../common/PageMeta.jsx";
import { Link } from "react-router-dom";
import { stats } from "../data/DriverStats.jsx";

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

  const dashboardStats = stats({ totalItems });

  return (
    <>
      <PageMeta page="dashboard" />

      <div
        className="px-6 py-8 transition-colors duration-300
                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[calc(100vh-6rem)]"
      >
        {/* Welcome Section */}
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className={`group p-5 rounded-2xl bg-gradient-to-br from-${stat.color}-400/10 via-${stat.color}-400/5 
                to-transparent border border-${stat.color}-500/30 shadow-sm 
                hover:shadow-${stat.color}-500/20 transition-transform transform hover:scale-[1.03] hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-3 rounded-xl bg-${stat.color}-100/40 dark:bg-${stat.color}-400/10`}
                >
                  <i
                    className={`${stat.icon} text-${stat.color}-500 dark:text-${stat.color}-400 text-xl`}
                  ></i>
                </div>
                <h2 className="text-lg font-semibold">{stat.title}</h2>
              </div>
              <p
                className={`text-3xl font-bold text-${stat.color}-500 dark:text-${stat.color}-400`}
              >
                {stat.value}
              </p>
              <p className="text-sm opacity-70 mt-1">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Today's Activity</h2>
            <Link to={"/rides/all"}>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 
                         text-black text-sm transition"
              >
                <i className="pi pi-list" />
                View All
              </button>
            </Link>
          </div>

          {bookings.length > 0 ? (
            <BookingsTable bookings={bookings} loading={bookingsLoading} />
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <i className="pi pi-inbox text-3xl mb-3"></i>
              <p>No bookings found for today.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
