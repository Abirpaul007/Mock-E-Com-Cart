import React, { useEffect, useState } from "react";
import { getProducts, addToCart } from "../api/api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (id) => {
    setAddingToCart(id);
    try {
      await addToCart(id);
      alert("Added to cart!");
    } catch (err) {
      alert("Error adding to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">New Collection</h1>
        <p className="products-subtitle">Discover our latest pieces</p>
      </div>
      
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <div className="product-image-wrapper">
              <img src={p.image} className="product-image" alt={p.name} />
              <div className="product-overlay">
                <button 
                  className={`add-to-cart-btn ${addingToCart === p._id ? 'adding' : ''}`}
                  onClick={() => handleAdd(p._id)}
                  disabled={addingToCart === p._id}
                >
                  {addingToCart === p._id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">₹{p.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}