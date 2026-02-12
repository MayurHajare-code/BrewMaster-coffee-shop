import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../axios";
import { useAuth } from "../../context/AuthContext";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchMyOredr(user._id);
    }
  }, [user]);

  const fetchMyOredr = async (userId) => {
    setLoading(true);
    try {
      const res = await api.get(`/order/myorder/${userId}`);
      setOrders(res.data.orders);
      console.log(res.data);
      console.log(res.data.orders.status);
    } catch (err) {
      console.error("Failed to fetch users orders", err);
      toast.error(
        err.response?.data?.message || "Failed to fetch users orders",
      );
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <p>Loading your orders...</p>;

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Your Order History</h1>
          <p>
            From your daily morning espresso to your monthly bean
            subscription—track your current deliveries and revisit your
            favorites.
          </p>
        </div>
      </section>

      <div className="orders-page">
        {loading ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p>You have not placed any orders yet ☕</p>
        ) : (
          orders.map((order) => (
            <Link to={`/my-orders/${order._id}`} key={order._id}>
              <div className="order-card">
                <div className="order-header">
                  <span>Order ID: {order._id.slice(0, 8)}</span>
                  <span className={`status ${order.payment?.status}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹ {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span>
                    Total: ₹ {order.pricing?.total || order.totalAmount}
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default MyOrders;
