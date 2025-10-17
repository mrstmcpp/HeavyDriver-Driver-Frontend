import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useLocationStore } from "../../contexts/LocationContext";
import drivercar from "../../assets/drivercar.png";
import pin from "../../assets/pin.png";
import man from "../../assets/man.png";

function DriverMap({ pickup, dropoff, rideStatus }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { location, error, getLocation } = useLocationStore();
  const [map, setMap] = useState(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    getLocation();
    const interval = setInterval(() => getLocation(), 5000);
    return () => clearInterval(interval);
  }, [getLocation]);

  useEffect(() => {
    if (!map) return;

    const directionsService = new google.maps.DirectionsService();

    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null);
    }

    directionsRenderer.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#007AFF",
        strokeWeight: 5,
      },
    });

    let origin, destination;

    if (rideStatus === "incoming") {
      // Just show pickup -> drop route
      origin = pickup;
      destination = dropoff;
    } else if (rideStatus === "accepted") {
      // Driver heading to pickup
      origin = location || pickup;
      destination = pickup;
    } else if (rideStatus === "started") {
      // Ride in progress
      origin = location || pickup;
      destination = dropoff;
    } else {
      return;
    }

    if (!origin || !destination) return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.current.setDirections(response);
      })
      .catch((err) => console.error("Directions API error:", err));
  }, [map, pickup, dropoff, location, rideStatus]);

  useEffect(() => {
    if (map && location) map.panTo(location);
  }, [map, location]);

  return (
    <APIProvider apiKey={apiKey}>
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

      <Map
        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
        onLoad={(m) => setMap(m)}
        defaultZoom={14}
        defaultCenter={pickup || { lat: 25.4358, lng: 81.8463 }}
        style={{ width: "100%", height: "100vh" }}
      >

        {/* Driver Marker */}
        {(rideStatus === "accepted" || rideStatus === "started") && location && (
          <AdvancedMarker position={location}>
            <img src={drivercar} alt="Driver" width="30" height="30" />
          </AdvancedMarker>
        )}

        {/* Pickup Marker */}
        {(rideStatus === "incoming" || rideStatus === "accepted") && pickup && (
          <AdvancedMarker position={pickup}>
            <img src={man} alt="Pickup" width="30" height="30" />
          </AdvancedMarker>
        )}

        {/* Dropoff Marker */}
        {(rideStatus === "incoming" ||
          rideStatus === "accepted" ||
          rideStatus === "started") &&
          dropoff && (
            <AdvancedMarker position={dropoff}>
              <img src={pin} alt="Dropoff" width="30" height="30" />
            </AdvancedMarker>
          )}
      </Map>
    </APIProvider>
  );
}

export default DriverMap;
