import React, { useEffect, useState } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import "../styles/admin/AdminLayout.css";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminFooter from "../components/Admin/AdminFooter";

const AdminLayout = () => {
  return (
    <>
      <div className="app-container">
        <AdminHeader />
        <div className="content-container">
          <AdminSidebar />
          <main className="main-content">
            <Outlet />
          </main>
        </div>
        <AdminFooter />
      </div>

      <style>
        {`
          .app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
          }

          .content-container {
            display: flex;
            flex: 1;
            background-color: #fafafa;
          }

          .main-content {
            flex: 1;
            padding: 1rem 2rem;
            overflow-y: auto;
            max-height: calc(100vh - 135px);
          }

        `}
      </style>
    </>
  );
};

export default AdminLayout;
