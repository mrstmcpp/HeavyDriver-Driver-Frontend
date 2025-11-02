import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import CarLoader from "../reusables/CarLoader.jsx";
import useAuthStore from "../../contexts/AuthContext.jsx";
import BookingsTable from "../reusables/BookingsTable.jsx";
import PageMeta from "../common/PageMeta.jsx";
import axios from "axios";

const MyRides = () => {
  const { authUser, loading: authLoading } = useAuthStore();
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;

  const [first, setFirst] = useState(page * size);
  const [rows, setRows] = useState(size);

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("size")) {
      setSearchParams({ page: 0, size: 10 });
    }
  }, []);

  const fetchBookings = async (pageNumber, pageSize, mode = "all") => {
    if (!authUser?.userId) return;

    setBookingsLoading(true);
    try {
      let url = "";

      if (mode === "today") {
        url = `${import.meta.env.VITE_BOOKING_BACKEND_URL}/driver/${
          authUser.userId
        }/today-booking?offset=${pageNumber}&pageSize=${pageSize}`;
      } else {
        url = `${import.meta.env.VITE_BOOKING_BACKEND_URL}/driver/${
          authUser.userId
        }/all-booking?offset=${pageNumber}&pageSize=${pageSize}`;
      }

      const { data } = await axios.get(url, { withCredentials: true });

      setBookings(data.bookingList || []);
      setTotalItems(data.totalItems || data.bookingList?.length || 0);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser?.userId) {
      fetchBookings(page, size, viewMode);
    }
  }, [authLoading, authUser, page, size, viewMode]);

  const onPageChange = (event) => {
    const newPage = event.first / event.rows;
    const newSize = event.rows;
    setFirst(event.first);
    setRows(event.rows);
    setSearchParams({ page: newPage, size: newSize });
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (mode === "today") {
      setSearchParams({});
    } else {
      setSearchParams({ page: 0, size: 10 });
    }
  };

  if (authLoading || bookingsLoading) {
    return <CarLoader message="Loading your rides..." />;
  }

  if (!authUser) {
    return null;
  }

  return (
    <>
      <PageMeta page={"myRides"} />

      <div className="py-8 px-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">My Rides</h1>

          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === "all"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              All Rides
            </button>
            <button
              onClick={() => handleViewChange("today")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === "today"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              Today’s Rides
            </button>
          </div>
        </div>

        <p className="text-sm opacity-80 mb-6">Total Rides: {totalItems}</p>

        <BookingsTable bookings={bookings} loading={bookingsLoading} />

        {viewMode === "all" && (
          <div className="flex justify-center mt-6">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={totalItems}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MyRides;
