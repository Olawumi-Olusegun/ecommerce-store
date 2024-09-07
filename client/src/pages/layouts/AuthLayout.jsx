import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../../stores/useUserStore';


const AuthLayout = () => {

  const authUser = useUserStore((state) => state.user);

  return (
    <div className='min-h-dvh flex items-center justify-center bg-gray-900 text-white relative overflow-hidden'>
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
            </div>
        </div>
        <main className='h-full w-full z-20'>
            { authUser ? <Navigate to={"/"} /> : <Outlet /> }
        </main>
    </div>
  )
}

export default AuthLayout