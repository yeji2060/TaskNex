import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  MenuItem,
  Container,
  InputAdornment,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const departments = ["HR", "Account", "IT", "Marketing"];
const roles = ["User", "Admin"];

const postAdminUsers = `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth/register`;
const getUserData = `${process.env.REACT_APP_AUTH_BASE_URL}/api/auth/userinfo`;

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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [peekPassword, setPeekPassword] = useState(false);
  const [peekRePassword, setPeekRePassword] = useState(false);
  const peekPasswordTimeout = useRef(null);
  const peekRePasswordTimeout = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    if (!showPassword) {
      setPeekPassword(true);
      clearTimeout(peekPasswordTimeout.current);
      peekPasswordTimeout.current = setTimeout(() => setPeekPassword(false), 600);
    }
  };

  const handleRePasswordChange = (e) => {
    handleChange(e);
    if (!showRePassword) {
      setPeekRePassword(true);
      clearTimeout(peekRePasswordTimeout.current);
      peekRePasswordTimeout.current = setTimeout(() => setPeekRePassword(false), 600);
    }
  };

  const formatPhone = (digits) => {
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    const formatted = digits.length === 0 ? "" : formatPhone(digits);
    setFormData({ ...formData, phone: formatted });
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com)";
    }
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g. (604)-123-4567)";
    }
    if (formData.password !== formData.rePassword) {
      newErrors.rePassword = "Passwords do not match";
    }
    return newErrors;
  };

  const registerNow = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const Reg = {
        userId: uuidv4(),
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
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
            <PersonAddOutlined sx={{ color: "#fff" }} />
          </Box>

          <Typography variant="h5" fontWeight={700} mb={1} fontFamily="Poppins, sans-serif">
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Join TaskNex to manage your tasks
          </Typography>

          <Grid container spacing={2} width="100%">
            {[
              { name: "fname", label: "First Name" },
              { name: "lname", label: "Last Name" },
              { name: "email", label: "Email" },
            ].map(({ name, label }) => (
              <Grid item xs={12} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  error={!!errors[name]}
                  helperText={errors[name]}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="(###)-###-####"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword || peekPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Re-enter Password"
                type={showRePassword || peekRePassword ? "text" : "password"}
                name="rePassword"
                value={formData.rePassword}
                onChange={handleRePasswordChange}
                error={!!errors.rePassword}
                helperText={errors.rePassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowRePassword(!showRePassword)} edge="end">
                        {showRePassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
                size="large"
                onClick={registerNow}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  borderRadius: 2,
                }}
              >
                Register
              </Button>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Link href="/login" variant="body2" underline="hover">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
