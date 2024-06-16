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

const NewTaskModule = ({ open, onClose, id}) => {
  const userid = id|| 1002;
  const [dueDate, setDueDate] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [taskType, setTaskType] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [amount, setAmount] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [details, setDetails] = useState("");
  const [api, setApi] = useState("");
  const port = process.env.PORT || 8888;
  // const newEventTask = "https://tasknexserver.onrender.com/insertEvent";
  // const newExpenseTask = "https://tasknexserver.onrender.com/expenseClaim";
  const newEventTask = "http://localhost:8888/insertEvent";
  const newExpenseTask = "http://localhost:8888/expenseClaim";

  const [formData, setFormData] = useState({
    taskType: "", // need to remove before push it to the server
    title: "",
    priority: "",
    amount: 0,
    due_date: "",
    short_desc: "",
    details: "",
    submitted_by: userid,
    submitted_at:"",
    status:"",
    image_urls: "",
    last_updated: "",
    userId: userid,
    comments:""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("new task data", formData);
  };

  const handleDateChange = (date) => {
    console.log("handle");
    const d = new Date(date).toLocaleDateString("fr-FR");
    const dateString = d.toString();
    console.log("dateString", dateString);
    setFormData({ ...formData, due_date: dateString });
    console.log("typeof", typeof dateString);
    console.log("check date", formData.due_date);
  };

  const handleSave = async () => {
    const newTask = {
      taskType: formData.taskType,
      title: formData.title,
      priority: formData.priority,
      amount: formData.amount,
      due_date: formData.due_date,
      short_desc: formData.short_desc,
      details: formData.details,
      userId: userid,
      submitted_by: userid,
      status: "Pending",
      /**
      submitted_at: "",
      status: "Submitted",
      image_urls: "",
      last_updated: "",
      comments:"" */
    };

    console.log("new task type", newTask.taskType);
    if (newTask.taskType === "Event Idea") {
      console.log("this is event");
      setApi(newEventTask);
    } else if (newTask.taskType === "Expense") {
      console.log("this is expense")
      setApi(newExpenseTask);
    } else {
      alert("Please select a task type");
      return;
    }

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      console.log("Response:", data);
      alert("New task created successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create a new task");
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                defaultValue="-"
                onChange={handleChange}
              >
                <MenuItem value="-">-</MenuItem>
                <MenuItem value="Event Idea">Event Idea</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                variant="outlined"
                className="lightGreyDefaultValue"
                defaultValue=""
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                select
                variant="outlined"
                className="lightGreyDefaultValue"
                onChange={handleChange}
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
                variant="outlined"
                type="number"
                defaultValue=""
                className="lightGreyDefaultValue"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datepicker"
                  label="Due Date"
                  name="due_date"
                  value={dueDate}
                  onChange={(date) => {
                    handleDateChange(date);
                    
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      className="lightGreyDefaultValue"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                name="short_desc"
                variant="outlined"
                className="lightGreyDefaultValue"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                name="details"
                variant="outlined"
                multiline
                rows={4}
                className="lightGreyDefaultValue"
                onChange={handleChange}
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
