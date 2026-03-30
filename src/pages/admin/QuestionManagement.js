import React, { useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { 
  useGetQuestionsQuery, 
  useGetSkillsQuery, 
  useCreateQuestionMutation, 
  useUpdateQuestionMutation, 
  useDeleteQuestionMutation 
} from "../../services/api";
import "./QuestionManagement.css";
import AdminLayout from "../../components/AdminLayout";

const QuestionManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    skill: "",
    difficulty: "Easy",
  });

  const difficulties = ["Easy", "Medium", "Hard"];

  const { data: questionsData, isLoading: questionsLoading } = useGetQuestionsQuery();
  const { data: skillsData } = useGetSkillsQuery();
  
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const questions = questionsData?.questions || [];
  const skills = skillsData?.skills || [];


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await updateQuestion({ id: editingQuestion._id, ...formData }).unwrap();
      } else {
        await createQuestion(formData).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save question", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id).unwrap();
      } catch (err) {
        console.error("Failed to delete question", err);
      }
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      skill: question.skill,
      difficulty: question.difficulty,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      skill: "",
      difficulty: "Easy",
    });
    setEditingQuestion(null);
    setShowModal(false);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSkill === "" || q.skill === selectedSkill)
  );

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Question Management</h1>
        <p>Add, edit, and manage quiz questions</p>
      </div>

      <div className="admin-card">
        <div className="controls-container">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="admin-input has-icon"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <select
                className="admin-select"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="">All Skills</option>
                {skills.map((skill) => (
                  <option key={skill._id} value={skill.title}>
                    {skill.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="admin-btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <FiPlus size={18} /> Add Question
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Question</th>
                <th>Skill</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questionsLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    Loading questions...
                  </td>
                </tr>
              ) : filteredQuestions.length > 0 ? (
                filteredQuestions.map((question, index) => (
                  <tr key={question._id}>
                    <td>{index + 1}</td>
                    <td style={{ maxWidth: "350px" }}>
                      {question.question.substring(0, 80)}
                      {question.question.length > 80 && "..."}
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {question.skill}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${question.difficulty === "Hard"
                            ? "badge-red"
                            : question.difficulty === "Medium"
                              ? "badge-yellow"
                              : "badge-green"
                          }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="admin-btn btn-secondary btn-icon-only"
                          onClick={() => handleEdit(question)}
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="admin-btn btn-danger btn-icon-only"
                          onClick={() => handleDelete(question._id)}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    No questions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h3>
              <button
                onClick={resetForm}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  className="admin-textarea"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  required
                  rows="3"
                  placeholder="Enter the question here..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Options (Select the correct one)</label>
                {formData.options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "12px"
                    }}
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswer === index}
                      onChange={() =>
                        setFormData({ ...formData, correctAnswer: index })
                      }
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Explanation</label>
                <textarea
                  className="admin-textarea"
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation: e.target.value })
                  }
                  placeholder="Explain why the correct answer is right..."
                  required
                  rows="3"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Skill Category</label>
                  <select
                    className="admin-select"
                    value={formData.skill}
                    onChange={(e) =>
                      setFormData({ ...formData, skill: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Skill</option>
                    {skills.map((skill) => (
                      <option key={skill._id} value={skill.title}>
                        {skill.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="admin-select"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="admin-btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn btn-primary">
                  {editingQuestion ? "Update Question" : "Add Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default QuestionManagement;
