import React from "react";

function Cart({ cartItems, removeFromCart }) {
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            <img src={item.pimage} alt={item.pname} />
            <div>
              <h3>{item.pname}</h3>
              <p>Price: Rs.{item.price}</p>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <button>Proceed to Checkout</button>
    </div>
  );
}

export default Cart;
