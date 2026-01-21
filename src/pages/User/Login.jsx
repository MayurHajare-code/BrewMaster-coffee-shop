import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successfully.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <section className="login-page">
        <form className="form" onSubmit={handleSubmit}>
          <h3>Brewmaster Login</h3>

          <p className="subtitle">Welcome back! Let’s brew happiness.</p>
          <label>Email</label>
          <input
            type="email"
            placeholder="barista@coffee.com"
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

          <div className="actions">
            <Link to="/forget-password">Forgot password?</Link>
          </div>

          <button type="submit">Login</button>

          <p className="actions">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Login;
