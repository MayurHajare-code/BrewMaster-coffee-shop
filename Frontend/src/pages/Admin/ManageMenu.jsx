import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenuItems, deleteMenuItem } from "../../services/menuService";
import "../../styles/admin/ManageMenu.css";
import toast from "react-hot-toast";
import api from "../../axios";

const ManageMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const transactionsPerPage = 5;

  useEffect(() => {
    fetchMenus();
  }, []);

  // Fetch all menu
  const fetchMenus = async () => {
    try {
      const res = await api.get("/menus");
      setMenuList(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
      toast.error(err.response?.data?.message || "fetch menu failed");
    }
  };

  // Delete menu
  const deleteMenu = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this menu item?",
    );
    if (!isConfirmed) {
      toast.info("Menu deletion canceled");
      return;
    }

    try {
      await api.delete(`/menus/${id}`);
      setMenuList((prev) => prev.filter((item) => item._id !== id));
      toast.success("Menu item deleted successfully");
    } catch (err) {
      console.error("Failed to delete menu", err);
      toast.error("Failed to delete menu item");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/menu/edit/${id}`);
  };

  // search menu
  const filteredMenuList = menuList.filter(
    (menu) =>
      menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * transactionsPerPage;
  const indexOfFirstItem = indexOfLastItem - transactionsPerPage;
  const currentMenuList = filteredMenuList.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredMenuList.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Manage Menu Items</h2>
          <div className="search-container" style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
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
              <tr key={menu._id} className="menu-item">
                <td>{menu.name}</td>
                <td>₹{menu.price}</td>
                <td>{menu.category}</td>

                <td>
                  {menu.available ? (
                    <span className="badge available">Available</span>
                  ) : (
                    <span className="badge not-available">Out</span>
                  )}
                </td>
                <td>
                  {menu.feature ? (
                    <span className="badge featured">Featured</span>
                  ) : (
                    <span className="badge featured">---</span>
                  )}
                </td>
                <td>
                  <button className="edit" onClick={() => handleEdit(menu._id)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteMenu(menu._id)}
                  >
                    Delete
                  </button>
                </td>
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
