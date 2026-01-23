import { useEffect, useState } from "react";
import "../../styles/user/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";
import { useCart } from "../../Context/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const signOutHandle = async () => {
    try {
      await signOut(auth);
      toast.success("Logout Successfully.");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const { cart } = useCart();
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <nav>
        {/* LOGO */}
        <h1>
          <Link
            to="/"
            className={`header-logo ${scrolled ? "header-logo-scrolled" : ""}`}
          >
            <i className="fa-solid fa-mug-saucer"></i> BrewMaster
          </Link>
        </h1>

        {/* NAV LINKS */}
        <ul>
          {["/", "/menu", "/about", "/contact"].map((path, i) => (
            <li key={i}>
              <Link
                to={path}
                className={`header-link ${
                  scrolled ? "header-link-scrolled" : ""
                }`}
              >
                {path === "/"
                  ? "Home"
                  : path === "/menu"
                    ? "Menu"
                    : path === "/about"
                      ? "About"
                      : "Contact"}
              </Link>
            </li>
          ))}

          {/* USER SECTION */}
          {user ? (
            <li className="account-menu">
              <button
                className={`account-btn ${
                  scrolled ? "header-link-scrolled" : ""
                }`}
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <i className="fas fa-user-alt"></i>
                <span>{user.displayName || "Account"}</span>
                <i className="fa-solid fa-caret-down"></i>
              </button>

              {openDropdown && (
                <div className="account-dropdown">
                  <Link to="/updateUser">Profile</Link>
                  <Link to="/my-orders">My Orders</Link>
                  <button onClick={signOutHandle}>Sign Out</button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className={`header-link ${
                  scrolled ? "header-link-scrolled" : ""
                }`}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
              </Link>
            </li>
          )}

          {/* CART */}
          <li>
            <Link
              to="/cart"
              className={`header-link cart-link ${
                scrolled ? "header-link-scrolled" : ""
              }`}
            >
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
