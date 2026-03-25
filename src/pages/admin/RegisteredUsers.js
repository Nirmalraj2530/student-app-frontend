import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiX, FiUser } from "react-icons/fi";
import "./RegisteredUsers.css";
import AdminLayout from "../../components/AdminLayout";
import {
  fetchUsers,
  deleteUser,
  updateUser,
} from "../../services/adminUserApi";

const RegisteredUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UPDATE STATE
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
    loadUsers();
  };

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    await updateUser(selectedUser._id, {
      name: selectedUser.name,
      email: selectedUser.email,
      skill: selectedUser.skill,
      score: selectedUser.score,
    });
    setShowEdit(false);
    loadUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.skill || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Registered Users</h1>
        <p>Manage and view all registered users and their test results</p>
      </div>

      <div className="admin-card">
        <div className="controls-container">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="admin-input has-icon"
              placeholder="Search users by name, email, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px" }}>Loading users...</p>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skill Attempted</th>
                  <th>Score (%)</th>
                  <th>Test Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: "500" }}>{user.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                      <td>
                        <span className="badge badge-blue">
                          {user.skill || "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${user.score >= 80
                              ? "badge-green"
                              : user.score >= 60
                                ? "badge-yellow"
                                : "badge-red"
                            }`}
                        >
                          {user.score ?? 0}%
                        </span>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {user.testDate
                          ? new Date(user.testDate).toLocaleDateString()
                          : "Not Attempted"}
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="admin-btn btn-secondary btn-icon-only"
                            onClick={() => handleEditClick(user)}
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            className="admin-btn btn-danger btn-icon-only"
                            onClick={() => handleDelete(user._id)}
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
                    <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)" }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination UI */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid var(--admin-border)",
          color: "var(--text-secondary)",
          fontSize: "14px"
        }}>
          <div>
            Showing 1 to {filteredUsers.length} of {users.length} entries
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="admin-btn btn-secondary" disabled>Previous</button>
            <button className="admin-btn btn-primary">1</button>
            <button className="admin-btn btn-secondary" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEdit && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit User</h3>
              <button
                onClick={() => setShowEdit(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="admin-input"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                placeholder="Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="admin-input"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                placeholder="Email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skill</label>
              <input
                className="admin-input"
                value={selectedUser.skill || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, skill: e.target.value })
                }
                placeholder="Skill"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Score</label>
              <input
                type="number"
                className="admin-input"
                value={selectedUser.score ?? 0}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    score: Number(e.target.value),
                  })
                }
                placeholder="Score"
              />
            </div>

            <div className="modal-actions">
              <button
                className="admin-btn btn-secondary"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button className="admin-btn btn-primary" onClick={handleUpdate}>
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RegisteredUsers;
