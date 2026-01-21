import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService"; // your existing service
import { addMenuItem } from "../../services/menuService"; // new service
import "../../styles/admin/AddMenu.css";

const AddMenu = () => {
  const [menuData, setMenuData] = useState({
    title: "",
    price: "",
    image: null,
    quantity: 1,
    description: "",
    category: "",
    available: true,
    feature: false,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

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
    try {
      await addMenuItem(menuData);
      alert("Menu item added successfully!");
      setMenuData({
        title: "",
        price: "",
        image: null,
        quantity: 1,
        description: "",
        category: "",
        available: true,
        feature: false,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to add menu item.");
    }
  };

  return (
    <div className="container">
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" value={menuData.title} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={menuData.price} onChange={handleChange} required />

        <label>Image</label>
        <input type="file" onChange={handleImageChange} required />

        <label>Quantity</label>
        <input type="number" name="quantity" value={menuData.quantity} onChange={handleChange} min="1" />

        <label>Description</label>
        <textarea name="description" value={menuData.description} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={menuData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>
          <input type="checkbox" name="available" checked={menuData.available} onChange={handleChange} />
          Available
        </label>

        <label>
          <input type="checkbox" name="feature" checked={menuData.feature} onChange={handleChange} />
          Featured Item
        </label>

        <button type="submit">Add Menu</button>
        <Link to="/admin">Back to Dashboard</Link>
      </form>
    </div>
  );
};

export default AddMenu;








// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "../../styles/admin/AddMenu.css";

// const AddMenu = () => {
//   const [menuData, setMenuData] = useState({
//     title: "",
//     price: "",
//     image: null,
//     quantity: 1,
//     description: "",
//     category: "",
//     available: true,
//     feature: false,
//   });

//   const [categories, setCategories] = useState([]);

//   // Fetch categories from JSON Server
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/categories");
//         const data = await res.json();
//         setCategories(data);
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setMenuData({
//       ...menuData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleImageChange = (e) => {
//     setMenuData({
//       ...menuData,
//       image: e.target.files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newMenu = {
//       title: menuData.title,
//       price: Number(menuData.price),
//       image: menuData.image ? menuData.image.name : "",
//       quantity: menuData.quantity,
//       description: menuData.description,
//       category: menuData.category,
//       available: menuData.available,
//       feature: menuData.feature,
//     };

//     try {
//       const res = await fetch("http://localhost:5000/menu", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newMenu),
//       });

//       if (res.ok) {
//         alert("Menu item added successfully!");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Add Menu Item</h2>

//       <form onSubmit={handleSubmit}>
//         <label>Title</label>
//         <input
//           type="text"
//           name="title"
//           className="input"
//           value={menuData.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Price</label>
//         <input
//           type="number"
//           name="price"
//           className="input"
//           value={menuData.price}
//           onChange={handleChange}
//           required
//         />

//         <label>Image</label>
//         <input type="file" name="image" onChange={handleImageChange} required />

//         <label>Quantity</label>
//         <input
//           type="number"
//           name="quantity"
//           className="input"
//           value={menuData.quantity}
//           onChange={handleChange}
//           min="1"
//         />

//         <label>Description</label>
//         <textarea
//           name="description"
//           className="input"
//           value={menuData.description}
//           onChange={handleChange}
//           required
//         />

//         <label>Category</label>
//         <select
//           name="category"
//           value={menuData.category}
//           onChange={handleChange}
//           className="input"
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         <label>
//           <input
//             type="checkbox"
//             name="available"
//             checked={menuData.available}
//             onChange={handleChange}
//           />
//           Available
//         </label>

//         <label>
//           <input
//             type="checkbox"
//             name="feature"
//             checked={menuData.feature}
//             onChange={handleChange}
//           />
//           Featured Item
//         </label>

//         <button type="submit" className="add-pg-submit-btn">
//           Add Menu
//         </button>

//         <Link to="/admin" className="add-pg-back-link">
//           Back to Dashboard
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default AddMenu;
