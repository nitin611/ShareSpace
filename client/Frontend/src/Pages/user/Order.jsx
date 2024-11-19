import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import orderStyles from "./Orders.module.css";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/auth";
import UserMenu from "../../Components/structure/UserMenu";
import Structure from "../../Components/structure/Structure";

const getStatusClass = (status) => {
  switch(status) {
    case "Not Process": return orderStyles.status_not_processed;
    case "Processing": return orderStyles.status_processing;
    case "Shipped": return orderStyles.status_shipped;
    case "Delivered": return orderStyles.status_delivered;
    case "Cancelled": return orderStyles.status_cancelled;
    default: return orderStyles.status_not_processed;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/allOrders`, {
        headers: {
          Authorization: `${auth?.token}`,
        },
      });
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        toast.error("Invalid order data format");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const orderStatusHandler = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/v1/order/update-status/${orderId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `${auth?.token}`
          }
        }
      );
      
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchAllOrders();
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating order status");
    }
  };

  useEffect(() => {
    if (auth?.token) fetchAllOrders();
  }, [auth?.token]);

  return (
    <Structure>
      <div className="container mx-auto p-6">
        <div className="flex">
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>
          <div className="w-2/3">
            <div className={orderStyles.orders_container}>
              <table className={orderStyles.orders_table}>
                <thead className={orderStyles.orders_header}>
                  <tr>
                    <th>Order ID</th>
                    <th>Products</th>
                    <th>Buyer</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className={orderStyles.orders_row}>
                      <td>{order._id?.slice(-6) || 'N/A'}</td>
                      <td>
                        {order.products && order.products.length > 0 
                          ? order.products.map(product => 
                              `${product.name || 'Unknown Product'} (x${product.quantity || 1})`
                            ).join(", ")
                          : 'No Products'}
                      </td>
                      <td>{order.buyer?.name || 'Unknown Buyer'}</td>
                      <td>₹{order.products 
                          ? order.products.reduce((total, product) => 
                              total + ((product.price || 0) * (product.quantity || 1)), 0) 
                          : 0}
                      </td>
                      <td>
                        <span className={`${orderStyles.status_badge} ${getStatusClass(order.status)}`}>
                          {order.status || 'Unknown Status'}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={order.status || ''} 
                          onChange={(e) => orderStatusHandler(order._id, e.target.value)}
                          disabled={order.status === "Delivered"}
                          className={orderStyles.action_select}
                        >
                          <option value="Not Process">Not Processed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Orders;