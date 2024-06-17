import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setrole] = useState("");
  const [userId, setuserId] = useState("");
  const [userFname, setuserFname] = useState("");
  const loginUrl = "https://tasknexauth.onrender.com/api/auth/login";
  const getUserData = "https://tasknexauth.onrender.com/api/auth/userinfo";
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const msg = {
        password,
        email,
      };
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
            headers: {
              "x-access-token": localStorage.getItem("rtk"),
            },
          });
          const data = await res.json();

              
          console.log("data return", data);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("userFname", data.fname);
          localStorage.setItem("department",data.department);

          navigate("/");
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Grid container spacing={3}>
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
            color="primary"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Link href="/register" variant="body2">
            Don't have an account? Register
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
