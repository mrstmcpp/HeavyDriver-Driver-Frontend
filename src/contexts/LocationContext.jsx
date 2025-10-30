import axios from "axios";
import { create } from "zustand";
import useAuthStore from "./AuthContext.jsx";

export const useLocationStore = create((set) => ({
  location: null,
  error: null,
  loading: false,

  getLocation: async () => {
    if (!navigator.geolocation) {
      set({
        error: "Geolocation is not supported by this browser.",
        loading: false,
      });
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          set({ location: coords, loading: false, error: null });
          console.log("Current location:", coords);

          try {
            const { userId } = useAuthStore.getState();
            if (!userId) throw new Error("Driver not logged in");

            const res = await axios.post(
              `${import.meta.env.VITE_LOCATION_BACKEND_URL}/driver/${userId}/location`,
              {
                latitude: coords.lat,
                longitude: coords.lng,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            console.log("Location posted successfully:", res.data);
          } catch (err) {
            console.error(
              "❌ Location posting failed:",
              err.response?.data || err.message
            );
          }

          resolve(coords);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          set({ error: error.message, loading: false });
          reject(error);
        },
        {
          enableHighAccuracy: true, 
          timeout: 10000,           
          maximumAge: 0,            
        }
      );
    });
  },
}));
