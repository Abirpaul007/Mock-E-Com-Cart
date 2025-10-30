import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get user cart with user details
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user.id })
      .populate("product")
      .populate("user", "name email"); // <--- populate user info here

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add to cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let existingItem = await CartItem.findOne({ user: req.user.id, product: productId });
    if (existingItem) {
      existingItem.qty += 1;
      await existingItem.save();
      return res.json(existingItem);
    }

    const newItem = new CartItem({
      user: req.user.id,
      product: productId,
      qty: 1,
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error while adding to cart" });
  }
});

// ✅ Remove from cart
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Clear all cart
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
