import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  MenuItem,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


const departments = ["HR", "Account", "IT", "Marketing"];
const roles = ["User", "Admin"];

const postAdminUsers = "https://tasknexauth.onrender.com/api/auth/register";
const getUserData = "https://tasknexauth.onrender.com/api/auth/userinfo";

const RegisterPage = () => {
  const [role, setrole] = useState('');
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
    department: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formData", formData);
    console.log("formData.role", formData.role);
  };

  const registerNow = async () => {
    try {

      const tempReg = JSON.stringify(formData);

      const Reg = {
        userId: uuidv4(),
        fname: tempReg.fname,
        lname: tempReg.lname,
        email: tempReg.email,
        password: tempReg.password,
        phone: tempReg.userphone,
        department: tempReg.department,
        role: tempReg.role,
      };



      const response = await fetch('/api/auth/register', {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(Reg),
      });

      const data = await response.json();

      console.log("response", response);
      console.log("data", data);

      if (data.auth === false) {
        alert(data.token);
      } else {
        // localStorage.setItem("rtk", data.token);
        setTimeout(async () => {
          const res = await fetch(getUserData, {
            method: "GET",
            // headers: {
            //   "x-access-token": localStorage.getItem("rtk"),
            // },
          });
          const data = await res.json();
          localStorage.setItem("userdata", data.name);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("userId", data.userId);
          setrole(data.role);
          if (data.role === "Admin") {
            // history.push('/');
          } else if (data.role === "User") {
            // history.push('/task/:id');
          }
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Replace with your register API call
  //   const response = await fetch('/register', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(formData),
  //   });
  //   const data = await response.json();

  //   if (response.ok) {
  //     localStorage.setItem('user', JSON.stringify(data));
  //     navigate('/dashboard');
  //   } else {
  //     alert('Registration failed');
  //   }
  // };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <Grid container spacing={3}>
        {["fname", "lname", "email", "password", "rePassword", "phone"].map(
          (field) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                label={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace("rePassword", "Re-enter Password")
                }
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </Grid>
          )
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={registerNow}
          >
            Register
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Link href="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;
