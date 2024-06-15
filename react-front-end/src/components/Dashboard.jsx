import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import TaskCards from "./TaskCards";
import Header from "./Header";
import NewTaskModule from "./NewTaskModule";
import TaskModule from "./TaskModule";
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ userType }) => {
  const [isTaskModuleOpen, setTaskModuleOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [task, setTask] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      console.log("user:", userData);
      setUser(userData);
    } else {
      navigate("/login"); // Redirect to login if no user data found
    }
  }, [navigate]);

  const tasks = [
    {
      id: 1,
      title: "Task 1",
      description: "Description of Task 1",
      dueDate: "2022-10-20",
      priority: "High",
      status: "Submitted",
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description of Task 2",
      dueDate: "2024-12-30",
      priority: "Low",
      status: "Submitted",
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description of Task 3",
      dueDate: "2022-10-14",
      priority: "High",
      status: "Done",
    },
    {
      id: 4,
      title: "Task 4",
      description: "Description of Task 4",
      dueDate: "2022-10-11",
      priority: "High",
      status: "Declined",
    },
    {
      id: 5,
      title: "Task 5",
      description: "Description of Task 5",
      dueDate: "2022-10-17",
      priority: "Low",
      status: "In Progress",
    },
  ];

  const statuses = ["Submitted", "In Progress", "Done", "Declined"];

  const handleOpenTask = () => {
    setTask(task);
    setIsTaskOpen(true);
  };

  const handleCloseTask = () => {
    setIsTaskOpen(false);
  };

  const handleOpenNewTask = () => {
    setTaskModuleOpen(true);
  };

  const handleCloseNewTask = () => {
    setTaskModuleOpen(false);
  };

  const handleLogout = () => {
    // Logic to handle logout
    localStorage.removeItem("user");
    localStorage.clear();
    console.log("Logout button clicked");
  };

  return (
    <Container>
      <Header
        userType={userType}
        onCreateTask={handleOpenNewTask}
        onLogout={handleLogout}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h6">Total Progress</Typography>
          <Typography variant="h4">70%</Typography>
          <Typography>Tasks completed: 700</Typography>
          <Typography>Total tasks: 1000</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Monthly Progress</Typography>
          <Typography variant="h4">80%</Typography>
          <Typography>Tasks completed: 320</Typography>
          <Typography>Total tasks: 400</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Yearly Progress</Typography>
          <Typography variant="h4">60%</Typography>
          <Typography>Tasks completed: 1920</Typography>
          <Typography>Total tasks: 3200</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {statuses.map((status) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={status}>
            <Box
              sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                {status}
              </Typography>
              <Grid container spacing={3}>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Grid item xs={12} key={index}>
                      <Card onClick={() => handleOpenTask(task)} sx={{ mb: 2 }}>
                        <CardContent>
                          <TaskCards
                            title={task.title}
                            description={task.description}
                            dueDate={task.dueDate}
                            priority={task.priority}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
      <NewTaskModule
        task={{}}
        open={isTaskModuleOpen}
        onClose={handleCloseNewTask}
      />
      <TaskModule task={task} open={isTaskOpen} onClose={handleCloseTask} />
    </Container>
  );
};

export default Dashboard;
