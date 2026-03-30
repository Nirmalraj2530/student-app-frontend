import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiBook, FiCalendar, FiArrowRight } from "react-icons/fi";
import { useRegisterUserMutation } from "../../services/api";
import "./UserRegister.css";

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    degree: "",
    yearOfPassing: "",
  });

  const [errors, setErrors] = useState({});
  const [registerUser, { isLoading: loading }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }

    if (!formData.yearOfPassing) {
      newErrors.yearOfPassing = "Year of passing is required";
    } else if (
      formData.yearOfPassing < 1990 ||
      formData.yearOfPassing > new Date().getFullYear()
    ) {
      newErrors.yearOfPassing = "Please enter a valid year";
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
      const data = await registerUser(formData).unwrap();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Registration successful!");
        navigate("/skills");
      } else {
        setErrors({ general: data.message || "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: error.data?.message || "Server not running or network error" });
    }
  };

  return (
    <div className="user-register-page">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="icon-wrapper">
              <FiUser />
            </div>
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Join the professional skills assessment platform</p>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="general-error">
                {errors.general}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FiUser /> Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? "error" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <div className="error-message">
                    <span>⚠</span> {errors.name}
                  </div>
                )}
              </div>

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
                  />
                </div>
                {errors.email && (
                  <div className="error-message">
                    <span>⚠</span> {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiPhone /> Phone Number
                </label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="phone"
                    className={`form-input ${errors.phone ? "error" : ""}`}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                {errors.phone && (
                  <div className="error-message">
                    <span>⚠</span> {errors.phone}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiBook /> Degree / Qualification
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="degree"
                    className={`form-input ${errors.degree ? "error" : ""}`}
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech, MBA"
                  />
                </div>
                {errors.degree && (
                  <div className="error-message">
                    <span>⚠</span> {errors.degree}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiCalendar /> Year of Passing
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="yearOfPassing"
                    className={`form-input ${errors.yearOfPassing ? "error" : ""}`}
                    value={formData.yearOfPassing}
                    onChange={handleChange}
                    placeholder="e.g., 2023"
                    min="1980"
                    max={new Date().getFullYear()}
                  />
                </div>
                {errors.yearOfPassing && (
                  <div className="error-message">
                    <span>⚠</span> {errors.yearOfPassing}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-register"
              disabled={loading}
            >
              {loading ? "Creating Account..." : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="auth-link primary-link">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
