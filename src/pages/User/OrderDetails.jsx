import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import "../../styles/MyOrders.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "orders", orderId);
        const snap = await getDoc(orderRef);

        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  //   if (loading) return <p className="loading">Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Order Confirmed!</h1>
          <p>
            Thank you for choosing BrewMaster. We’re preparing your coffee with care.
          </p>
        </div>
      </section>

      <div className="order-details-page">
        {/* Header */}
        <div className="order-details-header">
          <h2>Order Details</h2>
          <p className="order-id">Order ID: {order.id}</p>
          <span className={`status ${order.status}`}>{order.status}</span>
        </div>

        {/* Content */}
        <div className="order-details-content">
          {/* LEFT - Items */}
          <div className="order-items-card">
            <h3>Items</h3>

            {order.items.map((item) => (
              <div className="order-item-row" key={item.id}>
                <img src={item.image} alt={item.title} />

                <div className="item-info">
                  <p className="item-title">{item.title}</p>
                  <p className="item-qty">
                    ₹ {item.price} × {item.quantity}
                  </p>
                </div>

                <p className="item-total">₹ {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* RIGHT - Summary */}
          <div className="order-summary-card">
            <h3>Price Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {order.pricing.subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>₹ {order.pricing.tax}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹ {order.pricing.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="delivery-card">
          <h3>Delivery Details</h3>
          <p>
            <strong>Name:</strong> {order.customer.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.customer.address}
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
