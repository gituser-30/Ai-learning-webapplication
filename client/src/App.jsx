import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import UploadPdf from "./pages/Uploadpdf";
import MyPdfs from "./pages/MyPdfs";
import PdfViewer from "./pages/PdfViewer";
import PdfChat from "./pages/PdfChat";
import PdfWorkspace from "./pages/PdfWorkspace";
import AiTutor from "./pages/AiTutor";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Domains from "./pages/Domains";
import DomainProblems from "./pages/DomainProblems";
import SolveProblem from "./pages/SolveProblem";
import Interview from "./pages/Interview";
import DomainSelection from "./pages/aiTutor/DomainSelection";
import CourseRoadmap from "./pages/aiTutor/CourseRoadmap";
import LearnTopic from "./pages/aiTutor/LearnTopic";
import AssignmentPage from "./pages/aiTutor/AssignmentPage";
const App = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/ai-tutor"
            element={
              <ProtectedRoute>
                <AiTutor />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/pdf/:id/workspace"
            element={
              <ProtectedRoute>
                <PdfWorkspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPdf />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-pdfs"
            element={
              <ProtectedRoute>
                <MyPdfs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pdf/:id"
            element={
              <ProtectedRoute>
                <PdfViewer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pdf/:id/chat"
            element={
              <ProtectedRoute>
                <PdfChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdfs"
            element={
              <ProtectedRoute>
                <PdfWorkspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/domains"
            element={
              <ProtectedRoute>
                <Domains />
              </ProtectedRoute>
            }
          />
          <Route
            path="/domain/:id"
            element={
              <ProtectedRoute>
                <DomainProblems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problem/:id"
            element={
              <ProtectedRoute>
                <SolveProblem />
              </ProtectedRoute>
            }
          />

          <Route path="/ai-tutor" element={<DomainSelection />} />
          <Route
            path="/ai-tutor/course/:courseId"
            element={<CourseRoadmap />}
          />
          <Route path="/ai-tutor/topic/:topicId" element={<LearnTopic />} />
          <Route
            path="/ai-tutor/assignment/:assignmentId"
            element={<AssignmentPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
