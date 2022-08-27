require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("express-handlebars");
const db=require("./config/connection")

//set in router path
var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");

const app = express();

// port selection

const PORT=process.env.PORT


app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname,'public')));

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

// loading route
app.use('/', userRouter);
app.use('/admin', adminRouter);


//set the port
app.listen(PORT,()=>{
    console.log("server is running");
})