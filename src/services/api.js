import axios from "axios";

// Base URL for your backend API
const API = axios.create({
  baseURL: "http://localhost:5000/api", // 👈 adjust if your backend runs on a different port
});

// Attach JWT token automatically (if available)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
