import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";


const AdminRoute = () => {
  const { loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default AdminRoute;
