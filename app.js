require('dotenv').config()
const express = require("express");
const path = require("path");
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const db=require("./config/connection")
const session=require('express-session')
const Razorpay = require('razorpay');
// const fileUpload=require('express-fileUpload')

//set in router path
var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
const fileUpload = require('express-fileupload');

const app = express();

// port selection

const PORT=process.env.PORT


app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(fileUpload())
//view engine set up
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout",
    partialsDir: __dirname + "/views/partials",
  })
);

//set to the database connection
db.connect((err)=>{
  if(err) console.log("connection error");
  else  console.log("succesfully created");
})

app.use((req,res,next)=>{
  if (!req.admin) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-3");
  }
  next();
});


// set up the function
app.use(session({secret:'key',resave:false,saveUninitialized:true,cookie:{maxAge:600000}}))

// loading route
app.use('/', userRouter);
app.use('/admin', adminRouter);


//set the port
app.listen(PORT,()=>{
    console.log("server is running");
})