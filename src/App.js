import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import "./services/fetchInterceptor";
import GlobalLoader from "./components/common/GlobalLoader";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RegisteredUsers from "./pages/admin/RegisteredUsers";
import QuestionManagement from "./pages/admin/QuestionManagement";

// User Pages
import Home from "./pages/user/Home";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import SkillSelection from "./pages/user/SkillSelection";
import SkillIntroduction from "./pages/user/SkillIntroduction";
import Test from "./pages/user/Test";
import TestResult from "./pages/user/TestResult";
import DetailedReview from "./pages/user/DetailedReview";
import SkillManagement from "./pages/admin/SkillManagement";

function App() {
  return (
    <Router>
      <div className="App">
        <GlobalLoader />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/skills" element={<SkillSelection />} />
          <Route path="/skill/:skillName" element={<SkillIntroduction />} />
          <Route path="/test/:skillName" element={<Test />} />
          <Route path="/result/:skillName" element={<TestResult />} />
          <Route path="/review/:skillName" element={<DetailedReview />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<RegisteredUsers />} />
          <Route path="/admin/questions" element={<QuestionManagement />} />
          <Route path="/admin/skills" element={<SkillManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
