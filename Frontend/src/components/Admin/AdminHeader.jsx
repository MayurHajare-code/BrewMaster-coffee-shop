import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../axios";
import { useAuth } from "../../Context/AuthContext";

function AdminHeader() {
  const { user, isAdmin, setUser } = useAuth(); // update context on logout
  const navigate = useNavigate();

  if (!user || !isAdmin) return null;

  const handleLogout = async () => {
    try {
      await api.post("/logout");

      setUser(null);

      localStorage.removeItem("userData");

      toast.success("Logged out successfully!");

      // Redirect to admin login
      navigate("/admin-login");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>
          Welcome, <span className="admin-name">{user.firstName.toUpperCase()}</span> in
          BrewMaster
          {/* Welcome, <span className="admin-name">adminName</span> in BrewMaster */}
        </h1>

        <button onClick={handleLogout}>Logout</button>
        {/* <button>Logout</button> */}
      </header>

      <style>
        {`
          .admin-header {
            background-color: #0078d7;
            color: white;
            padding: 1rem 1.5rem 0rem;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }

          .admin-header .admin-name{
            color: red;
            text-decoration: underline;
          }

          .admin-header h1{
            font-size: 20px;
          }

          .admin-header button {
            padding: 6px 12px;
            border: none;
            background-color: #e74c3c;
            color: white;
            cursor: pointer;
          }
            
        `}
      </style>
    </>
  );
}

export default AdminHeader;
