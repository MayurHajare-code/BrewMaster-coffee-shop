import "../../styles/user/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Get in Touch </h1>
          <p>
            Have a question about our beans or want to partner with us? Our team
            is here to help you find your perfect blend.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="data-section">
        <div className="contact-container">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p>
              BrewMaster Café
              <br />
              Crafted with passion, brewed to perfection.
            </p>

            <ul>
              <li>
                <i class="fa-solid fa-location-dot"></i> Mumbai, India
              </li>
              <li>
                <i class="fa-solid fa-at"></i> mayurhajare333@gmail.com
              </li>
              <li>
                <i class="fa-solid fa-phone"></i> +91 8879334267
              </li>
            </ul>
          </div>
          {/* <form onSubmit={handleSubmit}></form> */}

          {/* Right */}
          <div className="contact-map">
            <h2>Visit Us</h2>
            <iframe
              title="BrewMaster Location"
              src="https://www.google.com/maps?q=Mumbai&output=embed"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <a href="tel:+918879334267">📞 Call Now</a>
        <a href="https://wa.me/918879334267">💬 WhatsApp</a>
        <a href="mailto:mayurhajare333@gmail.com">✉ Email Us</a>
      </section>

      {/* Why BrewMaster */}
      <section className="why-us">
        <h2>Why BrewMaster?</h2>
        <p>
          At BrewMaster Café, we believe coffee is more than just a drink. Every
          cup is crafted using carefully sourced beans and brewed by passionate
          baristas to give you a memorable experience.
        </p>
      </section>
    </div>
  );
};

export default Contact;

