import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../../styles/admin/AddMenu.css";
import toast from "react-hot-toast";
import api from "../../axios";

const AddMenu = () => {
  const [menuData, setMenuData] = useState({
    name: "",
    price: "",
    image: null,
    quantity: 1,
    description: "",
    category: "",
    calories: "",
    available: true,
    feature: false,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuData({
      ...menuData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setMenuData({
      ...menuData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !menuData.name.trim() ||
      !menuData.price ||
      !menuData.image ||
      !menuData.description.trim() ||
      !menuData.category ||
      !menuData.calories
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", menuData.name);
      formData.append("price", menuData.price);
      formData.append("quantity", menuData.quantity);
      formData.append("description", menuData.description);
      formData.append("category", menuData.category);
      formData.append("calories", menuData.calories);
      formData.append("available", menuData.available);
      formData.append("feature", menuData.feature);

      formData.append("image", menuData.image);

      // debug ----------------------------------------
      for (let [key, value] of formData.entries()) {
        // console.log(key, value);
      }
      // -----------------------------------------------
      await api.post("/menus", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Menu item added successfully!");
      setMenuData({
        name: "",
        price: "",
        image: null,
        quantity: 1,
        description: "",
        category: "",
        calories: "",
        available: true,
        feature: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add menu item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction-container">
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="add-transaction-form">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={menuData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            name="price"
            value={menuData.price}
            onChange={handleChange}
          />
        </label>

        <label>
          Image
          <input type="file" onChange={handleImageChange} />
        </label>

        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            value={menuData.quantity}
            onChange={handleChange}
            min="1"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={menuData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={menuData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Total Calories
          <input
            type="number"
            name="calories"
            value={menuData.calories}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="available"
            checked={menuData.available}
            onChange={handleChange}
            className="checkbox"
          />
          Available
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="feature"
            checked={menuData.feature}
            onChange={handleChange}
            className="checkbox"
          />
          Featured Item
        </label>

        <button type="submit" disabled={loading}>
          Add Menu
        </button>

        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </form>
    </div>
  );
};

export default AddMenu;
