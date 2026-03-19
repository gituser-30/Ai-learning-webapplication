import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PdfWorkspace = () => {
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch PDFs
  const fetchPdfs = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/pdfs/my-pdfs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPdfs(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load PDFs");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPdfs();
  }, [token]);

  // 🔹 Upload PDF
  const uploadPdf = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", file);

    try {
      await axios.post(
        "http://localhost:5000/api/pdfs/upload",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("PDF Uploaded Successfully");
      setTitle("");
      setFile(null);
      fetchPdfs(); // 🔄 Refresh list
    } catch {
      alert("Upload failed");
    }
  };

  // 🔹 Extract text
  const extractText = (id) => {
    axios
      .post(
        `http://localhost:5000/api/pdfs/${id}/extract`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("Text extracted successfully"))
      .catch((err) =>
        alert(err.response?.data?.message || "Extract failed")
      );
  };

  return (
    <div className="dashboard-bg">
      <div className="container py-4">

        {/* ===== UPLOAD SECTION ===== */}
        <div className="card shadow-soft p-4 mb-4">
          <h4 className="mb-3">📤 Upload PDF</h4>

          <form onSubmit={uploadPdf} className="row g-3">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="PDF Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-md-5">
              <input
                type="file"
                accept="application/pdf"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <div className="col-md-2">
              <button className="btn btn-primary w-100">
                Upload
              </button>
            </div>
          </form>
        </div>

        {/* ===== PDF LIST ===== */}
        <h4 className="mb-3">📚 My PDFs</h4>

        {loading ? (
          <p>Loading PDFs...</p>
        ) : pdfs.length === 0 ? (
          <p>No PDFs uploaded yet.</p>
        ) : (
          <div className="row g-3">
            {pdfs.map((pdf) => (
              <div className="col-md-4" key={pdf._id}>
                <div className="card shadow-soft h-100 p-3">
                  <h5>{pdf.title}</h5>
                  <p className="text-muted small">
                    Uploaded on{" "}
                    {new Date(pdf.createdAt).toLocaleDateString()}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    <Link
                      to={`/pdf/${pdf._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </Link>

                    <Link
                      to={`/pdf/${pdf._id}/chat`}
                      className="btn btn-success btn-sm"
                    >
                      Ask AI
                    </Link>

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => extractText(pdf._id)}
                    >
                      Extract
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PdfWorkspace;
