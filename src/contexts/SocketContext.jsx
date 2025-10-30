import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import useAuthStore from "./AuthContext.jsx";
import { eventEmitter } from "../utils/eventEmitter";
import { useNotification } from "./NotificationContext.jsx";
import { useLocationStore } from "./LocationContext.jsx";
import useBookingStore from "./BookingContext.jsx";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [isDriverOnline, setDriverOnline] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);
  const { showToast } = useNotification();

  const { authUser, userId, loading: authLoading } = useAuthStore();
  const { getLocation } = useLocationStore();
  const { activeBooking, loadingBooking } = useBookingStore();
  const clientRef = useRef(null);

  const canConnect = !!authUser && !!userId && !authLoading;

  const parseRideEvent = (data) => {
    switch (data.type) {
      case "RIDE_REQUEST":
        return {
          event: "RIDE_REQUEST",
          bookingId: data.bookingId,
          passenger: {
            id: data.passengerId || "Unknown",
            name: data.fullName || "Passenger",
          },
          pickup: {
            address: data.pickupLocation?.address || "Address not available",
            lat: data.pickupLocation?.latitude || 0,
            lng: data.pickupLocation?.longitude || 0,
          },
          drop: {
            address: data.dropLocation?.address || "Address not available",
            lat: data.dropLocation?.latitude || 0,
            lng: data.dropLocation?.longitude || 0,
          },
          fare: data.fare || 0,
        };
      case "RIDE_CANCELLED":
        return {
          event: "RIDE_CANCELLED",
          bookingId: data.bookingId,
          reason: data.reason || "Passenger cancelled the ride.",
        };
      case "RIDE_STARTED":
        return { event: "RIDE_STARTED", bookingId: data.bookingId };
      case "RIDE_COMPLETED":
        return { event: "RIDE_COMPLETED", bookingId: data.bookingId };
      default:
        console.warn("Unknown message type:", data.type);
        return null;
    }
  };

  const connectSocket = useCallback(() => {
    if (!canConnect || clientRef.current) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3004/ws";
    const socket = new SockJS(socketUrl);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      setConnected(true);
      if (!clientRef.current && !activeBooking) {
        showToast("success", "You are online now.", "Ready to accept ride.");
      }
      clientRef.current = stompClient;

      const topic = `/topic/driver/${userId}`;
      stompClient.subscribe(topic, (message) => {
        try {
          const data = JSON.parse(message.body);
          const parsed = parseRideEvent(data);
          if (parsed) eventEmitter.emit(parsed.event, parsed);
          console.log("Socket message:", parsed);
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
      });
    });

    socket.onclose = () => {
      console.warn("Socket disconnected");
      setConnected(false);
      clientRef.current = null;

      setTimeout(() => {
        if (canConnect && isDriverOnline) {
          showToast("error", "Disconnected.", "Attempting to reconnect.");
          console.log("Attempting to reconnect...");
          connectSocket();
        }
      }, 5000);
    };
  }, [canConnect, userId, isDriverOnline]);

  const disconnectSocket = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect(() => {
        setConnected(false);
        showToast(
          "info",
          "You are offline now.",
          "No ride notifications will be received."
        );
        clientRef.current = null;
      });
    }
  }, [showToast]);

  useEffect(() => {
    if (activeBooking && !isDriverOnline && !loadingBooking) {
      console.log("Active booking found, forcing driver online...");
      setDriverOnline(true);
    }
  }, [activeBooking, loadingBooking, isDriverOnline]);

  // Manage socket connection
  useEffect(() => {
    if (canConnect && isDriverOnline) {
      if (!clientRef.current) connectSocket();
    } else {
      if (clientRef.current) disconnectSocket();
    }
  }, [canConnect, isDriverOnline, connectSocket, disconnectSocket]);

  // Periodic location updates
  useEffect(() => {
    if (!connected || !isDriverOnline || loadingBooking) return;

    let interval;
    const updateLocation = async () => {
      try {
        await getLocation();
        console.log(
          `Driver location updated (every ${
            activeBooking ? 8 : 30
          }s) [activeBooking=${activeBooking ? "YES" : "NO"}]`
        );
      } catch (err) {
        console.error("Failed to update location:", err.message);
      }
    };

    updateLocation();
    const intervalTime = activeBooking ? 8000 : 30000;
    interval = setInterval(updateLocation, intervalTime);

    return () => clearInterval(interval);
  }, [connected, isDriverOnline, loadingBooking, activeBooking, getLocation]);

  const goOnline = async () => {
    if (!canConnect) return;
    setDriverOnline(true);
  };

  const goOffline = async () => {
    if (activeBooking) {
      showToast(
        "warn",
        "Ride in progress!",
        "You cannot go offline during an active ride."
      );
      return;
    }
    setDriverOnline(false);
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        isDriverOnline,
        activeBooking,
        loadingBooking,
        clientRef,
        goOnline,
        goOffline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
