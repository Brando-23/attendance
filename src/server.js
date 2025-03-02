// const { useRadioGroup } = require("@mui/material");
const express = require("express");
const mongoose=require("mongoose");
const bodyparser =require("body-parser");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());


//database connection
mongoose.connect("mongodb://127.0.0.1:27017/leaveDB",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("connected")})
.catch((err)=>{console.log(err)});


const leaveschema=new mongoose.Schema({
    name:String,
    year:String,
    section:String,
    email:String,
    reason:String,
    fromDate:String,
    toDate:String,
});

const studentschema=new mongoose.Schema({
  studentName:String,
  rollNo:String
});


const attendanceschema=new mongoose.Schema({
  studentName:String,
  rollNo:String,
  status:{type:String,enum:["Present","Absent"]},
  date:String
});

const User=mongoose.model("User",leaveschema);
const Student=mongoose.model("students",studentschema);
const Attendance=mongoose.model("Attendance",attendanceschema);

//leavepage api
app.post("/leave",async(req,res)=>{
  try{
    const newuser =new User(req.body);
    await newuser.save();
    res.status(201).json(newuser);
  }
  catch(err){
    console.log("error in leave post api")
  }
});

//dashboardpage api
app.get("/",async(req,res)=>{
  try{
    const leaves=await User.find();
    if (leaves.length === 0) {
      return res.send("No leaves found in the database.") ;
    }
    res.status(200).json(leaves);
  }
  catch(err){
    console.log("error in leave get api")
  }
});


//attendancepage api
app.get("/attendance",async(req,res)=>{
  try{

    const students = await Student.find();
    console.log(students);
    res.status(200).json(students);
  }
  catch(err){
    console.log("error in attendance get api");
    res.status(500).json({ error: "Internal Server Error" });

  }
});

app.post("/attendance",async(req,res)=>{
  try{
    const attendance = req.body;
    console.log(attendance);
    await Attendance.insertMany(attendance);
    res.status(201).json({ message: "Attendance submitted successfully!" });
  }
  catch(err){
    console.log("error in attendance post api");
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//reportpage api
app.get("/report",async(req,res)=>{
  try{
    const attendance=await Attendance.find();
    res.status(200).json(attendance);
  }
  catch(err){
    console.log("error in report get api");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/attendance/report", async (req, res) => {
  try {
    const { date } = req.query;
    const records = await Attendance.find({ date });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/attendance/export", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    const records = await Attendance.find({ date }); // Filter by selected date
    if (records.length === 0) {
      return res.status(404).json({ error: "No attendance records found for this date" });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const fileName = `attendance_report_${date}.pdf`;

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // Add Title
    doc.fontSize(16).text(`Attendance Report (${date})`, { align: "center" }).moveDown();

    // Table Header
    doc.fontSize(12).text("Student Name", 50, 100);
    doc.text("Roll No", 200, 100);
    doc.text("Status", 300, 100);
    doc.text("Date", 400, 100);
    doc.moveDown();

    // Table Rows
    records.forEach((record, index) => {
      const y = 120 + index * 20;
      doc.fontSize(10).text(record.studentName, 50, y);
      doc.text(record.rollNo, 200, y);
      doc.text(record.status, 300, y);
      doc.text(record.date, 400, y);
    });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ error: "Server error while exporting PDF" });
  }
});



app.listen(3000,()=>{console.log("server is running")});

