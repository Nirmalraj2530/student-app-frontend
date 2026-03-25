const BASE_URL = process.env.REACT_APP_API_URL;



export const fetchSkillByKey = async (skillKey) => {
  const res = await fetch(`${BASE_URL}/api/skills/${skillKey}`, {
    method: "GET",
  });

  return res.json();
};
