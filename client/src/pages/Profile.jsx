
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import "./profile.css";

export default function Profile() {
  const { user, token, login } = useContext(AuthContext);

  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // load dashboard async (non blocking UI)
  useEffect(() => {
    setStatsLoading(true);

    axios
      .get("https://ai-learning-webapplication.onrender.com/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDashboard(res.data))
      .catch(() => console.log("Dashboard load failed"))
      .finally(() => setStatsLoading(false));

  }, [token]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        "https://ai-learning-webapplication.onrender.com/api/users/profile",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(res.data, token);
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* PROFILE CARD — SHOWS INSTANTLY */}
      <div className="profile-panel card-glow">
        <h2 className="title">👤 Profile</h2>
        <form onSubmit={updateProfile} className="profile-form">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input value={user.email} disabled />

          <button disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* DASHBOARD CARD */}
      <div className="stats-panel card-glow">
        <h2 className="title">📊 Learning Dashboard</h2>

        {/* LOADING SKELETON */}
        {statsLoading ? (
          <div className="skeleton-wrapper">

            <div className="stats-grid">
              <div className="stat skeleton"></div>
              <div className="stat skeleton"></div>
              <div className="stat skeleton"></div>
            </div>

            <div className="course-card skeleton large"></div>
            <div className="course-card skeleton large"></div>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat">
                <span>🔥</span>
                <p>{dashboard.streak}</p>
                <small>Day Streak</small>
              </div>
              <div className="stat">
                <span>📘</span>
                <p>{dashboard.totalTopicsCompleted}</p>
                <small>Topics</small>
              </div>
              <div className="stat">
                <span>🧠</span>
                <p>{dashboard.solvedAssignments}</p>
                <small>Assignments</small>
              </div>
            </div>

            <div className="courses">
              <h3>My Courses</h3>
              {dashboard.courses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <b>{course.title}</b>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <small>
                    {course.completedTopics}/{course.totalTopics} completed
                  </small>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
