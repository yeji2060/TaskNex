import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  MenuItem,
  Button,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Close as CloseIcon, AddTaskOutlined } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import validateFieldHelper from "./../helper/validateField";

const NewTaskModule = ({ open, onClose, id }) => {
  const userid = id || 1002;
  const userFname = localStorage.getItem("userFname") || "";
  const userLname = localStorage.getItem("userLname") || "";
  const submittedByName = userLname
    ? `${userFname} ${userLname.charAt(0).toUpperCase()}.`
    : userFname;


  const [taskType, setTaskType] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(dayjs());
  const [shortDesc, setshortDesc] = useState("");
  const [details, setDetails] = useState("");

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const newEventTask = `${apiBaseUrl}/insertEvent`;
  const newExpenseTask = `${apiBaseUrl}/expenseClaim`;

  const [taskTypeError, setTaskTypeError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);

  const resetErrorStates = () => {
    setTaskTypeError(false);
    setTitleError(false);
    setPriorityError(false);
  };

  const resetAllFields = () => {
    setTaskType("");
    setTitle("");
    setPriority("");
    setAmount("");
    setDueDate(dayjs());
    setshortDesc("");
    setDetails("");
  };

  const handleCancel = () => {
    resetAllFields();
    resetErrorStates();
    onClose();
  };

  const handleSave = async () => {
    const isTaskTypeValid = validateFieldHelper(taskType, setTaskTypeError);
    const isTitleValid = validateFieldHelper(title, setTitleError);
    const isPriorityValid = validateFieldHelper(priority, setPriorityError);

    if (!isTaskTypeValid || !isTitleValid || !isPriorityValid) return;

    const newTask = {
      taskType,
      title,
      priority,
      amount,
      due_date: dueDate,
      short_desc: shortDesc,
      details,
      userId: userid,
      submitted_by: userid,
      submitted_by_name: submittedByName,
      status: "Submitted",
    };

    const apiEndpoint =
      newTask.taskType === "Event Idea"
        ? newEventTask
        : newTask.taskType === "Expense"
        ? newExpenseTask
        : null;

    if (!apiEndpoint) {
      console.error("Invalid task type");
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      console.log("Response:", data);
      alert("New task created successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create a new task");
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddTaskOutlined sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              fontFamily="Poppins, sans-serif"
              lineHeight={1.2}
            >
              New Task
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fill in the details below
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleCancel} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>

          {/* Task Type */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Type"
              select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              error={taskTypeError}
              helperText={taskTypeError ? "Task type is required" : ""}
              size="small"
            >
              <MenuItem value="Event Idea">Event Idea</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
          </Grid>

          {/* Title + Priority */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={titleError}
              helperText={titleError ? "Title is required" : ""}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Priority"
              select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              error={priorityError}
              helperText={priorityError ? "Required" : ""}
              size="small"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Grid>

          {/* Amount + Due Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount ($)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(date) => setDueDate(date)}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Short Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              value={shortDesc}
              onChange={(e) => setshortDesc(e.target.value)}
              size="small"
            />
          </Grid>

          {/* Details */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              multiline
              rows={3}
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      {/* Footer buttons */}
      <Box sx={{ px: 3, py: 2, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderColor: "#e2e8f0",
            color: "#6b7280",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { boxShadow: "0 4px 12px rgba(102,126,234,0.4)" },
          }}
        >
          Create Task
        </Button>
      </Box>
    </Dialog>
  );
};

export default NewTaskModule;
