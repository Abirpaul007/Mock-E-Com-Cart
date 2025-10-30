import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import CartItem from "../models/CartItem.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user.id }).populate("product");

    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    await CartItem.deleteMany({ user: req.user.id });

    res.json({ success: true, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
