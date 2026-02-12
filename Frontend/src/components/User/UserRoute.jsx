import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const UserRoute = () => {
  const { loading, isUser } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isUser ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoute;
