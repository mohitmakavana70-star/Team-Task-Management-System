import axios from "axios";

const api = axios.create({
  baseURL: isProduction
    ? "https://team-task-management-system-u8ii.onrender.com/api"
    : "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
