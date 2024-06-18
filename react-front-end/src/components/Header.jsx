import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = ({ userFname, userRole, onCreateTask, onLogout }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <AppBar position="static" sx={{ backgroundColor: '#A7BEAE', boxShadow: 3 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: 'Playwrite IS, serif',
              color: '#fff',
              fontWeight: 'bold',
              
            }}
          >
            Welcome back, {userFname}
          </Typography>
          <Box>
           
              <Button
                variant="contained"
                onClick={onCreateTask}
                sx={{
                  backgroundColor: '#E7E8D1',
                  color: '#fff',
                  mr: 2,
                  '&:hover': {
                    backgroundColor: '#e68900',
                  },
                }}
              >
                Make a new task
              </Button>
          
            <Button
              variant="contained"
              onClick={onLogout}
              sx={{
                backgroundColor: '#f44336',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              Log out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
