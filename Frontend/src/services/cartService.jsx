import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const saveCartItem = async (item) => {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "users", user.uid, "cart", String(item.id));

  await setDoc(cartRef, {
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  });
};

export const updateQuantity = async (itemId, quantity) => {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "users", user.uid, "cart", String(itemId));

  await updateDoc(cartRef, { quantity });
};

export const removeCartItem = async (itemId) => {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "users", user.uid, "cart", String(itemId));

  await deleteDoc(cartRef);
};

export const getUserCart = async (uid) => {
  const cartRef = collection(db, "users", uid, "cart");
  const snapshot = await getDocs(cartRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
