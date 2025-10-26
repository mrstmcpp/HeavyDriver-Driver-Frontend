// RideManager.jsx
import React, { useEffect, useState } from "react";
import RideNotificationManager from "./RideNotificationManager";
import RideDetailsOnMap from "./pages/RideDetailsOnMap";
import { eventEmitter } from "../utils/eventEmitter";

export default function RideManager() {
  const [rideRequest, setRideRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleRideRequest = (data) => {
      setRideRequest(data);
    };

    eventEmitter.on("RIDE_REQUEST", handleRideRequest);

    return () => {
      eventEmitter.off("RIDE_REQUEST", handleRideRequest);
    };
  }, []);

  if (showDetails && rideRequest) {
    return <RideDetailsOnMap rideRequest={rideRequest} />;
  }

  return (
    <>
      <RideNotificationManager onSeeDetails={() => setShowDetails(true)} />
    </>
  );
}
