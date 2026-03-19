

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors({
  origin: "*", // later change to frontend domain in production
  credentials: true
}));

app.use(express.json());

/* ---------------- PUBLIC ROUTES (NO LOGIN REQUIRED) ---------------- */

// Auth
app.use("/api/auth", require("./routes/authRoutes"));

// AI Tutor / Learning features
app.use("/api/tutor", require("./routes/tutorRoutes"));
app.use("/api/problems", require("./routes/problemRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/domains", require("./routes/domainRoutes"));

// Test AI (VERY IMPORTANT for debugging)
app.use("/test-ai", require("./routes/testAI"));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* ---------------- AUTH MIDDLEWARE ---------------- */

const verifyUser = require("./middleware/verifyUser");

/* ---------------- PROTECTED ROUTES (LOGIN REQUIRED) ---------------- */

// user profile
app.use("/api/users", verifyUser, require("./routes/userRoutes"));

// code execution
app.use("/api/code", verifyUser, require("./routes/codeRoutes"));

// pdf upload + rag
app.use("/api/pdfs", verifyUser, require("./routes/pdfRoutes"));

// interview agent (we will add soon)
app.use("/api/interview", verifyUser, require("./routes/interviewRoutes"));
app.use("/api/dashboard", require("./routes/user/dashboardRoutes"));

app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/course", require("./routes/learning/courseRoutes"));
app.use("/api/topic", require("./routes/learning/topicRoutes"));

app.use("/api/assignment", require("./routes/learning/assignmentRoutes"));
/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.send("AI Learning Assistant Server Running 🚀");
});


/* ---------------- DATABASE ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.log("Mongo Error:", err));
