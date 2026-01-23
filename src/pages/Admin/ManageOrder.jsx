import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrderItems } from "../../services/orderService";
import "../../styles/admin/ManageMenu.css";

const ManageOrder = () => {
  const [OrderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const fetchOrders = async () => {
    try {
      const data = await getOrderItems();
      setOrderList(data);
    } catch (err) {
      console.error("Failed to fetch menus", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrder = (id) => {
    navigate(`/admin-order/view/${id}`);
  };

  // Filter menu items based on search term
  const filteredMenuList = OrderList.filter(
    (menu) =>
      menu.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentMenuList = filteredMenuList.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );
  const totalPages = Math.ceil(filteredMenuList.length / transactionsPerPage);

  // const indexOfLastTransaction = currentPage * transactionsPerPage;
  // const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  // const currentMenuList = OrderList.slice(
  //   indexOfFirstTransaction,
  //   indexOfLastTransaction,
  // );
  // const totalPages = Math.ceil(OrderList.length / transactionsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Manage Order Items</h2>
          <div className="search-container" style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search by customer name or status..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total </th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMenuList.map((menu) => (
              <tr key={menu.id} className="menu-item">
                <td>{menu.id}</td>
                <td>{menu.customer.name}</td>
                <td>₹ {menu.pricing.total}</td>
                <td>{menu.status}</td>
                <td>{menu.createdAt.toDate().toLocaleString()}</td>
                <td>
                  <button className="view" onClick={() => viewOrder(menu.id)}>
                    View
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
      </div>
    </>
  );
};

export default ManageOrder;
