import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    let unsubscribeCart = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // Clean up old cart listener
      if (unsubscribeCart) {
        unsubscribeCart();
        unsubscribeCart = null;
      }

      if (!user) {
        setCart([]);
        setLoadingCart(false);
        return;
      }

      const cartRef = collection(db, "users", user.uid, "cart");

      unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCart(items);
        setLoadingCart(false);
      });
    });

    return () => {
      if (unsubscribeCart) unsubscribeCart();
      unsubscribeAuth();
    };
  }, []);

  /* CART ACTIONS */
  const increaseQty = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    const itemRef = doc(db, "users", user.uid, "cart", id);
    const item = cart.find((i) => i.id === id);
    await updateDoc(itemRef, { quantity: item.quantity + 1 });
  };

  const decreaseQty = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    const item = cart.find((i) => i.id === id);
    const itemRef = doc(db, "users", user.uid, "cart", id);

    if (item.quantity === 1) {
      await deleteDoc(itemRef);
    } else {
      await updateDoc(itemRef, { quantity: item.quantity - 1 });
    }
  };

  const removeFromCart = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "cart", id));
  };

  const addToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    const itemRef = doc(db, "users", user.uid, "cart", item.id);
    const snap = await getDoc(itemRef);

    if (snap.exists()) {
      // item already exists → UPDATE quantity
      const oldQty = snap.data().quantity || 0;
      await updateDoc(itemRef, {
        quantity: oldQty + item.quantity,
      });
    } else {
      // new item → ADD with quantity
      await setDoc(itemRef, {
        name: item.title, // IMPORTANT
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
