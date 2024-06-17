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
import { useNavigate } from "react-router-dom";

const Dashboard = ({}) => {
  const [isTaskModuleOpen, setTaskModuleOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userFname, setUserFname] = useState(null);
  const navigate = useNavigate();
  // const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  // const apiPort = process.env.REACT_APP_API_PORT;
  // const editEvent = `${apiBaseUrl}:${apiPort}/editEvent`;
  // const editExpress = `${apiBaseUrl}:${apiPort}/expenseClaim`;
  // const deleteEvent = `${apiBaseUrl}:${apiPort}/delEvent`;
  // const delClaim = `${apiBaseUrl}:${apiPort}/delClaim`;

  

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const userFname = localStorage.getItem("userFname");

    if (role && userId && userFname) {
      setUserRole(role);
      setUserId(userId);
      setUserFname(userFname);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const eventResponse = await fetch(`https://tasknexserver.onrender.com/getEventIdeas?user=${userId}`);
        const claimResponse = await fetch(`https://tasknexserver.onrender.com/getClaims?userClaims=${userId}`);
        
        const eventData = await eventResponse.json();
        const claimData = await claimResponse.json();
        
        // Combine event ideas and claims into a single array
        const combinedTasks = [
          ...eventData.map(event => ({ ...event, type: 'Event Idea' })),
          ...claimData.map(claim => ({ ...claim, type: 'Claim' }))
        ];
        
        setTasks(combinedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const statuses = ["Approved", "In Progress", "Pending", "Completed", "Rejected"];

  const handleOpenTask = (task) => {
    console.log("Task opened:", task);
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
    localStorage.clear();
    navigate("/login");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`https://tasknexserver.onrender.com/editEvent/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
        console.log("Task status updated:", data);
      } else {
        const text = await response.text();
        console.log("Task status updated:", text);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const deleteTask = async (taskId) => {
    console.log("Deleting task:", taskId);
    try {
      const response = await fetch(`https://tasknexserver.onrender.com/delEvent/${taskId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      console.log("Task deleted:", data);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <Container>
      <Header
        userRole={userRole}
        onCreateTask={handleOpenNewTask}
        onLogout={handleLogout}
      />

      {userRole === 'Admin' && (
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
      )}

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
                            dueDate={task.due_date || task.dueDate} // Adjust key if needed
                            priority={task.priority}
                            type={task.type}
                            userRole={userRole}
                            onApprove={() => updateTaskStatus(task._id, 'Approved')}
                            onReject={() => updateTaskStatus(task._id, 'Rejected')}
                            onDelete={() => deleteTask(task._id)}
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
        id={userId}
      />
       <TaskModule
        task={task}
        open={isTaskOpen}
        onClose={handleCloseTask}
        userRole={userRole}
        onApprove={() => updateTaskStatus(task._id, 'Approved')}
        onReject={() => updateTaskStatus(task._id, 'Rejected')}
        onDelete={() => deleteTask(task._id)}
      />
    </Container>
  );
};

export default Dashboard;
