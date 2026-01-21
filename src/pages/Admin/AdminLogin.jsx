import { Link } from "react-router-dom";
// import "../../styles/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import toast from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Step 2: Get user data from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Step 3: Check if user role is "admin"
        if (userData.role === "admin") {
          toast.success("Admin login successful!");
          setTimeout(() => {
            navigate("/admin"); // redirect admin to admin dashboard
          }, 1500);
        } else {
          // Logout the user if not admin
          toast.error("Access denied. You are not an admin.");
          auth.signOut();
        }
      } else {
        toast.error("No user data found.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="admin-login">
      <form className="form" onSubmit={handleSubmit}>
        <h3>Brewmaster Admin Login</h3>
        <p className="subtitle">Welcome back, Admin! Let’s brew happiness.</p>
        <label>Email</label>
        <input
          type="email"
          placeholder="admin@coffee.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* <div className="actions">
          <Link to="/forget-password">Forgot password?</Link>
        </div> */}

        <button type="submit" style={{margin:"15px 0px 30px"}}>Login</button>

        {/* <p className="actions">
          New here? <Link to="/register">Create an account</Link>
        </p> */}
      </form>
    </section>
  );
};

export default AdminLogin;
