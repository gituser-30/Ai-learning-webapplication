import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PdfViewer = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/pdfs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPdf(res.data))
      .catch(() => alert("Unable to load PDF"));
  }, [id, token]);

  if (!pdf) {
    return <h4 className="text-center mt-5">Loading PDF...</h4>;
  }

  return (
    <div className="container-fluid mt-3">
      <h5 className="mb-3">{pdf.title}</h5>

      <iframe
       src={pdf.fileUrl}
        width="100%"
        height="600px"
        title="PDF Viewer"
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default PdfViewer;
