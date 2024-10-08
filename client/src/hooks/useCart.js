import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCartStore from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

import { useEffect, useState } from "react";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";


const useCart = () => {

  const [cartQuantity, setCartQuantity] = useState(0);
  const [item, setItem] = useState(0);

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();

    const cart = useCartStore((state) => state.cart);
    const getCartItems = useCartStore((state) => state.getCartItems);
  
    const user = useUserStore((state) => state.user);

    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateCartQuantity = useCartStore((state) => state.updateCartQuantity);

    const { data, isLoading: isCartLoading } = useQuery({
      queryKey: ["get-cart-items", user?._id],
      queryFn: api.getCartItems,
      enabled: !!user?._id,
    });
  

   const deleteMutation =  useMutation({
        mutationKey: ["remove-all-from-cart"],
        mutationFn: api.removeAllFromCart,
        onSuccess: () => {
          if(!user || !user?._id) {
            navigate("/signin", { replace: true, state: { path: location.pathname } });
            return;
          }
          if(item && user) {
              removeFromCart(item)
          }
        }
    })

   const updateMutation =  useMutation({
        mutationKey: ["update-cart-quantity"],
        mutationFn: api.updateCartQuantity,
        onSuccess: () => {
          if(!user || !user?._id) {
            navigate("/signin", { replace: true, state: { path: location.pathname } });
            return;
          }
            if(item && user) {
                updateCartQuantity(item, cartQuantity)
                queryClient.invalidateQueries({ queryKey: ["get-cart-items", user?._id] })
            }
        }
    })
  

    useEffect(() => {
      if(user && data && data?.cartItems) {
        getCartItems(data?.cartItems)
      }
    }, [user, data?.cartItems, getCartItems,])

    return { cart, deleteMutation, updateMutation, setCartQuantity, setItem, isCartLoading }

}

export default useCart;