import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalCategories: 0,
    totalOrders: 0, // optional
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch menus from Firestore
        const menuSnapshot = await getDocs(collection(db, "menus"));
        const totalMenus = menuSnapshot.size;

        // Fetch categories from Firestore
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const totalCategories = categorySnapshot.size;

        // Fetch orders from Firestore (optional)
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const totalOrders = ordersSnapshot.size;

        setStats({ totalMenus, totalCategories, totalOrders });
      } catch (err) {
        console.error("Failed to fetch stats from Firebase", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <style>{`
        .dashboard-container {
          margin-left: 0px;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .cards {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 20px;
        }
        .card {
          flex: 1;
          min-width: 220px;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .card-title {
          font-size: 18px;
          color: #555;
          margin-bottom: 10px;
        }
        .card-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
      `}</style>

      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div className="cards">
          <Link to="/admin/manage-menu" style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-title">Total Menus</div>
              <div className="card-value">{stats.totalMenus}</div>
            </div>
          </Link>

          <Link to="/admin/manage-category" style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-title">Total Categories</div>
              <div className="card-value">{stats.totalCategories}</div>
            </div>
          </Link>

          <Link to="/admin/orders" style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-title">Total Orders</div>
              <div className="card-value">{stats.totalOrders}</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
