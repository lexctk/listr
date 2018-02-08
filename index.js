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

//mongoose model config, todo list
var todoSchema = new mongoose.Schema ({
    action: String, 
    active: {type: Boolean, default: true}
});

//ROOT route -> todo INDEX
var Todo = mongoose.model("ToDo", todoSchema);
app.get("/", function (req, res){
    res.redirect("/todo");
});

//todo INDEX
app.get("/todo", function (req, res) {
    Todo.find({}, function (error, todos){
        if (error) {
            console.log("Something went wrong listing to do" + error);
        } else {
            res.render("index", {todos : todos});
        }
    });
});

//todo CREATE
app.post("/todo", function (req, res) {
    req.body.todo.action = req.sanitize(req.body.todo.action);
    
    //create new todo
    var todo = new Todo ({
        action: req.body.todo.action,
        active: true
    });
    
    //add it to the database
    todo.save( function (error, todo) {
        if (error) {
            console.log("Couldn't save to database " + error);
        } else {
            console.log("Added to database " + todo);
            res.redirect ("/todo");
        }
    });
});

//todo UPDATE
app.put("/todo/:id", function (req, res) {
    
    Todo.findById(req.params.id, function (error, todo) {
        if (error) {
            console.log("Error finding the item to update" + error);
        } else {
            todo.active = !todo.active;
            
            todo.save (function (error, todo) {
                if (error) {
                    console.log("Couldn't save item to update" + error);
                } else {
                    res.redirect("/todo");
                }
            });
        }
    });
});

//todo DESTROY
app.delete ("/todo/:id", function (req, res){
    Todo.findByIdAndRemove (req.params.id, function (error) {
        if (error) {
            console.log("Couldn't delete " + error);
        } else {
            console.log("Deleted to do item " + req.params.id);
        }
        res.redirect("/todo");
    });
});

//listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log("listr server is listening");
});