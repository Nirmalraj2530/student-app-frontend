import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetSkillsUserQuery } from "../../services/api";
import "./SkillSelection.css";

const SkillSelection = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetSkillsUserQuery();
  const skills = data?.skills || [];
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));


  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="skill-selection-page">
      <header className="page-header">
        <div className="container">
          <div className="flex-between">
            <div className="user-greeting">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span>Hello, {user?.name || "User"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="page-title">
            <h1>Choose Your Skill</h1>
            <p className="subtitle">
              Select a skill category to begin your professional assessment
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill._id} className="skill-card">
                <div className="skill-icon">{skill.icon}</div>
                <h3 className="skill-title">{skill.title}</h3>
                <p className="skill-description">{skill.description}</p>
                <Link
                  to={`/skill/${skill.key}`}
                  className="btn btn-primary start-btn"
                >
                  Start Assessment
                </Link>
              </div>
            ))}

            {skills.length === 0 && !isLoading && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No skills available at the moment.
              </div>
            )}
            {isLoading && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                Loading skills...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillSelection;
