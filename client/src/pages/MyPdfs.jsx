import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
const MyPdfs = () => {
  const { token } = useContext(AuthContext);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/pdfs/my-pdfs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPdfs(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load PDFs");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <h4 className="text-center mt-5">Loading PDFs...</h4>;
  }

  return (
    <div className="container mt-5">
      
      <h3 className="mb-4">My PDFs</h3>

      {pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <div className="row">
          {pdfs.map((pdf) => (
            <div className="col-md-4 mb-3" key={pdf._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{pdf.title}</h5>
                  <p className="card-text text-muted">
                    Uploaded on {new Date(pdf.createdAt).toLocaleDateString()}
                  </p>

                  {/* View button will be used in next step */}
                  <Link
                    to={`/pdf/${pdf._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View PDF
                  </Link>
                  <Link
                    to={`/pdf/${pdf._id}/chat`}
                    className="btn btn-success btn-sm ms-2"
                  >
                    Ask AI
                  </Link>

                  <button
                    className="btn btn-warning btn-sm mt-2"
                    onClick={() => {
                      axios
                        .post(
                          `http://localhost:5000/api/pdfs/${pdf._id}/extract`,
                          {},
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        )
                        .then(() => alert("Text extracted successfully"))
                        .catch((err) => {
                          console.log(err.response?.data);
                          alert(
                            err.response?.data?.message || "Extract failed",
                          );
                        });
                    }}
                  >
                    Extract Text
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPdfs;
