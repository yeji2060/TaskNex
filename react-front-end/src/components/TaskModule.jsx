import React, { useState } from "react";
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

import "./../TaskModule.css";

const TaskModule = ({ task, open, onClose }) => {
  const [dueDate, setDueDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const handleSave = () => {
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {};

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
                className="lightGreyDefaultValue"
                defaultValue={task.taskType || "-"}
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
                defaultValue="Title"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                select
                variant="outlined"
                value="High"
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
                variant="outlined"
                type="number"
                defaultValue="138"
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datepicker"
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  inputFormat="MM/DD/YYYY"
                  disabled={!isEditMode}
                  InputProps={{
                    readOnly: !isEditMode,
                  }}
                  renderInput={(params) => (
                    <TextField {...params} className="lightGreyDefaultValue" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                variant="outlined"
                defaultValue="less than 10 words"
                className="lightGreyDefaultValue"
                disabled={!isEditMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                variant="outlined"
                multiline
                rows={4}
                defaultValue="Type the details"
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
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModule;