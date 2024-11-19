import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Structure from "../../Components/structure/Structure";
import moment from 'moment';
import UserMenu from "../../Components/structure/UserMenu";
import API_BASE_URL from '../../apiConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/orders`, {
        headers: {
          Authorization: `${auth?.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Structure>
        <div className="container mx-auto p-6">
        <div className="flex">
        <div className="w-1/3 pr-4">
            <UserMenu />
          </div>
     <div>
     <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Products</th>
              <th className="border border-gray-300 px-4 py-2">Buyer</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Ordered At</th>
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
                  {moment(order.createdAt).format("MMM Do YYYY, h:mm:ss a")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
     </div>
        </div>
        </div>
       
       
    </Structure>
  );
};

export default Orders;
