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
    localStorage.setItem("user", JSON.stringify(userData));
  },

  initializeAuth: async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      set({ authUser: storedUser, loading: true });
      await get().checkAuth(); // ✅ validate after restoring
    } else {
      set({ authUser: null, loading: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/validate`,
        { withCredentials: true }
      );

      if (res.data?.loggedIn) {
        const userData = {
          email: res.data.user,
          name: res.data.name,
          userId: res.data.userId,
          role: res.data.role,
        };

        set({
          authUser: userData,
          name: res.data.name,
          role: res.data.role,
          userId: res.data.userId,
          loading: false,
        });
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
        set({
          authUser: null,
          name: null,
          role: null,
          userId: null,
          loading: false,
        });
      }
    } catch {
      localStorage.removeItem("user");
      set({
        authUser: null,
        name: null,
        role: null,
        userId: null,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
