import React, { useState } from "react";
import { Card, CardContent, Typography, Chip } from '@mui/material';



const TaskCard = ({ title, description, dueDate, priority }) => {

  
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
        <Typography variant="subtitle2">Due Date : {dueDate}</Typography>

        <Chip label={priority} color={priority === 'High' ? 'error' : 'primary'} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
};

export default TaskCard;