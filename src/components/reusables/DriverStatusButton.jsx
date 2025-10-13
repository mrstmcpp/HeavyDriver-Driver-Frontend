import React from "react";
import { useSocket } from "../../contexts/SocketContext.jsx";
const DriverStatusButton = () => {
  const { isDriverOnline, goOnline, goOffline, connected } = useSocket();

  const handleToggle = () => {
    if (isDriverOnline) {
      goOffline();
    } else {
      goOnline();
    }
  };

  const getButtonProps = () => {
    if (!isDriverOnline) {
      return {
        icon: "pi pi-ban",
        label: "You are Offline",
        className: "bg-red-600 hover:bg-red-700 text-white",
      };
    }

    if (connected) {
      return {
        icon: "pi pi-wifi",
        label: "You are Online",
        className: "bg-green-600 hover:bg-green-700 text-white",
      };
    }

    return {
      icon: "pi pi-spin pi-spinner",
      label: "Connecting...",
      className:
        "bg-yellow-500 hover:bg-yellow-600 text-black animate-pulse",
    };
  };

  const { icon, label, className } = getButtonProps();

  return (
    <button
      key={label} 
      onClick={handleToggle}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-300 ${className}`}
    >
      <i className={`${icon} text-lg`} />
      {label}
    </button>
  );
};

export default DriverStatusButton;
