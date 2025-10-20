import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const useAuthStore = create((set, get) => ({
  authUser: null,
  loading: true,
  name: null,
  role: null,
  userId: null,

  setUser: (userData) => {
    set({
      authUser: userData,
      name: userData.name || null,
      role: userData.role || null,
      userId: userData.userId || null,
    });
    localStorage.setItem("user", JSON.stringify(userData)); // sstoring non-sensitive data
  },

  initializeAuth: async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) set({ authUser: storedUser });
  },

  checkAuth: async () => {
    // console.log("checkAuth called");
    set({ loading: true });
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/validate`,
        { withCredentials: true }
      );

      if (res.data?.loggedIn) {
        // console.log("User is authenticated:", res.data);

        const userData = {
          email: res.data.user,
          name: res.data.name,
          userId: res.data.userId,
          role: res.data.role,
        };

        set({
          authUser: userData,
          loading: false,
          name: res.data.name,
          role: res.data.role,
          userId: res.data.userId,
        });
      } else {
        set({
          authUser: null,
          loading: false,
          userId: null,
          name: null,
          role: null,
        });
      }
    } catch (err) {
      console.error("Auth validation failed:", err.message);
      set({
        authUser: null,
        name: null,
        role: null,
        loading: false,
        userId: null,
      });
    }
  },
}));

export default useAuthStore;
