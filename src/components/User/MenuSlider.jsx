import { getMenuItems } from "../../services/menuService";
import { useEffect, useState } from "react";
import "../../styles/Card.css";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

const MenuSlider = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const data = await getMenuItems();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <>
      <div className="menu-slider">
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default MenuSlider;
