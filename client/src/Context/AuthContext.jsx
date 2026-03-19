

import { createContext, useEffect, useState } from "react";

// 1️⃣ Create context
export const AuthContext = createContext();

// 2️⃣ Provider component
export const AuthProvider = ({ children }) => {

  // restore from browser storage on first render
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(true);

  // runs once when app loads
  useEffect(() => {
    setLoading(false);
  }, []);

  // 4️⃣ Login function
  const login = (userData, jwtToken) => {
    // save to state
    setUser(userData);
    setToken(jwtToken);

    // save to browser (IMPORTANT)
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  // 5️⃣ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
