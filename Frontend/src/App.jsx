import { useEffect, useState, lazy, Suspense } from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import toast, { Toaster } from "react-hot-toast";
// import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRoute from "./components/Admin/AdminRoute";
import UserRoute from "./components/User/UserRoute";

// import Login from "./pages/User/Login";
// import Register from "./pages/User/Register";
// import Menu from "./pages/User/Menu";
// import HomePage from "./pages/User/HomePage";

// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import AdminLayout from "./layouts/AdminLayout";
// import AddMenu from "./pages/Admin/AddMenu";
// import ManageMenu from "./pages/Admin/ManageMenu";
// import UpdateMenu from "./pages/Admin/UpdateMenu";
// import ManageCategory from "./pages/Admin/ManageCategory";
// import UpdateUser from "./pages/User/UpdateUser";
// import Checkout from "./pages/User/CheckoutPage";
// import Cart from "./pages/User/CartPage";
// import MyOrders from "./pages/User/MyOrders";
// import OrderDetails from "./pages/User/OrderDetails";
// import AboutCoffee from "./pages/User/AboutCoffee";
// import Contact from "./pages/User/Contact";
// import MenuDetails from "./pages/User/MenuDetails";
// import AddCategory from "./pages/Admin/AddCategory";
// import ManageOrder from "./pages/Admin/ManageOrder";
// import UpdateOrder from "./pages/Admin/UpdateOredr";

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));

const Login = lazy(() => import("./pages/User/Login"));
const Register = lazy(() => import("./pages/User/Register"));
const Menu = lazy(() => import("./pages/User/Menu"));
const HomePage = lazy(() => import("./pages/User/HomePage"));
const Cart = lazy(() => import("./pages/User/CartPage"));
const Checkout = lazy(() => import("./pages/User/CheckoutPage"));
const MyOrders = lazy(() => import("./pages/User/MyOrders"));
const OrderDetails = lazy(() => import("./pages/User/OrderDetails"));
const UpdateUser = lazy(() => import("./pages/User/UpdateUser"));
const AboutCoffee = lazy(() => import("./pages/User/AboutCoffee"));
const Contact = lazy(() => import("./pages/User/Contact"));
const MenuDetails = lazy(() => import("./pages/User/MenuDetails"));

const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AddMenu = lazy(() => import("./pages/Admin/AddMenu"));
const ManageMenu = lazy(() => import("./pages/Admin/ManageMenu"));
const UpdateMenu = lazy(() => import("./pages/Admin/UpdateMenu"));
const ManageCategory = lazy(() => import("./pages/Admin/ManageCategory"));
const AddCategory = lazy(() => import("./pages/Admin/AddCategory"));
const ManageOrder = lazy(() => import("./pages/Admin/ManageOrder"));
const UpdateOrder = lazy(() => import("./pages/Admin/UpdateOredr"));

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    console.log("need to login.....");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      toast.info("Quantity updated in cart");
    } else {
      cart.push({ ...product, quantity: 1 });
      toast.success("Added to cart");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("need not to login.....");
    setCart(cart);
    // };
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Suspense fallback={<div className="loader">Loading...</div>}>
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

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="add-menu" element={<AddMenu />} />
              <Route path="manage-menu" element={<ManageMenu />} />
              <Route path="menu/edit/:id" element={<UpdateMenu />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="manage-category" element={<ManageCategory />} />
              <Route path="manage-order" element={<ManageOrder />} />
              <Route path="order/view/:id" element={<UpdateOrder />} />
            </Route>
          </Route>

          {/* Pages WITHOUT Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
