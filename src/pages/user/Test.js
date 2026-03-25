import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Test.css";

const Test = () => {
  const { skillName } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [skill, setSkill] = useState(null);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Fetch skill details
        const skillRes = await fetch(`${process.env.REACT_APP_API_URL}/api/skills/${skillName}`);
        const skillData = await skillRes.json();

        if (skillData.success) {
          setSkill(skillData.skill);

          // Fetch questions for this skill
          const questionsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/questions?skill=${skillData.skill.title}`);
          const questionsData = await questionsRes.json();

          if (questionsData.success && questionsData.questions.length > 0) {
            // Shuffle questions
            const shuffled = [...questionsData.questions].sort(() => Math.random() - 0.5);
            setQuestions(shuffled);
            // Set timer: 1 minute per question
            setTimeLeft(shuffled.length * 60);
          } else {
            alert("No questions available for this skill");
            navigate("/skills");
          }
        }
      } catch (err) {
        console.error("Failed to load test", err);
        alert("Failed to load test");
        navigate("/skills");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [skillName, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time's up!");
          navigate(`/result/${skillName}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions, skillName, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = async () => {
    // Calculate results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattempted = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === undefined) {
        unattempted++;
      } else if (selectedAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const status = score >= 60 ? 'PASSED' : 'FAILED';

    // Save to backend
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/test-results/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill: skill?.title || skillName,
          score,
          correct: correctAnswers,
          wrong: wrongAnswers,
          unattempted,
          totalQuestions: questions.length,
          status,
          userEmail: user?.email,
          answers: Object.keys(selectedAnswers).map(index => ({
            questionId: questions[index]._id,
            selectedAnswer: selectedAnswers[index]
          }))
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Save result with questions and answers for review
        localStorage.setItem(`testResult_${skillName}`, JSON.stringify({
          resultId: data.result._id,
          skillName: skill?.title || skillName,
          totalQuestions: questions.length,
          correctAnswers,
          wrongAnswers,
          unattempted,
          score,
          status,
          questions: questions.map((q, index) => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            userAnswer: selectedAnswers[index],
            explanation: q.explanation
          }))
        }));
        navigate(`/result/${skillName}`);
      } else {
        alert("Failed to save test result");
      }
    } catch (err) {
      console.error("Failed to save result", err);
      alert("Failed to save test result");
    }
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  if (loading) {
    return (
      <div className="test-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#cbd5e1' }}>Loading test data...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="test-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#cbd5e1' }}>No questions available for this skill.</div>
      </div>
    );
  }

  const getTimerClass = () => {
    // Return warning class if less than 60 seconds left
    if (timeLeft < 60) return "timer warning";
    return "timer";
  };

  return (
    <div className="test-page">
      <header className="test-header">
        <div className="container">
          <div className="header-content">
            <div className="skill-name">
              {skill?.title || skillName?.replace("-", " ").toUpperCase()}
            </div>
            <div className="progress-info">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className={getTimerClass()}>{formatTime(timeLeft)}</div>
          </div>
        </div>
      </header>

      <main className="test-content">
        <div className="container">
          <div className="question-card">
            <div className="question-number">
              Question {currentQuestion + 1}
            </div>
            <div className="question-text">
              {questions[currentQuestion].question}
            </div>

            <div className="options-container">
              {questions[currentQuestion].options.map((option, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="option-radio"
                  />
                  <span className="option-text">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              className="btn btn-prev"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button onClick={handleFinishTest} className="btn btn-finish">
                Finish Test
              </button>
            ) : (
              <button className="btn btn-next" onClick={handleNext}>
                Next Question
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


export default Test;
