// // import { useContext, useState } from "react";
// // import axios from "axios";
// // import { AuthContext } from "../../context/AuthContext";
// // import { useNavigate } from "react-router-dom";
// // import "./domain.css";

// // const domains = [
// //   { name: "Web Development", icon: "🌐", color: "#4CAF50" },
// //   { name: "Machine Learning", icon: "🤖", color: "#FF9800" },
// //   { name: "Data Science", icon: "📊", color: "#2196F3" },
// //   { name: "Generative AI", icon: "🧠", color: "#9C27B0" },
// //   { name: "System Design", icon: "🏗️", color: "#795548" },
// //   { name: "DSA", icon: "📚", color: "#F44336" }
// // ];

// // export default function DomainSelection() {
// //   const { token } = useContext(AuthContext);
// //   const [loading, setLoading] = useState(null);
// //   const navigate = useNavigate();

// //   const createCourse = async (domain) => {
// //     try {
// //       setLoading(domain);

// //       const res = await axios.post(
// //         "http://localhost:5000/api/course/create",
// //         { domain },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       navigate(`/ai-tutor/course/${res.data.courseId}`);

// //     } catch (err) {
// //       alert("Failed to create course");
// //       console.error(err);
// //     } finally {
// //       setLoading(null);
// //     }
// //   };

// //   return (
// //     <div className="domain-page">
// //       <h1>Choose Your Learning Path</h1>
// //       <p>Select a domain and start your AI guided journey 🚀</p>

// //       <div className="domain-grid">
// //         {domains.map((d) => (
// //           <div
// //             key={d.name}
// //             className="domain-card"
// //             style={{ borderColor: d.color }}
// //             onClick={() => createCourse(d.name)}
// //           >
// //             <div className="icon">{loading === d.name ? "⏳" : d.icon}</div>
// //             <h3>{d.name}</h3>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// import { useContext, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "./domain.css";

// const domains = [
//   { name: "Web Development", icon: "🌐", color: "#4CAF50" },
//   { name: "Machine Learning", icon: "🤖", color: "#FF9800" },
//   { name: "Data Science", icon: "📊", color: "#2196F3" },
//   { name: "Generative AI", icon: "🧠", color: "#9C27B0" },
//   { name: "System Design", icon: "🏗️", color: "#795548" },
//   { name: "DSA", icon: "📚", color: "#F44336" }
// ];

// export default function DomainSelection() {
//   const { token } = useContext(AuthContext);
//   const [loading, setLoading] = useState(null);
//   const [customDomain, setCustomDomain] = useState("");
//   const navigate = useNavigate();

//   const createCourse = async (domain) => {
//     try {
//       setLoading(domain);

//       const res = await axios.post(
//         "http://localhost:5000/api/course/create",
//         { domain },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       navigate(`/ai-tutor/course/${res.data.courseId}`);
//     } catch (err) {
//       alert("Failed to create course");
//       console.error(err);
//     } finally {
//       setLoading(null);
//     }
//   };

//   return (
//     <div className="domain-page">
//       <h1 className="title">🚀 Choose Your Learning Path</h1>
//       <p className="subtitle">Select a domain and start your AI-guided journey</p>

//       <div className="domain-grid">
//         {domains.map((d) => (
//           <div
//             key={d.name}
//             className="domain-card"
//             style={{ borderColor: d.color }}
//             onClick={() => createCourse(d.name)}
//           >
//             <div className="icon">{loading === d.name ? "⏳" : d.icon}</div>
//             <h3>{d.name}</h3>
//           </div>
//         ))}
//       </div>

//       <div className="custom-domain">
//         <input type="text" placeholder="Enter your own topic..." value={customDomain} onChange={(e) => setCustomDomain(e.target.value)}
//         />
//         <button onClick={() => {
//             if (customDomain.trim()) {
//               createCourse(customDomain.trim());
//             } else {
//               alert("Please enter a topic");
//             }
//           }}
//         >
//           {loading === customDomain ? "⏳ Creating..." : "Create Course"}
//         </button>
//       </div>
//     </div>
//   );
// }


import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./domain.css";

const domains = [
  { name: "Web Development", icon: "🌐", color: "#4CAF50" },
  { name: "Machine Learning", icon: "🤖", color: "#FF9800" },
  { name: "Data Science", icon: "📊", color: "#2196F3" },
  { name: "Generative AI", icon: "🧠", color: "#9C27B0" },
  { name: "System Design", icon: "🏗️", color: "#795548" },
  { name: "DSA", icon: "📚", color: "#F44336" }
];

export default function DomainSelection() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(null);
  const [customDomain, setCustomDomain] = useState("");
  const navigate = useNavigate();

  const createCourse = async (domain) => {
    try {
      setLoading(domain);

      const res = await axios.post(
        "http://localhost:5000/api/course/create",
        { domain },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/ai-tutor/course/${res.data.courseId}`);
    } catch (err) {
      alert("Failed to create course");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="domain-page">
      <h1 className="title">🚀 Choose Your Learning Path</h1>
      <p className="subtitle">Select a domain or enter your own topic</p>

      <div className="domain-grid">
        {domains.map((d) => (
          <div
            key={d.name}
            className="domain-card"
            style={{ borderColor: d.color }}
            onClick={() => createCourse(d.name)}
          >
            <div className="icon">{loading === d.name ? "⏳" : d.icon}</div>
            <h3>{d.name}</h3>
          </div>
        ))}
      </div>

      <div className="custom-domain">
        <input
          type="text"
          placeholder="Enter your own topic..."
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
        />
        <button
          onClick={() => {
            if (customDomain.trim()) {
              createCourse(customDomain.trim());
            } else {
              alert("Please enter a topic");
            }
          }}
        >
          {loading === customDomain ? "⏳ Creating..." : "Create Course"}
        </button>
      </div>
    </div>
  );
}
