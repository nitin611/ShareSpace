import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Structure from "../../Components/structure/Structure";
import moment from "moment";
import UserMenu from "../../Components/structure/UserMenu";
import API_BASE_URL from "../../apiConfig";


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
        `http://localhost:8080/api/chat/chats/${order._id}`,
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

  // Jab modal khulega , then it will refresh hrr one second
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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    if (auth?.token) getOrders();
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
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Products
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Buyer</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Ordered At
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Chat With
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.products.map((product) => (
                          <div key={product._id}>{product.name}</div>
                        ))}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.buyer.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {order.status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {moment(order.createdAt).format(
                          "MMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleChatClick(order)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2 text-xs sm:text-sm"
                        >
                          Chat
                        </button>
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
      {/* Render the Chat Modal */}
      <ChatModal
        show={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        order={selectedOrder}
      />
    </Structure>
  );
};

export default Orders;
