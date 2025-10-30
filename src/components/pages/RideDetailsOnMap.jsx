import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CarLoader from "../reusables/CarLoader";
import DriverMap from "../maps/DriverMap";
import useAuthStore from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { Button } from "primereact/button";

const RideDetailsOnMap = ({ rideRequest: rideRequestProp }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Always defined object — prevents conditional hook calls
  const rideRequest = rideRequestProp || location.state?.rideData || {};

  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const { userId } = useAuthStore();
  const { clientRef, startRide } = useSocket();

  // Simulate loading delay for smoother UI
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Countdown & redirect logic
  useEffect(() => {
    if (!rideRequest?.bookingId) return;

    if (countdown === 0) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, rideRequest?.bookingId, navigate]);

  // ✅ useMemo hooks always run, even with fallback
  const pickup = useMemo(() => {
    return rideRequest?.pickup || { lat: 25.437, lng: 81.842 };
  }, [rideRequest?.pickup]);

  const dropoff = useMemo(() => {
    return rideRequest?.drop || { lat: 25.453, lng: 81.862 };
  }, [rideRequest?.drop]);

  const passenger = rideRequest?.passenger || { passengerName: "Unknown" };
  const fare = rideRequest?.fare || 120;

  const handleAccept = () => {
    if (!clientRef?.current || !rideRequest?.bookingId) return;

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
    navigate("/ride-active");
  };

  const handleReject = () => {
    if (!clientRef?.current || !rideRequest?.bookingId) return;

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

    navigate("/dashboard");
  };

  if (loading) {
    return <CarLoader message="Loading your dashboard..." />;
  }

  // ✅ Prevent map render if rideRequest not loaded yet
  if (!rideRequest?.bookingId) {
    return (
      <div className="text-center text-red-500 mt-10">
        Ride details not found.
      </div>
    );
  }

  return (
    <div className="py-8 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="md:w-1/4 w-full bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <div>
            <h2 className="text-3xl text-center font-semibold text-yellow-400 mb-4">
              Ride Details
            </h2>
            <p className="mb-2 text-center text-red-400 font-semibold">
              Please accept the ride within{" "}
              <span className="text-yellow-400">{countdown}s</span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">Passenger:</span>{" "}
              <span className="text-gray-300">{passenger.passengerName}</span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">
                Pickup Address:
              </span>{" "}
              <span className="text-gray-300">
                {pickup.address || "Address not available"}
              </span>
            </p>
            <p className="mb-2">
              <span className="text-yellow-400 font-semibold">
                Drop Address:
              </span>{" "}
              <span className="text-gray-300">
                {dropoff.address || "Address not available"}
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

        {/* Right Section (Map) */}
        <div className="flex-1 min-h-[400px] bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <DriverMap
            pickup={{
              latitude: pickup.lat,
              longitude: pickup.lng,
            }}
            dropoff={{
              latitude: dropoff.lat,
              longitude: dropoff.lng,
            }}
            rideStatus="ASSIGNING_DRIVER"
          />
        </div>
      </div>
    </div>
  );
};

export default RideDetailsOnMap;
