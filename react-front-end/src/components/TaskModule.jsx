import React, { useState, useEffect } from "react";
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
  Chip,
} from "@mui/material";
import { Close as CloseIcon, AssignmentOutlined } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const STATUS_CONFIG = {
  Submitted:     { color: "#6366f1", bg: "#eef2ff" },
  "In Progress": { color: "#f59e0b", bg: "#fffbeb" },
  Approved:      { color: "#10b981", bg: "#ecfdf5" },
  Rejected:      { color: "#ef4444", bg: "#fef2f2" },
};

const TaskModule = ({ task, open, onClose, userRole, onInProgress, onApprove, onReject, onDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setEditedTask({ ...task });
    setIsEditMode(false);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEditedTask((prev) => ({ ...prev, due_date: date ? date.toISOString() : prev.due_date }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/editTask/${editedTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTask),
      });

      if (response.ok) {
        setIsEditMode(false);
        onClose();
      } else {
        const errorText = await response.text();
        alert(`Failed to update task: ${errorText}`);
      }
    } catch (error) {
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      setEditedTask({ ...task });
      setIsEditMode(false);
    } else {
      onClose();
    }
  };

  const statusConfig = STATUS_CONFIG[editedTask.status] || { color: "#6b7280", bg: "#f3f4f6" };

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
            <AssignmentOutlined sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              fontFamily="Poppins, sans-serif"
              lineHeight={1.2}
            >
              Task Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
              <Typography variant="caption" color="text.secondary">
                {isEditMode ? "Editing task" : "View task info"}
              </Typography>
              {editedTask.status && (
                <Chip
                  label={editedTask.status}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.color}30`,
                  }}
                />
              )}
            </Box>
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
              name="taskType"
              value={editedTask.taskType || ""}
              onChange={handleChange}
              disabled={!isEditMode}
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
              name="title"
              value={editedTask.title || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Priority"
              select
              name="priority"
              value={editedTask.priority || ""}
              onChange={handleChange}
              disabled={!isEditMode}
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
              name="amount"
              type="number"
              value={editedTask.amount || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={editedTask.due_date ? dayjs(editedTask.due_date) : null}
                onChange={handleDateChange}
                disabled={!isEditMode}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Short Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              name="short_desc"
              value={editedTask.short_desc || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              size="small"
            />
          </Grid>

          {/* Details */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details"
              name="details"
              value={editedTask.details || ""}
              onChange={handleChange}
              disabled={!isEditMode}
              multiline
              rows={3}
              size="small"
            />
          </Grid>

          {/* Submitted by */}
          {editedTask.submitted_by_name && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Submitted By"
                value={editedTask.submitted_by_name}
                disabled
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <Divider />

      {/* Footer */}
      <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>

        {/* Admin status actions — top row, full width */}
        {userRole === "Admin" && !isEditMode && (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onInProgress}
              size="small"
              sx={{
                borderColor: "#fcd34d",
                color: "#f59e0b",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#f59e0b", backgroundColor: "#fffbeb" },
              }}
            >
              In Progress
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onApprove}
              size="small"
              sx={{
                borderColor: "#6ee7b7",
                color: "#10b981",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#10b981", backgroundColor: "#ecfdf5" },
              }}
            >
              Approve
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onReject}
              size="small"
              sx={{
                borderColor: "#fca5a5",
                color: "#ef4444",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
              }}
            >
              Reject
            </Button>
          </Box>
        )}

        {/* Primary actions — bottom row */}
        {isEditMode ? (
          /* Edit mode: Cancel + Save */
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
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
              Save Changes
            </Button>
          </Box>
        ) : (
          /* View mode: Delete on left, Close + Edit on right */
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={onDelete}
              sx={{
                borderColor: "#fecaca",
                color: "#ef4444",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
              }}
            >
              Delete
            </Button>
            <Box sx={{ display: "flex", gap: 1.5 }}>
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
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsEditMode(true)}
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
                Edit
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default TaskModule;
