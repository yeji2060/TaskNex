// src/routes.js

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TaskModule from "./components/TaskModule";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/task/:id"
        /> 
        {/* <Route
          path="/task/:id"
          element={<TaskModule open={true} onClose={() => false}/>}
        />  */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
