import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs"; 
import { updateDriverStatus } from "../api/mockApi.js";
import { useNotification } from "./NotificationContext.jsx";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [rideActive, setRideActive] = useState(false);
  const [isDriverOnline, setDriverOnline] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);

  const { showNotification } = useNotification();
  const clientRef = useRef(null);
  const rideSubscriptionRef = useRef(null);

  const DRIVER_ID = "3";

  // Establish WebSocket connection
  const connectSocket = () => {
    if (clientRef.current) return;

    console.log("Connecting to WebSocket...");

    const socket = new SockJS("http://localhost:3004/ws");
    const stompClient = Stomp.over(socket);

    stompClient.debug = null; // Disable verbose logs

    stompClient.connect({}, (frame) => {
      console.log("Connected:", frame);
      setConnected(true);
      clientRef.current = stompClient;

      const notificationTopic = `/topic/driver/${DRIVER_ID}`;

      stompClient.subscribe(notificationTopic, (message) => {
        const data = JSON.parse(message.body);
        console.log("Driver Notification Received:", data);

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
            const payload = {
              response: true,
              bookingId: data.bookingId,
              driverId: DRIVER_ID,
              passengerId: data.passengerId,
            };
            console.log("Ride accepted:", payload);
            stompClient.send(
              `/app/rideResponse/${DRIVER_ID}`,
              {},
              JSON.stringify(payload)
            );
            startRide(data.bookingId);
          },

          onDecline: () => {
            const payload = {
              response: false,
              bookingId: data.bookingId,
              driverId: DRIVER_ID,
              passengerId: data.passengerId,
            };
            console.log("Ride declined:", payload);
            stompClient.send(
              `/app/rideResponse/${DRIVER_ID}`,
              {},
              JSON.stringify(payload)
            );
          },
        });
      });
    });

    stompClient.onclose = () => {
      console.warn("WebSocket Disconnected");
      setConnected(false);
      clientRef.current = null;
    };
  };

  // Disconnect WebSocket
  const disconnectSocket = () => {
    if (clientRef.current) {
      console.log("Disconnecting WebSocket...");
      clientRef.current.disconnect(() => {
        console.log("Disconnected from server");
        setConnected(false);
        clientRef.current = null;
      });
    }
  };

  // Subscribe to ride location updates
  useEffect(() => {
    if (connected && rideActive && currentRideId && clientRef.current) {
      const topic = `/topic/driver/${DRIVER_ID}/ride/${currentRideId}/location`;
      console.log("Subscribing to ride location:", topic);

      rideSubscriptionRef.current = clientRef.current.subscribe(
        topic,
        (message) => {
          const update = JSON.parse(message.body);
          console.log("Ride Location Update:", update);
        }
      );
    } else if (rideSubscriptionRef.current) {
      rideSubscriptionRef.current.unsubscribe();
      rideSubscriptionRef.current = null;
    }

    return () => {
      if (rideSubscriptionRef.current) {
        rideSubscriptionRef.current.unsubscribe();
      }
    };
  }, [connected, rideActive, currentRideId]);

  // Go Online
  const goOnline = async () => {
    try {
      await updateDriverStatus(DRIVER_ID, "ACTIVE");
      setDriverOnline(true);
      connectSocket();
      console.log("Driver is now ONLINE.");
    } catch (err) {
      console.error("Failed to go online:", err);
    }
  };

  // Go Offline
  const goOffline = async () => {
    try {
      await updateDriverStatus(DRIVER_ID, "INACTIVE");
      setDriverOnline(false);
      disconnectSocket();
      console.log("Driver is now OFFLINE.");
    } catch (err) {
      console.error("Failed to go offline:", err);
    }
  };

  // Manage ride lifecycle
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
