import React from 'react'
import { useUserStore } from '../../stores/useUserStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const authUser = useUserStore((state) => state.user);
    return  authUser ? <Outlet />  : <Navigate to={"/signin"} />
}

export default ProtectedRoute