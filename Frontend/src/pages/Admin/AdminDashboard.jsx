import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin/AdminDashboard.css";
import api from "../../axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");

        setStats({
          totalMenus: data.totalMenus,
          totalOrders: data.totalOrders,
          revenue: data.revenue,
        });

        setOrders(data.orders);
        setWeeklyData(data.weeklyData);

        // console.log(data.totalMenus);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  const normalize = (s) => s?.toUpperCase();

  const orderStatusData = [
    {
      name: "Pending",
      value: orders.filter((o) => normalize(o.status) === "PENDING").length,
    },
    {
      name: "Preparing",
      value: orders.filter((o) => normalize(o.status) === "PREPARING").length,
    },
    {
      name: "Delivered",
      value: orders.filter((o) => normalize(o.status) === "DELIVERED").length,
    },
    {
      name: "Cancelled",
      value: orders.filter((o) => o.status?.toLowerCase().includes("cancelled"))
        .length,
    },
  ];

  const COLORS = ["#FFC107", "#2196F3", "#4CAF50", "#F44336"];

  return (
    <>
      <div className="dashboard">
        <h1>Admin Dashboard</h1>

        {/*  Total Menus,  Total Orders,  Revenue */}
        <div className="top-cards">
          <div className="admin-card">
            <h3>Total Menus</h3>
            <p>{stats.totalMenus}</p>
          </div>

          <div className="admin-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="admin-card">
            <h3>Total Revenue</h3>
            <p>₹{stats.revenue}</p>
          </div>
        </div>

        {/*  Order Status Charts  */}
        <div className="section">
          <div className="section-title">Order Status Charts</div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {orderStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="section">
          <div className="section-title">Weekly Revenue & Orders</div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="revenue" stroke="#4CAF50" />
              <Line dataKey="orders" stroke="#2196F3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/*  Recent Orders Table  */}
        <div className="section">
          <div className="section-title">Recent Orders</div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* {orders.slice(0, 5).map((order) => ( */}
              {[...orders]
                .sort((a, b) => {
                  const priority = {
                    PREPARING: 1,
                    PENDING: 2,
                    DELIVERED: 3,
                    CANCELLED: 4,
                  };

                  return (
                    (priority[a.status] || 99) - (priority[b.status] || 99)
                  );
                })
                .slice(0, 5)
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>₹{order.pricing.total}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="view-more">
            <Link to="/admin/manage-order">View More →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
