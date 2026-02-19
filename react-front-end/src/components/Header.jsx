import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip, Divider } from '@mui/material';
import { TaskAlt, AddCircleOutline, LogoutOutlined } from '@mui/icons-material';

const Header = ({ userFname, userRole, onCreateTask, onLogout }) => {
  const initials = userFname ? userFname.charAt(0).toUpperCase() : '?';

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 5 }, py: 1, minHeight: 64 }}>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TaskAlt sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight={800}
            fontFamily="Poppins, sans-serif"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            TaskNex
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mr: 3, borderColor: '#e2e8f0' }} />

        {/* Role badge */}
        <Chip
          label={userRole}
          size="small"
          sx={{
            backgroundColor: userRole === 'Admin' ? '#eef2ff' : '#ecfdf5',
            color: userRole === 'Admin' ? '#6366f1' : '#10b981',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: `1px solid ${userRole === 'Admin' ? '#c7d2fe' : '#a7f3d0'}`,
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* New task button */}
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={onCreateTask}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
            borderRadius: 2,
            px: 2.5,
            mr: 2,
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
            },
          }}
        >
          New Task
        </Button>

        {/* User avatar + name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 2 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Typography
            variant="body2"
            fontWeight={600}
            fontFamily="Poppins, sans-serif"
            sx={{ color: '#374151', display: { xs: 'none', sm: 'block' } }}
          >
            {userFname}
          </Typography>
        </Box>

        {/* Logout */}
        <Button
          variant="outlined"
          startIcon={<LogoutOutlined />}
          onClick={onLogout}
          sx={{
            color: '#6b7280',
            borderColor: '#e2e8f0',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#fef2f2',
              borderColor: '#ef4444',
              color: '#ef4444',
            },
          }}
        >
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
