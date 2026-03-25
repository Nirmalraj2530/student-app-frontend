const BASE_URL = "http://localhost:4000/api/admin/dashboard";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

export const fetchDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`, { headers: getHeaders() });
  return res.json();
};

export const fetchRecentActivity = async () => {
  const res = await fetch(`${BASE_URL}/recent-activity`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const fetchPopularSkills = async () => {
  const res = await fetch(`${BASE_URL}/popular-skills`, {
    headers: getHeaders(),
  });
  return res.json();
};
