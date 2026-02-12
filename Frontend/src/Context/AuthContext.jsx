import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuth();
  }, []);

  const fetchAuth = async () => {
    try {
      const res = await api.get("/me");

      setUser(res.data);
      setRole(res.data.role);
      console.log(res.data);
    } catch (err) {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAdmin: role === "admin",
        isUser: role === "user",
        setUser,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
