import { useState } from "react";
import "../../styles/Contact.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("Please login to send a message.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent successfully.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero-section-allPages">
        <div className="hero-section-allPages-content">
          <h1>Get in Touch </h1>
          <p>
            Have a question about our beans or want to partner with us? Our team
            is here to help you find your perfect blend.
          </p>
        </div>
      </section>

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
              <li><i class="fa-solid fa-location-dot"></i> Mumbai, India</li>
              <li><i class="fa-solid fa-at"></i> mayurhajare333@gmail.com</li>
              <li><i class="fa-solid fa-phone"></i> +91 8879334267</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <h3>Send Us a Message</h3>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Massage</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
