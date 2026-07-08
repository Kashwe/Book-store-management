import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Replace 1 with the logged-in user's ID later
      const response = await axios.get("http://localhost:8080/orders/user/1");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderDate}</td>
                <td>₹ {order.totalPrice}</td>
                <td>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No Orders Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;