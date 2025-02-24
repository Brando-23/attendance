import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


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


const Table = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(dayjs()); // Default to today's date

  // Fetch student list
  useEffect(() => {
    axios.get("http://localhost:3000/attendance")
      .then((res) => {
        setStudents(res.data);
        const initialAttendance = {};
        res.data.forEach((student) => {
          initialAttendance[student.rollNo] = "Absent";
        });
        setAttendance(initialAttendance);
      })
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  // Toggle attendance status
  const handleStatusToggle = (rollNo) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNo]: prev[rollNo] === "Present" ? "Absent" : "Present",
    }));
  };

  // Submit Attendance
  const handleSubmit = () => {
    const attendanceData = students.map((student) => ({
      studentName: student.studentName,
      rollNo: student.rollNo,
      date: date.format("YYYY-MM-DD"),
      status: attendance[student.rollNo],
    }));

    axios.post("http://localhost:3000/attendance", attendanceData)
      .then(() => alert("Attendance Submitted Successfully!"))
      .catch(() => alert("Error submitting attendance"));
  };

  return (
    <div className="container mt-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Attendance Date"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo}>
              <td>{student.studentName}</td>
              <td>{student.rollNo}</td>
              <td>
                <input
                  type="checkbox"
                  checked={attendance[student.rollNo] === "Present"}
                  onChange={() => handleStatusToggle(student.rollNo)}
                />
                {attendance[student.rollNo]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Submit Attendance
      </button>
    </div>
  );
};

const AttendancePage = () => {
  return (
    <>
      <Menu />
      <Table />
    </>
  );
};

export default AttendancePage;
