import { Link, useNavigate } from "react-router-dom";
import "../../styles/AboutCoffee.css";

const AboutCoffee = () => {
  const navigate = useNavigate();

  const handlePersonalityClick = (category) => {
    navigate(`/menu?search=${category}`);
  };
  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Our Story & Craft</h1>
          <p>
            At BrewMaster, we blend traditional roasting techniques with modern
            technology to deliver a smarter, smoother coffee experience.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="coffee-story">
        <h2>Our Coffee Story</h2>
        <p>
          BrewMaster was born on a sleepy morning when someone said,
          <strong> “Life feels illegal without coffee.”</strong>
          We don’t claim our coffee can solve all problems, but it definitely
          makes you care less about them ☕😌
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="coffee-philosophy">
        <h2>Our Coffee Philosophy</h2>
        <ul>
          <li>☕ Strong coffee, weak excuses</li>
          <li>☕ First sip before first conversation</li>
          <li>☕ Decaf is just coffee playing a prank</li>
          <li>☕ Bad coffee should be illegal</li>
        </ul>
      </section>

      {/* Coffee Types */}
      <section className="coffee-types">
        <h2>Choose Your Personality</h2>
        <div className="coffee-cards">
          <div
            className="coffee-card"
            onClick={() => handlePersonalityClick("Espresso")}
          >
            <h3>Espresso</h3>
            <p>
              For people who say <br />
              <strong>“I’ll sleep later.”</strong>
            </p>
          </div>

          <div
            className="coffee-card"
            onClick={() => handlePersonalityClick("Cappuccino")}
          >
            <h3>Cappuccino</h3>
            <p>Balanced, classy and pretending your life is under control.</p>
          </div>

          <div
            className="coffee-card"
            onClick={() => handlePersonalityClick("Latte")}
          >
            <h3>Latte</h3>
            <p>Mostly milk, zero judgement. We still love you.</p>
          </div>

          <div
            className="coffee-card"
            onClick={() => handlePersonalityClick("Flat White")}
          >
            <h3>Flat White</h3>
            <p>You’re scary. But we respect you. 🫡</p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="coffee-quote">
        <blockquote>
          “Behind every successful person <br />
          is a substantial amount of coffee.”
        </blockquote>
        <cite>— Anonymous Coffee Lover</cite>
      </section>

      {/* CTA */}
      <section className="coffee-cta">
        <h2>Life’s Too Short for Bad Coffee</h2>
        <p>Come for the coffee. Stay because you’re awake now.</p>
        <p>☕ Fresh Beans • 🚚 Fast Delivery • ❤️ Brewed with Passion</p>
        <Link to="/menu">
          <button className="cta-btn">Order Coffee ☕</button>
        </Link>
      </section>
    </>
  );
};

export default AboutCoffee;
