import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Structure from "../../Components/structure/Structure";
import AdminMenu from "../../Components/structure/AdminMenu";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const ViewUserDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User ID from URL:", id);

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/category/userDetails/${id}`
        );
        console.log("API response:", response.data);
        setDetails(response.data.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading)
    return (
      <Structure>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-gray-700">Loading...</p>
        </div>
      </Structure>
    );
  if (error)
    return (
      <Structure>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </Structure>
    );

  const renderUserInfo = (user) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(user)
          .filter(([key]) => key !== "password")
          .map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="font-medium text-gray-600 capitalize">
                {key}
              </span>
              <span className="text-gray-800">{String(value)}</span>
            </div>
          ))}
      </div>
    );
  };

  return (
    <Structure>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4">
          <AdminMenu />
        </div>
        <div className="w-full md:w-3/4 p-4 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            User Details
          </h2>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">User Info</h3>
            {details.user ? (
              renderUserInfo(details.user)
            ) : (
              <p className="text-gray-600">No user info available.</p>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Products Created</h3>
            {details.products && details.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {details.products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between h-full transform transition hover:scale-105"
                  >
                    <img
                      src={`${API_BASE_URL}/api/product/product-photo/${p._id}`}
                      className="w-60 h-60 object-cover"
                      alt={p.name}
                    />
                    <div className="p-3 flex-grow">
                      <h5 className="text-md font-bold text-gray-700">
                        {p.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {p.description.substring(0, 60)}...
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-md font-semibold text-blue-600">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(p.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No products found.</p>
            )}
          </div>

          {/* Orders Placed */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Orders Placed</h3>
            {details.ordersPlaced && details.ordersPlaced.length > 0 ? (
              <ul className="space-y-3">
                {details.ordersPlaced.map((order) => (
                  <li key={order._id} className="p-4 bg-gray-50 rounded-lg">
                    <p>
                      <span className="font-medium">Order ID:</span> {order._id}
                    </p>
                    {order.products[0].name && (
                      <p>
                        <span className="font-medium">Order Name:</span> {order.products[0].name}
                      </p>
                    )}
                    {order.status && (
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {order.status}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No orders placed found.</p>
            )}
          </div>

          {/* Orders Received */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Orders Received</h3>
            {details.ordersReceived && details.ordersReceived.length > 0 ? (
              <ul className="space-y-3">
                {details.ordersReceived.map((order) => (
                  <li key={order._id} className="p-4 bg-gray-50 rounded-lg">
                    <p>
                      <span className="font-medium">Order ID:</span> {order._id}
                    </p>
                    {order.products[0].name && (
                      <p>
                        <span className="font-medium">Order Name:</span> {order.products[0].name}
                      </p>
                    )}
                    {order.status && (
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {order.status}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No orders received found.</p>
            )}
          </div>

          {/* Chats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Chats</h3>
            {details.chats && details.chats.length > 0 ? (
              <ul className="space-y-3">
                {details.chats.map((chat) => (
                  <li key={chat._id} className="p-4 bg-gray-50 rounded-lg">
                    <p>
                      <span className="font-medium">Message:</span>{" "}
                      {chat.message}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No chats found.</p>
            )}
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default ViewUserDetails;
