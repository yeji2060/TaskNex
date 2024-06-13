import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from "@mui/material";
 /** import { useNavigate } from "react-router-dom"; */
import NewTaskModule from "./NewTaskModule";
import TaskModule from "./TaskModule";

const Dashboard = ({ tasks }) => {
  /**  const navigate = useNavigate();*/

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [task, setTask] = useState({});

  const handleOpenTask = () => {
    setTask(task);
    setIsTaskOpen(true);
  };

  const handleCloseTask = () => {
    setIsTaskOpen(false);
  };

  /** const handleSelectTask = (task) => {
    navigate(`/task/${task.id}`);
  }; */

  const handleOpenNewTask = () => {
    setIsNewTaskOpen(true);
  };

  const handleCloseNewTask = () => {
    setIsNewTaskOpen(false);
  };

  const sampleTasks = [
    { id: 1, title: "Task 1", description: "Description of Task 1", dueDate: "2022-12-31", status: "In Progress", priority: "High"},
    { id: 2, title: "Task 2", description: "Description of Task 2" },
    // Add more sample tasks here or fetch from a server
  ];

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenNewTask}
        style={{ marginBottom: "16px" }}
      >
        New Task
      </Button>
      <Grid container spacing={2}>
        {sampleTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card onClick={() => handleOpenTask(task)}>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{task.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <NewTaskModule open={isNewTaskOpen} onClose={handleCloseNewTask} />
      <TaskModule task={task} open={isTaskOpen} onClose={handleCloseTask} />
    </Container>
  );
};

export default Dashboard;
