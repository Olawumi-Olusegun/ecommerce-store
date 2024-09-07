import { create } from "zustand";
import { persist } from 'zustand/middleware';


export const useUserStore = create(
    persist((set) => ({
        user: null,
        isLoading: false,
        checkingAuth: true,
        setUser: (userData) => set({ user: userData }),
        logout: () => {
            set({ user: null });
            localStorage.removeItem("auth-user")
        },
    }), { name: 'auth-user',  } )
)