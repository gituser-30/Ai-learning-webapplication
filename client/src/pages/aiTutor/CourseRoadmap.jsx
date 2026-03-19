import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./roadmap.css";

export default function CourseRoadmap() {
  const { courseId } = useParams();
  const { token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setCourse(res.data.course);
        setTopics(res.data.topics);
      });
  }, [courseId, token]);

  const openTopic = (topic) => {
    if (topic.status === "locked") return;
    navigate(`/ai-tutor/topic/${topic._id}`);
  };

  return (
    <div className="roadmap-page">
      {course && (
        <>
          <h1>{course.title}</h1>
          <p>Progress: {course.currentTopicIndex} / {topics.length}</p>

          <div className="roadmap-container">
            {topics.map((topic, i) => (
              <div
                key={topic._id}
                className={`topic-node ${topic.status}`}
                onClick={() => openTopic(topic)}
              >
                <div className="circle">
                  {topic.status === "completed" && "✅"}
                  {topic.status === "unlocked" && "📘"}
                  {topic.status === "locked" && "🔒"}
                </div>

                <span>{topic.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
