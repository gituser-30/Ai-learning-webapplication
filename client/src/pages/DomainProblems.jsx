import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const DomainProblems = () => {
  const { id } = useParams();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/problems/domain/${id}`)
      .then(res => setProblems(res.data));
  }, [id]);

  return (
    <div className="dashboard-bg">
      <div className="container py-5">
        <h3 className="mb-4">Problems</h3>

        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {problems.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.difficulty}</td>
                <td>
                  <Link
                    to={`/problem/${p._id}`}
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

export default DomainProblems;