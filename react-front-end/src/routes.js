// src/routes.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginPage from "./login";
import NewLoginPage from "./UserLogin";
import RegisterPage from "./register";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task/:id" />
        <Route path="/login" element={<NewLoginPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route
          path="/task/:id"
          element={<TaskModule open={true} onClose={() => false}/>}
        />  */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;

