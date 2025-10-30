import React from "react";
import { useSocket } from "../../contexts/SocketContext.jsx";

const DriverStatusButton = () => {
  const { isDriverOnline, goOnline, goOffline, connected, activeBooking } = useSocket();

  const handleToggle = () => {
    if (activeBooking) return; 
    if (isDriverOnline) goOffline();
    else goOnline();
  };

  const getButtonProps = () => {
    if (activeBooking) {
      return {
        icon: "pi pi-lock",
        label: "Active Ride - Locked Online",
        className: "bg-green-700 text-white cursor-not-allowed opacity-90",
        disabled: true,
      };
    }

    if (!isDriverOnline) {
      return {
        icon: "pi pi-ban",
        label: "You are Offline",
        className: "bg-red-600 hover:bg-red-700 text-white",
        disabled: false,
      };
    }

    if (connected) {
      return {
        icon: "pi pi-wifi",
        label: "You are Online",
        className: "bg-green-600 hover:bg-green-700 text-white",
        disabled: false,
      };
    }

    return {
      icon: "pi pi-spin pi-spinner",
      label: "Connecting...",
      className: "bg-yellow-500 hover:bg-yellow-600 text-black animate-pulse",
      disabled: true,
    };
  };

  const { icon, label, className, disabled } = getButtonProps();

  return (
    <button
      key={label}
      onClick={handleToggle}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-300 ${className}`}
    >
      <i className={`${icon} text-lg`} />
      {label}
    </button>
  );
};

export default DriverStatusButton;
