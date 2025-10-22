import React, { useState, useEffect } from "react";
import CarLoader from "../reusables/CarLoader";
import DriverMap from "../maps/DriverMap";
import useAuthStore from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { Button } from "primereact/button";

const RideDetailsOnMap = ({ rideRequest }) => {
  const [loading, setLoading] = useState(true);
  const { userId } = useAuthStore();
  const { clientRef, startRide } = useSocket();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  // fallback data if no rideRequest passed
  const pickup = rideRequest?.pickup || { lat: 25.437, lng: 81.842 };
  const dropoff = rideRequest?.drop || { lat: 25.453, lng: 81.862 };
  const passenger = rideRequest?.passenger || { name: "John Doe" };
  const fare = rideRequest?.fare || 120;

  const handleAccept = () => {
    if (!clientRef.current) return;
    clientRef.current.send(
      `/app/rideResponse/${userId}`,
      {},
      JSON.stringify({
        response: true,
        bookingId: rideRequest.bookingId,
        driverId: userId,
        passengerId: passenger.id,
      })
    );
    startRide(rideRequest.bookingId);
  };

  const handleReject = () => {
    if (!clientRef.current) return;
    clientRef.current.send(
      `/app/rideResponse/${userId}`,
      {},
      JSON.stringify({
        response: false,
        bookingId: rideRequest.bookingId,
        driverId: userId,
        passengerId: passenger.id,
      })
    );
  };

  return (
    <div className="px-6 py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Ride details */}
        <div className="md:w-1/4 w-full bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col ">
          <div>
            <h2 className="text-3xl text-center font-semibold text-yellow-400 mb-4">
              Ride Details
            </h2>
            <p className="mb-2">
              <span className="text-red-400 font-semibold">
                Note:
                <span>{" "}</span>
              <span className="text-red-400">Please accept the ride within 30 sec.</span>
              </span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">
                Passenger:
              </span>{" "}
              <span className="text-gray-300">{passenger.name}</span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">
                Pickup Address:
              </span>{" "}
              <span className="text-gray-300">
                {pickup.lat}, {pickup.lng}
              </span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">
                Drop Address:
              </span>{" "}
              <span className="text-gray-300">
                {dropoff.lat}, {dropoff.lng}
              </span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">Fare:</span>{" "}
              <span className="text-gray-300">₹{fare}</span>
            </p>
            <p className="mb-4">
              <span className="text-yellow-400 font-semibold">Status:</span>{" "}
              <span className="text-gray-300">Incoming</span>
            </p>
          </div>

          {/* Accept / Reject buttons */}
          <div className="flex gap-4 mt-4">
            <Button
              label="Accept"
              icon="pi pi-check"
              className="p-button-success w-full md:w-1/2"
              onClick={handleAccept}
            />
            <Button
              label="Reject"
              icon="pi pi-times"
              className="p-button-danger w-full md:w-1/2"
              onClick={handleReject}
            />
          </div>
        </div>

        {/* Right side - Map */}
        <div className="flex-1 min-h-[400px] bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <DriverMap pickup={pickup} dropoff={dropoff} rideStatus="incoming" />
        </div>
      </div>
    </div>
  );
};

export default RideDetailsOnMap;
