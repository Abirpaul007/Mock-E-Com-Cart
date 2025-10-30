import React, { useState, useEffect } from "react";
import { checkout } from "../api/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Checkout.css";

export default function Checkout() {
  const [total, setTotal] = useState(null);
  const [user, setUser] = useState({ name: "", email: "" });
  const [billingInfo, setBillingInfo] = useState({ name: "", email: "" });
  const [billingTime, setBillingTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Decode token to extract user info (for pre-filling)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userData = {
          name: decoded.name || "",
          email: decoded.email || "",
        };
        setUser(userData);
        setBillingInfo(userData); // Pre-fill the form
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    // Set current billing time
    const now = new Date();
    const formattedTime = now.toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });
    setBillingTime(formattedTime);
  }, []);

  const handleInputChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!billingInfo.name.trim() || !billingInfo.email.trim()) {
      alert("Please enter your name and email");
      return;
    }
    
    setLoading(true);
    try {
      const res = await checkout();
      setTotal(res.data.total);
    } catch {
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      alert("Payment successful!");
      navigate("/");
    }, 800);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete Your Purchase</p>
        </div>

        <div className="checkout-content">
          {!total ? (
            <>
              {/* Billing Form */}
              <div className="checkout-section">
                <h2 className="section-title">Billing Information</h2>
                <div className="info-card">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Enter your name"
                      value={billingInfo.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Generate Bill Button */}
              <div className="checkout-section">
                <h2 className="section-title">Order Summary</h2>
                <div className="summary-card">
                  <p className="summary-message">
                    Click below to generate your final bill and review the total amount
                  </p>
                  <button 
                    className={`generate-bill-btn ${loading ? 'loading' : ''}`}
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="btn-spinner"></span>
                        Generating...
                      </>
                    ) : (
                      'Generate Final Bill'
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Display Billing Information */}
              <div className="checkout-section">
                <h2 className="section-title">Billing Information</h2>
                <div className="info-card">
                  <div className="info-row">
                    <span className="info-label">Customer Name</span>
                    <span className="info-value">{billingInfo.name}</span>
                  </div>
                  <div className="info-divider"></div>
                  <div className="info-row">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{billingInfo.email}</span>
                  </div>
                  <div className="info-divider"></div>
                  <div className="info-row">
                    <span className="info-label">Billing Date & Time</span>
                    <span className="info-value">{billingTime}</span>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="checkout-section">
                <h2 className="section-title">Order Summary</h2>
                <div className="summary-card total-card">
                  <div className="total-section">
                    <span className="total-label">Total Payable</span>
                    <span className="total-amount">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="payment-info">
                    <p className="payment-note">
                      <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      Secure payment processing
                    </p>
                  </div>
                  <button 
                    className={`confirm-payment-btn ${confirming ? 'confirming' : ''}`}
                    onClick={handleConfirm}
                    disabled={confirming}
                  >
                    {confirming ? (
                      <>
                        <span className="btn-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      'Confirm Payment'
                    )}
                  </button>
                  <button 
                    className="back-to-cart-btn"
                    onClick={() => navigate("/cart")}
                    disabled={confirming}
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}