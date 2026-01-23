import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin/AddMenu.css";
import "../../styles/admin/ManageMenu.css";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ADD */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    await addCategory(newCategory);
    setNewCategory("");
    fetchCategories();
  };

  /* UPDATE */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editCategory.name.trim()) return;

    await updateCategory(editCategory.id, editCategory.name);
    setEditCategory(null);
    fetchCategories();
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await deleteCategory(id);
    fetchCategories();
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentMenuList = categories.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );
  const totalPages = Math.ceil(categories.length / transactionsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="add-transaction-container">
      <h2>Add Categories</h2>

      <form onSubmit={handleAdd} className="add-transaction-form">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="input"
        />
        <button>Add Category</button>
      </form>

      {/* <table className="transaction-table">
        <thead>
          <tr>
            <th>Category Name</th>

            <th>Actions</th>
          </tr>
        </thead>
        {/* <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              {editCategory?.id === cat.id ? (
                <form onSubmit={handleUpdate}>
                  <input
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                    className="input"
                  />
                  <button className="add-pg-submit-btn">Save</button>
                </form>
              ) : (
                <>
                  <td>
                    <span>{cat.name}</span>
                  </td>
                  <td>
                    <button className="edit" onClick={() => setEditCategory(cat)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(cat.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody> 

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              {editCategory?.id === cat.id ? (
                <>
                  <td>
                    <form onSubmit={handleUpdate} className="add-transaction-form">
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
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table> */}

      {/* <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li key={cat.id}>
            {editCategory?.id === cat.id ? (
              <form onSubmit={handleUpdate}>
                <input
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, name: e.target.value })
                  }
                  className="input"
                />
                <button className="add-pg-submit-btn">Save</button>
              </form>
            ) : (
              <>
                <span>{cat.name}</span>
                <button onClick={() => setEditCategory(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <Link to="/admin">Back</Link> */}
    </div>
  );
};

export default AddCategory;
