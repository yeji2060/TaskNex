import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  MenuItem,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./../TaskModule.css";
import validateFieldHelper from "./../helper/validateField";

const NewTaskModule = ({ open, onClose, id }) => {
  const userid = id || 1002;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [taskType, setTaskType] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [shortDesc, setshortDesc] = useState("");
  const [details, setDetails] = useState("");
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const apiPort = process.env.REACT_APP_API_PORT;
  const newEventTask = `${apiBaseUrl}:${apiPort}/insertEvent`;
  const newExpenseTask = `${apiBaseUrl}:${apiPort}/expenseClaim`;
  // Error state for each field
  const [taskTypeError, setTaskTypeError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);

  const resetErrorStates = () => {
    setTaskTypeError(false);
    setTitleError(false);
    setPriorityError(false);
    // Add other error states if needed
  };

  const resetAllFields = () => {
    setTaskType("");
    setTitle("");
    setPriority("");
    setAmount("");
    setDueDate(new Date());
    setshortDesc("");
    setDetails("");
    // Add other fields if needed
  };

  const handleCancel = () => {
    // Reset all fields
    resetAllFields();
    // Reset error states
    resetErrorStates();
    onClose();
  };

  const handleSave = async () => {

    const isTaskTypeValid = validateFieldHelper(taskType, setTaskTypeError);
    const isTitleValid = validateFieldHelper(title, setTitleError);
    const isPriorityValid = validateFieldHelper(priority, setPriorityError);

      // Proceed only if all validations pass
  if (!isTaskTypeValid || !isTitleValid || !isPriorityValid) {
    return;
  }

    const newTask = {
      taskType: taskType,
      title: title,
      priority: priority,
      amount: amount,
      due_date: dueDate,
      short_desc: shortDesc,
      details: details,
      userId: userid,
      submitted_by: userid,
      status: "Submitted",
     
    };

    let apiEndpoint; // Variable to hold the API endpoint

  
    // Determine the API endpoint based on task type
    if (newTask.taskType === "Event Idea") {
      apiEndpoint = newEventTask;
    } else if (newTask.taskType === "Expense") {
      apiEndpoint = newExpenseTask;
    } else {
      console.error("Invalid task type");
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        Make a new Task{" "}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box p={isMobile ? 1 : 2} m={isMobile ? 1 : 2}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="taskType"
                name="taskType"
                select
                variant="outlined"
                className="lightGreyDefaultValue"
                value={taskType}
                onChange={(event) => setTaskType(event.target.value)}
                error={taskTypeError}
                helperText={taskTypeError ? "Task Type is required" : ""}
              >
                <MenuItem value="Event Idea">Event Idea</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={title}
                variant="outlined"
                className="lightGreyDefaultValue"
                onChange={(event) => setTitle(event.target.value)}
                error={titleError}
                helperText={titleError ? "Title is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                value={priority}
                select
                variant="outlined"
                className="lightGreyDefaultValue"
                onChange={(event) => setPriority(event.target.value)}
                error={priorityError}
                helperText={priorityError ? "Priority is required" : ""}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={amount}
                variant="outlined"
                type="number"
                className="lightGreyDefaultValue"
                onChange={(event) => setAmount(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datepicker"
                  label="Due Date"
                  name="due_date"
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      className: "lightGreyDefaultValue",
                    },
                  }}
                  // )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                name="short_desc"
                value={shortDesc}
                variant="outlined"
                className="lightGreyDefaultValue"
                onChange={(event) => setshortDesc(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                name="details"
                value={details}
                variant="outlined"
                multiline
                rows={4}
                className="lightGreyDefaultValue"
                onChange={(event) => setDetails(event.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              container
              spacing={2}
              justifyContent="space-between"
            >
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModule;
