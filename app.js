require('dotenv').config()
const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("express-handlebars");

//set in router path
var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");

const app = express();

//view engine set up
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// app.engine(
//   "hbs",
//   hbs.engine({
//     extname: ".hbs",
//     defaultLayout: "layout",
//     layoutsDir: __dirname + "/views/layout",
//     partialsDir: __dirname + "/views/partials",
//   })
// );


app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname,'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);
