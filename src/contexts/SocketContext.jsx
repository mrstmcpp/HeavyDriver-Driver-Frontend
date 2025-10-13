import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { updateDriverStatus } from "../api/mockApi.js";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [rideActive, setRideActive] = useState(false);
  const [isDriverOnline, setDriverOnline] = useState(false);
  const [currentRideId, setCurrentRideId] = useState(null);
  
  const clientRef = useRef(null);
  const rideSubscriptionRef = useRef(null);
  
  const DRIVER_ID = '3';

  const connectSocket = () => {
    if (clientRef.current) {
        return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:3004/ws"),
      reconnectDelay: 5000,
      debug: () => {}, 
    });

    client.onConnect = () => {
      setConnected(true);
      clientRef.current = client; // Store client instance only on successful connect
      console.log("WebSocket Connected!");

      const notificationTopic = `/topic/driver/${DRIVER_ID}`;
      client.subscribe(notificationTopic, (message) => {
        const data = JSON.parse(message.body);
        console.log("Driver Notification Received:", data);
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      clientRef.current = null;
      setConnected(false);
    };
    
    client.onDisconnect = () => {
      clientRef.current = null;
      setConnected(false);
      console.log("WebSocket Disconnected!");
    }

    client.activate();
  };

  const disconnectSocket = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
  };

  useEffect(() => {
    if (connected && rideActive && currentRideId && clientRef.current) {
      const rideLocationTopic = `/topic/driver/${DRIVER_ID}/ride/${currentRideId}/location`;
      
      rideSubscriptionRef.current = clientRef.current.subscribe(rideLocationTopic, (message) => {
        const locationUpdate = JSON.parse(message.body);
        console.log("Ride Location Update:", locationUpdate);
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
  }, [connected, rideActive, currentRideId, DRIVER_ID]);

  const goOnline = async () => {
    try {
      await updateDriverStatus(DRIVER_ID, 'ACTIVE');
      setDriverOnline(true);
      connectSocket(); 
      console.log("Driver is now ONLINE.");
    } catch (error) {
      console.error("Failed to go online:", error);
    }
  };

  const goOffline = async () => {
    try {
      await updateDriverStatus(DRIVER_ID, 'INACTIVE');
      setDriverOnline(false);
      disconnectSocket(); 
      console.log("Driver is now OFFLINE.");
    } catch (error) {
      console.error("Failed to go offline:", error);
    }
  };

  const startRide = (rideId) => {
    if (rideId) {
      setCurrentRideId(rideId);
      setRideActive(true);
    }
  };

  const endRide = () => {
    setCurrentRideId(null);
    setRideActive(false);
  };

  const sendMessage = (destination, payload) => {
    const client = clientRef.current;
    if (client && connected) {
      client.publish({ destination, body: JSON.stringify(payload) });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        rideActive,
        isDriverOnline,
        sendMessage,
        startRide,
        endRide,
        goOnline,
        goOffline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};