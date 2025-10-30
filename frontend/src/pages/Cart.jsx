import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    setRemoving(id);
    try {
      await removeFromCart(id);
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setRemoving(null);
    }
  };

  const total = cart.reduce((acc, c) => acc + c.product.price * c.qty, 0);

  const handleCheckout = async () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Bag</h1>
        <p className="cart-subtitle">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h3 className="empty-cart-title">Your bag is empty</h3>
          <p className="empty-cart-text">Add items to get started</p>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-price">₹{item.product.price.toLocaleString()}</p>
                  <div className="item-quantity">
                    <span className="quantity-label">Quantity:</span>
                    <span className="quantity-value">{item.qty}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <p className="item-total">₹{(item.product.price * item.qty).toLocaleString()}</p>
                  <button 
                    className={`remove-btn ${removing === item._id ? 'removing' : ''}`}
                    onClick={() => handleRemove(item._id)}
                    disabled={removing === item._id}
                  >
                    {removing === item._id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-content">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">₹{total.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">Calculated at checkout</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row summary-total">
                <span className="summary-label">Total</span>
                <span className="summary-value">₹{total.toLocaleString()}</span>
              </div>
              
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              
              <button className="continue-shopping-link" onClick={() => navigate("/")}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}