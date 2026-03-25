import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetailedReview.css';

const DetailedReview = () => {
  const { skillName } = useParams();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedReview();
  }, [skillName]);

  const fetchDetailedReview = async () => {
    try {
      const savedResult = localStorage.getItem(`testResult_${skillName}`);
      if (savedResult) {
        const result = JSON.parse(savedResult);

        // Fetch from API if we have result ID
        if (result.resultId) {
          const response = await fetch(`http://localhost:4000/api/test-results/${result.resultId}/review`);
          const data = await response.json();

          if (data.success) {
            setReviewData(data.review);
          } else {
            // Fallback to localStorage
            if (result.questions) {
              setReviewData({
                score: result.score,
                correct: result.correctAnswers,
                wrong: result.wrongAnswers,
                questions: result.questions
              });
            }
          }
        } else if (result.questions) {
          // Use localStorage data
          setReviewData({
            score: result.score,
            correct: result.correctAnswers,
            wrong: result.wrongAnswers,
            questions: result.questions
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch review', err);
      // Fallback to localStorage
      const savedResult = localStorage.getItem(`testResult_${skillName}`);
      if (savedResult) {
        const result = JSON.parse(savedResult);
        if (result.questions) {
          setReviewData({
            score: result.score,
            correct: result.correctAnswers,
            wrong: result.wrongAnswers,
            questions: result.questions
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <div className="container" style={{ textAlign: 'center', color: '#cbd5e1' }}>
          Loading review...
        </div>
      </div>
    );
  }

  if (!reviewData || !reviewData.questions) {
    return (
      <div className="review-page">
        <div className="container" style={{ textAlign: 'center', color: '#cbd5e1' }}>
          No review data found
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="container">
        <div className="page-header">
          <h1>Detailed Review - {skillName?.replace('-', ' ').toUpperCase()}</h1>
        </div>

        <div className="summary-banner">
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{reviewData.score}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Correct</span>
              <span className="stat-value correct">{reviewData.correct}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Incorrect</span>
              <span className="stat-value wrong">{reviewData.wrong}</span>
            </div>
          </div>
        </div>

        <div className="questions-review">
          {reviewData.questions.map((question, index) => {
            const isCorrect = question.userAnswer === question.correctAnswer;

            return (
              <div key={index} className="question-card">
                <div className="question-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className={`status-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? 'Correct' : question.userAnswer === undefined ? 'Unattempted' : 'Incorrect'}
                  </span>
                </div>

                <div className="question-text">{question.question}</div>

                <div className="options-review">
                  {question.options.map((option, optionIndex) => {
                    let optionClass = 'option-item';

                    if (optionIndex === question.correctAnswer) {
                      optionClass += ' correct-answer';
                    } else if (optionIndex === question.userAnswer && !isCorrect) {
                      optionClass += ' wrong-answer';
                    }

                    return (
                      <div key={optionIndex} className={optionClass}>
                        <span className="option-letter">
                          {String.fromCharCode(65 + optionIndex)})
                        </span>
                        <span className="option-text">{option}</span>
                        {optionIndex === question.correctAnswer && (
                          <span className="correct-icon">✓</span>
                        )}
                        {optionIndex === question.userAnswer && !isCorrect && (
                          <span className="wrong-icon">✗</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="explanation">
                  <div className="explanation-header">💡 Explanation</div>
                  <div className="explanation-text">{question.explanation}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bottom-actions">
          <Link to={`/test/${skillName}`} className="btn btn-primary">
            Retake Test
          </Link>
          <Link to="/skills" className="btn btn-secondary">
            Select Another Skill
          </Link>
          <Link to="/" className="btn-text">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailedReview;