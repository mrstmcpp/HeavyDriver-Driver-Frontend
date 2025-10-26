import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputOtp } from "primereact/inputotp";
import useAuthStore from "../../contexts/AuthContext";
import useBookingStore from "../../contexts/BookingContext";
import CarLoader from "../reusables/CarLoader.jsx";
import { useNavigate } from "react-router-dom";
import DriverMap from "../maps/DriverMap.jsx";
import RideStatusButton from "../reusables/RideStatusButton.jsx";
import { useNotification } from "../../contexts/NotificationContext.jsx";

const ActiveRide = () => {
  const { userId, loading: authLoading } = useAuthStore();
  const { activeBooking } = useBookingStore();
  const [rideDetails, setRideDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [visible, setVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { showToast } = useNotification();

  const navigate = useNavigate();

  const fetchRideDetails = useCallback(async () => {
    if (!activeBooking || !userId) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/details/${activeBooking}`,
        { userId, role: "DRIVER" }
      );
      setRideDetails(res.data);
      console.log("Fetched ride details:", res.data);
    } catch (err) {
      console.error("Failed to fetch ride details:", err);
      setError("Failed to fetch ride details.");
    } finally {
      setIsFetching(false);
    }
  }, [activeBooking, userId]);

  useEffect(() => {
    if (authLoading) return;
    if (!activeBooking) {
      setIsFetching(false);
      navigate("/");
      return;
    }
    fetchRideDetails();
  }, [authLoading, activeBooking, userId, fetchRideDetails, navigate]);

  const handleMarkArrived = async () => {
    if (!rideDetails) return;
    setIsButtonLoading(true);
    setError("");
    try {
      await axios.put(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/${
          rideDetails.bookingId
        }/updateStatus`,
        { driverId: userId, bookingStatus: "ARRIVED" }
      );
      setRideDetails((prev) => ({ ...prev, bookingStatus: "ARRIVED" }));
    } catch (err) {
      console.error("Failed to mark arrived:", err);
      setError("Failed to mark as arrived. Please try again.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!rideDetails) {
      setError("Ride details not loaded.");
      return;
    }

    setIsButtonLoading(true);
    setError("");

    try {
      await axios.put(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/${
          rideDetails.bookingId
        }/updateStatus`,
        { driverId: userId, bookingStatus: "IN_RIDE", otp: otp }
      );
      // Fix: Update bookingStatus, not status
      setRideDetails((prev) => ({ ...prev, bookingStatus: "IN_RIDE" }));
      showToast("info", "Ride Started", "Be safe.");
      setVisible(false);
      setOtp("");
    } catch (err) {
      showToast("error", err.response.data.error, "Please try again.");
      console.error("Failed to start ride:", err);
      setError(err.response.data.error);
    }
    setIsButtonLoading(false);
  };

  const handleEndRide = async () => {
    if (!rideDetails) return;
    setIsButtonLoading(true);
    setError("");
    try {
      await axios.put(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/${
          rideDetails.bookingId
        }/updateStatus`,
        { driverId: userId, bookingStatus: "COMPLETED" }
      );
      showToast("info", "Ride Ended", "Thank you for driving.");
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to end ride:", err);
      showToast("error", err.response.data.error, "Please try again.");
      setError("Failed to end the ride. Please try again.");
      setIsButtonLoading(false);
    }
  };

  const otpInputTemplate = ({ events, props }) => (
    <input
      {...events}
      {...props}
      type="text"
      maxLength={1}
      className="w-12 h-12 text-xl text-yellow-400 text-center bg-black border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md mx-1"
    />
  );

  const footerContent = (
    <div className="flex justify-end gap-3">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text text-yellow-400 hover:text-yellow-300"
        onClick={() => {
          setVisible(false);
          setError("");
          setOtp("");
        }}
        disabled={isButtonLoading}
      />
      <Button
        label="Start Ride"
        icon="pi pi-check"
        className="bg-yellow-500 text-black font-semibold border-none hover:bg-yellow-400"
        onClick={handleOtpSubmit}
        loading={isButtonLoading}
      />
    </div>
  );

  if (authLoading) {
    return <CarLoader message="Fetching session data..." />;
  }

  if (!activeBooking) {
    return null;
  }

  if (isFetching) {
    return <CarLoader message="Fetching ride details..." />;
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-bold mb-3">
          {error ? "Error Loading Ride" : "No Active Ride"}
        </h1>
        <p className="text-zinc-400 mb-6">
          {error ? error : "You do not have any active rides at the moment."}
        </p>
        <Button
          label="Go to Dashboard"
          icon="pi pi-home"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-5 rounded-lg border-none"
          onClick={() => navigate("/dashboard")}
        />
      </div>
    );
  }

  const pickup = rideDetails?.pickupLocation;
  const dropoff = rideDetails?.dropoffLocation;
  const passenger = rideDetails?.passenger || { name: "Unknown" };
  const fare = rideDetails?.fare || 0;

  return (
    <div className="py-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-yellow-400">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 w-full bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col ">
          <h2 className="text-3xl text-center font-semibold text-yellow-400 mb-4">
            Active Ride
          </h2>
          <p className="mb-2">
            <span className="text-yellow-400 font-semibold">Passenger:</span>{" "}
            <span className="text-gray-300">{passenger.name}</span>
          </p>
          <p className="mb-3">
            <span className="text-yellow-400 font-semibold">Pickup:</span>{" "}
            <span className="text-gray-300 block">
              {pickup?.address
                ? pickup.address
                : `${pickup?.latitude}, ${pickup?.longitude}`}
            </span>
          </p>

          <p className="mb-3">
            <span className="text-yellow-400 font-semibold">Dropoff:</span>{" "}
            <span className="text-gray-300 block">
              {dropoff?.address
                ? dropoff.address
                : `${dropoff?.latitude}, ${dropoff?.longitude}`}
            </span>
          </p>

          <p className="mb-2">
            <span className="text-yellow-400 font-semibold">Fare:</span>{" "}
            <span className="text-gray-300">₹{fare}</span>
          </p>
          <p className="mb-6">
            <span className="text-yellow-400 font-semibold">Status:</span>{" "}
            <span className="text-gray-300 capitalize">
              {/* Fix: Use bookingStatus for display, as in your original code */}
              {rideDetails?.bookingStatus}
            </span>
          </p>

          {/* Fix: Pass bookingStatus to the button component */}
          <RideStatusButton
            status={rideDetails?.bookingStatus}
            isLoading={isButtonLoading}
            onMarkArrived={handleMarkArrived}
            onStartRideClick={() => setVisible(true)}
            onEndRide={handleEndRide}
          />

          {error && !visible && (
            <p className="text-red-500 mt-3 text-sm font-medium text-center">
              {error}
            </p>
          )}
        </div>

        <div className="flex-1 min-h-[400px] bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
          {/* Fix: Pass bookingStatus to the map component */}
          <DriverMap
            pickup={pickup}
            dropoff={dropoff}
            rideStatus={rideDetails?.bookingStatus}
          />
        </div>
      </div>

      <Dialog
        header="Enter OTP to Start Ride"
        visible={visible}
        style={{ width: "25rem", background: "#111" }}
        onHide={() => {
          if (isButtonLoading) return;
          setVisible(false);
          setError("");
          setOtp("");
        }}
        modal
        footer={footerContent}
        contentClassName="bg-black text-yellow-400"
        headerClassName="bg-zinc-900 text-yellow-400"
      >
        <div className="flex flex-col justify-center items-center mt-2">
          <p className="text-zinc-400 mb-3 text-center">
            Please enter the 4-digit OTP provided by the rider.
          </p>

          <InputOtp
            value={otp}
            onChange={(e) => setOtp(e.value)}
            length={4}
            inputTemplate={otpInputTemplate}
            style={{ gap: 0 }}
          />

          {error && (
            <p className="text-red-500 mt-3 text-sm font-medium">{error}</p>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ActiveRide;
