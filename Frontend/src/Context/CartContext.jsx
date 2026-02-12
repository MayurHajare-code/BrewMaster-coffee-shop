import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = (menu) => {
    let updatedCart = [...cart];
    const item = updatedCart.find((i) => i._id === menu._id);

    if (item) {
      item.quantity += 1;
    } else {
      updatedCart.push({ ...menu, quantity: 1 });
    }

    syncCart(updatedCart);
  };

  const increaseQty = (_id) => {
    const updatedCart = cart.map((item) =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    syncCart(updatedCart);
  };

  const decreaseQty = (_id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    syncCart(updatedCart);
  };

  const removeFromCart = (_id) => {
    const updatedCart = cart.filter((item) => item._id !== _id);
    syncCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
