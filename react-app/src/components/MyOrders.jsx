import React from "react";
import { useLocation } from "react-router-dom";
import "./MyOrders.css";
import Header from "./Header"
function MyOrders() {
  const location = useLocation();
  const orderState = location.state;

  // Check if state is available
  if (!orderState) {
    return <div>No order details found.</div>;
  }

  // Destructure order details from state
  const {
    productName,
    quantity,
    total,
    fullName,
    pincode,
    state,
    city,
    area,
    mobileNumber,
    paymentOption,
    orderDate,
    orderId,
  } = orderState;

  return (
    <div>
    <Header />
    <div className="my-orders-container">
      <h2 className="my-orders-heading">Order Summary</h2>
      <div>
        <h3 className="order-section-heading">Order Details</h3>
        <p className="order-text">
          <span className="order-bold">Product Name:</span> {productName}
        </p>
        <p className="order-text">
          <span className="order-bold">Quantity:</span> {quantity} kg
        </p>
        <p className="order-text">
          <span className="order-bold">Total Price:</span> Rs.{total} /-
        </p>
        {/* Display other order details */}
      </div>
      <div>
        <h3 className="order-section-heading">Delivery Address</h3>
        <p className="order-text">
          <span className="order-bold">Full Name:</span> {fullName}
        </p>
        <p className="order-text">
          <span className="order-bold">Pincode:</span> {pincode}
        </p>
        <p className="order-text">
          <span className="order-bold">State:</span> {state}
        </p>
        <p className="order-text">
          <span className="order-bold">City:</span> {city}
        </p>
        <p className="order-text">
          <span className="order-bold">Area:</span> {area}
        </p>
        <p className="order-text">
          <span className="order-bold">Mobile Number:</span> {mobileNumber}
        </p>
      </div>
      <div>
        <h3 className="order-section-heading">Order Information</h3>
        <p className="order-text">
          <span className="order-bold">Payment Option:</span> {paymentOption}
        </p>
        <p className="order-text">
          <span className="order-bold">Order Date:</span> {orderDate}
        </p>
        <p className="order-text">
          <span className="order-bold">Order ID:</span> {orderId}
        </p>
      </div>
    </div>
    </div>
  );
}

export default MyOrders;
