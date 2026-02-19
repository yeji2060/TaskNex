import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import TaskCards from "./TaskCards";
import Header from "./Header";
import NewTaskModule from "./NewTaskModule";
import TaskModule from "./TaskModule";
import { useNavigate } from "react-router-dom";
import TaskPieChart from "../helper/pieChart";

const STATUS_CONFIG = {
  Submitted:     { color: "#6366f1", bg: "#eef2ff" },
  "In Progress": { color: "#f59e0b", bg: "#fffbeb" },
  Approved:      { color: "#10b981", bg: "#ecfdf5" },
  Rejected:      { color: "#ef4444", bg: "#fef2f2" },
};

const Dashboard = () => {
  const [isTaskModuleOpen, setTaskModuleOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userFname, setUserFname] = useState(null);
  const [department, setDepartment] = useState(null);
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const userFname = localStorage.getItem("userFname");
    const department = localStorage.getItem("department");

    if (role && userId && userFname && department) {
      setUserRole(role);
      setUserId(userId);
      setUserFname(userFname);
      setDepartment(department);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasksResponse = await fetch(`${apiBaseUrl}/tasks`);
        const allTasksData = await allTasksResponse.json();

        let filteredTasks = allTasksData;
        if (userRole === "Admin") {
          if (department === "HR") {
            filteredTasks = allTasksData.filter((task) => task.taskType === "Event Idea");
          } else if (department === "Account") {
            filteredTasks = allTasksData.filter((task) => task.taskType === "Expense");
          }
        } else if (userRole === "User") {
          filteredTasks = allTasksData.filter((task) => task.submitted_by === userId);
        }

        setTasks(filteredTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId, userRole, department, apiBaseUrl]);

  const statuses = ["Submitted", "In Progress", "Approved", "Rejected"];

  const handleOpenTask = (task) => {
    setTask(task);
    setIsTaskOpen(true);
  };

  const handleCloseTask = () => setIsTaskOpen(false);
  const handleOpenNewTask = () => setTaskModuleOpen(true);
  const handleCloseNewTask = () => setTaskModuleOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${apiBaseUrl}/updateTaskStatus/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        const errorText = await response.text();
        alert(`Failed to update task status: ${errorText}`);
      }
      handleCloseTask();
    } catch (error) {
      alert(`Failed to update task status: ${error.message}`);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/delEvent/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.deletedCount > 0) {
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        }
      } else {
        const errorText = await response.text();
        alert(`Failed to delete task: ${errorText}`);
      }
      handleCloseTask();
    } catch (error) {
      alert(`Failed to delete task: ${error.message}`);
    }
  };

  const totalTasks = tasks.length;
  const approvedTasks = tasks.filter((task) => task.status === "Approved").length;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header
        userFname={userFname}
        userRole={userRole}
        onCreateTask={handleOpenNewTask}
        onLogout={handleLogout}
      />

      <Container maxWidth={false} sx={{ px: { xs: 2, md: 5 }, pt: 4, pb: 6 }}>

        {/* Admin stats banner */}
        {userRole === "Admin" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 3,
              mb: 5,
              p: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              boxShadow: "0 10px 40px rgba(102,126,234,0.3)",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                Total Progress
              </Typography>
              <Typography variant="h2" fontWeight={700} fontFamily="Poppins, sans-serif">
                {totalTasks > 0 ? ((approvedTasks / totalTasks) * 100).toFixed(0) : 0}%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                {approvedTasks} of {totalTasks} tasks completed
              </Typography>
            </Box>
            <Box>
              <TaskPieChart tasks={tasks} />
            </Box>
          </Box>
        )}

        {/* Kanban board */}
        <Grid container spacing={3}>
          {statuses.map((status) => {
            const config = STATUS_CONFIG[status];
            const columnTasks = tasks.filter((t) => t.status === status);
            return (
              <Grid item xs={12} sm={6} lg={3} key={status}>
                <Box
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  {/* Column header */}
                  <Box
                    sx={{
                      px: 2.5,
                      py: 2,
                      borderBottom: `3px solid ${config.color}`,
                      backgroundColor: config.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      fontFamily="Poppins, sans-serif"
                      sx={{ color: config.color }}
                    >
                      {status}
                    </Typography>
                    <Chip
                      label={columnTasks.length}
                      size="small"
                      sx={{
                        backgroundColor: config.color,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        height: 22,
                      }}
                    />
                  </Box>

                  {/* Task cards */}
                  <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {columnTasks.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        textAlign="center"
                        sx={{ py: 4 }}
                      >
                        No tasks
                      </Typography>
                    ) : (
                      columnTasks.map((task, index) => (
                        <Card
                          key={index}
                          onClick={() => handleOpenTask(task)}
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            borderRadius: 2,
                            border: "1px solid #e2e8f0",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                              transform: "translateY(-2px)",
                              borderColor: config.color,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <TaskCards
                              title={task.title}
                              description={task.short_desc}
                              dueDate={task.due_date || task.dueDate}
                              priority={task.priority}
                              taskType={task.taskType}
                              userRole={userRole}
                              submittedByName={task.submitted_by_name}
                              onInProgress={() => updateTaskStatus(task._id, "In Progress")}
                              onApprove={() => updateTaskStatus(task._id, "Approved")}
                              onReject={() => updateTaskStatus(task._id, "Rejected")}
                              onDelete={() => deleteTask(task._id)}
                            />
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>

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
        onInProgress={() => updateTaskStatus(task._id, "In Progress")}
        onApprove={() => updateTaskStatus(task._id, "Approved")}
        onReject={() => updateTaskStatus(task._id, "Rejected")}
        onDelete={() => deleteTask(task._id)}
      />
    </Box>
  );
};

export default Dashboard;
