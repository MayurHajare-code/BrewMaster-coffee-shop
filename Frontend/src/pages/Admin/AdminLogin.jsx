import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import api from "../../axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      await api.post("/login", { email, password });
      toast.success("Admin login successful!");
      // navigate("/admin/dashboard");
      window.location.href = "/admin/dashboard";  // reload + go home
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
};

export default AdminLogin;
