import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrderItems } from "../../services/orderService";
import "../../styles/admin/ManageMenu.css";
import api from "../../axios";

const ManageOrder = () => {
  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const transactionsPerPage = 5;

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrderList(res.data.orders);
      // console.log(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch order", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrder = (id) => {
    navigate(`/admin/order/view/${id}`);
  };

  // Filter menu items based on search term
  const filteredOrderList = orderList.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * transactionsPerPage;
  const indexOfFirstItem = indexOfLastItem - transactionsPerPage;
  const currentOrderList = filteredOrderList.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredOrderList.length / transactionsPerPage);

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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total </th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrderList.map((menu) => (
              <tr key={menu._id} className="menu-item">
                <td>{menu._id}</td>
                <td>{menu.customer.name}</td>
                <td>₹ {menu.pricing.total}</td>
                <td>{menu.status}</td>
                <td>{new Date(menu.createdAt).toLocaleString()}</td>
                <td>
                  <button className="view" onClick={() => viewOrder(menu._id)}>
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
