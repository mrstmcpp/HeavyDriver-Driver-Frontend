import { create } from "zustand";
import useAuthStore from "./AuthContext";
import axios from "axios";

axios.defaults.withCredentials = true;

const useBookingStore = create((set, get) => ({
  activeBooking: null,
  bookingStatus: null,
  loadingBooking: false,

  fetchActiveBooking: async () => {
    const { loadingBooking } = get();
    if (loadingBooking) return;

    set({ loadingBooking: true });

    try {
      const { userId } = useAuthStore.getState();
      if (!userId) {
        if (import.meta.env.DEV)
          console.warn("⚠ No userId found in auth store.");
        set({ loadingBooking: false });
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/active/driver/${userId}`,
        { withCredentials: true }
      );

      if (res.data) {
        set({
          activeBooking: res.data.bookingId,
          bookingStatus: res.data.bookingStatus,
        });

        // console.info(res.data)
        if (import.meta.env.DEV)
          console.log("Active booking fetched:", res.data);
      } else {
        set({ activeBooking: null, bookingStatus: null });
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        set({ activeBooking: null, bookingStatus: null });
        if (import.meta.env.DEV)
          console.warn("No active booking found for this driver.");
      } else {
        console.error("Could not fetch active booking:", err);
      }
    } finally {
      set({ loadingBooking: false });
    }
  },

  clearActiveBooking: () => {
    set({ activeBooking: null, bookingStatus: null, loadingBooking: false });
  },

  setActiveBooking: (booking) =>
    set({
      activeBooking: booking.bookingId,
      bookingStatus: booking.bookingStatus,
    }),
}));

export default useBookingStore;
