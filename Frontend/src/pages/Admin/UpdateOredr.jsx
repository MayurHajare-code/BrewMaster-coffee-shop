import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/admin/AddMenu.css";
import "../../styles/user/MyOrders.css";
import toast from "react-hot-toast";
import api from "../../axios";

const UpdateOrder = () => {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/${orderId}`);
      setOrder(res.data.order);
      setSelectedStatus(res.data.order.status);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === order.status) return;

    try {
      setUpdating(true);

      await api.patch(`/order/${orderId}/status`, {
        status: selectedStatus,
      });

      setOrder((prev) => ({
        ...prev,
        status: selectedStatus,
        payment:
          selectedStatus === "delivered" && prev.payment.method === "cod"
            ? { ...prev.payment, status: "paid" }
            : prev.payment,
      }));

      toast.success("Order updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };
  if (loading) return <p className="loading">Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  return (
    <div className="add-transaction-container" style={{ maxWidth: "900px" }}>
      <div className="order-details-page">
        <div className="order-details-header">
          <h2>Order Details</h2>
          <p className="order-id">Order ID: {order._id}</p>

          <form onSubmit={handleSubmit} className="order-status-control">
            <label>Status:</label>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isDelivered || isCancelled}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              type="submit"
              disabled={updating || isCancelled || isDelivered}
            >
              {isCancelled
                ? "Order Cancelled"
                : isDelivered
                  ? "Order Delivered"
                  : updating
                    ? "Updating..."
                    : "Update"}
            </button>
          </form>
        </div>

        <div className="order-details-content">
          <div className="order-items-card">
            <h3>Items</h3>
            <div className="order-item-card-slider">
              {order.items.map((item) => (
                <div className="order-item-row" key={item._id}>
                  <img
                    // src={`http://localhost:3000${item.image}`}
                    // alt={item.title}

                    src={item.image}
                    alt={item.name || "Menu"}
                  />
                  <div className="item-info">
                    <p className="item-title">{item.name}</p>
                    <p className="item-qty">
                      ₹ {item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="item-total">₹ {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

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

        <div className="details-bottom">
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
            <p>
              <strong>Delivery Date:</strong> {order.deliveryDate}
            </p>
          </div>

          <div className="payment-card">
            <h3>Payment Details</h3>

            {order.status?.toLowerCase().includes("cancelled") ? (
              <p>Payment: Cancelled – {order.status}</p>
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
                    {order.cancelledBy === "user" && order.cancelledBy && (
                      <span className="cancelled-by">
                        {" "}
                        by {order.cancelledBy}
                      </span>
                    )}
                  </span>
                </p>

                {!isDelivered && (
                  <p className="payment-info">
                    Payment will be enabled after delivery
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
