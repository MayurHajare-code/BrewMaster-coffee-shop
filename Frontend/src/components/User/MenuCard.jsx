import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

const MenuCard = ({ menu }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const handleClick = () => {
    navigate(`/menu/${menu._id}`);
  };

  return (
    <div
      className={`card ${!menu.available ? "card-disabled" : ""}`}
      onClick={handleClick}
    >
      <div className="card-image-wrapper">
        <img
          // src={`http://localhost:3000${menu.image}`}
          // alt={menu.name}
          src={menu.image?.url}
          alt={menu.name || "Menu"}
          loading="lazy"
        />

        <div className="card-hover-overlay">
          <i className="fa-solid fa-location-dot"></i>
          <span>Calories: {menu.calories} kcal</span>
        </div>
      </div>

      <h3>{menu.name}</h3>

      <div className="card-footer">
        <p className="price">
          <span className="currency">₹</span>
          {menu.price}
        </p>

        <button
          disabled={!menu.available}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(menu);
          }}
        >
          {menu.available ? "Add to Cart" : "Notify Me"}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
