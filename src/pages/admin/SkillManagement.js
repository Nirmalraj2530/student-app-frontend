import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../services/adminSkillApi";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCode } from "react-icons/fi";
import "./SkillManagement.css";

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSkill, setEditSkill] = useState(null);

  const [form, setForm] = useState({
    key: "",
    title: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const res = await fetchSkills();
    if (res.success) setSkills(res.skills);
  };

  const openAdd = () => {
    setEditSkill(null);
    setForm({ key: "", title: "", description: "", icon: "" });
    setShowModal(true);
  };

  const openEdit = (skill) => {
    setEditSkill(skill);
    setForm(skill);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editSkill) {
      await updateSkill(editSkill._id, form);
    } else {
      await createSkill(form);
    }
    setShowModal(false);
    loadSkills();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Disable this skill?")) return;
    await deleteSkill(id);
    loadSkills();
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Skill Management</h1>
        <p>Manage skill assessments, categories, and configurations</p>
      </div>

      <div className="controls-container">
        <div style={{ color: "var(--text-secondary)" }}>
          <strong>{skills.length}</strong> Skills Available
        </div>
        <button className="admin-btn btn-primary" onClick={openAdd}>
          <FiPlus size={18} /> Add Skill
        </button>
      </div>

      {/* SKILL GRID */}
      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill._id} className="skill-card">
            <div className="card-header">
              <div className="skill-icon">{skill.icon || <FiCode />}</div>
              <code className="skill-key">{skill.key}</code>
            </div>

            <h3>{skill.title}</h3>

            <span className={`status-badge ${skill.isActive !== false ? 'status-active' : 'status-disabled'}`}>
              {skill.isActive !== false ? 'Active' : 'Disabled'}
            </span>

            <p>{skill.description || "No description provided."}</p>

            <div className="card-actions">
              <button
                className="admin-btn btn-secondary"
                onClick={() => openEdit(skill)}
              >
                <FiEdit2 size={16} /> Edit
              </button>
              <button
                className="admin-btn btn-danger"
                onClick={() => handleDelete(skill._id)}
              >
                <FiTrash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="admin-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
            <p>No skills found. Click "Add Skill" to create one.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editSkill ? "Edit Skill" : "Add New Skill"}</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Skill Key (Unique Identifier)</label>
                <input
                  className="admin-input"
                  placeholder="e.g. javascript-basics"
                  value={form.key}
                  disabled={!!editSkill}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Title</label>
                <input
                  className="admin-input"
                  placeholder="e.g. JavaScript Basics"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="admin-textarea"
                  placeholder="Short description of what this skill covers..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <input
                  className="admin-input"
                  placeholder="e.g. 💻"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="admin-btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn btn-primary">
                  {editSkill ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SkillManagement;
