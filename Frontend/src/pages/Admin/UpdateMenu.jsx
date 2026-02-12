import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMenuById, updateMenuItem } from "../../services/menuService";
import { getCategories } from "../../services/categoryService";
import toast from "react-hot-toast";
import "../../styles/admin/AddMenu.css";
import api from "../../axios";

const UpdateMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    name: "",
    price: "",
    image: "",
    quantity: 1,
    description: "",
    category: "",
    calories: "",
    available: true,
    feature: false,
  });

  const [categories, setCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMenuById();
      fetchCategories();
    }
  }, [id]);

  const fetchMenuById = async () => {
    try {
      const res = await api.get(`/menus/${id}`);
      // console.log(res.data);

      setMenu(res.data);
    } catch (err) {
      console.error("Failed to load menu", err);
      toast.error("Failed to load menu details");
    } finally {
      setLoading(false);
    }
  };

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
    setMenu({
      ...menu,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validation: all fields mandatory
  //   const { name, price, description, category, calories, quantity, image } =
  //     menu;
  //   if (
  //     !name.trim() ||
  //     !price ||
  //     !description.trim() ||
  //     !category.trim() ||
  //     !calories ||
  //     !quantity ||
  //     (!image && !newImage)
  //   ) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   const updatedMenu = {
  //     name: name.trim(),
  //     price: Number(price),
  //     quantity: Number(quantity),
  //     description: description.trim(),
  //     category: category.trim(),
  //     calories: Number(calories),
  //     available: menu.available,
  //     feature: menu.feature,
  //     image: newImage
  //       ? `http://localhost:3000/public/${newImage.name}`
  //       : menu.image,
  //   };

  //   try {
  //     await api.put(`/menus/${id}`, updatedMenu);
  //     // await api.put(`/categories/${id}`, { name });
  //     toast.success("Menu updated successfully!");
  //     navigate("/admin/manage-menu");
  //   } catch (err) {
  //     console.error("Update failed", err);
  //     toast.error("Failed to update menu");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation: all fields mandatory
  const { name, price, description, category, calories, quantity } = menu;
  if (
    !name.trim() ||
    !price ||
    !description.trim() ||
    !category.trim() ||
    !calories ||
    !quantity ||
    (!menu.image && !newImage) // ensure either old or new image exists
  ) {
    toast.error("All fields are required");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("price", Number(price));
    formData.append("quantity", Number(quantity));
    formData.append("description", description.trim());
    formData.append("category", category.trim());
    formData.append("calories", Number(calories));
    formData.append("available", menu.available);
    formData.append("feature", menu.feature);

    // Append new image if selected
    if (newImage) {
      formData.append("image", newImage);
    }

    // Send FormData (not JSON) to backend
    await api.put(`/menus/${id}`, formData);

    toast.success("Menu updated successfully!");
    navigate("/admin/manage-menu");
  } catch (err) {
    console.error("Update failed", err);
    toast.error("Failed to update menu");
  }
};


  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading menu...</p>;
  }

  return (
    <div className="add-transaction-container">
      <h2>Update Menu Item</h2>

      <form onSubmit={handleSubmit} className="add-transaction-form">
        <label>
          Name
          <input
            name="name"
            className="input"
            value={menu.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Price
          <input
            type="number"
            name="price"
            className="input"
            value={menu.price}
            onChange={handleChange}
            min="0"
          />
        </label>

        <img
          // src={`http://localhost:3000${menu.image}`}
           src={menu.image?.url} 
          alt={menu.name || "Menu"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/no1.webp";
          }}
          style={{ width: "120px", marginBottom: "10px", borderRadius: "6px" }}
        />

        <label>
          Upload New Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            className="input"
            value={menu.quantity}
            onChange={handleChange}
            min="1"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            className="input"
            value={menu.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={menu.category}
            onChange={handleChange}
            className="input"
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
            type="text"
            className="input"
            name="calories"
            value={menu.calories}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="available"
            checked={menu.available}
            onChange={handleChange}
            className="checkbox"
          />
          Available
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="feature"
            checked={menu.feature}
            onChange={handleChange}
            className="checkbox"
          />
          Featured
        </label>

        <button type="submit" className="add-pg-submit-btn">
          Update Menu
        </button>

        <Link to="/admin-manage-menu" className="add-pg-back-link">
          Back To Manage Menu
        </Link>
      </form>
    </div>
  );
};

export default UpdateMenu;
