import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../styles/Checkout.css";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";

const TAX_RATE = 0.05;

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  // fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const cartRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCart(items);
      setLoading(false);
    };

    fetchCart();
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
      alert("Please fill all customer details");
      return;
    }

    if (phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      setSubmitting(true);

      // save order
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        pricing: {
          subtotal,
          tax,
          total: grandTotal,
        },
        customer: { name, phone, address },
        status: "pending",
        createdAt: serverTimestamp(),
      });
      console.log("Submitting order...");
      // clear cart
      const cartRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);
      snapshot.docs.forEach((doc) => deleteDoc(doc.ref));

      setCart([]);
      toast.success(" Order placed successfully!");

      navigate("/my-orders");
    } catch (error) {
      console.error("Order failed", error);
      toast.error("Failed to place order. Try again.");
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

              <button type="submit" disabled={submitting}>
                Place Order
              </button>
            </form>

            <div className="checkout-summary">
              <h3>Order Summary</h3>

              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>
                    {item.title} × {item.quantity}
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
