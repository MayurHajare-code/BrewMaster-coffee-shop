import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMenuById, updateMenuItem } from "../../services/menuService";
import { getCategories } from "../../services/categoryService";
import "../../styles/admin/AddMenu.css";

const UpdateMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    title: "",
    price: "",
    image: "",
    quantity: 1,
    description: "",
    category: "",
    available: true,
    feature: false,
  });

  const [categories, setCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMenu();
      fetchCategories();
    }
  }, [id]);

  // Fetch menu details
  const fetchMenu = async () => {
    try {
      const data = await getMenuById(id);
      setMenu(data);
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenu({
      ...menu,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedMenu = {
      title: menu.title,
      price: Number(menu.price),
      quantity: Number(menu.quantity),
      description: menu.description,
      category: menu.category,
      available: menu.available,
      feature: menu.feature,
      image: newImage ? `/assets/${newImage.name}` : menu.image,
    };

    try {
      await updateMenuItem(id, updatedMenu);
      navigate("/admin/manage-menu");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update menu");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading menu...</p>;
  }

  return (
    <div className="container">
      <h2>Update Menu Item</h2>

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          name="title"
          className="input"
          value={menu.title}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          className="input"
          value={menu.price}
          onChange={handleChange}
          required
        />

        <img
          src={menu.image}
          alt="Menu"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/no-image.png";
          }}
          style={{
            width: "120px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        />

        <label>Upload New Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          className="input"
          value={menu.quantity}
          onChange={handleChange}
          min="1"
        />

        <label>Description</label>
        <textarea
          name="description"
          className="input"
          value={menu.description}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={menu.category}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            name="available"
            checked={menu.available}
            onChange={handleChange}
          />
          Available
        </label>

        <label>
          <input
            type="checkbox"
            name="feature"
            checked={menu.feature}
            onChange={handleChange}
          />
          Featured
        </label>

        <button type="submit" className="add-pg-submit-btn">
          Update Menu
        </button>

        <Link to="/admin/manage-menu" className="add-pg-back-link">
          Back
        </Link>
      </form>
    </div>
  );
};

export default UpdateMenu;
