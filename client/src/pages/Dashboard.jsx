
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { HiOutlineMicrophone } from "react-icons/hi";
import ToolCard from "../components/ToolCard";
import aiHero from "../assets/ai-hero.png";
import studentHero from "../assets/student-hero.png";
import { motion } from "framer-motion";
import Snowfall from 'react-snowfall';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [pdfCount, setPdfCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const Motionlink = motion(Link);

  const StatCard = ({ title, value, icon }) => (
    <motion.div
      className="col-md-4"
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="card stat-card glass-card p-4 shadow-lg">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h2 className="fw-bold neon-text">{value}</h2>
          </div>
          <div className="stat-icon fs-2">{icon}</div>
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/pdfs/my-pdfs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPdfCount(res.data.length);
      })
      .catch(() => {});
  }, [token]);

  return (
    <div className="dashboard-bg">

      <Snowfall 
        color="white" 
        snowflakeCount={150} 
        style={{ position: 'fixed', width: '100vw', height: '100vh' }}
      />

      <div className="container py-5">
        {/* HERO BANNER */}
        <motion.div
          className="hero-banner mb-5 glass-banner"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content">
            <h1 className="fw-bold display-4 gradient-text">
              Learn Faster with <span>AI</span>
            </h1>
            <p className="lead text-light">
              Your personal AI tutor, PDF assistant & coding mentor — all in one
              place.
            </p>

            <div className="hero-buttons mt-4">
              <Motionlink
                to="/ai-tutor"
                className="hero-btn primary-btn"
                whileHover={{ scale: 1.1 }}
              >
                🚀 Start Learning
              </Motionlink>
              <Motionlink
                to="/pdfs"
                className="hero-btn secondary-btn"
                whileHover={{ scale: 1.1 }}
              >
                📂 Upload PDF
              </Motionlink>
            </div>
          </div>

          <div className="hero-images">
            <motion.img
              src={aiHero}
              className="hero-ai floating-img"
              alt="AI"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <motion.img
              src={studentHero}
              className="hero-user floating-img"
              alt="Student"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
          </div>
        </motion.div>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="welcome-text neon-text">
              Welcome back, <span className="highlight-name">Aryan</span> 👋
            </h1>
            <p className="subtitle-text text-light">
              Let’s continue your learning journey
            </p>
          </motion.div>

          <motion.div
            className="streak-card glass-card"
            whileHover={{ scale: 1.1 }}
          >
            🔥 <span>Current Streak</span>
            <h5 className="fw-bold">5 Days</h5>
          </motion.div>
        </div>

        {/* STATS */}
        <div className="row g-4 mb-5">
          <StatCard title="PDFs Uploaded" value={pdfCount} icon="📄" />
          <StatCard title="AI Chats" value={chatCount} icon="🤖" />
          <StatCard title="Learning Status" value="Active" icon="✅" />
        </div>

        {/* TOOLS */}
        <h3 className="section-title mb-4 gradient-text">✨ Your AI Tools</h3>

        <div className="row g-4">
          <ToolCard
            title="AI Tutor"
            description="Learn any topic step by step like a personal tutor"
            icon="🎓"
            link="/ai-tutor"
          />
          <ToolCard
            title="PDF AI"
            description="Ask questions from your uploaded PDFs"
            icon="📘"
            link="/pdfs"
          />
          <ToolCard
            title="Code Editor"
            description="Practice coding with AI assistance"
            icon="💻"
            link="/domains"
          />
          <ToolCard
            title="AI-Interviewer"
            description="Practice Interview with AI assistance"
            icon={<HiOutlineMicrophone />}
            link="/interview"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
