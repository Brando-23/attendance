import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const Menu=()=>{
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
function Dashboardpage() {
  return (
    <>
    <Menu/>
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <h3 className="card-text">Welcome,Studentname</h3>
            <p className="card-text">Attendance 90%</p>
            <p className="card-text">pending</p>

          </div>

        </div>

      </div>
    </div>
    </>
  )
}

export default Dashboardpage