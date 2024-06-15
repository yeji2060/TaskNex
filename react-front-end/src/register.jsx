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
  };

  const registerNow = async () => {
    try {
      const Reg = {
        userId: uuidv4(),
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        password: formData.password,
        phone: formData.userphone,
        department: formData.department,
        role: formData.role,
      };

      const response = await fetch(postAdminUsers, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(Reg),
      });

      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
    navigate("/login");
  };

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
