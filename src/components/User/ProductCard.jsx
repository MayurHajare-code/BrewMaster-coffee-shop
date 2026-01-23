import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const handleClick = () => {
    navigate(`/menu/${product.id}`);
  };

  return (
    <div
      className={`card ${!product.available ? "card-disabled" : ""}`}
      onClick={handleClick}
    >
      <div className="card-image-wrapper">
        <img src={product.image} alt={product.title} />

        <div className="card-hover-overlay">
          <i className="fa-solid fa-location-dot"></i>
          <span>{product.title}</span>
        </div>
      </div>

      <h3>{product.title}</h3>

      <div className="card-footer">
        <p className="price">
          <span className="currency">₹</span>
          {product.price}
        </p>

        <button
          disabled={!product.available}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          {product.available ? "Add to Cart" : "Notify Me"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
