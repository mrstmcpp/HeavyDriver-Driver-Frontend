import React from "react";
import { Button } from "primereact/button";
const RideStatusButton = ({
  status,
  onMarkArrived,
  onStartRideClick,
  onEndRide,
  isLoading,
}) => {
  const buttonClassName =
    "bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-5 rounded-lg border-none";

  switch (status) {
    case "SCHEDULED":
      return (
        <Button
          label="Mark Arrived"
          icon="pi pi-map-marker"
          className={buttonClassName}
          onClick={onMarkArrived}
          loading={isLoading}
        />
      );
    case "ARRIVED":
      return (
        <Button
          label="Start Ride"
          icon="pi pi-play"
          className={buttonClassName}
          onClick={onStartRideClick}
          loading={isLoading}
        />
      );
    case "IN_RIDE":
      return (
        <Button
          label="End Ride"
          icon="pi pi-stop-circle"
          className="bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-5 rounded-lg border-none" // Different color for "End"
          onClick={onEndRide}
          loading={isLoading}
        />
      );
    case "COMPLETED":
      return (
        <p className="text-center text-green-500 font-semibold">
          Ride Completed!
        </p>
      );
    default:
      return null;
  }
};

export default RideStatusButton;
