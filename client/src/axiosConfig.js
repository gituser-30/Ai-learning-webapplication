import axios from "axios";

// set base URL once
axios.defaults.baseURL = "http://localhost:5000/api";

// automatically attach token to EVERY request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
