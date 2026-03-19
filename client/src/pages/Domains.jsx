import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Domains = () => {
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/domains")
      .then(res => setDomains(res.data));
  }, []);

  return (
    <div className="dashboard-bg">
      <div className="container py-5">
        <h2 className="mb-4">Choose Your Learning Path</h2>

        <div className="row g-4">
          {domains.map(domain => (
            <div className="col-md-4" key={domain._id}>
              <Link
                to={`/domain/${domain._id}`}
                className="text-decoration-none"
              >
                <div className="card shadow-soft p-4 h-100 domain-card">
                  <h4>{domain.name}</h4>
                  <p className="text-muted">{domain.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Domains;
