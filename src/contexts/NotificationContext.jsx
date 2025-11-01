import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import useBookingStore from "./BookingContext";
// Note: Timeline component is no longer needed unless used elsewhere
// import { Timeline } from 'primereact/timeline';

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
      const pickupAddress =
        msg.pickup?.address
      const dropAddress =
        msg.drop?.address

      return (
        <div className="flex gap-4 pt-2">
          <div className="flex flex-col items-center self-stretch">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg flex-shrink-0"
              style={{ backgroundColor: "#4CAF50" }}
            >
              <i className="pi pi-map-marker text-white text-md" />
            </span>
            <div
              className="w-0.5 flex-1 my-1" // flex-1 makes it fill vertical space
              style={{ backgroundColor: "#FFC107" }} // Yellow line
            ></div>
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg flex-shrink-0"
              style={{ backgroundColor: "#FFC107" }}
            >
              <i className="pi pi-flag text-white text-md" />
            </span>
          </div>

          {/* Col 2: Text Content */}
          <div className="flex flex-col justify-between flex-1">
            {/* Pickup Text */}
            <div className="text-sm text-gray-200 font-medium leading-5">
              <div className="text-base font-semibold">Pickup Location</div>
              <div className="text-xs opacity-80">{pickupAddress}</div>
            </div>

            {/* Drop Text */}
            <div className="text-sm text-gray-200 font-medium leading-5">
              <div className="text-base font-semibold">Drop Location</div>
              <div className="text-xs opacity-80">{dropAddress}</div>
            </div>
          </div>
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
        /**
         * ## 🎨 UI TWEAK ##
         * Removed 'transform scale-105 hover:scale-100' for a stable,
         * professional look. Added 'overflow-hidden'.
         */
        className={`rounded-2xl shadow-2xl border ${
          typeColors[notification.type]
        } 
          backdrop-blur-md bg-opacity-70 transition-all duration-300 max-w-md
          overflow-hidden`}
        footer={
          notification.showActions && (
            <div className="flex justify-end gap-3">
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