import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = ({ userType, onCreateTask, onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome back, {userType}
        </Typography>
        <Box>
          {/* {userType === 'User' && ( */}
            <Button color="inherit" onClick={onCreateTask} sx={{ mr: 2 }}>
              Make a new task
            </Button>
          {/* )} */}
          <Button color="inherit" onClick={onLogout}>
            Log out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;