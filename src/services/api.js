import axios from "axios";

// Determine API base URL based on environment
const getBaseURL = () => {
  // In production, use the backend URL directly
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE || 'https://govt-complaint-management-system.vercel.app/api';
  }
  // In development, use Vite proxy
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for error handling
API.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response?.status === 404) {
      console.error('API endpoint not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export default API;
