import { useState, useContext,useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import "./AiTutor.css"

const AiTutor = () => {
  const { token } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [chats, setChats] = useState([]);
const [activeChat, setActiveChat] = useState(null);
const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tutor/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChatList(res.data));
  }, []);

  useEffect(() => {
  axios
    .get("http://localhost:5000/api/tutor/my-chats", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setChats(res.data));
}, []);

const loadChat = async (chatId) => {
  const res = await axios.get(
    `http://localhost:5000/api/tutor/chat/${chatId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  setMessages(res.data);
  setActiveChat(chatId);
};

const newChat = () => {
  setMessages([
    { role: "assistant", content: "Hi! 👋 What would you like to learn today?" }
  ]);
  setActiveChat(null);
};


  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 What would you like to learn today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  

  const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessages = [...messages, { role: "user", content: input }];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/tutor/chat",
      {
        message: input,
        history: newMessages,
        chatId: activeChat,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages([
      ...newMessages,
      { role: "assistant", content: res.data.reply },
    ]);

    setActiveChat(res.data.chatId);

  } catch {
    alert("Tutor error");
  }

  setLoading(false);
};


  const openChat = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/tutor/chat/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages(res.data);
    setChatId(id);
  };

  return (
  <div className="tutor-layout">

    {/* ===== MOBILE TOP BAR ===== */}
    <div className="mobile-topbar d-md-none">
      <button className="menu-btn" onClick={() => setShowHistory(true)}>☰</button>
      <span className="title">AI Learning Assistant</span>
    </div>

    {/* ===== MOBILE HISTORY DRAWER ===== */}
    <div className={`history-drawer ${showHistory ? "open" : ""}`}>
      <div className="history-header">
        <b>📚 Learning History</b>
        <button onClick={() => setShowHistory(false)}>✕</button>
      </div>

      <div className="history-list">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`history-item ${activeChat === chat._id ? "active" : ""}`}
            onClick={() => {
              loadChat(chat._id);
              setShowHistory(false);
            }}
          >
            <div>{chat.title}</div>
            <small>{new Date(chat.updatedAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <button className="new-chat-btn" onClick={newChat}>
        ➕ New Learning Session
      </button>
    </div>


    <div className="container-fluid">
      <div className="row">

        {/* ===== DESKTOP SIDEBAR ===== */}
        <div className="col-md-3 d-none d-md-block">
          <div className="card h-100 shadow-soft d-flex flex-column">
            <div className="card-header fw-bold">📚 Learning History</div>

            <div className="list-group list-group-flush overflow-auto flex-grow-1">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  className={`list-group-item list-group-item-action ${activeChat === chat._id ? "active" : ""}`}
                  onClick={() => loadChat(chat._id)}
                >
                  {chat.title}
                  <div className="small text-muted">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-top">
              <button className="btn btn-outline-primary w-100" onClick={newChat}>
                ➕ New Learning Session
              </button>
            </div>
          </div>
        </div>

        {/* ===== CHAT AREA ===== */}
        <div className="col-md-9 col-12 chat-area">

          {/* Messages */}
          <div className="messages-area">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="bubble">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div className="thinking">Tutor is thinking...</div>}
            
          </div>

          {/* Input */}
          <div className="chat-input-area">
            {/* <button onClick={() => setInput("Create a 7-day learning plan for this topic")}>📅</button>
            <button onClick={() => setInput("Give me quiz questions for practice")}>🧠</button> */}

            <input
              placeholder="Ask anything you want to learn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button className="send" onClick={sendMessage}>Send</button>
          </div>

        </div>
      </div>
    </div>
  </div>
);

};

export default AiTutor;
