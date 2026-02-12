import "../../styles/user/HomePage.css";
import MenuSlider from "../../components/User/MenuSlider";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HomePage = ({ addToCart }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h3>Handcrafted Coffee Since 2015</h3>
          <h1>
            <span className="brand-name">BrewMaster</span> Coffee Shop
          </h1>

          <p>
            Experience the perfect blend of rich flavors, expertly brewed by
            passionate baristas in a cozy atmosphere. Your everyday coffee,
            elevated.
          </p>

          <div className="btn-group">
            <Link to="/menu">
              <button className="primary-btn">View Menu</button>
            </Link>
            <Link to="/my-orders">
              <button className="secondary-btn">Order Now</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h1 className="section-title">About BrewMaster</h1>
        <p className="about-subtitle">
          Where passion meets perfection in every cup
        </p>
        <div className="title-line"></div>
        <div className="about-container">
          <div className="about-image">
            <div className="image-glow"></div>
            <img src="./assets/aboutImg.webp" alt="About illustration" />
          </div>

          <div className="about-content">
            <p className="about-text first-para">
              BrewMaster is where passion meets perfection in every cup.
            </p>

            <p className="about-text">
              We source premium coffee beans and craft each brew with care,
              bringing out rich flavors and unforgettable aromas.
            </p>

            <p className="about-text">
              Whether you’re starting your morning or slowing down your day, our
              café is designed to be your cozy escape — one sip at a time.
            </p>

            <div className="about-stats">
              <span>
                <i className="fas fa-mug-hot"></i> Premium Beans
              </span>
              <span>
                <i className="fas fa-fire"></i> Freshly Brewed
              </span>
              <span>
                <i className="fas fa-leaf"></i> Cozy Ambience
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h1>Our Popular Products</h1>
        <p>
          Our most loved brews, crafted with premium beans and served fresh
          every day.
        </p>

        {loading ? <p>Please wait...</p> : <MenuSlider addToCart={addToCart} />}
      </section>
    </>
  );
};

export default HomePage;
