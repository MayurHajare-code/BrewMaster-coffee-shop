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
const menuCollection = collection(db, "menu");

/* ================= FETCH ================= */
export const getMenuItems = async () => {
  const snapshot = await getDocs(menuCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ================= ADD ================= */
export const addMenuItem = async (menuData) => {
  try {
    // Image path (from public folder)
    const imageURL = `/assets/${menuData.image.name}`;

    const docRef = await addDoc(menuCollection, {
      title: menuData.title,
      price: Number(menuData.price),
      image: imageURL,
      quantity: menuData.quantity,
      description: menuData.description,
      category: menuData.category,
      calories:menuData.calories,
      available: menuData.available,
      feature: menuData.feature,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }
};

export const updateMenuItem = async (id, menuData) => {
  const menuDoc = doc(db, "menu", id);
  return await updateDoc(menuDoc, menuData);
};

/* ================= DELETE ================= */
export const deleteMenuItem = async (id) => {
  const menuDoc = doc(db, "menu", id);
  return await deleteDoc(menuDoc);
};

/* ================= FETCH SINGLE ================= */
export const getMenuById = async (id) => {
  const menuDoc = doc(db, "menu", id);
  const snapshot = await getDoc(menuDoc);

  if (!snapshot.exists()) {
    throw new Error("Menu not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};
