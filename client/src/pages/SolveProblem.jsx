
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { AuthContext } from "../context/AuthContext";

const SolveProblem = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Write your code here");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [customInput, setCustomInput] = useState("");

  // Fetch problem
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/problems/${id}`)
      .then((res) => setProblem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // RUN CODE
  const runCode = async () => {
    setVerdict("");
    setOutput("Running...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/code/run",
        {
          language,
          code,
          input: customInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOutput(res.data.output || "No output");
    } catch (err) {
      console.error("RUN ERROR:", err.response?.data || err.message);
      setOutput("Error executing code");
    }
  };

  // SUBMIT CODE
  const submitCode = async () => {
    setVerdict("Judging...");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/code/submit/${id}`,
        { language, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVerdict(res.data.verdict);
    } catch (err) {
      console.error("SUBMIT ERROR:", err.response?.data || err.message);
      setVerdict("Submission failed");
    }
  };

  if (!problem) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="dashboard-bg">
      <div className="container-fluid py-4">
        <div className="row">

          {/* LEFT — Problem */}
          <div className="col-md-5">
            <div className="card p-4 shadow-soft h-100">
              <h4>{problem.title}</h4>
              <span className="badge bg-success mb-3">
                {problem.difficulty}
              </span>

              <p>{problem.description}</p>

              <h6>Example:</h6>
              <pre>
Input:
{problem.testCases?.[0]?.input}

Output:
{problem.testCases?.[0]?.output}
              </pre>
            </div>
          </div>

          {/* RIGHT — Editor */}
          <div className="col-md-7">

            {/* Language Select */}
            <select
              className="form-select w-auto mb-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
            </select>

            {/* Code Editor */}
            <Editor
              height="420px"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
            />

            {/* Custom Input */}
            <div className="card mt-3 p-3">
              <h6>Custom Input</h6>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter input exactly like problem format"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="mt-3 d-flex gap-3">
              <button className="btn btn-outline-primary" onClick={runCode}>
                ▶ Run
              </button>
              <button className="btn btn-success" onClick={submitCode}>
                🚀 Submit
              </button>
            </div>

            {/* Output */}
            <div className="card mt-4 p-3">
              <h6>Output</h6>
              <pre style={{ minHeight: "80px" }}>
                {output || "Run your code to see output..."}
              </pre>
            </div>

            {/* Verdict */}
            {verdict && (
              <div className="alert alert-info mt-3 text-center">
                {verdict}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblem;
