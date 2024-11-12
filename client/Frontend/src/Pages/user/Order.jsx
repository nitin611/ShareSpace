import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import orderStyles from "./Orders.module.css";
import { assets } from "../../assets/assets";
import { AuthProvider } from "../../context/auth";
import Structure from "../../Components/structure/Structure";


const Orders = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const {data} = await axios.post(
        backendURL + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const permissionHandler = async (orderId, permission) => {
    try {
      const { data } = await axios.post(backendURL + "/api/order/permission", {
        orderId,
        permission,
      });
      await fetchAllOrders();
      data.success ? toast.success(data.message) : toast.error(data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };
  const statusHandler = async (e, orderId) => {
   
    try {
      const response = await axios.post(
        backendURL + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);
  return (
    <div className={orderStyles.order_page}>
      <div className={orderStyles.order_holder}>
        {orders.map((order, idx) => (
          <div
            className={`${orderStyles.order}
               ${order.status === "Delivered" ? orderStyles.delivered : ""}
                ${order.permission === false ? orderStyles.reject : ""}`}
            key={idx}
          >
            <div className={orderStyles.order_left}>
              <img src={assets.parcel_icon} loading="lazy" />
              <div className={orderStyles.order_info}>
                <div className={orderStyles.product_info}>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return (
                        <p key={index}>
                          {item.name} X {item.quantity},{" "}
                          <span>{item.size}</span>
                        </p>
                      );
                    } else {
                      return (
                        <p key={index}>
                          {item.name} X {item.quantity},{" "}
                          <span>{item.size}</span>,
                        </p>
                      );
                    }
                  })}
                </div>
                <p>{order.address.firstName + " " + order.address.lastName}</p>
                <div className={orderStyles.address_holder}>
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
            </div>
            <div className={orderStyles.order_center}>
              <p>Items: {order.items.length}</p>
              <p>
                Price: {currency}
                {order.amount}
              </p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className={orderStyles.order_right}>
              {order.permission === null && (
                <>
                  <button onClick={() => permissionHandler(order._id, true)}>
                    ACCEPT ORDER
                  </button>
                  <button
                    onClick={() => permissionHandler(order._id, false)}
                    className={orderStyles.red}
                  >
                    REJECT ORDER
                  </button>
                </>
              )}
              {order.permission === true && (
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  disabled={order.status === "Delivered"}
                  className={
                    order.status === "Delivered"
                      ? orderStyles.select_disable
                      : ""
                  }
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              )}
              {order.permission === false && (
                <p className={orderStyles.reject}>Order Rejected.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
