import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/* Firestore reference */
const categoryCollection = collection(db, "categories");

/* ================= FETCH ================= */
export const getCategories = async () => {
  const snapshot = await getDocs(categoryCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ================= ADD ================= */
export const addCategory = async (name) => {
  return await addDoc(categoryCollection, { name });
};

/* ================= UPDATE ================= */
export const updateCategory = async (id, name) => {
  const categoryDoc = doc(db, "categories", id);
  return await updateDoc(categoryDoc, { name });
};

/* ================= DELETE ================= */
export const deleteCategory = async (id) => {
  const categoryDoc = doc(db, "categories", id);
  return await deleteDoc(categoryDoc);
};
