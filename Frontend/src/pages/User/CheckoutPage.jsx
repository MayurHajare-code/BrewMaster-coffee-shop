import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../styles/user/Checkout.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useCart } from "../../Context/CartContext";
import api from "../../axios";

const TAX_RATE = 0.05;

const Checkout = () => {
  const { cart, setCart } = useCart();
  // const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // date pick and validation ....
  const [deliveryDate, setDeliveryDate] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const navigate = useNavigate();

  useEffect(() => {
    setDeliveryDate(today);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const grandTotal = subtotal + tax;

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      toast.error("Please fill all customer details");
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token"); // JWT

      await api.post("/order", {
        // items: cart,

        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),

        pricing: {
          subtotal,
          tax,
          total: grandTotal,
        },
        customer: { name, phone, address },
        deliveryDate,
        paymentMethod,
      });

      localStorage.removeItem("cart");
      setCart([]);

      toast.success("Order placed successfully");
      navigate("/my-orders");
    } catch (error) {
      toast.error("Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Secure Checkout</h1>
          <p>
            You’re just one step away from your perfect brew. Complete your
            details below to finalize your order through our encrypted payment
            gateway.
          </p>
        </div>
      </section>

      <section className="data-section">
        {cart.length === 0 ? (
          <p>Your cart is empty ☕</p>
        ) : (
          <div className="checkout-container">
            <form className="checkout-form" onSubmit={placeOrder}>
              <h3>Customer Details</h3>

              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label>Delivery Address</label>
              <textarea
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label>Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                min={today}
                onChange={(e) => {
                  setDeliveryDate(e.target.value);
                  setError("");
                }}
                required
              />

              {error && <p className="error-text">{error}</p>}

              <h3>Payment Method</h3>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>

              <button type="submit" disabled={submitting}>
                {submitting ? "Placing order..." : "Place Order"}
              </button>
            </form>

            <div className="checkout-summary">
              <h3>Order Summary</h3>

              {cart.map((item) => (
                <div key={item._id} className="summary-item">
                  <span>
                    {item.name}{" "}
                    <i
                      className="fa-solid fa-xmark"
                      style={{ fontSize: "10px" }}
                    ></i>{" "}
                    {item.quantity}
                  </span>
                  <span>₹ {item.price * item.quantity}</span>
                </div>
              ))}

              <hr />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹ {subtotal}</span>
              </div>

              <div className="summary-row">
                <span>GST (5%)</span>
                <span>₹ {tax}</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹ {grandTotal}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Checkout;
