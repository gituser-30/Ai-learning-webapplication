import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PdfChat = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (e) => {
    e.preventDefault();
    if (!question) return;

    setMessages([...messages, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          pdfId: id,
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
      setQuestion("");
    } catch {
      alert("AI failed to respond");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100 p-3">
      <h5 className="mb-3">Ask AI</h5>

      {/* Messages */}
      <div className="flex-grow-1 mb-3" style={{ overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 d-flex ${
              msg.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`chat-bubble ${
                msg.role === "user" ? "user" : "assistant"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && <div className="text-muted small">AI is thinking...</div>}
      </div>

      {/* Input */}
      <form onSubmit={askQuestion} className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Ask something from this PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default PdfChat;
