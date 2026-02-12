import "../../styles/user/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <h2 className="footer-title">
            BrewMaster<span>.</span>
          </h2>
          <p className="footer-description">
            Crafted with passion, brewed to perfection.
          </p>
        </div>

        <div className="footer-icons">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a
            href="https://wa.me/918879334267"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>

          <a href="mailto:mayurhajare333@gmail.com" aria-label="Email">
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© 2026 Mayur. All rights reserved.</p>

        <p>
          Built with <span>❤</span> using HTML, CSS , JavaScript & React
        </p>
      </div>
    </footer>
  );
};

export default Footer;
