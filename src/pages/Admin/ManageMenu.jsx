import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMenuItems, deleteMenuItem } from "../../services/menuService";
import "../../styles/admin/ManageMenu.css";

const ManageMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

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
    if (!window.confirm("Are you sure you want to delete this menu item?"))
      return;

    try {
      await deleteMenuItem(id);
      setMenuList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete menu", err);
    }
  };

  // Edit menu
  const handleEdit = (id) => {
    navigate(`/admin-menu/edit/${id}`);
  };

  // Filter menu items based on search term
  const filteredMenuList = menuList.filter(
    (menu) =>
      menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentMenuList = filteredMenuList.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );
  const totalPages = Math.ceil(filteredMenuList.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container">
        
        <div style={{display:"flex", justifyContent: "space-between"}}>
          <h2>Manage Menu Items</h2>
          <div className="search-container" style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              style={{
                padding: "8px 12px",
                width: "300px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* <ul className="menu-list"> */}

        <table className="transaction-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Available</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMenuList.map((menu) => (
              <tr key={menu.id} className="menu-item">
                <td>{menu.title}</td>
                <td>₹{menu.price}</td>
                <td>{menu.category}</td>
                <td>
                  {/* {menu.feature && (
                    <span className="badge featured">Featured</span>
                  )} */}

                  {menu.available ? (
                    <span className="badge featured">Featured</span>
                  ) : (
                    <span className="badge featured">-</span>
                  )}
                </td>
                <td>
                  {menu.available ? (
                    <span className="badge available">Available</span>
                  ) : (
                    <span className="badge not-available">Out</span>
                  )}
                </td>
                <td>
                  <button className="edit" onClick={() => handleEdit(menu.id)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteMenu(menu.id)}
                  >
                    Delete
                  </button>
                </td>

                {/* <div className="menu-info">
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
                </div> */}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* <Link to="/admin" className="back-link">
          Back to Dashboard
        </Link> */}
      </div>
    </>
  );
};

export default ManageMenu;
