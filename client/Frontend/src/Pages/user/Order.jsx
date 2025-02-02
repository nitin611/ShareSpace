import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import orderStyles from "./Orders.module.css";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/auth";
import UserMenu from "../../Components/structure/UserMenu";
import Structure from "../../Components/structure/Structure";
import API_BASE_URL from "../../apiConfig";
import moment from "moment";

const getStatusClass = (status) => {
  switch (status) {
    case "Not Process":
      return orderStyles.status_not_processed;
    case "Processing":
      return orderStyles.status_processing;
    case "Shipped":
      return orderStyles.status_shipped;
    case "Delivered":
      return orderStyles.status_delivered;
    case "Cancelled":
      return orderStyles.status_cancelled;
    default:
      return orderStyles.status_not_processed;
  }
};

// ChatModal Component
const ChatModal = ({ show, onClose, order }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [auth] = useAuth();

  // Fetch messages for the current order
  const fetchMessages = async () => {
    if (!order) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/chat/chats/${order._id}`,
        { headers: { Authorization: auth?.token } }
      );
      if (response.data && response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Poll for new messages every 1 second when modal is open
  useEffect(() => {
    if (!show || !order) return;
    // initial fetch
    fetchMessages();
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [show, order]);

  // Send a new message
  const handleSend = async () => {
    if (newMessage.trim() === "" || !order) return;
    const currentUserId = auth?.user?._id;
    // Assume order.buyer is an object containing _id
    const buyerId = order?.buyer?._id || order?.buyer;
    // Assuming seller's id is stored in the product's userId field
    const sellerId =
      order.products && order.products.length > 0
        ? order.products[0].userId
        : null;

    let apiEndpoint = "";
    if (currentUserId === buyerId) {
      apiEndpoint = `http://localhost:8080/api/chat/BuyerSend/${order._id}`;
    } else if (currentUserId === sellerId) {
      apiEndpoint = `http://localhost:8080/api/chat/SellerSend/${order._id}`;
    } else {
      console.error("User is neither buyer nor seller for this order");
      return;
    }

    try {
      const response = await axios.post(
        apiEndpoint,
        { message: newMessage },
        { headers: { Authorization: auth?.token } }
      );
      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-96 p-4 rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Chat - Order: {order?._id}
          </h3>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
        <div className="h-64 overflow-y-auto border p-2 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 ${
                  msg.sender === auth?.user?._id
                    ? "text-blue-500 text-right"
                    : "text-green-500 text-left"
                }`}
              >
                <div>
                  <span>{msg.message}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {moment(msg.createdAt).format("h:mm a")}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="border flex-grow p-2"
            placeholder="Type your message"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/allOrders`,
        { headers: { Authorization: `${auth?.token}` } }
      );
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setOrders(response.data.data);
      } else {
        toast.error("Invalid order data format");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  };

  const orderStatusHandler = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/v1/order/update-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `${auth?.token}` } }
      );
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchAllOrders();
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error updating order status"
      );
    }
  };

  useEffect(() => {
    if (auth?.token) fetchAllOrders();
  }, [auth?.token]);

  const handleChatClick = (order) => {
    setSelectedOrder(order);
    setIsChatModalOpen(true);
  };

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
                    <th>Chat With</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className={orderStyles.orders_row}
                    >
                      <td>
                        {order._id?.slice(-6) || "N/A"}
                      </td>
                      <td>
                        {order.products && order.products.length > 0
                          ? order.products
                              .map(
                                (product) =>
                                  `${product.name || "Unknown Product"} (x${
                                    product.quantity || 1
                                  })`
                              )
                              .join(", ")
                          : "No Products"}
                      </td>
                      <td>
                        {order.buyer?.name || "Unknown Buyer"}
                      </td>
                      <td>
                        ₹
                        {order.products
                          ? order.products.reduce(
                              (total, product) =>
                                total +
                                (product.price || 0) *
                                  (product.quantity || 1),
                              0
                            )
                          : 0}
                      </td>
                      <td>
                        <span
                          className={`${orderStyles.status_badge} ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "Unknown Status"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status || ""}
                          onChange={(e) =>
                            orderStatusHandler(
                              order._id,
                              e.target.value
                            )
                          }
                          disabled={order.status === "Delivered"}
                          className={orderStyles.action_select}
                        >
                          <option value="Not Process">
                            Not Processed
                          </option>
                          <option value="Processing">
                            Processing
                          </option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">
                            Delivered
                          </option>
                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleChatClick(order)}
                          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-200 mr-2"
                        >
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Render Chat Modal */}
      <ChatModal
        show={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        order={selectedOrder}
      />
    </Structure>
  );
};

export default Orders;
