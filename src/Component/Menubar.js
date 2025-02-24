import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MenuBar() {
  const navigate = useNavigate(); // To navigate between pages

  return (
    <AppBar position="static" sx={{ background: "#ff6f61" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Campus Management
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
