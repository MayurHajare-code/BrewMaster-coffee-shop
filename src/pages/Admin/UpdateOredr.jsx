import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/admin/AddMenu.css";
import "../../styles/user/MyOrders.css";

/**
 * STATUS RULE (VERY IMPORTANT)
 * We normalize everything to LOWERCASE in DB & UI
 * Table -> Details -> Firestore all match
 */

const UpdateOrder = () => {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "orders", orderId);
        const snap = await getDoc(orderRef);

        if (snap.exists()) {
          const data = snap.data();
          setOrder({ id: snap.id, ...data });
          setSelectedStatus(data.status); // ✅ FIX 1
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* ================= UPDATE STATUS ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === order.status) return;

    try {
      setUpdating(true);

      const orderRef = doc(db, "orders", orderId);

      const updateData = {
        status: selectedStatus, // lowercase only
        updatedAt: serverTimestamp(),
      };

      // ✅ FIX 2: AUTO MARK COD AS PAID WHEN DELIVERED
      if (
        selectedStatus === "delivered" &&
        order.payment?.method === "cod"
      ) {
        updateData["payment.status"] = "paid";
        updateData.paymentUpdatedAt = serverTimestamp();
      }

      await updateDoc(orderRef, updateData);

      // ✅ FIX 3: UI INSTANT UPDATE
      setOrder((prev) => ({
        ...prev,
        status: selectedStatus,
        payment:
          selectedStatus === "delivered"
            ? { ...prev.payment, status: "paid" }
            : prev.payment,
      }));

      alert("Order updated successfully");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="loading">Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  /* ================= UI ================= */
  return (
    <div className="add-transaction-container" style={{ maxWidth: "900px" }}>
      <div className="order-details-page">
        {/* HEADER */}
        <div className="order-details-header">
          <h2>Order Details</h2>
          <p className="order-id">Order ID: {order.id}</p>

          <form onSubmit={handleSubmit} className="order-status-control">
            <label>Status:</label>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isDelivered || isCancelled} // ✅ FIX 4
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
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

        {/* CONTENT */}
        <div className="order-details-content">
          {/* ITEMS */}
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
                  <p className="item-total">
                    ₹ {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PRICE SUMMARY */}
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

        {/* DELIVERY + PAYMENT */}
        <div className="details-bottom">
          {/* DELIVERY */}
          <div className="delivery-card">
            <h3>Delivery Details</h3>
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Address:</strong> {order.customer.address}</p>
          </div>

          {/* PAYMENT */}
          <div className="payment-card">
            <h3>Payment Details</h3>

            {isCancelled ? (
              <>
                <p className="payment-cancelled">
                   This order was cancelled by the user
                </p>
                <p className="payment-muted">
                  No payment is required.
                </p>
              </>
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
                  <span
                    className={`payment-status ${order.payment?.status}`}
                  >
                    {order.payment?.status}
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



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebase";
// import "../../styles/admin/AddMenu.css";
// import "../../styles/user/MyOrders.css";

// const UpdateOrder = () => {
//   const { id: orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState("");

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const orderRef = doc(db, "orders", orderId);
//         const snap = await getDoc(orderRef);

//         if (snap.exists()) {
//           setOrder({ id: snap.id, ...snap.data() });
//         }
//       } catch (error) {
//         console.error("Error fetching order:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   useEffect(() => {
//     if (order?.status) {
//       setSelectedStatus(order.status);
//     }
//   }, [order]);

//   useEffect(() => {
//     if (
//       selectedStatus === "DELIVERED" &&
//       order?.payment?.method === "cod" &&
//       order?.payment?.status === "pending"
//     ) {
//       setPaymentStatus("paid");
//     }
//   }, [selectedStatus, order]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   alert("selectedStatus:", selectedStatus);
//   //   if (!selectedStatus || selectedStatus === order.status) {
//   //     return;
//   //   }

//   //   try {
//   //     setUpdating(true);

//   //     const orderRef = doc(db, "orders", orderId);

//   //     await updateDoc(orderRef, {
//   //       status: selectedStatus,
//   //       updatedAt: serverTimestamp(),
//   //     });

//   //     // Update UI instantly (no refetch needed)
//   //     setOrder((prev) => ({
//   //       ...prev,
//   //       status: selectedStatus,
//   //     }));

//   //     alert("Order status updated successfully ✅");
//   //   } catch (error) {
//   //     console.error("Error updating order:", error);
//   //     alert("Failed to update order ❌");
//   //   } finally {
//   //     setUpdating(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedStatus || selectedStatus === order.status) return;

//     try {
//       setUpdating(true);

//       const orderRef = doc(db, "orders", orderId);

//       const updateData = {
//         status: selectedStatus,
//         updatedAt: serverTimestamp(),
//       };

//       if (selectedStatus === "DELIVERED" && order.payment?.method === "cod") {
//         updateData["payment.status"] = "paid";
//         updateData.paymentUpdatedAt = serverTimestamp();
//       }

//       await updateDoc(orderRef, updateData);

//       // Update UI instantly
//       setOrder((prev) => ({
//         ...prev,
//         status: selectedStatus,
//         payment:
//           selectedStatus === "DELIVERED"
//             ? { ...prev.payment, status: "paid" }
//             : prev.payment,
//       }));

//       alert("Order updated successfully");
//     } catch (error) {
//       console.error(error);
//       alert("Update failed ");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handlePaymentUpdate = async () => {
//     try {
//       setUpdating(true);

//       const orderRef = doc(db, "orders", orderId);

//       await updateDoc(orderRef, {
//         "payment.status": paymentStatus,
//         paymentUpdatedAt: serverTimestamp(),
//       });

//       setOrder((prev) => ({
//         ...prev,
//         payment: {
//           ...prev.payment,
//           status: paymentStatus,
//         },
//       }));

//       alert("Payment status updated");
//     } catch (error) {
//       console.error("Payment update failed:", error);
//       alert("Failed to update payment");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) return <p className="loading">Loading order...</p>;
//   if (!order) return <p>Order not found</p>;

//   return (
//     <div className="add-transaction-container" style={{ maxWidth: "900px" }}>
//       <div className="order-details-page">
//         {/* Header */}

//         <div className="order-details-header">
//           <h2>Order Details</h2>
//           <p className="order-id">Order ID: {order.id}</p>

//           <form onSubmit={handleSubmit} className="order-status-control">
//             <label>Status:</label>

//             {/* <span className={`status ${order.status}`}>{order.status}</span> */}

//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               disabled={
//                 order.status === "delivered" || order.status === "cancelled"
//               }
//             >
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="preparing">Preparing</option>
//               <option value="out_for_delivery">Out for Delivery</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>

//             <button
//               type="submit"
//               disabled={updating || order.status === "cancelled"}
//             >
//               {order.status === "cancelled"
//                 ? "Order Cancelled"
//                 : updating
//                   ? "Updating..."
//                   : "Update"}
//             </button>
//           </form>
//         </div>

//         {/* Content */}
//         <div className="order-details-content">
//           <div className="order-items-card">
//             <h3>Items</h3>
//             <div className="order-item-card-slider">
//               {order.items.map((item) => (
//                 <div className="order-item-row" key={item.id}>
//                   <img src={item.image} alt={item.title} />

//                   <div className="item-info">
//                     <p className="item-title">{item.title}</p>
//                     <p className="item-qty">
//                       ₹ {item.price} × {item.quantity}
//                     </p>
//                   </div>

//                   <p className="item-total">₹ {item.price * item.quantity}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT - Summary */}
//           <div className="order-summary-card">
//             <h3>Price Summary</h3>

//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span>₹ {order.pricing.subtotal}</span>
//             </div>

//             <div className="summary-row">
//               <span>Tax</span>
//               <span>₹ {order.pricing.tax}</span>
//             </div>

//             <div className="summary-total">
//               <span>Total</span>
//               <span>₹ {order.pricing.total}</span>
//             </div>
//           </div>
//         </div>

//         {/* Delivery
//         <div className="delivery-card">
//           <h3>Delivery Details</h3>
//           <p>
//             <strong>Name:</strong> {order.customer.name}
//           </p>
//           <p>
//             <strong>Phone:</strong> {order.customer.phone}
//           </p>
//           <p>
//             <strong>Address:</strong> {order.customer.address}
//           </p>
//         </div> */}

//         {/* Delivery + Payment */}
//         <div className="details-bottom">
//           {/* Delivery */}
//           <div className="delivery-card">
//             <h3>Delivery Details</h3>
//             <p>
//               <strong>Name:</strong> {order.customer.name}
//             </p>
//             <p>
//               <strong>Phone:</strong> {order.customer.phone}
//             </p>
//             <p>
//               <strong>Address:</strong> {order.customer.address}
//             </p>
//           </div>

//           {/* Payment */}
//           {/* <div className="payment-card">
//             <h3>Payment Details</h3>
//             <p>
//               <strong>Method:</strong>{" "}
//               {order.payment?.method === "cod"
//                 ? "Cash on Delivery"
//                 : order.payment?.method}
//             </p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <span className={`payment-status ${order.payment?.status}`}>
//                 {order.payment?.status}
//               </span>
//             </p>
//           </div> */}

//           {/* <div className="payment-card">
//             <h3>Payment Details</h3>

//             <p>
//               <strong>Method:</strong>{" "}
//               {order.payment?.method === "cod"
//                 ? "Cash on Delivery"
//                 : order.payment?.method}
//             </p>

//             <p>
//               <strong>Status:</strong>{" "}
//               <span
//                 className={`payment-status ${
//                   order.status === "DELIVERED" ? "paid" : "pending"
//                 }`}
//               >
//                 {order.status === "DELIVERED" ? "paid" : "pending"}
//               </span>
//             </p>

//             {/* INFO MESSAGE *
//             {order.status !== "DELIVERED" && (
//               <p className="payment-info">
//                 Payment will be enabled after delivery
//               </p>
//             )}
//           </div> */}

//           <div className="payment-card">
//             <h3>Payment Details</h3>

//             {order.status === "cancelled" ? (
//               <>
//                 <p className="payment-cancelled">
//                   This order was cancelled by the user
//                 </p>
//                 <p className="payment-muted">
//                   No payment is required for cancelled orders.
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p>
//                   <strong>Method:</strong>{" "}
//                   {order.payment?.method === "cod"
//                     ? "Cash on Delivery"
//                     : order.payment?.method}
//                 </p>

//                 <p>
//                   <strong>Status:</strong>{" "}
//                   <span
//                     className={`payment-status ${
//                       order.status === "delivered" ? "paid" : "pending"
//                     }`}
//                   >
//                     {order.status === "delivered" ? "paid" : "pending"}
//                   </span>
//                 </p>

//                 {order.status !== "delivered" && (
//                   <p className="payment-info">
//                     Payment will be enabled after delivery
//                   </p>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateOrder;
