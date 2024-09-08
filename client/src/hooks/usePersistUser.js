import { useEffect, useState } from "react";
import {useUserStore} from "./../stores/useUserStore"
import api from "../api";

const usePersistUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMMessage, setErrorMessage] = useState(null);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const isAuth = useUserStore((state) => state.isAuth);

    const isAdmin = user && user.role === "admin" ? true : false;


    const getUserData = async () => {

        if(!user) return;

        try {
            setIsLoading(true);
            setErrorMessage(null);
            const data = await api.userProfile();
            if(data && data?.user) {
                setUser(data?.user);
            }
        } catch (error) {
            const message = error?.response?.data?.message ?? error?.message;
            setErrorMessage(message);
            setUser(null);
        } finally {
            setIsLoading(false);
            setErrorMessage(null)
        }
    }

    useEffect(() => {
        getUserData();
    }, [setUser, isAuth]);

    return { isLoading, errorMMessage, user, isAdmin, isAuth }
}

export default usePersistUser;