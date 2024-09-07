import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/useUserStore";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useAuth = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

    const setUser = useUserStore((state) => state.setUser);
    const logout = useUserStore((state) => state.logout);
    const user = useUserStore((state) => state.user);

  const isAdmin = user && user.role === "admin";

  const signoutMutation = useMutation({
    mutationKey: ["signout"],
    mutationFn: api.signout,
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries(); // This will stop queries from refetching
      queryClient.clear(); // Clears the query cache (optional)
      queryClient.removeQueries();
      navigate("/signin", { replace: true });
    },

    onError: (error) => {
      const message = error?.response?.data?.message || "";
      toast.error(message)
    }
  });

  const signinMutation = useMutation({
    mutationKey: ["signin"],
    mutationFn: api.signin,
    onSuccess: (data) => {
      if (data?.user) {
        setUser(data?.user);
        navigate("/", { replace: true })
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "";
      toast.error(message)
    }
  });


  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: api.signup,
    onSuccess: (data) => {
      if (data?.user) {
        setUser(data?.user);
        navigate("/", { replace: true })
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "";
      toast.error(message)
    }
  });


      return { user, isAdmin, signoutMutation, signinMutation, signupMutation,  }
}