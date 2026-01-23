import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

function AdminHeader() {
  const navigate = useNavigate();
    const [adminName, setAdminName] = useState("");
  
    useEffect(() => {
      const fetchAdminData = async () => {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // console.log("Firestore user data:", userData);
            setAdminName(userData.firstName || auth.currentUser.email);
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
      toast.success("Logout Successfully");
      navigate("/admin-login"); // Redirect to login page
    };
  
  return (
    <>
      <header className="admin-header">
        <h1>Welcome, <span className="admin-name">{adminName}</span> in BrewMaster</h1>

        <button onClick={handleLogout}>Logout</button>
      </header>

      <style>
        {`
          .admin-header {
            background-color: #0078d7;
            color: white;
            padding: 1rem 1.5rem;
            display: flex;
  justify-content: space-between;
  align-items: center;
          }

          .admin-header .admin-name{
  color: gray;
  text-decoration: underline;
}

          .admin-header button {
  padding: 6px 12px;
  border: none;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
}
        `}
      </style>
    </>
  );
}

export default AdminHeader;
