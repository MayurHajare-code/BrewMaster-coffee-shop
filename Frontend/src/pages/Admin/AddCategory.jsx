import { useState } from "react";
import "../../styles/admin/AddMenu.css";
import "../../styles/admin/ManageMenu.css";
import toast from "react-hot-toast";
import api from "../../axios";

const AddCategory = () => {
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    const name = newCategory;
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error("Category name is required.");
      return;
    }
    try {
      await api.post("/categories", { name });
      toast.success("Category Added Successfully.");
      setNewCategory("");
    } catch (err) {
      console.error("Failed to add category", err);
      toast.error(err.response?.data?.message || "Category not added");
    } finally {
      setLoading(false);
    }
  };

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
        <button type="submit" disabled={loading}>
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
