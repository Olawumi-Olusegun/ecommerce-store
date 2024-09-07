import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import api from "../api";

export const useAuth = () => {

    const setUser = useUserStore((state) => state.setUser);

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ["user-profile"],
        queryFn: api.userProfile,
      });

      const user = useUserStore((state) => state.user);

      useEffect(() => {
        if (data?.user) {
          setUser(data?.user);
        }
      }, [data, setUser]);

      return { user, isLoading, isError, error, refetch, isFetched }
}