import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

export const getProducts = () => API.get("/products");

export const getCart = () => API.get("/cart");
export const addToCart = (productId) => API.post("/cart", { productId });
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const clearCart = () => API.delete("/cart");

export const checkout = () => API.post("/checkout");
