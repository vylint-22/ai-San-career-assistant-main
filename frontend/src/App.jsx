// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const COLORS = ["#00C49F", "#0088FE"];

const uploadResume = async () => {
  if (!file) return alert("Please upload resume");

  const formData = new FormData();
  formData.append("resume", file);

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/resume/upload",
      formData
    );

    setSkills(res.data.skills || []);
    setJobs(res.data.jobs || []);

  } catch (error) {
    console.log(error);
    alert("Upload failed");
  } finally {
    setLoading(false);
  }
};

  const atsScore = Math.min(skills.length * 10, 100);

  const pieData = [
    { name: "Matched", value: skills.length },
    { name: "Missing", value: Math.max(10 - skills.length, 0) },
  ];

  const barData = skills.map((skill) => ({
    name: skill,
    level: Math.floor(Math.random() * 30) + 70,
  }));

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* Navbar */}
      <nav className="navbar">
        <h1>🚀 AI Career Assistant</h1>

        <button
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h2>Boost Your Career With AI</h2>
        <p>Upload Resume • Analyze Skills • Find Best Jobs</p>
      </section>

      {/* Upload */}
      <div className="upload-card glass">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={uploadResume}>
          {loading ? "Analyzing..." : "Upload Resume"}
        </button>
      </div>

      {/* Results */}
      {skills.length > 0 && (
        <>
          {/* Dashboard Cards */}
          <div className="stats-grid">
            <div className="stat-card glass">
              <h3>ATS Score</h3>
              <p>{atsScore}%</p>
            </div>

            <div className="stat-card glass">
              <h3>Skills Found</h3>
              <p>{skills.length}</p>
            </div>

            <div className="stat-card glass">
              <h3>Jobs Found</h3>
              <p>{jobs.length}</p>
            </div>

            <div className="stat-card glass">
              <h3>Best Role</h3>
              <p>{skills.includes("python") ? "Python Dev" : "Developer"}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="glass section-card">
            <h2>🧠 Extracted Skills</h2>

            <div className="skills-wrap">
              {skills.map((skill, i) => (
                <span key={i} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="glass chart-card">
              <h3>Skill Match</h3>

              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass chart-card">
              <h3>Skill Strength</h3>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="level" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs */}
          <div className="section-card glass">
  <h2>🔥 Recommended Jobs</h2>

  <div className="jobs-grid">
    {jobs.map((job, index) => (
      <div className="job-card" key={index}>
        <h3>{job.title}</h3>

        <p className="company">{job.company}</p>

        <p>📍 {job.location || "India"}</p>

        <p>💰 {job.salary || "Negotiable"}</p>

        <span className="match-badge">
          {90 - index * 5}% Match
        </span>

        <a
          href={job.redirect_url}
          target="_blank"
          rel="noreferrer"
          className="apply-btn"
        >
          Apply Now
        </a>
      </div>
    ))}
  </div>
</div>

          {/* Suggestions */}
          <div className="glass section-card">
            <h2>💡 AI Suggestions</h2>
            <ul>
              {atsScore < 70 && <li>Add more projects</li>}
              {atsScore < 80 && <li>Add internships</li>}
              <li>Use action verbs in resume</li>
              <li>Tailor resume for each role</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}