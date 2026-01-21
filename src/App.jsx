import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";

import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import Menu from "./pages/User/Menu";
import HomePage from "./pages/User/HomePage";

import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AddMenu from "./pages/Admin/AddMenu";
import ManageMenu from "./pages/Admin/ManageMenu";
import UpdateMenu from "./pages/Admin/UpdateMenu";
import ManageCategory from "./pages/Admin/ManageCategory";
import UpdateUser from "./pages/User/UpdateUser";
import { saveCartItem, updateQuantity } from "./services/cartService";
import Checkout from "./pages/User/CheckoutPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRoute from "./components/Admin/AdminRoute";
import Cart from "./pages/User/CartPage";
import MyOrders from "./pages/User/MyOrders";
import OrderDetails from "./pages/User/OrderDetails";
import AboutCoffee from "./pages/User/AboutCoffee";
import Contact from "./pages/User/Contact";
import MenuDetails from "./pages/User/MenuDetails";
import UserRoute from "./components/User/UserRoute";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    console.log("need to login.....");

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedQty = existingItem.quantity + 1;

        updateQuantity(product.id, updatedQty);

        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: updatedQty } : item,
        );
      }

      const newItem = {
        ...product,
        quantity: 1,
      };
      saveCartItem(newItem);

      return [...prev, newItem];
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCart([]);
        return;
      }

      try {
        const cartRef = collection(db, "users", user.uid, "cart");
        const snapshot = await getDocs(cartRef);

        const cartItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCart(cartItems);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* USER LAYOUT */}

        <Route element={<MainLayout cart={cart} />}>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route path="/about" element={<AboutCoffee />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/menu/:id"
            element={<MenuDetails addToCart={addToCart} />}
          />
          <Route element={<UserRoute />}>
            <Route path="/updateUser" element={<UpdateUser />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:orderId" element={<OrderDetails />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-menu" element={<AddMenu />} />
            <Route path="/admin/manage-menu" element={<ManageMenu />} />
            <Route path="/admin/menu/edit/:id" element={<UpdateMenu />} />
            <Route path="/admin/category" element={<ManageCategory />} />
          </Route>
        </Route>

        {/* Pages WITHOUT Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
