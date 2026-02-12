import Footer from "../components/User/Footer";
import Navbar from "../components/User/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = ({ cart, openCart }) => {
  return (
    <>
      <Navbar cartCount={cart.length} openCart={openCart} />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
