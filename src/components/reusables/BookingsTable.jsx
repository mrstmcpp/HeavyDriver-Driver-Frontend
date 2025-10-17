import React from "react";

const BookingsTable = ({ bookings = [], loading }) => {
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        Loading bookings...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        No bookings found for today.
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 
                 dark:border-gray-700 shadow-md overflow-hidden"
    >
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">Booking ID</th>
            <th className="p-3">Date</th>
            <th className="p-3">Earnings</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
            >
              <td className="p-3">{booking.id}</td>
              <td className="p-3">
                {new Date(booking.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              {/* Mock earnings column for now */}
              <td className="p-3 text-yellow-500">₹{Math.floor(Math.random() * 300) + 100}</td>
              <td
                className={`p-3 font-semibold ${
                  booking.status === "COMPLETED"
                    ? "text-green-500"
                    : booking.status === "CANCELLED"
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {booking.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
