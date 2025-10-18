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

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [rideActive, setRideActive] = useState(false);
  const [isDriverOnline, setDriverOnline] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);

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
            name: data.passengerName || "Passenger",
          },
          pickup: {
            address: data.pickupLocation?.pickupAddress || "Address not available",
            lat: data.pickupLocation?.latitude || 0,
            lng: data.pickupLocation?.longitude || 0,
          },
          drop: {
            address: data.dropLocation?.dropAddress || "Address not available",
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

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3004/ws";
    const socket = new SockJS(socketUrl);
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      setConnected(true);
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
      //  auto-reconnect after delay
      setTimeout(() => {
        if (canConnect) connectSocket();
      }, 5000);
    };
  }, [canConnect, userId]);

  const disconnectSocket = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect(() => {
        console.log("Disconnected from socket");
        setConnected(false);
        clientRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    if (canConnect && !clientRef.current) connectSocket();
    else if (!authUser && clientRef.current) {
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
      console.error("failed to go online:", err);
    }
  };

  const goOffline = async () => {
    if (!userId) return;
    try {
      await updateDriverStatus(userId, "INACTIVE");
      setDriverOnline(false);
      disconnectSocket();
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
