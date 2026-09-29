const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const getJobs = require("../services/jobService");
const { calculateMatch } = require("../services/matchService");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadMiddleware = multer({ storage: storage }).single("resume");

// Main controller
const upload = (req, res) => {
  uploadMiddleware(req, res, async function (err) {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).send("Upload error: " + err.message);
    }

    try {
      const filePath = req.file.path;

      const formData = new FormData();
      formData.append("resume", fs.createReadStream(filePath));

      // Send to Python API
      const response = await axios.post(
        "http://127.0.0.1:8000/parse-resume",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      const skills = response.data.skills;

      // Fetch jobs
      const searchQuery = skills.includes("python")
        ? "python developer"
        : skills.includes("java")
        ? "java developer"
        : "software developer";

      const jobs = await getJobs(searchQuery);

      // Match jobs
      const matchedJobs = jobs.map((job) => {
        const result = calculateMatch(skills, job.description || "");

        return {
          title: job.title,
          company: job.company.display_name,
          match: result.match + "%",
          missing_skills: result.missingSkills,
          link: job.redirect_url,
        };
      });
      // 🔥 Sort jobs by match %
const sortedJobs = matchedJobs.sort(
  (a, b) => parseFloat(b.match) - parseFloat(a.match)
);

// 🔥 Best match job
const bestMatch = sortedJobs[0];
      // Final response
    // 🔥 Sort jobs


// 🔥 Best match


// ✅ Final response
res.json({
  skills: skills,
  best_match: bestMatch,
  jobs: sortedJobs.slice(0, 5),
});

    } catch (error) {
      console.error("FULL ERROR:", error);

      res.status(500).json({
        message: "Error processing resume",
        error: error.message,
      });
    }
  }); 
};

module.exports = upload;