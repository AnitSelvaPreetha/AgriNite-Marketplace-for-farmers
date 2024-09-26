import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);
  const total = location?.state?.total || 0;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
        document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/create-order", { amount: location.state.total });
        setOrderId(response.data.id);
        setAmount(location.state.total);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchData();
  }, []);

  const openPayModal = () => {
    const options = {
      key: "rzp_test_HzbB2qiFR9yf6M",
      amount: total * 100, // Amount in paisa
      currency: "INR",
      name: "agriNite",
      description: "Test Transaction",
      order_id: orderId,
      handler: function (response) {
        alert("Payment successful!");
        console.log(response);
        // Navigate to MyOrders page after successful payment
        // navigate('/myorders', { state: { orderId: response.order_id, amount: amount } });
        navigate('/');
      },
      prefill: {
        name: "agriNite",
        email: "agrinite@gmail.com",
        contact: "9791675543",
      },
      notes: {
        address: "Your Address",
      },
      theme: {
        color: "#F37254",
      },
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      alert("An error occurred while processing your payment. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Checkout Page</h2>
      <p>Order Total: Rs.{location.state.total} /-</p>
      <button onClick={openPayModal}>Proceed to Pay</button>
    </div>
  );
}

export default CheckoutPage;
