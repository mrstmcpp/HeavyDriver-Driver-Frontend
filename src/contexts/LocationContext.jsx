import axios from "axios";
import { create } from "zustand";
import useAuthStore from "./AuthContext";

export const useLocationStore = create((set) => ({
    location: null,
    error: null,
    loading: true,

    getLocation: () => {
        if (!navigator.geolocation) {
            set({ error: "Geolocation is not supported by this browser.", loading: false });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                set({ location: coords, loading: false, error: null });

                try {
                    const { userId } = useAuthStore.getState(); // safer than calling inside component
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
                    console.error("Location posting failed:", err.response?.data || err.message);
                }
            },
            (error) => set({ error: error.message, loading: false })
        );
    },
}));
