import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
  

    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-soft p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-1">Welcome Back 👋</h3>
        <p className="text-center text-muted mb-4">
          Login to your AI Learning Assistant
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name ="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
