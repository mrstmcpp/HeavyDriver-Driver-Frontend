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
import axios from "axios";
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

  const { authUser, activeBooking, userId, loading } = useAuthStore();
  if(!loading && activeBooking){
    setRideActive(true);
    setCurrentRideId(activeBooking);
  }

  const { showNotification } = useNotification();

  const clientRef = useRef(null);
  const rideSubscriptionRef = useRef(null);
  const locationWatchRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  const latestLocationRef = useRef(null);
  const lastSentRef = useRef(Date.now());

  const canConnect = !!authUser && !!userId && !loading;

  // connect websocket
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
          title: "new ride request",
          icon: "pi pi-car",
          type: "ride",
          showActions: true,
          confirmLabel: "accept ride",
          declineLabel: "decline",
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

    socket.onclose = () => {
      setConnected(false);
      clientRef.current = null;
    };
  }, [canConnect, userId, showNotification]);

  // disconnect websocket
  const disconnectSocket = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect(() => {
        setConnected(false);
        clientRef.current = null;
      });
    }
  }, []);

  // ride location subscription
  useEffect(() => {
    if (connected && rideActive && currentRideId && clientRef.current) {
      const topic = `/topic/driver/${userId}/ride/${currentRideId}/location`;
      rideSubscriptionRef.current = clientRef.current.subscribe(topic, (msg) => {
        const update = JSON.parse(msg.body);
        console.log("ride location update:", update);
      });
    } else if (rideSubscriptionRef.current) {
      rideSubscriptionRef.current.unsubscribe();
      rideSubscriptionRef.current = null;
    }

    return () => {
      if (rideSubscriptionRef.current) {
        rideSubscriptionRef.current.unsubscribe();
        rideSubscriptionRef.current = null;
      }
    };
  }, [connected, rideActive, currentRideId, userId]);

  // auto connect or disconnect based on auth
  useEffect(() => {
    if (canConnect && !clientRef.current) {
      connectSocket();
    } else if (!authUser && clientRef.current) {
      disconnectSocket();
      setDriverOnline(false);
    }
  }, [canConnect, authUser, connectSocket, disconnectSocket]);

  // go online or offline
  const goOnline = async () => {
    if (!canConnect) return;
    try {
      await updateDriverStatus(userId, "ACTIVE");
      setDriverOnline(true);
      connectSocket();
      startLocationUpdates();
    } catch (err) {
      console.error("failed to go online:", err);
    }
  };

  const goOffline = async () => {
    if (!userId) return;
    try {
      await updateDriverStatus(userId, "INACTIVE");
      setDriverOnline(false);
      stopLocationUpdates();
      disconnectSocket();
    } catch (err) {
      console.error("failed to go offline:", err);
    }
  };

  // ride lifecycle
  const startRide = (rideId) => {
    setCurrentRideId(rideId);
    setRideActive(true);
    startLocationUpdates();
  };

  const endRide = () => {
    setCurrentRideId(null);
    setRideActive(false);
    stopLocationUpdates();
  };

  // start location updates
  const startLocationUpdates = () => {
    if (!navigator.geolocation) {
      console.error("geolocation is not supported by this browser.");
      return;
    }

    stopLocationUpdates();

    locationWatchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          driverId: userId,
        };

        latestLocationRef.current = location;

        // send realtime updates only during ride
        if (
          rideActive &&
          currentRideId &&
          clientRef.current &&
          connected &&
          Date.now() - lastSentRef.current > 3000
        ) {
          clientRef.current.send(
            `/app/driver/${userId}/ride/${currentRideId}/location`,
            {},
            JSON.stringify(location)
          );
          lastSentRef.current = Date.now();
        }
      },
      (error) => {
        console.error("error getting location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    // background snapshot updates every 60s
    if (!snapshotIntervalRef.current && isDriverOnline && !rideActive) {
      snapshotIntervalRef.current = setInterval(async () => {
        if (latestLocationRef.current) {
          try {
            await axios.post(
              `${import.meta.env.VITE_DRIVER_BACKEND_URL}/location/snapshot`,
              latestLocationRef.current,
              { withCredentials: true }
            );
          } catch (err) {
            console.error("failed to send location snapshot:", err);
          }
        }
      }, 60000);
    }
  };

  // stop all tracking
  const stopLocationUpdates = useCallback(() => {
    if (locationWatchRef.current) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
      snapshotIntervalRef.current = null;
    }
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationUpdates();
      disconnectSocket();
    };
  }, [stopLocationUpdates, disconnectSocket]);

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
