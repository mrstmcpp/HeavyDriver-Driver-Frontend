import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputOtp } from "primereact/inputotp";
import useAuthStore from "../../contexts/AuthContext"

const ActiveRide = () => {
  const {activeBooking, userId} = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [rideStarted, setRideStarted] = useState(false);

  const handleOtpSubmit = () => {
    if (otp === "1234") {
      setRideStarted(true);
      setVisible(false);
      setError("");
    } else {
      setError("Invalid OTP. Please try again.");
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
        onClick={() => setVisible(false)}
      />
      <Button
        label="Start Ride"
        icon="pi pi-check"
        className="bg-yellow-500 text-black font-semibold border-none hover:bg-yellow-400"
        onClick={handleOtpSubmit}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col justify-center items-center p-4">
      {!rideStarted ? (
        <>
          <h1 className="text-4xl font-bold mb-3">Active Ride</h1>
          <p className="text-zinc-400 mb-6">
            Note: You cannot leave this page until the ride starts.
          </p>

          <Button
            label="Start Ride"
            icon="pi pi-play"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-5 rounded-lg border-none"
            onClick={() => setVisible(true)}
          />

          {/* OTP Dialog */}
          <Dialog
            header="Enter OTP to Start Ride"
            visible={visible}
            style={{ width: "25rem", background: "#111" }}
            onHide={() => setVisible(false)}
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
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3 text-yellow-400">
            Ride Started 🚗
          </h1>
          <p className="text-zinc-400">Enjoy your trip!</p>
        </div>
      )}
    </div>
  );
};

export default ActiveRide;
