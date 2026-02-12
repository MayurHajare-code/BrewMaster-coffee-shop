import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import toast from "react-hot-toast";
import api from "../../axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!firstName.trim()) {
      toast.error("First Name is required.");
      setLoading(false);
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last Name is required.");
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required.");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/register", {
        firstName,
        lastName,
        email,
        password,
      });
      toast.success("Register Successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Failed to Register", err);
      toast.error(err.response?.data?.message || "Failed to Register");
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <section className="register-page">
        <form className="form" onSubmit={handleSubmit}>
          <h3>Create Account</h3>
          <p className="subtitle">Join us & start your coffee journey</p>
          <label>First Name</label>
          <input
            type="text"
            placeholder="Your First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label>Last Name</label>
          <input
            type="text"
            placeholder="Your Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="coffee@lover.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="actions">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Register;
