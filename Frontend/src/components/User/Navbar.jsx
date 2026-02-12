import { useEffect, useState } from "react";
import "../../styles/user/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";
import { useCart } from "../../Context/CartContext";
import { useAuth } from "../../Context/AuthContext";
import api from "../../axios";

const Navbar = () => {
  const { user, isUser, loading, setUser, setRole } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { cart } = useCart();
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      setRole(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  /* ⛔ Prevent flicker while /me is loading */
  if (loading) return null;

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <nav>
        <h1>
          <Link to="/" className="header-logo">
            <i className="fa-solid fa-mug-saucer"></i> BrewMaster
          </Link>
        </h1>

        <ul>
          {["/", "/menu", "/about", "/contact"].map((path, i) => (
            <li key={i}>
              <Link to={path} className="header-link">
                {path === "/" ? "Home" : path.slice(1)}
              </Link>
            </li>
          ))}

          {/* USER MENU */}
          {user && isUser ? (
            <li className="account-menu">
              <button
                className="account-btn"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <i className="fas fa-user-alt"></i>
                <span>{user.firstName || "Account"}</span>
                <i className="fa-solid fa-caret-down"></i>
              </button>

              {openDropdown && (
                <div className="account-dropdown">
                  <Link to="/updateUser">Profile</Link>
                  <Link to="/my-orders">My Orders</Link>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="header-link">
                <i className="fa-solid fa-right-to-bracket"></i>
              </Link>
            </li>
          )}

          {/* CART */}
          <li>
            <Link to="/cart" className="header-link cart-link">
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
