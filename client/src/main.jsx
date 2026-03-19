import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContext } from "./Context/AuthContext";
import "./components/global.css";
import "./axiosConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
