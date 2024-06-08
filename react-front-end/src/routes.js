// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskModule from './components/TaskModule'; // Add other components as needed

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task/:id" element={<TaskModule />} /> {/* Example of a TaskModule route */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
