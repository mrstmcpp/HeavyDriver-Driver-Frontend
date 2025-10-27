import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import CarLoader from "../reusables/CarLoader.jsx";
import useAuthStore from "../../contexts/AuthContext.jsx";
import BookingsTable from "../reusables/BookingsTable.jsx";

const MyRides = () => {
  const { authUser, loading: authLoading } = useAuthStore();
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;

  const [first, setFirst] = useState(page * size);
  const [rows, setRows] = useState(size);

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("size")) {
      setSearchParams({ page: 0, size: 10 });
    }
  }, []);

  const fetchBookings = async (pageNumber, pageSize) => {
    if (!authUser?.userId) return;

    setBookingsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BOOKING_BACKEND_URL}/driver/${
        authUser.userId
      }/all-booking?offset=${pageNumber}&pageSize=${pageSize}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data.bookingList || []);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error("Error fetching all bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser?.userId) {
      fetchBookings(page, size);
    }
  }, [authLoading, authUser, page, size]);

  const onPageChange = (event) => {
    const newPage = event.first / event.rows;
    const newSize = event.rows;

    setFirst(event.first);
    setRows(event.rows);

    setSearchParams({ page: newPage, size: newSize });
  };

  if (authLoading || bookingsLoading) {
    return <CarLoader message="Loading your rides..." />;
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="py-8 px-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
      <h1 className="text-3xl text-center font-bold mb-4">My Rides</h1>
      <p className="text-sm opacity-80 mb-6">Total Rides: {totalItems}</p>

      <BookingsTable bookings={bookings} loading={bookingsLoading} />

      <div className="flex justify-center mt-6">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalItems}
          rowsPerPageOptions={[10, 20 , 30]}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default MyRides;
