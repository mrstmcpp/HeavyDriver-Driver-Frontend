import React, { useState, useEffect, useCallback } from "react";
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
import PageMeta from "../common/PageMeta.jsx";

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
      // console.log("Fetched ride details:", res.data);
    } catch (err) {
      // console.error("Failed to fetch ride details:", err);
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
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/${rideDetails.bookingId}/updateStatus`,
        { driverId: userId, bookingStatus: "ARRIVED" }
      );
      setRideDetails((prev) => ({ ...prev, bookingStatus: "ARRIVED" }));
    } catch (err) {
      // console.error("Failed to mark arrived:", err);
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
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/${rideDetails.bookingId}/updateStatus`,
        { driverId: userId, bookingStatus: "IN_RIDE", otp: otp }
      );
      setRideDetails((prev) => ({ ...prev, bookingStatus: "IN_RIDE" }));
      showToast("info", "Ride Started", "Be safe.");
      setVisible(false);
      setOtp("");
    } catch (err) {
      showToast("error", err.response?.data?.error || "Failed to start ride", "Please try again.");
      // console.error("Failed to start ride:", err);
      setError(err.response?.data?.error || "Failed to start ride.");
    }
    setIsButtonLoading(false);
  };

  const handleEndRide = async () => {
    if (!rideDetails) return;
    setIsButtonLoading(true);
    setError("");

    try {
      await axios.put(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/${rideDetails.bookingId}/updateStatus`,
        { driverId: userId, bookingStatus: "COMPLETED" }
      );

      showToast("info", "Ride Ended", "Thank you for driving.");

      useBookingStore.getState().clearActiveBooking();

      setIsButtonLoading(false);

      navigate(`/rides/details/${rideDetails.bookingId}`);
    } catch (err) {
      // console.error("Failed to end ride:", err);
      showToast("error", err.response?.data?.error || "Failed to end ride", "Please try again.");
      setError("Failed to end the ride. Please try again.");
      setIsButtonLoading(false);
    }
  };

  // Tailwind-only OTP input template (neon, sharp, clean)
  const otpInputTemplate = ({ events, props }) => (
    <input
      {...events}
      {...props}
      type="text"
      maxLength={1}
      className="w-12 h-12 text-lg text-amber-300 text-center bg-[#0f0f0f] border border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400/80 rounded-xl mx-1 shadow-[0_0_20px_rgba(255,193,7,0.08)]"
    />
  );

  const footerContent = (
    <div className="flex justify-end gap-3">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text text-amber-300 hover:text-amber-200"
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
        className="bg-amber-500 text-black font-semibold border-none hover:bg-amber-400 transition-all"
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
      <div className=" bg-[#0b0b0c] text-amber-300 flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-semibold tracking-wide mb-3">
          {error ? "Error Loading Ride" : "No Active Ride"}
        </h1>
        <p className="text-zinc-400 mb-6">
          {error ? error : "You do not have any active rides at the moment."}
        </p>
        <Button
          label="Go to Dashboard"
          icon="pi pi-home"
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 px-5 rounded-xl border-none"
          onClick={() => navigate("/dashboard")}
        />
      </div>
    );
  }

  const pickup = rideDetails?.pickupLocation;
  const dropoff = rideDetails?.dropoffLocation;
  const passenger = rideDetails?.passengerName || "Unknown";
  const fare = rideDetails?.fare || 0;

  return (
    <>
      <PageMeta page={"activeRide"} />
      <div className=" bg-[#0a0a0b] text-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Ride Card */}
            <div className="md:w-1/3 w-full bg-[#101012] border border-zinc-800/70 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
              <div className="mb-6">
                <h2 className="text-3xl font-semibold text-amber-400 tracking-wide text-center">
                  Active Ride
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-medium min-w-20">Passenger:</span>
                  <span className="text-zinc-300">{passenger}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-medium min-w-20">Pickup:</span>
                  <span className="text-zinc-300">
                    {pickup?.address ? pickup.address : `${pickup?.latitude}, ${pickup?.longitude}`}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-medium min-w-20">Dropoff:</span>
                  <span className="text-zinc-300">
                    {dropoff?.address ? dropoff.address : `${dropoff?.latitude}, ${dropoff?.longitude}`}
                  </span>
                </p>
                
                <p className="flex items-start gap-2">
                  <span className="text-amber-400 font-medium min-w-20">Status:</span>
                  <span className="capitalize text-zinc-300">{rideDetails?.bookingStatus}</span>
                </p>
              </div>

              <div className="mt-6">
                <RideStatusButton
                  status={rideDetails?.bookingStatus}
                  isLoading={isButtonLoading}
                  onMarkArrived={handleMarkArrived}
                  onStartRideClick={() => setVisible(true)}
                  onEndRide={handleEndRide}
                />
              </div>

              {error && !visible && (
                <p className="text-red-500 mt-4 text-center text-sm font-medium">{error}</p>
              )}
            </div>

            {/* Right: Map */}
            <div className="flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-zinc-800/70 bg-[#121214] shadow-[0_0_40px_rgba(0,0,0,0.25)]">
              <DriverMap pickup={pickup} dropoff={dropoff} rideStatus={rideDetails?.bookingStatus} />
            </div>
          </div>
        </div>

        {/* OTP Dialog */}
        <Dialog
          header="Enter OTP to Start Ride"
          visible={visible}
          style={{ width: "26rem", background: "#0f0f10" }}
          onHide={() => {
            if (isButtonLoading) return;
            setVisible(false);
            setError("");
            setOtp("");
          }}
          modal
          footer={footerContent}
          contentClassName="bg-[#0a0a0b] text-amber-300"
          headerClassName="bg-[#0f0f10] text-amber-300"
        >
          <div className="flex flex-col justify-center items-center mt-2">
            <p className="text-zinc-400 mb-4 text-center">
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
    </>
  );
};

export default ActiveRide;
