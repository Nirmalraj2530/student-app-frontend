import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetTestResultQuery } from '../../services/api';
import './TestResult.css';

const TestResult = () => {
  const { skillName } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const savedResultStr = localStorage.getItem(`testResult_${skillName}`);
  const savedResult = savedResultStr ? JSON.parse(savedResultStr) : null;
  const resultId = savedResult?.resultId;

  const { data, isLoading: apiLoading, error } = useGetTestResultQuery(resultId, {
    skip: !resultId,
  });

  useEffect(() => {
    let finalResult = null;

    if (resultId && data?.success) {
      finalResult = {
        skillName: data.result.skill,
        totalQuestions: data.result.totalQuestions,
        correctAnswers: data.result.correct,
        wrongAnswers: data.result.wrong,
        unattempted: data.result.unattempted,
        score: data.result.score,
        status: data.result.status,
      };
    } else if (savedResult) {
      finalResult = savedResult;
    }

    setResult(finalResult);
    setLoading(resultId ? apiLoading : false);
  }, [data, apiLoading, resultId, savedResult]);

  if (loading) {
    return (
      <div className="result-page">
        <div style={{ color: '#cbd5e1' }}>Loading result...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-page">
        <div style={{ color: '#cbd5e1' }}>No test result found</div>
      </div>
    );
  }

  const isPassed = result.status === 'PASSED';

  return (
    <div className="result-page">
      <div className="container">
        <div className="result-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#f8fafc' }}>
            Assessment Complete
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            Here is how you performed on the {result.skillName || "skill"} assessment
          </p>

          <div className="score-section">
            <div className="circular-progress">
              <svg className="progress-ring" width="160" height="160">
                <circle
                  className="progress-ring-background"
                  strokeWidth="12"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="progress-ring-progress"
                  stroke={isPassed ? "#34d399" : "#f87171"}
                  strokeWidth="12"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.score / 100)}`}
                />
              </svg>
              <div className="score-text">
                <span className="score-number">{result.score}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>

            <div className={`status-badge ${isPassed ? 'passed' : 'failed'}`}>
              {result.status}
            </div>
          </div>

          <div className="summary-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Questions</span>
                <span className="stat-value">{result.totalQuestions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unattempted</span>
                <span className="stat-value" style={{ color: '#fbbf24' }}>{result.unattempted}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Correct</span>
                <span className="stat-value correct">{result.correctAnswers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Incorrect</span>
                <span className="stat-value wrong">{result.wrongAnswers}</span>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Link
              to={`/review/${skillName}`}
              className="btn btn-primary"
            >
              View Detailed Review
            </Link>
            <Link
              to="/skills"
              className="btn btn-secondary"
            >
              Select Another Skill
            </Link>
            <Link
              to="/"
              className="btn-text"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResult;