import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocationStore } from "../../contexts/LocationContext";
import useBookingStore from "../../contexts/BookingContext";
import CustomMarker from "../reusables/CustomMarker";

import drivercar from "../../assets/drivercar.png";
import pin from "../../assets/pin.png";
import man from "../../assets/man.png";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

function DriverMap({ pickup, dropoff, rideStatus }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { location, error, getLocation } = useLocationStore();
  const { activeBooking } = useBookingStore();

  const [driverLocation, setDriverLocation] = useState(undefined);
  const [map, setMap] = useState(null);
  const [directionResponse, setDirectionResponse] = useState(null);
  const prevRouteRef = useRef(null);
  

  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

  useEffect(() => {
    let ignore = false;
    const intervalTime = activeBooking ? 8000 : 30000;

    const fetchLocation = async () => {
      try {
        const newLoc = await getLocation();
        if (
          !ignore &&
          newLoc &&
          typeof newLoc.lat === "number" &&
          typeof newLoc.lng === "number"
        ) {
          setDriverLocation(newLoc);
          console.log(" Updated driver location:", newLoc);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, intervalTime);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [activeBooking, getLocation]);
  const calculateRoute = useCallback(async (originVal, destinationVal) => {
    if (!originVal || !destinationVal || !window.google) return;

    const prev = prevRouteRef.current;
    if (
      prev &&
      prev.origin.lat === originVal.lat &&
      prev.origin.lng === originVal.lng &&
      prev.destination.lat === destinationVal.lat &&
      prev.destination.lng === destinationVal.lng
    ) {
      return;
    }

    const directionService = new window.google.maps.DirectionsService();
    try {
      const results = await directionService.route({
        origin: originVal,
        destination: destinationVal,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionResponse(results);
      prevRouteRef.current = { origin: originVal, destination: destinationVal };
    } catch (err) {
      console.error("Error calculating route:", err);
      setDirectionResponse(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !map) return;

    let origin, destination;

    if (rideStatus === "incoming") {
      origin = pickup;
      destination = dropoff;
    } else if (rideStatus === "accepted") {
      origin = driverLocation || pickup;
      destination = pickup;
    } else if (rideStatus === "started") {
      origin = driverLocation || pickup;
      destination = dropoff;
    } else {
      setDirectionResponse(null);
      return;
    }

    if (origin && destination) calculateRoute(origin, destination);
  }, [
    isLoaded,
    map,
    pickup,
    dropoff,
    driverLocation,
    rideStatus,
    calculateRoute,
  ]);

  useEffect(() => {
    if (map && driverLocation) {
      map.panTo(driverLocation);
    }
  }, [map, driverLocation]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {error && (
        <div
          style={{
            background: "red",
            color: "white",
            padding: "10px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        options={{
          ...mapOptions,
          mapId,
        }}
        zoom={14}
        center={pickup || { lat: 25.4358, lng: 81.8463 }}
        onLoad={(m) => setMap(m)}
      >
        {driverLocation && (
          <CustomMarker
            map={map}
            position={driverLocation}
            label="You"
            iconUrl={drivercar}
            color="#3B82F6"
            zIndex={999}
          />
        )}

        {(rideStatus === "incoming" || rideStatus === "accepted") && pickup && (
          <CustomMarker
            map={map}
            position={pickup}
            label="Pickup"
            iconUrl={man}
            color="#22C55E"
          />
        )}

        {(rideStatus === "incoming" ||
          rideStatus === "accepted" ||
          rideStatus === "started") &&
          dropoff && (
            <CustomMarker
              map={map}
              position={dropoff}
              label="Drop"
              iconUrl={pin}
              color="#EF4444"
            />
          )}

        {directionResponse && (
          <DirectionsRenderer
            directions={directionResponse}
            options={{
              suppressMarkers: true,
              polylineOptions: { strokeColor: "#007AFF", strokeWeight: 5 },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default React.memo(DriverMap);
