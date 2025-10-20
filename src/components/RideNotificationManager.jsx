import React, { useEffect } from "react";
import { eventEmitter } from "../utils/eventEmitter";
import { useSocket } from "../contexts/SocketContext";
import { useNotification } from "../contexts/NotificationContext";
import useAuthStore from "../contexts/AuthContext";


export default function RideNotificationManager() {
  const {userId} = useAuthStore();
  const { clientRef, startRide, endRide } = useSocket();
  const { showNotification, showToast } = useNotification();
  
  useEffect(() => {
    const handleRideRequest = (data) => {
      showNotification({
        title: "New Ride Request",
        icon: "pi pi-car",
        type: "ride",
        showActions: true,
        confirmLabel: "Accept",
        declineLabel: "Decline",
        message: {
          type: "RIDE_REQUEST",
          pickup: data.pickup,
          drop: data.drop,
          fare: data.fare,
          passenger: data.passenger,
        },
        onConfirm: () => {
          if (!clientRef.current) return;
          clientRef.current.send(
            `/app/rideResponse/${userId}`,
            {},
            JSON.stringify({
              response: true,
              bookingId: data.bookingId,
              driverId: userId,
              passengerId: data.passenger.id,
            })
          );
          startRide(data.bookingId);
        },
        onDecline: () => {
          if (!clientRef.current) return;
          clientRef.current.send(
            `/app/rideResponse/${userId}`,
            {},
            JSON.stringify({
              response: false,
              bookingId: data.bookingId,
              driverId: userId,
              passengerId: data.passenger.id,
            })
          );
        },
      });
    };

    const handleRideCancelled = (data) => {
      showNotification({
        title: "Ride Cancelled",
        icon: "pi pi-times-circle",
        type: "error",
        message: data.reason || "Passenger cancelled the ride.",
        showActions: false,
      });
      endRide();
    };

    const handleRideStarted = () =>
      showToast("success", "Ride Started", "Passenger onboard — drive safe!");

    const handleRideCompleted = () => {
      showToast("info", "Ride Completed", "Trip finished successfully.");
      endRide();
    };

    eventEmitter.on("RIDE_REQUEST", handleRideRequest);
    eventEmitter.on("RIDE_CANCELLED", handleRideCancelled);
    eventEmitter.on("RIDE_STARTED", handleRideStarted);
    eventEmitter.on("RIDE_COMPLETED", handleRideCompleted);

    return () => {
      eventEmitter.off("RIDE_REQUEST", handleRideRequest);
      eventEmitter.off("RIDE_CANCELLED", handleRideCancelled);
      eventEmitter.off("RIDE_STARTED", handleRideStarted);
      eventEmitter.off("RIDE_COMPLETED", handleRideCompleted);
    };
  }, [clientRef, showNotification, showToast, startRide, endRide]);

  return null;
}
