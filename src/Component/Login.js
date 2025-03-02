import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("http://localhost:3000/login", formData);
      localStorage.setItem("token", resp.data.token); // Store token
      alert("Login Successful");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Invalid Credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 4, borderRadius: 3, boxShadow: 3, backgroundColor: "white" }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Box textAlign="center">
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#ff6f61", color: "#fff", px: 4 }}>
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
