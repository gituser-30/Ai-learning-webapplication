// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import { AuthContext } from "../../context/AuthContext";
// import "./learn.css";

// export default function LearnTopic() {
//   const { topicId } = useParams();
//   const { token } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [locked, setLocked] = useState(false);

//   const [lesson, setLesson] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [generatingTask, setGeneratingTask] = useState(false);

//   // Load lesson
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/topic/learn/${topicId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => {
//         setLesson(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//   if (err.response?.status === 402) {
//     setLocked(true);
//   } else {
//     alert("Failed to load lesson");
//   }
// });

//   }, [topicId, token]);

//   // Generate assignment
//   const generateAssignment = async () => {
//     try {
//       setGeneratingTask(true);

//       const res = await axios.post(
//         `http://localhost:5000/api/assignment/generate/${topicId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       navigate(`/ai-tutor/assignment/${res.data._id}`);

//     } catch {
//       alert("Failed to generate assignment");
//     } finally {
//       setGeneratingTask(false);
//     }
//   };

//   if (loading) return <div className="learn-loading">Preparing your lesson... 📚</div>;

//   return (
//     <div className="learn-container">

//       <h1 className="lesson-title">{lesson.title}</h1>

//       <div className="lesson-content">
//         <ReactMarkdown>{lesson.explanation}</ReactMarkdown>
//       </div>

//       <div className="lesson-actions">
//         <button onClick={generateAssignment} disabled={generatingTask}>
//           {generatingTask ? "Creating Task..." : "Take Assignment 📝"}
//         </button>
//       </div>

//     </div>
//   );
// }


import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../context/AuthContext";
import "./learn.css";

export default function LearnTopic() {
  const { topicId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [locked, setLocked] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingTask, setGeneratingTask] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Load lesson
  const loadLesson = () => {
    setLoading(true);

    axios
      .get(`http://localhost:5000/api/topic/learn/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setLesson(res.data);
        setLocked(false);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 402) {
          setLocked(true);
          setLoading(false);   // IMPORTANT: stop spinner
        } else {
          alert("Failed to load lesson");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    loadLesson();
  }, [topicId, token]);

  // Upgrade plan
  const upgradePlan = async () => {
    try {
      setUpgrading(true);

      await axios.post(
        "http://localhost:5000/api/subscription/upgrade",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // reload lesson after upgrade
      loadLesson();

    } catch {
      alert("Upgrade failed");
    } finally {
      setUpgrading(false);
    }
  };

  // Generate assignment
  const generateAssignment = async () => {
    try {
      setGeneratingTask(true);

      const res = await axios.post(
        `http://localhost:5000/api/assignment/generate/${topicId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/ai-tutor/assignment/${res.data._id}`);

    } catch {
      alert("Failed to generate assignment");
    } finally {
      setGeneratingTask(false);
    }
  };

  // ================= LOCK SCREEN =================
  if (locked) {
    return (
      <div className="upgrade-container">
        <h1>🔒 Premium Lesson</h1>
        <p>You’ve reached the free learning limit.</p>
        <p>Upgrade to continue your journey 🚀</p>

        <button onClick={upgradePlan} disabled={upgrading}>
          {upgrading ? "Upgrading..." : "Upgrade to Pro"}
        </button>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading) {
    return <div className="learn-loading">Preparing your lesson... 📚</div>;
  }

  // ================= LESSON =================
  return (
    <div className="learn-container">

      <h1 className="lesson-title">{lesson.title}</h1>

      <div className="lesson-content">
        <ReactMarkdown>{lesson.explanation}</ReactMarkdown>
      </div>

      <div className="lesson-actions">
        <button onClick={generateAssignment} disabled={generatingTask}>
          {generatingTask ? "Creating Task..." : "Take Assignment 📝"}
        </button>
      </div>

    </div>
  );
}
