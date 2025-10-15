import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import { updateDriverStatus } from "../api/mockApi.js";
import { useNotification } from "./NotificationContext.jsx";
import useAuthStore from "./AuthContext.jsx";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [rideActive, setRideActive] = useState(false);
  const [isDriverOnline, setDriverOnline] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);

  const { authUser, userId, loading } = useAuthStore();
  const { showNotification } = useNotification();

  const clientRef = useRef(null);
  const rideSubscriptionRef = useRef(null);

  const canConnect = !!authUser && !!userId && !loading;

  /** 
   * Memoized connectSocket — stable reference 
   */
  const connectSocket = useCallback(() => {
    if (!canConnect || clientRef.current) return;

    const socket = new SockJS("http://localhost:3004/ws");
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      setConnected(true);
      clientRef.current = stompClient;

      const notificationTopic = `/topic/driver/${userId}`;

      stompClient.subscribe(notificationTopic, (message) => {
        const data = JSON.parse(message.body);

        showNotification({
          title: "New Ride Request",
          icon: "pi pi-car",
          type: "ride",
          showActions: true,
          confirmLabel: "Accept Ride",
          declineLabel: "Decline",
          message: {
            type: "rideRequest",
            pickup: {
              address: data.pickupLocation.pickupAddress,
              lat: data.pickupLocation.latitude,
              lng: data.pickupLocation.longitude,
            },
            drop: {
              address: data.dropLocation.dropAddress,
              lat: data.dropLocation.latitude,
              lng: data.dropLocation.longitude,
            },
            fare: data.fare,
            passenger: {
              name: data.passengerName,
              id: data.passengerId,
            },
          },
          onConfirm: () => {
            stompClient.send(
              `/app/rideResponse/${userId}`,
              {},
              JSON.stringify({
                response: true,
                bookingId: data.bookingId,
                driverId: userId,
                passengerId: data.passengerId,
              })
            );
            startRide(data.bookingId);
          },
          onDecline: () => {
            stompClient.send(
              `/app/rideResponse/${userId}`,
              {},
              JSON.stringify({
                response: false,
                bookingId: data.bookingId,
                driverId: userId,
                passengerId: data.passengerId,
              })
            );
          },
        });
      });
    });

    stompClient.onclose = () => {
      setConnected(false);
      clientRef.current = null;
    };
  }, [canConnect, userId, showNotification]);

  const disconnectSocket = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect(() => {
        setConnected(false);
        clientRef.current = null;
      });
    }
  }, []);

  /** 
   * Handle ride subscription
   */
  useEffect(() => {
    if (connected && rideActive && currentRideId && clientRef.current) {
      const topic = `/topic/driver/${userId}/ride/${currentRideId}/location`;
      rideSubscriptionRef.current = clientRef.current.subscribe(topic, (message) => {
        const update = JSON.parse(message.body);
        console.log("Ride Location Update:", update);
      });
    } else if (rideSubscriptionRef.current) {
      rideSubscriptionRef.current.unsubscribe();
      rideSubscriptionRef.current = null;
    }

    return () => {
      if (rideSubscriptionRef.current) {
        rideSubscriptionRef.current.unsubscribe();
      }
    };
  }, [connected, rideActive, currentRideId, userId]);

  /**
   * Auto-connect when user becomes available
   */
  useEffect(() => {
    if (canConnect && !clientRef.current) {
      connectSocket();
    } else if (!authUser && clientRef.current) {
      disconnectSocket();
      setDriverOnline(false);
    }
  }, [canConnect, authUser, connectSocket, disconnectSocket]);

  const goOnline = async () => {
    if (!canConnect) return;
    try {
      await updateDriverStatus(userId, "ACTIVE");
      setDriverOnline(true);
      connectSocket();
    } catch (err) {
      console.error("Failed to go online:", err);
    }
  };

  const goOffline = async () => {
    if (!userId) return;
    try {
      await updateDriverStatus(userId, "INACTIVE");
      setDriverOnline(false);
      disconnectSocket();
    } catch (err) {
      console.error("Failed to go offline:", err);
    }
  };

  const startRide = (rideId) => {
    setCurrentRideId(rideId);
    setRideActive(true);
  };

  const endRide = () => {
    setCurrentRideId(null);
    setRideActive(false);
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        rideActive,
        isDriverOnline,
        goOnline,
        goOffline,
        startRide,
        endRide,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
