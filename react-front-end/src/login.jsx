import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setrole] = useState("");
  const [userId, setuserId] = useState("");
  const [userFname, setuserFname] = useState("");
  const loginUrl = `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth/login`;
  const getUserData = `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth/userinfo`;
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const msg = { password, email };
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(msg),
      });

      const data = await res.json();
      console.log(data.auth, data.auth);
      if (data.auth === false) {
        alert(data.token);
      } else {
        console.log("data.token", data.token);
        localStorage.setItem("rtk", data.token);
        setTimeout(async () => {
          const res = await fetch(getUserData, {
            method: "GET",
            headers: { "x-access-token": localStorage.getItem("rtk") },
          });
          const data = await res.json();
          console.log("data return", data);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("userFname", data.fname);
          localStorage.setItem("userLname", data.lname);
          localStorage.setItem("department", data.department);
          navigate("/");
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockOutlined sx={{ color: "#fff" }} />
          </Box>

          <Typography variant="h5" fontWeight={700} mb={1} fontFamily="Poppins, sans-serif">
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your TaskNex account
          </Typography>

          <Grid container spacing={2} width="100%">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  borderRadius: 2,
                }}
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Link href="/register" variant="body2" underline="hover">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
