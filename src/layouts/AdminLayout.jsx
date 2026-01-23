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
    // <div className="admin-layout">
    //   <aside className="admin-sidebar">
    //     <h2>Admin Panel</h2>
    //     <nav className="admin-sidebar-nav">
    //       <ul>
    //         <li><Link to="/admin">Dashboard</Link></li>
    //         <li><Link to="/admin/add-menu">Add Menu</Link></li>
    //         <li><Link to="/admin/manage-menu">Manage Menus</Link></li>
    //         <li><Link to="/admin/category">Manage Category</Link></li>
    //       </ul>
    //     </nav>
    //   </aside>

    //   <div className="main">
        // <header className="admin-navbar">
        //   <span>Welcome, {adminName}</span>
        //   <button onClick={handleLogout}>Logout</button>
        // </header>

    //     <div className="content">
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
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
