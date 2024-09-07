import React, { useEffect } from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from '../stores/useUserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import useCartStore from '../stores/useCartStore';

const Header = () => {

  const logout = useUserStore((state) => state.logout);
  const cart = useCartStore((state) => state.cart);
  const getCartItems = useCartStore((state) => state.getCartItems);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["signout"],
    mutationFn: api.signout,
    onSuccess: () => {
      logout();
      queryClient.removeQueries();
      navigate("/signin", { replace: true });
    },

    onError: (error) => {
      const message = error?.response?.data?.message || error?.message;
      toast.error(message)
    }
  });

  const { data } = useQuery({
    queryKey: ["get-cart-items"],
    queryFn: api.getCartItems,
  });

  const user = useUserStore((state) => state.user);
  const isAdmin = user && user.role === "admin";

  const handleLogout = () => {
    mutation.mutate();
  }

  useEffect(() => {
    if(data && data?.cartItems) {
      getCartItems(data?.cartItems)
    }
  }, [data?.cartItems])

  return (
    <header className="fixed flex items-center justify-between p-5 py-4 top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <Link to={"/"} >
        Ecommerce Store
      </Link>
      <nav className='flex flex-wrap items-center gap-3'>
        <Link to={"/"} className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>Home</Link>
        {
          user && <Link to={"/cart"} className='relative text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out group flex items-center justify-center gap-1'>
            <ShoppingCart size={20} className='inline-block'  />
            <span>Cart</span>
            {
              cart?.length > 0 && (
                <span className='absolute -top-3 -left-2 min-h-6 min-w-6 rounded-full flex items-center justify-center bg-emerald-500 group-hover:text-gray-300 transition duration-300 ease-in-out'>{cart?.length ?? 0}</span>
              )
            }
          </Link>
        }
        {
          isAdmin && (
            <Link to={"/secret-dashboard"} className='bg-emerald-700 hover:bg-emerald-600 text-white px-2 md:px-4 py-2 md:py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center gap-1 ' >
              <Lock size={18} />
              <span className='hidden sm:inline'>Dashboard</span>  
            </Link>
          )
        }
        {
          user ? (
            <button onClick={handleLogout} className='bg-gray-700 hover:bg-gray-600 text-white py-2 md:py-1 px-2 md:px-4 rounded-md flex items-center gap-1 transition duration-300 ease-in-out'>
              <LogOut size={18} />
              <span className='hidden sm:inline'>Signout</span>
            </button>
          ) : (
            <>
            <Link to={"/signup"} className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-2 md:px-4 
									rounded-md flex items-center gap-1 transition duration-300 ease-in-out'>
              <UserPlus size={18} />
              <span className='hidden sm:inline'>Signup</span>
            </Link>

            <Link to={"/signin"} className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-2 md:px-4 
									rounded-md flex items-center gap-1 transition duration-300 ease-in-out'>
              <LogIn size={18} />
              <span className='hidden sm:inline'>Signin</span>
            </Link>
            </>
          )
        }
      </nav>
    </header>
  )
}

export default Header