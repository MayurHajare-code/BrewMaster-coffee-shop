import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/admin/AdminLayout.css";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setAdminName(userData.name || auth.currentUser.email);
        } else {
          // If no Firestore data, fallback to email
          setAdminName(auth.currentUser.email);
        }
      } else {
        // If not logged in, redirect to login
        navigate("/login");
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut(); // Firebase logout
    navigate("/admin-login");   // Redirect to login page
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-sidebar-nav">
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/add-menu">Add Menu</Link></li>
            <li><Link to="/admin/manage-menu">Manage Menus</Link></li>
            <li><Link to="/admin/category">Manage Category</Link></li>
          </ul>
        </nav>
      </aside>

      <div className="main">
        <header className="admin-navbar">
          <span>Welcome, {adminName}</span>
          <button onClick={handleLogout}>Logout</button>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;




// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import "../styles/admin/AdminLayout.css";

// const AdminLayout = ({ children, ownerName }) => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await fetch("http://localhost:8080/logout", {
//       method: "POST",
//       credentials: "include"
//     });
//     navigate("/");
//   };

//   return (
//     <div className="admin-layout">
//       <aside className="admin-sidebar">
//         <h2>Admin</h2>
//         <nav className="admin-sidebar-nav">
//           <ul>
//             <li><Link to="/admin">Dashboard</Link></li>
            
//             <li><Link to="/admin/add-menu">Add Menu</Link></li>
//             <li><Link to="/admin/manage-menu">Manage Menus</Link></li>
//             <li><Link to="/admin/category">Manage Category</Link></li>
//             {/* <li><Link to="/pg_owner/bookings">Total Bookings</Link></li> */}

//           </ul>
//         </nav>
//       </aside>

//       <div className="main">
//         <header className="admin-navbar">
//           <span>Welcome, Admin</span>
//           <button onClick={handleLogout}>Logout</button>
//         </header>

//         <div className="content"><Outlet /></div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
