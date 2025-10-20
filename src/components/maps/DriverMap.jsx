import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useLocationStore } from "../../contexts/LocationContext";
import drivercar from "../../assets/drivercar.png";
import pin from "../../assets/pin.png";
import man from "../../assets/man.png";
import useAuthStore from "../../contexts/AuthContext";
import useBookingStore from "../../contexts/BookingContext";

function DriverMap({ pickup, dropoff, rideStatus }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { location, error, getLocation } = useLocationStore();
  const {activeBooking} = useBookingStore();
  const [driverLocation, setDriverLocation] = useState(location);
  const [map, setMap] = useState(null);
  const directionsRenderer = useRef(null);
  

  useEffect(() => {
    let intervalTime = activeBooking ? 8000 : 30000; // 8s if activeBooking else 30s
    console.log("hit aggin")
    const fetchLocation = () => {
      getLocation();
      setDriverLocation(location);
    };
    console.log(location)
    fetchLocation(); // initial fetch
    const interval = setInterval(fetchLocation, intervalTime);
    return () => clearInterval(interval);
  }, [activeBooking, getLocation, location]);

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
        {driverLocation && (
          <AdvancedMarker position={driverLocation}>
            <p className="border p-2 rounded-2xl text-white font-bold bg-blue-500">
              You
            </p>
            <img src={drivercar} alt="Driver" width="30" height="30" />
          </AdvancedMarker>
        )}

        {/* Pickup Marker */}
        {(rideStatus === "incoming" || rideStatus === "accepted") && pickup && (
          <AdvancedMarker position={pickup}>
            <p className="border p-2 rounded-2xl text-white font-bold bg-green-400">
              Pickup
            </p>
            <img src={man} alt="Pickup" width="30" height="30" />
          </AdvancedMarker>
        )}

        {/* Dropoff Marker */}
        {(rideStatus === "incoming" ||
          rideStatus === "accepted" ||
          rideStatus === "started") &&
          dropoff && (
            <AdvancedMarker position={dropoff}>
              <p className="border p-2 rounded-2xl text-white font-bold bg-red-500">
                Drop
              </p>
              <img src={pin} alt="Dropoff" width="30" height="30" />
            </AdvancedMarker>
          )}
      </Map>
    </APIProvider>
  );
}

export default DriverMap;
