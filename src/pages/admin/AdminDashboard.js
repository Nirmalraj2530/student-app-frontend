import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetPopularSkillsQuery,
} from "../../services/api";
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiActivity,
  FiClock,
  FiTrendingUp,
  FiAward
} from "react-icons/fi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: activityData, isLoading: activityLoading } = useGetRecentActivityQuery();
  const { data: skillsData, isLoading: skillsLoading } = useGetPopularSkillsQuery();

  const stats = statsData?.stats || null;
  const activities = activityData?.recentTests || [];
  const skills = skillsData?.skills || [];

  if (statsLoading || activityLoading || skillsLoading) {
    return (
      <AdminLayout>
        <div style={{ color: '#cbd5e1', padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Welcome back to the admin panel</p>
      </div>

      {/* ===== STATS ===== */}
      {stats && (
        <div className="dashboard-grid">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<FiUsers />}
            color="blue"
          />
          <StatCard
            title="Total Tests"
            value={stats.totalTests}
            icon={<FiFileText />}
            color="purple"
          />
          <StatCard
            title="Avg. Score"
            value={`${stats.averageScore}%`}
            icon={<FiCheckCircle />}
            color="green"
          />
          <StatCard
            title="Active Skills"
            value={stats.activeSkills}
            icon={<FiActivity />}
            color="orange"
          />
        </div>
      )}

      {/* ===== ACTIVITY + SKILLS ===== */}
      <div className="sections-grid">
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title"><FiClock /> Recent Activity</h3>
          </div>

          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((item, i) => (
                <div key={i} className="activity-item">
                  <div>
                    <div className="activity-user">
                      {item.user}
                    </div>
                    <div className="activity-meta">
                      Time: {new Date(item.date).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="activity-user" style={{ justifyContent: 'flex-end' }}>
                      {item.skill}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', justifyContent: 'flex-end' }}>
                      <span className={`status-badge ${item.status?.toLowerCase()}`}>
                        {item.status}
                      </span>
                      <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                        {Math.round(item.score)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No recent activity.</p>
            )}
          </div>
        </div>

        {/* Popular Skills */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title"><FiTrendingUp /> Popular Skills</h3>
          </div>

          <div className="skills-list">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-info">
                    <div className="skill-icon">
                      <FiAward color="#a855f7" />
                    </div>
                    <span>{skill.title}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{skill.usageCount}%</span>
                    <div className="usage-bar-container">
                      <div className="usage-bar" style={{ width: `${Math.min(skill.usageCount, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No skills data.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="stats-card">
    <div className={`stats-icon-wrapper icon-${color}`}>
      {icon}
    </div>
    <div className="stats-content">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  </div>
);

export default AdminDashboard;
