import React from "react";
import { Typography, Chip, Box } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';
import dayjs from "dayjs";
import { PiMoneyWavy, PiLightbulb } from "react-icons/pi";

const TaskCard = ({ title, description, dueDate, priority, taskType, userRole, submittedByName }) => {
  const formattedDueDate = dayjs(dueDate).format("YYYY-MM-DD");

  const getIcon = () => {
    if (taskType === "Expense") return <PiMoneyWavy size={18} />;
    if (taskType === "Event Idea") return <PiLightbulb size={18} />;
    return null;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
          {getIcon()}
        </Box>
        <Typography variant="subtitle2" fontWeight={700} fontFamily="Poppins, sans-serif" noWrap>
          {title}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.78rem' }} noWrap>
        {description}
      </Typography>

      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
        Due: {formattedDueDate}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip
          label={priority}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 600,
            backgroundColor: priority === 'High' ? '#fef2f2' : '#eff6ff',
            color: priority === 'High' ? '#ef4444' : '#3b82f6',
            border: `1px solid ${priority === 'High' ? '#fecaca' : '#bfdbfe'}`,
          }}
        />

        {userRole === 'Admin' && submittedByName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <PersonOutline sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
              {submittedByName}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TaskCard;
