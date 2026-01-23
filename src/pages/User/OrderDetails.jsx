import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import "../../styles/user/MyOrders.css";

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

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) return;

    try {
      const orderRef = doc(db, "orders", order.id);

      await updateDoc(orderRef, {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: "user",
      });

      // Update UI instantly
      setOrder((prev) => ({
        ...prev,
        status: "cancelled",
      }));
    } catch (error) {
      console.error("Cancel failed:", error);
      alert("Failed to cancel order");
    }
  };

  if (loading) return <p className="loading">Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Order Confirmed!</h1>
          <p>
            Thank you for choosing BrewMaster. We’re preparing your coffee with
            care.
          </p>
        </div>
      </section>

      <div className="order-details-page">
        {/* Header */}

        <div className="order-details-header">
          <h2>Order Details</h2>
          <p className="order-id">Order ID: {order.id}</p>

          <form className="order-status-control">
            <label>Status:</label>

            <span className={`status ${order.status}`}>{order.status}</span>

            {order.status === "pending" && (
              <button type="button" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            )}
          </form>
        </div>

        {/* Content */}
        <div className="order-details-content">
          {/* LEFT - Items */}
          <div className="order-items-card">
            <h3>Items</h3>
            <div className="order-item-card-slider">
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

        {/* Delivery
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
        </div> */}

        {/* Delivery + Payment */}
        <div className="details-bottom">
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

          {/* Payment */}
          {/* <div className="payment-card">
            <h3>Payment Details</h3>
            <p>
              <strong>Method:</strong>{" "}
              {order.payment?.method === "cod"
                ? "Cash on Delivery"
                : order.payment?.method}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`payment-status ${order.payment?.status}`}>
                {order.payment?.status}
              </span>
            </p>
          </div> */}

          <div className="payment-card">
            <h3>Payment Details</h3>
            {order.status === "cancelled" && order.cancelledBy === "user" ? (
              <p>Payment: Cancelled – No Payment Required</p>
            ) : (
              <>
                <p>
                  <strong>Method:</strong>{" "}
                  {order.payment?.method === "cod"
                    ? "Cash on Delivery"
                    : order.payment?.method}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`payment-status ${order.payment?.status}`}>
                    {order.payment?.status}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
