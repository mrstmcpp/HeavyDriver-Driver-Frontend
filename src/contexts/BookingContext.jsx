import { create } from "zustand";
import useAuthStore from "./AuthContext";
import axios from "axios";

axios.defaults.withCredentials = true;

const useBookingStore = create((set, get) => ({
  activeBooking: null,
  activeBookingStatus: null,

  fetchActiveBooking: async () => {
    const { userId } = useAuthStore.getState();

    if (!userId) {
      if (import.meta.env.DEV) console.warn("⚠ No userId found in auth store.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/active/driver/${userId}`,
        { withCredentials: true }
      );

      if (res.data) {
        set({ activeBooking: res.data });
        if (import.meta.env.DEV)
          console.log("Active booking fetched:", res.data);
      } else {
        set({ activeBooking: null });
      }
    } catch (err) {
      const status = err.response?.status;

      if (status === 404) {
        // booking not found — normal case
        set({ activeBooking: null });
        if (import.meta.env.DEV)
          console.warn("ℹNo active booking found for this driver.");
      } else {
        // unexpected error
        console.error(
          "Could not fetch active booking. Please try again later."
        );
        set({ activeBooking: null });
      }
    }
  },
}));


export default useBookingStore;