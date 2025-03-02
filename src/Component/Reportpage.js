import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import  { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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

const Tables = () => {
  const [date, setDate] = useState(""); // State for selected date
  const [records, setRecords] = useState([]); // State for fetched data

  // Function to fetch report based on selected date
  const fetchReport = async (selectedDate) => {
    if (!selectedDate) return;
    
    try {
      const response = await axios.get(
        `http://localhost:3000/attendance/report?date=${selectedDate}`
      );
      setRecords(response.data); // Update state with API response
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };
  const exportToPDF = async () => {
    if (!date) {
      alert("Please select a date before exporting.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/attendance/export?date=${date}`, {
        responseType: "blob", // Important for file download
      });
  
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_report_${date}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("No records found for the selected date.");
    }
  };
  
  

  return (
    <>
      {/* Date Picker */}
      <div className="mb-3">
        <label htmlFor="dateFilter" className="form-label" style={{fontWeight: "bold"}}>
          Select Date:
        </label>
        <input
          type="date"
          id="dateFilter"
          className="form-control "
          style={{ width: "200px" }}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            fetchReport(e.target.value);
          }}
        />
      </div>

      {/* Attendance Report Table */}
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.rollNo}>
                <td>{record.studentName}</td>
                <td>{record.rollNo}</td>
                <td>
                  <span
                    className={`badge ${
                      record.status === "Present" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td>{record.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Select a date to view report
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="btn btn-primary mb-3" onClick={exportToPDF}>
        Export to CSV
      </button>
    </>
  );
};
function Reportpage () {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios.get("http://localhost:3000/report")
      .then((response) => {
        const processedData = processAttendanceData(response.data);
        setChartData(processedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Process attendance data to count "Present" students per date
  const processAttendanceData = (attendanceRecords) => {
    const countMap = {};

    attendanceRecords.forEach(record => {
      if (record.status === "Present") {
        countMap[record.date] = (countMap[record.date] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(countMap), // Dates
      datasets: [
        {
          label: "Present Students",
          data: Object.values(countMap), // Count of present students per date
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
    <Menu/>
    <div style={{ width: "80%", margin: "auto" }}>
      <h2>Attendance Report</h2>
      <Bar data={chartData} />
    </div>
    <Tables/>
    </>
  );
}

export default Reportpage;