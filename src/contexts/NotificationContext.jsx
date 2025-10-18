import React, { createContext, useContext, useRef, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const toast = useRef(null);
  const [notification, setNotification] = useState({
    visible: false,
    title: "",
    message: "", // can be string or object
    icon: "pi pi-info-circle",
    type: "info", // info | success | warning | error | ride
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
      const { pickup, drop, fare, passenger } = msg;
      return (
        <div className="space-y-3 text-base leading-relaxed">
          <div>
            <p className="font-semibold text-yellow-400">Pickup Location:</p>
            <p className="text-sm">
              {pickup.address || "Address not available"} <br />
              {pickup.lat && pickup.lng && (
                <span className="text-gray-400">
                  ({pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)})
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="font-semibold text-yellow-400">Drop Location:</p>
            <p className="text-sm">
              {drop.address || "Address not available"} <br />
              {drop.lat && drop.lng && (
                <span className="text-gray-400">
                  ({drop.lat.toFixed(4)}, {drop.lng.toFixed(4)})
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="font-semibold text-yellow-400">Fare:</p>
            <p className="text-lg font-bold text-yellow-500">₹{fare || 0}</p>
          </div>

          {passenger && (
            <div>
              <p className="font-semibold text-yellow-400">
                Passenger Details:
              </p>
              <p className="text-sm">
                {passenger.name || "Unknown"} <br />
                Id: {passenger.id}
              </p>
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
        header={notification.title}
        message={renderMessage(notification.message)}
        icon={notification.icon}
        className={`rounded-2xl shadow-xl border ${
          typeColors[notification.type]
        } transition-all duration-300 max-w-md`}
        footer={
          notification.showActions && (
            <div className="flex justify-end gap-2 mt-3">
              <Button
                label={notification.confirmLabel || "Confirm"}
                icon="pi pi-check"
                onClick={handleConfirm}
                className="p-button-sm p-button-success"
              />
              <Button
                label={notification.declineLabel || "Decline"}
                icon="pi pi-times"
                onClick={handleDecline}
                className="p-button-sm p-button-danger"
              />
            </div>
          )
        }
      />

      {children}
    </NotificationContext.Provider>
  );
};
