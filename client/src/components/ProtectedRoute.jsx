import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
