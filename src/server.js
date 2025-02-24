const express = require("express");
const mongoose=require("mongoose");
const app = express();
app.use(express.json());


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

const User=mongoose.model("User",leaveschema);
const Student=mongoose.model("Student",studentschema);

//for leavepage
app.post("/leave",async(req,res)=>{
  try{
    const newuser =new User(req.body);
    await newuser.save();
    res.status(201).json(newuser);
  }
  catch(err){
    res.status(400).json(err);
  }
});

app.get("/attendance",async(req,res)=>{
  try{

    const student=await Student.find();
    if (student.length === 0) {
      return res.send("No students found in the database.") ;
    }
    res.send(student);
  }
  catch(err){
    res.status(400).json(err);
  }
});


app.listen(3000,()=>{console.log("server is running")});

