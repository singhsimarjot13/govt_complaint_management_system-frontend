import axios from "axios";

// Prefer env base URL; fallback to Vite proxy '/api'
const baseURL = import.meta?.env?.VITE_API_BASE || 
  (typeof window !== 'undefined' && window.__API_BASE__) || 
  "/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;
