import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
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
      const baseUrl = import.meta.env.VITE_BOOKING_BACKEND_URL;
      const endpoint =
        mode === "today"
          ? `/driver/${authUser.userId}/today-booking`
          : `/driver/${authUser.userId}/all-booking`;

      const { data } = await axios.get(`${baseUrl}${endpoint}`, {
        params: { offset: pageNumber, pageSize },
        withCredentials: true,
      });

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
    if (mode === "today") setSearchParams({});
    else setSearchParams({ page: 0, size: 10 });
  };

  if (!authUser) return null;

  return (
    <>
      <PageMeta page="myRides" />

      <div className="px-6 py-8 min-h-[calc(100vh-6rem)] bg-[#0A0F1C] text-white transition-colors duration-300">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            <span className="text-yellow-400">My</span> Rides
          </h1>

          <div className="flex gap-3">
            {["all", "today"].map((mode) => (
              <button
                key={mode}
                onClick={() => handleViewChange(mode)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md
                  ${
                    viewMode === mode
                      ? "bg-yellow-400 text-black shadow-yellow-400/40"
                      : "bg-[#141922] border border-gray-700 text-gray-300 hover:text-yellow-400 hover:border-yellow-400/40"
                  }`}
              >
                {mode === "all" ? "All Rides" : "Today’s Rides"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {(authLoading || bookingsLoading) ? (
          <div className="space-y-6">
            {/* Skeleton Header */}
            <Skeleton width="12rem" height="1.5rem" className="mb-4" />
            {/* Skeleton Table Rows */}
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} width="100%" height="60px" borderRadius="0.75rem" />
            ))}
            {/* Skeleton Paginator */}
            <div className="flex justify-center mt-6">
              <Skeleton width="300px" height="40px" borderRadius="1rem" />
            </div>
          </div>
        ) : (
          <>
            {/* Total Count */}
            <p className="text-sm text-gray-400 mb-6">Total Rides: {totalItems}</p>

            {/* Bookings Section */}
            <div className="bg-[#141922] border border-gray-800 rounded-2xl shadow-lg p-6">
              {bookings.length > 0 ? (
                <BookingsTable bookings={bookings} loading={bookingsLoading} />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <i className="pi pi-inbox text-3xl mb-3 text-yellow-400/70"></i>
                  <p>No rides found{viewMode === "today" ? " for today." : "."}</p>
                </div>
              )}
            </div>

            {/* Paginator */}
            {viewMode === "all" && totalItems > 10 && (
              <div className="flex justify-center mt-8">
                <div className="bg-[#141922] border border-gray-800 rounded-2xl shadow-lg p-4">
                  <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalItems}
                    rowsPerPageOptions={[10, 20, 30]}
                    onPageChange={onPageChange}
                    template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rides"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyRides;
