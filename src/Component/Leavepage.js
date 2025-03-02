import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" sx={{ background: "#a03fb6" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Class Management System
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate("/")}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate("/attendance")}>Attendance</Button>
          <Button color="inherit" onClick={() => navigate("/report")}>Report</Button>
          <Button color="inherit" onClick={() => navigate("/leave")}>Leave</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    section: "",
    email: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [leaveStatus, setLeaveStatus] = useState(null); // New State for Leave Status

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("http://localhost:3000/leave", formData);
      console.log(resp);
      alert("Form Submitted Successfully");

      if (resp.data.status) {
        setLeaveStatus(resp.data.status); // Set the received status
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Menu />
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 5,
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            background: "linear-gradient(125deg,rgb(195, 242, 250),rgb(236, 180, 180))",
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 3, color: "black", fontWeight: "bold" }}>
            Leave Request Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Name" name="name" variant="outlined" required value={formData.name} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Year" name="year" variant="outlined" required value={formData.year} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Section" name="section" variant="outlined" required value={formData.section} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" name="email" type="email" variant="outlined" required value={formData.email} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Reason" name="reason" multiline rows={3} variant="outlined" required value={formData.reason} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="From Date" name="fromDate" type="date" InputLabelProps={{ shrink: true }} variant="outlined" required value={formData.fromDate} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="To Date" name="toDate" type="date" InputLabelProps={{ shrink: true }} variant="outlined" required value={formData.toDate} onChange={handleChange} sx={{ backgroundColor: "white", borderRadius: 1 }} />
              </Grid>
            </Grid>

            {/* Leave Status Display */}
            {leaveStatus && (
              <Box textAlign="center" mt={3}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: leaveStatus === "Approved" ? "green" : leaveStatus === "Rejected" ? "red" : "orange" }}>
                  Leave Status: {leaveStatus}
                </Typography>
              </Box>
            )}

            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#ff6f61", color: "#fff", fontWeight: "bold", px: 4, "&:hover": { backgroundColor: "#e6514c" } }}>
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
}
