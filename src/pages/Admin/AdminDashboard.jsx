import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const menuSnap = await getDocs(collection(db, "menu"));
      const orderSnap = await getDocs(collection(db, "orders"));

      let totalRevenue = 0;
      const orderList = [];

      // Init weekly map
      const weeklyMap = {
        Mon: { day: "Mon", revenue: 0, orders: 0 },
        Tue: { day: "Tue", revenue: 0, orders: 0 },
        Wed: { day: "Wed", revenue: 0, orders: 0 },
        Thu: { day: "Thu", revenue: 0, orders: 0 },
        Fri: { day: "Fri", revenue: 0, orders: 0 },
        Sat: { day: "Sat", revenue: 0, orders: 0 },
        Sun: { day: "Sun", revenue: 0, orders: 0 },
      };

      orderSnap.forEach((doc) => {
        const data = doc.data();
        orderList.push({ id: doc.id, ...data });

        // Count revenue ONLY from delivered orders
        // if (data.status === "DELIVERED") {
        //   totalRevenue += data.pricing?.total || 0;

        //   if (data.createdAt) {
        //     const day = getDayName(data.createdAt);
        //     weeklyMap[day].revenue += data.pricing?.total || 0;
        //     weeklyMap[day].orders += 1;
        //   }
        // }

        if (data.createdAt) {
          const day = getDayName(data.createdAt);

          // count ALL orders
          weeklyMap[day].orders += 1;

          // count revenue ONLY if delivered
          if (data.status?.toUpperCase() === "DELIVERED") {
            totalRevenue += data.pricing?.total || 0;
            weeklyMap[day].revenue += data.pricing?.total || 0;
          }
        }
      });

      setStats({
        totalMenus: menuSnap.size,
        totalOrders: orderSnap.size,
        revenue: totalRevenue,
      });

      setOrders(orderList);
      setWeeklyData(Object.values(weeklyMap));
    };

    fetchData();
  }, []);

  /* ================= CHART DATA ================= */
  // const orderStatusData = [
  //   {
  //     name: "Pending",
  //     value: orders.filter((o) => o.status === "PENDING").length,
  //   },
  //   {
  //     name: "Preparing",
  //     value: orders.filter((o) => o.status === "PREPARING").length,
  //   },
  //   {
  //     name: "Delivered",
  //     value: orders.filter((o) => o.status === "DELIVERED").length,
  //   },
  //   {
  //     name: "Cancelled",
  //     value: orders.filter((o) => o.status === "CANCELLED").length,
  //   },
  // ];

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
      value: orders.filter((o) => normalize(o.status) === "CANCELLED").length,
    },
  ];

  const getDayName = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const COLORS = ["#FFC107", "#2196F3", "#4CAF50", "#F44336"];

  return (
    <>
      <style>{`
        .dashboard {
          padding: 20px;
          background: #f4f6fa;
          font-family: Arial, sans-serif;
        }

        h1 {
          margin-bottom: 20px;
        }

        /* ===== TOP CARDS ===== */
        .top-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }

        .card {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          text-align: center;
        }

        .card h3 {
          font-size: 15px;
          color: #666;
        }

        .card p {
          font-size: 28px;
          font-weight: bold;
          margin-top: 8px;
        }

        /* ===== SECTIONS ===== */
        .section {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          margin: 30px 0px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }

        /* ===== RECENT ORDERS ===== */
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }

        th {
          background: #f1f3f6;
        }

        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          color: #fff;
        }

        .PENDING { background: #FFC107; }
        .PREPARING { background: #2196F3; }
        .DELIVERED { background: #4CAF50; }
        .CANCELLED { background: #F44336; }

        .view-more {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.view-more a {
  color: #2196F3;
  font-weight: 600;
  text-decoration: none;
}

.view-more a:hover {
  text-decoration: underline;
}


      `}</style>

      <div className="dashboard">
        <h1>Admin Dashboard</h1>

        {/* ===== [ Total Menus ] [ Total Orders ] [ Revenue ] ===== */}
        <div className="top-cards">
          <div className="card">
            <h3>Total Menus</h3>
            <p>{stats.totalMenus}</p>
          </div>

          <div className="card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="card">
            <h3>Total Revenue</h3>
            <p>₹{stats.revenue}</p>
          </div>
        </div>

        {/* ===== [ Order Status Charts ] ===== */}
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

        {/* ===== [ Weekly Revenue & Orders Chart ] ===== */}
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

        {/* ===== [ Recent Orders Table ] ===== */}
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
                  <tr key={order.id}>
                    <td>{order.id}</td>
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
            <Link to="/admin-order">View More →</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
