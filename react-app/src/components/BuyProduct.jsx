import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../constants";
import "./BuyProduct.css";

function BuyProduct() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-product/${productId}`);
        if (response.data.product) {
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Server Error");
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [productId]);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    if (product) {
      return quantity * product.price;
    }
    return 0;
  };

  const handleBuyNow = () => {
    // Navigate to the payment page with product details as parameters
    navigate(`/payment/${productId}?name=${encodeURIComponent(product.pname)}&quantity=${quantity}&total=${calculateTotalPrice()}`);
  };

  return (
    <div className="buy-product-container">
      <h2 className="product-title">Buy Product</h2>
      {product ? (
        <div className="product-details">
          <img
            src={`${API_URL}/${product.pimage}`}
            alt={product.pname}
            className="product-image"
          />
          <h3 className="product-name">{product.pname}</h3>
          <p className="product-price">Price: Rs.{product.price} /-</p>
          <div className="quantity-control">
            <button onClick={handleDecrease} className="quantity-btn">-</button>
            <span className="quantity">{quantity}</span>
            <button onClick={handleIncrease} className="quantity-btn">+</button>
          </div>
          <p className="total-price">Total Price: Rs.{calculateTotalPrice()} /-</p>
          <button onClick={handleBuyNow} className="buy-btn">Buy Now</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BuyProduct;
