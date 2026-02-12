import "../../styles/user/Invoice.css";

const Invoice = ({ order }) => {
  return (
    <div className="invoice-container" id="invoice">
      {/* HEADER */}
      <div className="invoice-header">
        <h1 className="invoice-brand">BrewMaster Coffee Shop</h1>
        <p className="invoice-title">Invoice</p>
      </div>

      {/* CUSTOMER + ORDER INFO */}
      <div className="invoice-info-box">
        <div>
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        <div>
          <p>
            <strong>Name:</strong> {order.customer.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.customer.address}
          </p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th className="center">Qty</th>
            <th className="right">Price</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td className="center">{item.quantity}</td>
              <td className="right">₹ {item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="invoice-total-box">
        <div className="total-row">
          <span>Subtotal</span>
          <span>₹ {order.pricing.subtotal}</span>
        </div>

        <div className="total-row">
          <span>Tax</span>
          <span>₹ {order.pricing.tax}</span>
        </div>

        <div className="grand-total">
          <span>Total</span>
          <span>₹ {order.pricing.total}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="invoice-footer">
        <p>Payment Method: Cash on Delivery</p>
        <p>Thank you for ordering from BrewMaster </p>
      </div>
    </div>
  );
};

export default Invoice;
