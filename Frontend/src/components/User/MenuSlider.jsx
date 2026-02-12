import { getMenuItems } from "../../services/menuService";
import { useEffect, useState } from "react";
import "../../styles/user/Card.css";
import Slider from "react-slick";
import ProductCard from "./MenuCard";
import toast from "react-hot-toast";
import api from "../../axios";
import MenuCard from "./MenuCard";

const MenuSlider = ({ addToCart }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all menu
  const fetchMenus = async () => {
    try {
      const res = await api.get("/menus");
      setMenus(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch menus", err);
      toast.error(err.response?.data?.message || "Failed to fetch menus");
    }
  };

  useEffect(() => {
    fetchMenus();
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
          {menus.map((menu) => (
            <div key={menu._id}>
              <MenuCard menu={menu} addToCart={addToCart} />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default MenuSlider;
