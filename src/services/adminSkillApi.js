const BASE_URL = process.env.REACT_APP_API_URL; // change if needed

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// GET ALL SKILLS
export const fetchSkills = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/skills`, {
    method: "GET",
    headers: headers(),
  });

  return res.json();
};

// CREATE SKILL
export const createSkill = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/admin/skills`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  return res.json();
};

// UPDATE SKILL
export const updateSkill = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/admin/skills/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  return res.json();
};

// DELETE (SOFT)
export const deleteSkill = async (id) => {
  const res = await fetch(`${BASE_URL}/api/admin/skills/${id}`, {
    method: "DELETE",
    headers: headers(),
  });

  return res.json();
};
