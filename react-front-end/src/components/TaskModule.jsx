import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  MenuItem,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from 'dayjs';

import "./../TaskModule.css";

const TaskModule = ({task, open, onClose, userRole, onApprove, onReject, onDelete}) => {
  
  const [isEditMode, setIsEditMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [taskType, setTaskType] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [shortDesc, setshortDesc] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const apiPort = process.env.REACT_APP_API_PORT;
  const deleteEvent = `${apiBaseUrl}:${apiPort}/delEvent`;
  const delClaim = `${apiBaseUrl}:${apiPort}/delClaim`;

  console.log('task review', task);


  const handleSave = () => {
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setIsEditMode(false); // Reset edit mode when closing the dialog
    onClose(); // Close the dialog
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Task Details
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
                label="Task"
                select
                variant="outlined"
                value={task.taskType || "-"}
                onChange={(event) => setTaskType(event.target.value)}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
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
                variant="outlined"
                className="lightGreyDefaultValue"
                value={task.title || "-"}
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                select
                variant="outlined"
                value={task.priority}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
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
                value={task.amount || "-"}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datepicker"
                  label="Due Date"
                  name="due_date"
                  disabled={!isEditMode}
                  value={dayjs(task.due_date)}
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
                variant="outlined"
                value={task.short_desc || "-"}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
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
                value={task.details || "-"}
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid
              item
              xs={12}
              container
              spacing={2}
              justifyContent="space-between"
            >
              {isEditMode ? (
                <>
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
                </>
              ) : (
                <>
                  {" "}
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={onDelete}
                    >
                      Delete
                    </Button>
                  </Grid>
                </>
              )}

            </Grid>
            {userRole === 'Admin' && !isEditMode && (
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
                    variant="contained"
                    color="primary"
                    onClick={onApprove}
                  >
                    Approve
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    onClick={onReject}
                  >
                    Reject
                  </Button>
                  </Grid>
              
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModule;