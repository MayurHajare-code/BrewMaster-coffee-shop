import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/MenuDetails.css";
import { useCart } from "../../Context/CartContext";

const MenuDetails = () => {
  const { id } = useParams();

  const [menu, setMenu] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const docRef = doc(db, "menu", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenu(docSnap.data());
        } else {
          console.log("Menu item not found");
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!menu.available) {
      alert("This item is unavailable ☕");
      return;
    }
    addToCart({
      id,
      title: menu.title,
      price: menu.price,
      image: menu.image,
      quantity: qty,
    });
  };

  if (loading) return <p>Loading menu...</p>;
  if (!menu) return <p>Menu not found ☕</p>;

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>The Perfect Pour: {menu.title}</h1>
          <p>
            Dive into the origin, tasting notes, and brewing methods that make
            this selection a BrewMaster favorite.
          </p>
        </div>
      </section>

      {/* Details Container */}
      <section className="menu-detail-container">
        <div className="menu-detail-card">
          {/* Image */}
          <div className="menu-detail-image">
            <img src={menu.image} alt={menu.title} />
          </div>

          {/* Info */}
          <div className="menu-detail-info">
            <h2>{menu.title}</h2>

            <p className="menu-description">{menu.description}</p>

            <div className="menu-price">₹{menu.price * qty}</div>

            {/* Quantity */}
            <div className="menu-quantity">
              <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}>
                -
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((prev) => prev + 1)}>+</button>
            </div>

            {/* Button */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MenuDetails;
