import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../styles/user/MenuDetails.css";
import { useCart } from "../../Context/CartContext";
import MenuSlider from "../../components/User/MenuSlider";
import toast from "react-hot-toast";
import api from "../../axios";

const MenuDetails = () => {
  const { id } = useParams();

  const [menu, setMenu] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuDetails = async () => {
      
        try {
          setLoading(true);
          const res = await api.get(`/menus/${id}`);
          setMenu(res.data);
        } catch (err) {
          console.error("Failed to fetch menu", err);
        } finally {
          setLoading(false);
        
      };
    };

    fetchMenuDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!menu.available) {
      toast.error("This item is unavailable ☕");
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
  if (!menu) return <p>Menu not found </p>;

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
            <img src={`http://localhost:3000${menu.image}`} alt={menu.title} />
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

      <section className="features-section">
        <h1>Explore Our Signature Menu</h1>
        <p>
          Handcrafted drinks made from carefully selected beans, brewed to
          perfection for every coffee lover.
        </p>

        {loading ? <p>Please wait...</p> : <MenuSlider addToCart={addToCart} />}
      </section>
    </>
  );
};

export default MenuDetails;
