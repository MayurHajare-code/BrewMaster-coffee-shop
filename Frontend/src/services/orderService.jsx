import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* Firestore reference */
const orderCollection = collection(db, "orders");

/* ================= FETCH ================= */
export const getOrderItems = async () => {
  const snapshot = await getDocs(orderCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
