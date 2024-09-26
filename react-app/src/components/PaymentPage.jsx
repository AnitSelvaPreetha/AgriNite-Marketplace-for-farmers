import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import API_URL from "../constants";

function PaymentPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productName = searchParams.get("name");
  const quantity = searchParams.get("quantity");
  const total = searchParams.get("total");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState(""); // Payment option: 'cod' or 'online'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !pincode || !state || !city || !area || !mobileNumber) {
        alert("Please fill in all address fields before proceeding.");
        return;
    }
    if (!paymentOption) {
        alert("Please select a payment option.");
        return;
    }
    
    const orderDetails = {
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
        orderDate: new Date().toLocaleDateString(),
        orderId: generateOrderId(),
    };

    fetch(API_URL + '/notify-seller', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
    }).then(response => {
        if (response.ok) {
            // If notification to seller is successful, navigate to appropriate page
            if (paymentOption === "online") {
                navigate("/checkout", {
                    state: {
                        ...orderDetails,
                        total,
                    },
                });
            } else {
                navigate("/myorders", {
                    state: orderDetails,
                });
            }
        } else {
            throw new Error('Failed to notify seller');
        }
    }).catch(error => {
        console.error('Error notifying seller:', error);
        // Handle error if needed
    });
};

const generateOrderId = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
};

const handleFullNameChange = (e) => {
  setFullName(e.target.value);
};

const handleMobileNumberChange = (e) => {
  setMobileNumber(e.target.value);
};

const handlePincodeChange = (e) => {
  setPincode(e.target.value);
};

const handleStateChange = (e) => {
  setState(e.target.value);
};

const handleCityChange = (e) => {
  setCity(e.target.value);
};

const handleAreaChange = (e) => {
  setArea(e.target.value);
};

const handlePaymentOptionChange = (e) => {
  setPaymentOption(e.target.value);
};



  return (
    <div className="payment-container">
      <h2 className="payment-heading">Payment Page</h2>
      <p>Product Name: {productName}</p>
      <p>Quantity: {quantity} kg</p>
      <p>Total Price: Rs.{total} /-</p>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input type="text" value={fullName} onChange={handleFullNameChange} required />
        </label>
        <br />
        <label>
          Mobile Number:
          <input type="text" value={mobileNumber} onChange={handleMobileNumberChange} required />
        </label>
        <br />
        <label>
          Pincode:
          <input type="text" value={pincode} onChange={handlePincodeChange} required />
        </label>
        <br />
        <label>
          State:
          <input type="text" value={state} onChange={handleStateChange} required />
        </label>
        <br />
        <label>
          City:
          <input type="text" value={city} onChange={handleCityChange} required />
        </label>
        <br />
        <label>
          Area:
          <input type="text" value={area} onChange={handleAreaChange} required />
        </label>
        <br />
        <label>
          Payment Option:
          <select value={paymentOption} onChange={handlePaymentOptionChange} required>
            <option value="">Select Payment Option</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="online">Online Payment</option>
          </select>
        </label>
        <br />
        <button type="submit">Proceed to Pay</button>
      </form>
    </div>
  );
}

export default PaymentPage;
