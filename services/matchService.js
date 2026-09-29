
exports.calculateMatch = (userSkills, jobDescription) => {

  const jobDesc = jobDescription.toLowerCase();
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

  const skillDB = [
    "python","java","c","c++","html","css","javascript","react",
    "node","express","mongodb","sql","mysql","aws","docker",
    "kubernetes","django","flask","fastapi","git","linux"
  ];

  // 🔥 Extract job skills
  let jobSkills = skillDB.filter(skill => jobDesc.includes(skill));

  // 🚨 IMPORTANT FIX: If no skills found, avoid wrong missing skills
  if (jobSkills.length === 0) {
    return {
      match: "0.00",
      missingSkills: []
    };
  }

  const matchedSkills = jobSkills.filter(skill =>
    normalizedUserSkills.includes(skill)
  );

  const missingSkills = jobSkills.filter(skill =>
    !normalizedUserSkills.includes(skill)
  );

  const matchPercentage =
    (matchedSkills.length / jobSkills.length) * 100;

  return {
    match: matchPercentage.toFixed(2),
    missingSkills: missingSkills
  };
};