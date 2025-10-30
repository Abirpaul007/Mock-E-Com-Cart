import React from "react";
import { confirmPayment } from "../api/api";

export default function ReceiptModal({ receipt, onClose, navigateHome }) {
  if (!receipt) return null;

  const handleConfirm = async () => {
    await confirmPayment(receipt.orderId);
    alert("Payment Confirmed ✅");
    onClose();
    navigateHome();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "#0009" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Receipt</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Order ID:</strong> {receipt.orderId}</p>
            <ul>
              {receipt.items.map((item) => (
                <li key={item.id}>{item.name} × {item.qty} = ₹{(item.price * item.qty).toFixed(2)}</li>
              ))}
            </ul>
            <h5>Total: ₹{receipt.total.toFixed(2)}</h5>
            <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={handleConfirm}>Confirm Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
