import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UploadPdf = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const uploadPdf = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", file);

    try {
      await axios.post(
        "http://localhost:5000/api/pdfs/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("PDF Uploaded Successfully");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <div className="card p-4 shadow">
        <h3>Upload PDF</h3>

        <form onSubmit={uploadPdf}>
          <input
            className="form-control mb-3"
            placeholder="PDF Title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            accept="application/pdf"
            className="form-control mb-3"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn btn-primary">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPdf;
