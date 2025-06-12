import { FC } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";

const AppRouter: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
