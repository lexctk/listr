var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require ("mongoose");
var methodOverride = require ("method-override");
var expressSanitizer = require ("express-sanitizer");

var moment = require('moment');
var dateFormat = "dddd, MMMM Do YYYY";

mongoose.connect("mongodb://localhost/listr");
app.use (express.static("public"));
app.use (bodyParser.urlencoded( { extended : true } ));
app.use (methodOverride("_method"));
app.use (expressSanitizer());

app.set("view engine", "ejs");

app.locals.moment = moment;
app.locals.dateFormat = dateFormat;

//ROOT route
app.get("/", function (req, res) {
    res.render("index");
});

//listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log("listr server is listening");
});