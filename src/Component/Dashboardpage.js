import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import axios from "axios";
const Menu = () => {
  const navigate = useNavigate(); // To navigate between pages

  return (
    <AppBar position="static" sx={{ background: "#a03fb6" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Class Management System
        </Typography>

        <Box>
          <Button color="inherit" onClick={() => navigate("/")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/attendance")}>
            Attendance
          </Button>
          <Button color="inherit" onClick={() => navigate("/report")}>
            Report
          </Button>
          <Button color="inherit" onClick={() => navigate("/leave")}>
            Leave
          </Button>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
const Dashboardpage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:3000");
      setLeaves(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLeaves([]);
    } finally {
      setLoading(false); // Always stop loading
    }
  };


  const handleAction = async (id, action) => {
    try {
      await axios.put(`http://localhost:3000/${id}/${action}`);
      fetchLeaves(); // Refresh data after update
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  return (
    <>
      <Menu />
      <div className="container mt-4">
        <h1>Welcome Faculty</h1>
        <h2 className="mb-4">Leave Requests</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row">
            {leaves.map((leave) => (
              <div className="col-md-4 mb-3" key={leave._id}>
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="card-title">{leave.name}</h5>
                    <h6 className="card-subtitle text-muted">
                      {leave.fromDate} - {leave.toDate}
                    </h6>
                    <p className="card-text">{leave.reason}</p>
                    <div className="mt-3">
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleAction(leave._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleAction(leave._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboardpage;