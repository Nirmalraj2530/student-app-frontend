import React from "react";
import { Link } from "react-router-dom";
import {
  FiLogIn,
  FiUserPlus,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Bubble Animation */}
      <div className="bubbles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

      {/* Decorative Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      {/* Header */}
      <header className="header glass-effect">
        <div className="container">
          <div className="flex-between">
            <Link to="/" className="logo-container">
              <div className="logo-icon">
                <FiTrendingUp />
              </div>
              <h2 className="logo">SkillSimulator</h2>
            </Link>
            <nav className="nav-links">
              <Link to="/admin/login" className="nav-item">
                <FiLock className="icon" />
                <span>Admin</span>
              </Link>
              <div className="nav-divider"></div>
              <Link to="/login" className="nav-item">
                <FiLogIn className="icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary glow-effect">
                <FiUserPlus className="icon" />
                <span>Get Started</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in-up">
            <div className="badge-pill">
              <FiCheckCircle className="badge-icon" />
              <span>#1 Platform for Skill Assessment</span>
            </div>
            <h1 className="hero-title">
              Employee Skills
              <br />
              <span className="text-gradient">Simulator For IT Careers</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate pre-employment assessment platform. Practice
              real-world scenarios, analyze your performance, and get hired by
              top companies.
            </p>
            <div className="hero-buttons">
              <Link
                to="/register"
                className="btn btn-primary btn-large glow-effect"
              >
                <span>Start Assessment</span>
                <FiArrowRight />
              </Link>
              <Link to="/login" className="btn btn-glass btn-large">
                <span>Resume Journey</span>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Tests Taken</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="features">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Why Choose SkillMaster?</h2>
            <p className="section-subtitle">
              Elevate your preparation with our premium features
            </p>
          </div>

          <div className="grid grid-3">
            <div className="feature-card glass-card">
              <div className="card-icon-wrapper color-1">
                <FiTarget className="card-icon" />
              </div>
              <h3>Precision Assessment</h3>
              <p>
                Adaptive tests that evaluate your technical and soft skills with
                industry-standard accuracy.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="card-icon-wrapper color-2">
                <FiBarChart2 className="card-icon" />
              </div>
              <h3>Deep Analytics</h3>
              <p>
                Get instant, detailed feedback on your performance with
                actionable insights for improvement.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="card-icon-wrapper color-3">
                <FiBriefcase className="card-icon" />
              </div>
              <h3>Career Readiness</h3>
              <p>
                Simulate real interview scenarios and build the confidence
                needed to land your dream job.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
