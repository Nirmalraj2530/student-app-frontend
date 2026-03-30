import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight, FiHome, FiUser } from "react-icons/fi";
import { useLoginMutation } from "../../services/api";
import "./UserLogin.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await login(formData).unwrap();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");
        navigate("/skills");
      } else {
        setErrors({ email: data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ email: error.data?.message || "Server not running or network error" });
    }
  };

  return (
    <div className="user-login-page">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="icon-wrapper">
              <FiUser />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to continue your assessment</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FiMail /> Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <span>⚠</span> {errors.email}
                </div>
              )}
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Signing In..." : <><span style={{ marginRight: '8px' }}>Sign In</span><FiArrowRight /></>}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/register" className="auth-link primary-link">
              Don't have an account? Create one
            </Link>
            <Link to="/" className="auth-link">
              <FiHome style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
