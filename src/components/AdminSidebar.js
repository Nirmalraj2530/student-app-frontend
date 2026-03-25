import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiPieChart,
  FiUsers,
  FiLayers,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiTrendingUp
} from "react-icons/fi";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FiPieChart /> },
    { path: "/admin/skills", label: "Skills", icon: <FiLayers /> },
    { path: "/admin/users", label: "Users", icon: <FiUsers /> },
    { path: "/admin/questions", label: "Questions", icon: <FiHelpCircle /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <FiTrendingUp />
          </div>
          <h3>SkillMaster Admin</h3>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""
                }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="nav-item logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'flex-start' }}
          >
            <span className="nav-icon"><FiLogOut /></span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default AdminSidebar;
