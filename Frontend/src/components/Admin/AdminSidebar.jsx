import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <>
      <nav className="sidebar">
        <ul>
          <li>
            <NavLink to="dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="add-menu">Add Menu</NavLink>
          </li>
          <li>
            <NavLink to="manage-menu">Manage Menus</NavLink>
          </li>
          <li>
            <NavLink to="add-category">Add Category</NavLink>
          </li>
          <li>
            <NavLink to="manage-category">Manage Category</NavLink>
          </li>

          <li>
            <NavLink to="manage-order">Manage Order</NavLink>
          </li>
        </ul>
      </nav>

      <style>
        {`
          .sidebar {
            width: 200px;
            background-color: #f3f3f3;
            max-height: calc(100vh - 135px);
            padding-top: 1rem;
          }

          .sidebar ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .sidebar li {
            margin: 1rem 0;
          }

          .sidebar a {
            text-decoration: none;
            color: #333;
            padding: 0.5rem 1.5rem;
            display: block;
          }

          .sidebar a.active {
            background-color: #0078d7;
            color: white;
            border-radius: 4px;
          }

          .sidebar a:hover {
            background-color: #ddd;
          }
        `}
      </style>
    </>
  );
}

export default AdminSidebar;
