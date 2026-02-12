import { useEffect, useState } from "react";
import "../../styles/admin/AddMenu.css";
import "../../styles/admin/ManageMenu.css";
import toast from "react-hot-toast";
import api from "../../axios";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 5;

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error(err.response?.data?.message || "fetch categories failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* update categary */
  const handleUpdate = async (e) => {
    e.preventDefault();
    const name = editCategory.name;
    const id = editCategory._id;
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      await api.put(`/categories/${id}`, { name });
      toast.success("Category updated successfully!");
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      toast.error("Failed to delete category. Please try again.");
    }
  };

  // search category
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // pagination calculation
  const indexOfLastItem = currentPage * transactionsPerPage;
  const indexOfFirstItem = indexOfLastItem - transactionsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredCategories.length / transactionsPerPage);

  // change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="add-transaction-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Manage Categories</h2>
        <div className="search-container" style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Search by name ..."
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
            <th>Category Name</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentCategories.map((cat) => (
            <tr key={cat._id}>
              {editCategory?._id === cat._id ? (
                <>
                  <td>
                    <form
                      onSubmit={handleUpdate}
                      className="add-transaction-form"
                    >
                      <input
                        value={editCategory.name}
                        onChange={(e) =>
                          setEditCategory({
                            ...editCategory,
                            name: e.target.value,
                          })
                        }
                        className="input"
                      />
                      <button className="add-pg-submit-btn" type="submit">
                        Save
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={() => setEditCategory(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  </td>
                  <td />
                </>
              ) : (
                <>
                  <td>{cat.name}</td>
                  <td>
                    <button
                      className="edit"
                      onClick={() => setEditCategory(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(cat._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
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
    </div>
  );
};

export default ManageCategory;
