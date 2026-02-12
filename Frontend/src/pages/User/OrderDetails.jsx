import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../styles/user/MyOrders.css";
import api from "../../axios";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Invoice from "./Invoice";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/order/${orderId}`);
        setOrder(res.data.order);
        // console.log(res.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.patch(`/order/${order._id}/cancel`);

      setOrder((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          status: "cancelled",
        },
        cancelledBy: "user",
      }));
    } catch (error) {
      console.error("Cancel failed:", error);
      alert("Failed to cancel order");
    }
  };

  //Create PDF Download Function
  const downloadInvoice = async () => {
    if (!invoiceRef.current) {
      alert("Invoice not ready yet");
      return;
    }

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${order.id}.pdf`);
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
          <p className="order-id">Order ID: {order._id}</p>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <form className="order-status-control">
              <label>Status:</label>

              <span className={`status ${order.status}`}>{order.status}</span>

              {order.status === "pending" && (
                <button type="button" onClick={handleCancelOrder}>
                  Cancel Order
                </button>
              )}
            </form>

            {order && order.status === "delivered" && (
              <button onClick={downloadInvoice} className="btn">
                Download Invoice
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="order-details-content">
          {/* LEFT - Items */}
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
            <p>
              <strong>Delivery Date:</strong> {order.deliveryDate}
            </p>
          </div>

          {/* Payment */}

          <div className="payment-card">
            <h3>Payment Details</h3>
            {order.status?.toLowerCase().includes("cancelled") ? (
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
                    {order.status}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden invoice for PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={invoiceRef}>
          <Invoice order={order} />
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
