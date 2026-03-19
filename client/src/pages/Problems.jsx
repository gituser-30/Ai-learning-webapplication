import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data));
  }, []);

  return (
    <div className="dashboard-bg">
      <div className="container py-4">
        <h3 className="mb-4">🧩 Coding Problems</h3>

        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Topic</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.difficulty}</td>
                <td>{p.topic}</td>
                <td>
                  <Link
                    to={`/problems/${p._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Solve
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;
