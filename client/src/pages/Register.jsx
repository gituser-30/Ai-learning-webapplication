import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    alert("Registration Successful");
    navigate("/login");
  };
  return (
    <>
      

      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card shadow-soft p-4" style={{ width: "380px" }}>
          <h3 className="text-center mb-1">Create Account 🚀</h3>
          <p className="text-center text-muted mb-4">
            Start learning smarter with AI
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control mb-3"
                name="name"
                placeholder="Name"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <input
                className="form-control mb-3"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control mb-3"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary w-100">Register</button>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
