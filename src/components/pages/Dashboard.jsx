import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader.jsx";
import useAuthStore from "../../contexts/AuthContext.jsx";
import BookingsTable from "../reusables/BookingsTable.jsx";
import axios from "axios";
import PageMeta from "../common/PageMeta.jsx";
import { Link } from "react-router-dom";
import { stats } from "../data/DriverStats.jsx";
import { Skeleton } from "primereact/skeleton";
import { calculateDateRange } from "../../utils/DateRangeUtil.js"; // ✅ added

const DashboardPage = () => {
  const { authUser, loading: authLoading } = useAuthStore();
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({});
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earnings, setEarnings] = useState({ today: 0, week: 0 }); // ✅ added

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

    const fetchEarnings = async () => {
      setEarningsLoading(true);
      try {
        const todayRange = calculateDateRange("1d");
        const weekRange = calculateDateRange("7d");

        const [todayRes, weekRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BOOKING_BACKEND_URL}/fare/analytics`,
            {
              params: { fromDate: todayRange.from, toDate: todayRange.to },
              withCredentials: true,
            }
          ),
          axios.get(
            `${import.meta.env.VITE_BOOKING_BACKEND_URL}/fare/analytics`,
            {
              params: { fromDate: weekRange.from, toDate: weekRange.to },
              withCredentials: true,
            }
          ),
        ]);
        
        console.log("todays res : " , todayRes.data);
        console.log("todays res : " , weekRes.data);
        setEarnings({
          today: todayRes.data.totalEarnings || 0,
          week: weekRes.data.totalEarnings || 0,
        });
      } catch (err) {
        console.error("Error fetching earnings data:", err);
      } finally {
        setEarningsLoading(false);
      }
    };

    fetchBookings();
    fetchEarnings();
  }, [authUser, authLoading]);

  if (authLoading || bookingsLoading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-400 text-lg font-semibold">
        <i className="pi pi-exclamation-triangle mr-2 text-xl" />
        {error}
      </div>
    );
  }

  if (!authUser) return null;

  const dashboardStats = stats({
    totalItems: totalItems,
    todayEarnings: earnings.today,
    weekEarnings: earnings.week,
  });

  return (
    <>
      <PageMeta page="dashboard" />

      <div className="px-6 py-8 min-h-[calc(100vh-6rem)] bg-[#0A0F1C] text-white transition-colors duration-300">
        {/* Welcome Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-2">
            Welcome Back,{" "}
            <span className="text-yellow-400">{authUser.name}!</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Here's your performance snapshot and today’s activity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="group bg-[#141922] hover:bg-[#1A2030] border border-gray-800 rounded-2xl p-6 
                         shadow-lg hover:shadow-yellow-500/20 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                    <i className={`${stat.icon} text-xl`} />
                  </div>
                  <h2 className="text-base font-semibold text-gray-200">
                    {stat.title}
                  </h2>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
            </div>
          ))}
        </div>

       

        {/* Bookings Section */}
        <div className="bg-[#141922] border border-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-yellow-400">
              Today's Bookings
            </h2>
            <Link to={"/rides/all"}>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 
                           text-black font-semibold text-sm shadow-md transition-all"
              >
                <i className="pi pi-list" />
                View All
              </button>
            </Link>
          </div>

          {bookings.length > 0 ? (
            <BookingsTable bookings={bookings} loading={bookingsLoading} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              <i className="pi pi-inbox text-3xl mb-3 text-yellow-400/70"></i>
              <p>No bookings found for today.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
