import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCartStore from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useEffect, useState } from "react";
import api from "../api";


const useCart = () => {

  const [cartQuantity, setCartQuantity] = useState(0);
  const [item, setItem] = useState(0);

  const queryClient = useQueryClient();

    const cart = useCartStore((state) => state.cart);
    const getCartItems = useCartStore((state) => state.getCartItems);
  
    const user = useUserStore((state) => state.user);

    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateCartQuantity = useCartStore((state) => state.updateCartQuantity);
  
    const { data } = useQuery({
      queryKey: ["get-cart-items", user?._id],
      queryFn: api.getCartItems,
      enabled: !!user?._id,
    });



   const deleteMutation =  useMutation({
        mutationKey: ["remove-all-from-cart"],
        mutationFn: api.removeAllFromCart,
        onSuccess: () => {
            if(item) {
                removeFromCart(item)
            }
        }
    })

   const updateMutation =  useMutation({
        mutationKey: ["update-cart-quantity"],
        mutationFn: api.updateCartQuantity,
        onSuccess: () => {
            if(item) {
                updateCartQuantity(item, cartQuantity)
                queryClient.invalidateQueries({ queryKey: ["get-cart-items", user?._id] })
            }
        }
    })
  

    useEffect(() => {
      if(data && data?.cartItems) {
        getCartItems(data?.cartItems)
      }
    }, [data?.cartItems, getCartItems])

    return { cart, deleteMutation, updateMutation, setCartQuantity, setItem }

}

export default useCart;