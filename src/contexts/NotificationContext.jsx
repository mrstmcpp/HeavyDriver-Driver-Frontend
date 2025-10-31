import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import useBookingStore from "./BookingContext";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { fetchActiveBooking } = useBookingStore();
  const [countdown, setCountdown] = useState(30);
  const [notification, setNotification] = useState({
    visible: false,
    title: "",
    message: "",
    icon: "pi pi-info-circle",
    type: "info",
    onConfirm: null,
    onDecline: null,
    confirmLabel: "Confirm",
    declineLabel: "Decline",
    showActions: false,
  });

  const showNotification = (config) => {
    setNotification({
      visible: true,
      showActions: false,
      ...config,
    });
    setCountdown(30);
  };

  const hideNotification = () =>
    setNotification((n) => ({ ...n, visible: false }));

  const showToast = (severity, summary, detail, life = 3000) => {
    toast.current?.show({ severity, summary, detail, life });
  };

  const handleConfirm = () => {
    notification?.onConfirm?.();

    showToast("success", "Confirmed", "Action completed successfully");
    hideNotification();
  };

  const handleDecline = () => {
    notification?.onDecline?.();
    showToast("warn", "Declined", "Action was cancelled");
    hideNotification();
  };

  // Auto-close countdown
  useEffect(() => {
    if (!notification.visible) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          hideNotification();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [notification.visible]);

  const typeColors = {
    info: "border-blue-400 bg-blue-500/10 text-blue-200",
    success: "border-green-400 bg-green-500/10 text-green-200",
    warning: "border-yellow-400 bg-yellow-500/10 text-yellow-200",
    error: "border-red-400 bg-red-500/10 text-red-200",
    ride: "border-yellow-500 bg-yellow-500/10 text-yellow-300",
  };

  const renderMessage = (msg) => {
    if (typeof msg === "string") return <p className="text-base">{msg}</p>;

    if (msg.type === "RIDE_REQUEST") {
      const { pickup, drop, passenger } = msg;
      return (
        <div className="space-y-3 text-base leading-relaxed">
          <div>
            <p className="font-semibold text-yellow-400">Pickup Location:</p>
            <p className="text-sm">{pickup.address || "Address not available"}</p>
          </div>

          <div>
            <p className="font-semibold text-yellow-400">Drop Location:</p>
            <p className="text-sm">{drop.address || "Address not available"}</p>
          </div>

          {passenger && (
            <div>
              <p className="font-semibold text-yellow-400">Passenger:</p>
              <p className="text-sm">{passenger.fullName || "Unknown"}</p>
            </div>
          )}

        </div>
      );
    }

    return <p className="text-base">{JSON.stringify(msg)}</p>;
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showToast }}>
      <Toast ref={toast} />

      <ConfirmDialog
        visible={notification.visible}
        onHide={hideNotification}
        header={
          <div className="flex items-center gap-2">
            <i className={`${notification.icon} text-xl`} />
            <span className="text-lg font-semibold">{notification.title}</span>
          </div>
        }
        message={
          <div className="space-y-4">
            {renderMessage(notification.message)}
            <p className="text-xs text-gray-400 text-center italic">
              Auto closing in {countdown}s
            </p>
          </div>
        }
        className={`rounded-2xl shadow-2xl border ${typeColors[notification.type]} 
          backdrop-blur-md bg-opacity-70 transition-all duration-300 max-w-md
          transform scale-105 hover:scale-100`}
        footer={
          notification.showActions && (
            <div className="flex justify-end gap-3 mt-3">
              <Button
                label={notification.confirmLabel || "Confirm"}
                icon="pi pi-check"
                onClick={handleConfirm}
                className="p-button-rounded p-button-success font-medium"
              />
              <Button
                label={notification.declineLabel || "Decline"}
                icon="pi pi-times"
                onClick={handleDecline}
                className="p-button-rounded p-button-danger font-medium"
              />
            </div>
          )
        }
      />

      {children}
    </NotificationContext.Provider>
  );
};
