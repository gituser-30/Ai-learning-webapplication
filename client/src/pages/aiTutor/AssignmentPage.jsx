import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./assignment.css";

export default function AssignmentPage() {
  const { assignmentId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // load assignment
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setAssignment(res.data))
      .catch(() => alert("Failed to load assignment"));
  }, [assignmentId, token]);

  // submit answer
  const submitAnswer = async () => {
    if (!answer.trim()) return alert("Write something first");

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/assignment/submit/${assignmentId}`,
        { answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data);

    } catch {
      alert("Evaluation failed");
    }

    setLoading(false);
  };

  const continueLearning = () => {
    navigate(-1); // back to roadmap
  };

  if (!assignment) return <div className="assign-loading">Loading task...</div>;

  return (
    <div className="assignment-container">

      <h1>📝 Assignment</h1>

      <div className="question-box">
        {assignment.question}
      </div>

      {!result && (
        <>
          <textarea
            placeholder="Write your solution here... Explain or write code."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button className="submit-btn" onClick={submitAnswer} disabled={loading}>
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </>
      )}

      {result && (
        <div className={`result-box ${result.pass ? "pass" : "fail"}`}>
          <h2>{result.pass ? "✅ Passed!" : "❌ Try Again"}</h2>
          <p><b>Score:</b> {result.score}/100</p>
          <p><b>Feedback:</b></p>
          <div className="feedback">{result.feedback}</div>

          {result.pass && (
            <button className="continue-btn" onClick={continueLearning}>
              Continue Learning →
            </button>
          )}
        </div>
      )}

    </div>
  );
}
