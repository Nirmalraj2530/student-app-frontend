import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiArrowRight, FiShield, FiAlertCircle } from "react-icons/fi";
import { useAdminLoginMutation } from "../../services/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [adminLogin, { isLoading: loading }] = useAdminLoginMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    if (!payload.username || !payload.password) {
      setErrors({
        username: !payload.username ? "Username is required" : "",
        password: !payload.password ? "Password is required" : ""
      });
      return;
    }

    try {
      const data = await adminLogin(payload).unwrap();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.admin));
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Invalid admin credentials");
      }
    } catch (error) {
      alert(error.data?.message || "Server error");
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background Shapes */}
      <div className="admin-bg-shape admin-shape-1"></div>
      <div className="admin-bg-shape admin-shape-2"></div>

      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="icon-wrapper">
              <FiShield />
            </div>
            <h2 className="login-title">Admin Portal</h2>
            <p className="login-subtitle">Secure access to dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group">
              <label className="form-label">
                <FiUser /> Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  className={`form-input ${errors.username ? "error" : ""}`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter admin username"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <div className="error-message">
                  <FiAlertCircle size={12} /> {errors.username}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                <FiLock /> Password
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <div className="error-message">
                  <FiAlertCircle size={12} /> {errors.password}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-login"
              disabled={loading}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Access Dashboard <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
