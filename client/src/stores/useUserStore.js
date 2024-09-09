import { create } from "zustand";
import { persist, } from 'zustand/middleware';


export const useUserStore = create(
    persist((set, get) => ({
        user: null,
        checkingAuth: true,
        isAuth: false,
        setUser: (userData) => set({ user: userData, isAuth: true }),
        logout: () => {
            set({ user: null, isAuth: false });
            localStorage.removeItem("auth-user");
        },
        setCheckingAuth: (value) => set({ checkingAuth: value }),
    }), { name: 'auth-user',  } )
)