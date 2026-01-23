import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import "../../styles/user/MyOrders.css";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, "orders");

        const q = query(
          ordersRef,
          where("userId", "==", user.uid),
          //   orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(q);

        const userOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  //   if (loading) return <p>Loading your orders...</p>;

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
        {orders.length === 0 ? (
          <p>You have not placed any orders yet ☕</p>
        ) : (
          orders.map((order) => (
            <Link to={`/my-orders/${order.id}`} key={order.id}>
              <div className="order-card">
                <div className="order-header">
                  <span>Order ID: {order.id.slice(0, 8)}</span>
                  <span className={`status ${order.status}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>₹ {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span>
                    Total: ₹ {order.pricing?.total || order.totalAmount}
                  </span>
                  <span>
                    {order.createdAt
                      ? order.createdAt.toDate().toLocaleDateString()
                      : "—"}
                  </span>
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
