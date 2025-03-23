import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Structure from "../../Components/structure/Structure";
import moment from "moment";
import UserMenu from "../../Components/structure/UserMenu";
import API_BASE_URL from "../../apiConfig";
import toast from 'react-hot-toast';

const ChatModal = ({ show, onClose, order }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const fetchMessages = async () => {
    if (!order) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/chat/chats/${order._id}`,
        {
          headers: { Authorization: auth?.token },
        }
      );
      if (response.data && response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!show || !order) return;
    fetchMessages();
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [show, order]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || !order) return;

    const currentUserId = auth?.user?._id;
    const buyerId = order?.buyer?._id || order?.buyer;
    const sellerId =
      order.products && order.products.length > 0
        ? order.products[0].userId
        : null;

    let apiEndpoint = "";
    if (currentUserId === buyerId) {
      apiEndpoint = `${API_BASE_URL}/api/chat/BuyerSend/${order._id}`;
    } else if (currentUserId === sellerId) {
      apiEndpoint = `${API_BASE_URL}/api/chat/SellerSend/${order._id}`;
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
          <h3 className="text-xl font-bold">Chat - Order: {order?._id}</h3>
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
            className="bg-blue-600 text-white px-4 py-2 ml-2 rounded-md text-xs sm:text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete this order?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/orders`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
      const intervalId = setInterval(getOrders, 10000);
      return () => clearInterval(intervalId);
    }
  }, [auth?.token]);

  const handleChatClick = (order) => {
    setSelectedOrder(order);
    setIsChatModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/auth/orders/${orderToDelete._id}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      
      if (response.data.success) {
        toast.success("Order deleted successfully");
        getOrders(); // Refresh the orders list
      } else {
        toast.error(response.data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Error deleting order");
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Not Process":
        return "bg-gray-200 text-gray-800";
      case "Processing":
        return "bg-blue-200 text-blue-800";
      case "Shipped":
        return "bg-yellow-200 text-yellow-800";
      case "Delivered":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Structure>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
            <UserMenu />
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Products</th>
                      <th className="border border-gray-300 px-4 py-2">Status</th>
                      <th className="border border-gray-300 px-4 py-2">Total</th>
                      <th className="border border-gray-300 px-4 py-2">Ordered At</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
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
                          <span className={`px-2 py-1 rounded ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          ₹{order.products?.reduce((total, p) => total + (p.price * p.quantity), 0)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleChatClick(order)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Chat
                            </button>
                            <button
                              onClick={() => handleDeleteClick(order)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      <DeleteConfirmModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Structure>
  );
};

export default Orders;
