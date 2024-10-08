import { useEffect } from "react";
import {useUserStore} from "./../stores/useUserStore"
import api from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const usePersistUser = () => {

    const queryClient = useQueryClient();

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const isAuth = useUserStore((state) => state.isAuth);



    const isAdmin = user && user.role === "admin" ? true : false;

    const { data, isLoading, error, isSuccess } = useQuery({
        queryKey: ["auth-profile"],
        queryFn: api.userProfile,
        enabled: !user,
    });

    useEffect(() => {
        if (isSuccess && data?.user && data?.user?._id) {
          setUser(data.user);
          queryClient.setQueryData(["auth-user"], data?.user);
        }
      }, [isSuccess, data, setUser ]);

    return {isSuccess, data, isLoading, error: error?.message, user, isAdmin, isAuth }
}
export default usePersistUser;