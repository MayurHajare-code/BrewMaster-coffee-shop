import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMenuItems, deleteMenuItem } from "../../services/menuService";

const ManageMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  // Fetch all menu items (Firestore)
  const fetchMenus = async () => {
    try {
      const data = await getMenuItems();
      setMenuList(data);
    } catch (err) {
      console.error("Failed to fetch menus", err);
    }
  };

  // Delete menu item (Firestore)
  const deleteMenu = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await deleteMenuItem(id);
      setMenuList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete menu", err);
    }
  };

  // Edit menu
  const handleEdit = (id) => {
    navigate(`/admin/menu/edit/${id}`);
  };

  return (
    <>
      {/* Internal CSS */}
      <style>{`
        .menu-management-container {
          padding: 25px;
          font-family: Arial, sans-serif;
        }

        .menu-management-container h2 {
          font-size: 26px;
          margin-bottom: 20px;
          color: #333;
        }

        .menu-list {
          list-style: none;
          padding: 0;
        }

        .menu-item {
          background: #ffffff;
          border: 1px solid #ddd;
          padding: 14px;
          margin-bottom: 14px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .menu-info {
          max-width: 70%;
        }

        .menu-info strong {
          font-size: 16px;
          color: #222;
        }

        .menu-meta {
          font-size: 14px;
          color: #555;
        }

        .badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 6px;
          color: #fff;
        }

        .available {
          background-color: #4CAF50;
        }

        .not-available {
          background-color: #f44336;
        }

        .featured {
          background-color: #ff9800;
        }

        .menu-actions button {
          margin-left: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .menu-actions button:first-child {
          background-color: #2196F3;
          color: #fff;
        }

        .menu-actions button:first-child:hover {
          background-color: #1976D2;
        }

        .menu-actions button:last-child {
          background-color: #f44336;
          color: #fff;
        }

        .menu-actions button:last-child:hover {
          background-color: #d32f2f;
        }

        .back-link {
          display: inline-block;
          margin-top: 15px;
          color: #007bff;
          text-decoration: none;
          font-size: 14px;
        }

        .back-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="menu-management-container">
        <h2>Manage Menu Items</h2>

        <ul className="menu-list">
          {menuList.map((menu) => (
            <li key={menu.id} className="menu-item">
              <div className="menu-info">
                <strong>{menu.title}</strong>
                <div className="menu-meta">
                  ₹{menu.price} | Qty: {menu.quantity} | {menu.category}
                  {menu.available ? (
                    <span className="badge available">Available</span>
                  ) : (
                    <span className="badge not-available">Out</span>
                  )}
                  {menu.feature && (
                    <span className="badge featured">Featured</span>
                  )}
                </div>
              </div>

              <div className="menu-actions">
                <button onClick={() => handleEdit(menu.id)}>Edit</button>
                <button onClick={() => deleteMenu(menu.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/admin" className="back-link">
          Back to Dashboard
        </Link>
      </div>
    </>
  );
};

export default ManageMenu;
