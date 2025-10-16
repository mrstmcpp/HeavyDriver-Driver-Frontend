import { create } from "zustand";

export const useLocationStore = create((set) => ({
    location: null,
    error: null,
    

    getLocation: () => {

        if(!navigator.geolocation){
            set({
                error: "Geolocation is not supported by this browser.",
            });
           
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                set({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    error: null
                });
            },
            (error) => {
                set({ error: error.message });
            }
        );
    }
}));