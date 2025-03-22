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
      <div className="bg-white w-11/12 sm:w-96 p-4 rounded-md shadow-lg">
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
        `${API_BASE_URL}/api/auth/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: auth?.token } }
      );
      if (data.success) {
        if (data.pointsAwarded > 0) {
          toast.success(`Order status updated to ${newStatus}. You earned ${data.pointsAwarded} points!`);
        } else {
          toast.success(`Order status updated to ${newStatus}`);
        }
        fetchAllOrders(); // Refresh orders list
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Error updating order status");
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
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
            <UserMenu />
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">Products</th>
                    <th className="border border-gray-300 px-4 py-2">Buyer</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                    <th className="border border-gray-300 px-4 py-2">Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.products?.map((p) => (
                          <div key={p._id} className="mb-2">
                            {p.name} x {p.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.buyer?.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={getStatusClass(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          className="border rounded p-1"
                          value={order.status}
                          onChange={(e) => orderStatusHandler(order._id, e.target.value)}
                        >
                          <option value="Not Process">Not Processed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsChatModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
      {selectedOrder && (
        <ChatModal
          show={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </Structure>
  );
};

export default Orders;
