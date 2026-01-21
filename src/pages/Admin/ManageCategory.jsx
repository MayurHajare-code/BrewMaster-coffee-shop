import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin/AddMenu.css";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);

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

  return (
    <div className="container">
      <h2>Manage Categories</h2>

      <form onSubmit={handleAdd}>
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="input"
        />
        <button className="add-pg-submit-btn">Add Category</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
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

      <Link to="/admin">Back</Link>
    </div>
  );
};

export default ManageCategory;



// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "../../styles/admin/AddMenu.css"; // reuse your CSS

// const ManageCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [editCategory, setEditCategory] = useState(null);

//   const API_URL = "http://localhost:5000/categories";

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(API_URL);
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error("Failed to fetch categories", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Add category
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     if (!newCategory.trim()) return;

//     try {
//       await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newCategory }),
//       });
//       setNewCategory("");
//       fetchCategories();
//     } catch (err) {
//       console.error("Failed to add category", err);
//     }
//   };

//   // Delete category
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     try {
//       await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//       fetchCategories();
//     } catch (err) {
//       console.error("Failed to delete category", err);
//     }
//   };

//   // Edit category (show input)
//   const startEdit = (category) => {
//     setEditCategory(category);
//   };

//   // Update category
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editCategory.name.trim()) return;

//     try {
//       await fetch(`${API_URL}/${editCategory.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editCategory),
//       });
//       setEditCategory(null);
//       fetchCategories();
//     } catch (err) {
//       console.error("Failed to update category", err);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Manage Categories</h2>

//       {/* Add Category */}
//       <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           placeholder="New category name"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//           className="input"
//           required
//         />
//         <button type="submit" className="add-pg-submit-btn">
//           Add Category
//         </button>
//       </form>

//       {/* Categories List */}
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {categories.map((cat) => (
//           <li
//             key={cat.id}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "10px",
//               padding: "10px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               background: "#fafafa",
//             }}
//           >
//             {editCategory && editCategory.id === cat.id ? (
//               <form
//                 style={{ display: "flex", gap: "8px", flex: 1 }}
//                 onSubmit={handleUpdate}
//               >
//                 <input
//                   type="text"
//                   value={editCategory.name}
//                   onChange={(e) =>
//                     setEditCategory({ ...editCategory, name: e.target.value })
//                   }
//                   className="input"
//                   required
//                 />
//                 <button type="submit" className="add-pg-submit-btn">
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   className="add-pg-submit-btn"
//                   style={{ background: "#ccc", color: "#000" }}
//                   onClick={() => setEditCategory(null)}
//                 >
//                   Cancel
//                 </button>
//               </form>
//             ) : (
//               <>
//                 <span>{cat.name}</span>
//                 <div>
//                   <button
//                     style={{
//                       marginRight: "8px",
//                       padding: "5px 10px",
//                       background: "#4CAF50",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => startEdit(cat)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     style={{
//                       padding: "5px 10px",
//                       background: "#f44336",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleDelete(cat.id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>

//       <Link to="/admin" className="add-pg-back-link">
//         Back to Dashboard
//       </Link>
//     </div>
//   );
// };

// export default ManageCategory;
