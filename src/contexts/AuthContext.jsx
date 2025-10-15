import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const useAuthStore = create((set, get) => ({
  authUser: null,
  activeBooking: null,
  loading: true,
  userId: null,

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/validate`,
        { withCredentials: true }
      );

      if (res.data?.loggedIn) {
        console.log("User is authenticated:", res.data);

        const userData = {
          email: res.data.user,
          userId: res.data.userId,
          role: res.data.role,
        };

        set({
          authUser: userData,
          loading: false,
          userId: res.data.userId,
        });

        if (get().fetchActiveBooking) {
          get().fetchActiveBooking(res.data.userId);
        }
      } else {
        set({
          authUser: null,
          activeBooking: null,
          loading: false,
          userId: null,
        });
      }
    } catch (err) {
      console.error("Auth validation failed:", err.message);
      set({
        authUser: null,
        activeBooking: null,
        loading: false,
        userId: null,
      });
    }
  },

  // fetchActiveBooking: async (userId) => {
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BOOKING_BACKEND_URL}/booking/active/${userId}`,
  //       { withCredentials: true }
  //     );

  //     if (res.data) {
  //       set({ activeBooking: res.data });
  //       console.log("Active booking fetched:", res.data);
  //     } else {
  //       set({ activeBooking: null });
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch active booking:", err.message);
  //     set({ activeBooking: null });
  //   }
  // },
}));

export default useAuthStore;
