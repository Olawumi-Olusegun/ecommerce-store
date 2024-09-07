import React from 'react'
import { useUserStore } from '../../stores/useUserStore';
import { Navigate, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const authUser = useUserStore((state) => state.user);
    return authUser && authUser?.role === "admin" ?  <Outlet /> : <Navigate to={"/"} />
}

export default AdminLayout