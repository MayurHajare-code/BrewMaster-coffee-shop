import { Link } from "react-router-dom";
import "../../styles/user/CartPage.css";

import { useCart } from "../../Context/CartContext";
import { useEffect } from "react";

const Cart = ({}) => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  // console.log(cart);

  const TAX_RATE = 0.05;
  const tax = Number((totalAmount * TAX_RATE).toFixed(2));

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Your Coffee Basket</h1>
          <p>
            Review your selection of premium blends and brewing essentials
            before we prepare them for your enjoyment.
          </p>
        </div>
      </section>

      <div className="data-section">
        <div className="cart-container">
          {/* LEFT */}
          <div className="cart-items">
            {cart.length === 0 ? (
              <p>Your cart is empty ☕</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img
                      // src={`http://localhost:3000${item.image}`}
                      // alt={item.name}
                      src={item.image?.url}
                      alt={item.name || "Menu"}
                    />

                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>₹ {item.price}</p>

                      <div className="qty-controls">
                        <button onClick={() => decreaseQty(item._id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item._id)}>+</button>
                      </div>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {totalAmount}</span>
            </div>

            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹ {tax}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹ {totalAmount + tax}</span>
            </div>

            <Link to="/checkout">
              <button className="order-btn">Order Now</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
