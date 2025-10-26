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
import { updateDriverStatus } from "../api/mockApi.js";
import useAuthStore from "./AuthContext.jsx";
import { eventEmitter } from "../utils/eventEmitter";
import { useNotification } from "./NotificationContext.jsx";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [rideActive, setRideActive] = useState(false);
  const [isDriverOnline, setDriverOnline] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);
  const { showToast } = useNotification();

  const { authUser, userId, loading } = useAuthStore();
  const clientRef = useRef(null);

  const canConnect = !!authUser && !!userId && !loading;

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
            address:
              data.pickupLocation?.address || "Address not available",
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
        return {
          event: "RIDE_STARTED",
          bookingId: data.bookingId,
        };

      case "RIDE_COMPLETED":
        return {
          event: "RIDE_COMPLETED",
          bookingId: data.bookingId,
        };

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
      showToast("success", "You are online now.", "Ready for ride.");
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
          showToast(
            "error",
            "Disconnected.",
            "Attempting to reconnect."
          );
          console.log("Attempting to reconnect...");
          connectSocket();
        }
      }, 5000);
    };
  }, [canConnect, userId, isDriverOnline]);

  const disconnectSocket = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect(() => {
        console.log("Disconnected from socket");
        setConnected(false);
        showToast(
          "info",
          "You are offline now.",
          "No ride notifications will be received."
        );
        clientRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    if (canConnect && isDriverOnline) {
      if (!clientRef.current) {
        connectSocket();
      }
    } else {
      if (clientRef.current) {
        disconnectSocket();
      }
    }
  }, [canConnect, isDriverOnline, connectSocket, disconnectSocket]);

  const goOnline = async () => {
    if (!canConnect) return;
    try {
      setDriverOnline(true);
    } catch (err) {
      console.error("failed to go online:", err);
    }
  };

  const goOffline = async () => {
    if (!userId) return;
    try {
      setDriverOnline(false);
    } catch (err) {
      console.error("failed to go offline:", err);
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
        clientRef,
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
