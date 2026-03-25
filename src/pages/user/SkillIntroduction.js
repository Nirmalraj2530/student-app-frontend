import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSkillByKey } from "../../services/userSkillApi";
import "./SkillIntroduction.css";

const SkillIntroduction = () => {
  const { skillName } = useParams();
  const [skill, setSkill] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSkill = async () => {
      try {
        const res = await fetchSkillByKey(skillName);
        if (res.success) {
          const apiSkill = res.skill;

          // Fetch question count for this skill
          const questionsRes = await fetch(
            `http://localhost:4000/api/admin/questions?skill=${apiSkill.title}`
          );
          const questionsData = await questionsRes.json();

          if (questionsData.success) {
            setQuestionCount(questionsData.total || 0);
          }

          setSkill(apiSkill);
        } else {
          setError(res.message || "Skill not found");
        }
      } catch (err) {
        setError("Failed to load skill data");
      } finally {
        setLoading(false);
      }
    };

    loadSkill();
  }, [skillName]);

  return (
    <div className="skill-intro-page">
      <div className="container">
        <Link to="/skills" className="back-btn">
          ← Back to Skills
        </Link>

        {loading ? (
          <div
            style={{ color: "#cbd5e1", textAlign: "center", padding: "40px" }}
          >
            Loading skill details...
          </div>
        ) : error ? (
          <div
            style={{ color: "#ef4444", textAlign: "center", padding: "40px" }}
          >
            Error: {error}
          </div>
        ) : !skill ? (
          <div
            style={{ color: "#cbd5e1", textAlign: "center", padding: "40px" }}
          >
            Skill not found
          </div>
        ) : (
          <div className="intro-content">
            <div className="skill-header">
              <div className="skill-icon-large">{skill.icon}</div>
              <h1 className="skill-title">{skill.title}</h1>
            </div>

            <p className="skill-description-large">{skill.description}</p>

            <section className="importance-section">
              <h2 className="section-title">Why This Skill Matters</h2>
              <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                Mastering {skill.title} is essential for professional growth.
                This assessment covers key concepts, practical applications, and
                industry standards to validate your expertise.
              </p>
            </section>

            <section className="test-info-section">
              <h2 className="section-title">Assessment Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Total Questions</span>
                  <span className="info-value">{questionCount}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time Limit</span>
                  <span className="info-value">{questionCount} mins</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Passing Score</span>
                  <span className="info-value">60%</span>
                </div>
              </div>
            </section>

            <section className="sample-section">
              <h2 className="section-title">Sample Question</h2>

              <div className="sample-card">
                <div className="question-text">
                  This is a sample question to demonstrate how the test
                  interface works. Please select the correct option below.
                </div>

                <div className="options-list">
                  <div className="option">A) Option 1</div>
                  <div className="option">B) Option 2</div>
                  <div className="option correct">C) Option 3</div>
                  <div className="option">D) Option 4</div>
                </div>

                <div className="explanation">
                  <strong>Explanation:</strong>
                  <br />
                  This section shows how explanations will appear after
                  answering a question. It helps users understand why the
                  selected option is correct.
                </div>
              </div>
            </section>

            <div className="start-test-section">
              <Link to={`/test/${skillName}`} className="btn-large">
                Start Assessment Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillIntroduction;
