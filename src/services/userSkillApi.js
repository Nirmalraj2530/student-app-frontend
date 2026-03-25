const BASE_URL = "http://localhost:4000";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const fetchSkillByKey = async (skillKey) => {
  const res = await fetch(`${BASE_URL}/api/skills/${skillKey}`, {
    method: "GET",
  });

  return res.json();
};
