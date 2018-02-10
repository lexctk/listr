var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require ("mongoose");
var methodOverride = require ("method-override");
var expressSanitizer = require ("express-sanitizer");

var moment = require('moment');
var dateFormat = "MMMM Do YYYY";

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

var Todo = mongoose.model("Todo", todoSchema);

//mongoose model config, payments
var paymentSchema = new  mongoose.Schema ({
    amountDate: [{
        amount: Number,
        date: {type: Date, default: Date.now}
    }],
    source: String, 
    frequency: {
        type: Number,
        required: true,
        min: 0,
        max: 12,
        validate : {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    endDate: {type: Date, default: Date.now},
    category: {type: String, enum: ['Bills', 'Food', 'Savings', 'Credit',  'Household',  'Luxury',  'Clothing']},
    importance: {type: String, enum: ['Required', 'Optional'] }
});

var Payment = mongoose.model ("Payment", paymentSchema);

//ROOT route -> todo INDEX
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

//finance INDEX
app.get("/finance", function (req, res) {
    
   //get all the payments from the database
   Payment.find({}, function (error, payments) {
       if (error) {
            console.log("Something went wrong listing payments " + error);
       } else {
           res.render("finance", {payments : payments});
       }
   });
});

//finance NEW
app.get("/finance/new", function (req, res) {
    res.render("new", {Payment : Payment});
});

//finance CREATE
app.post("/finance", function (req, res) {
    //create new payment 
    var payment = new Payment ({
        amountDate: [{ 
                amount: req.body.payment.amount,
                date: req.body.payment.date
        }],
        source: req.body.payment.source, 
        frequency: req.body.payment.frequency, 
        endDate: req.body.payment.endDate,
        category: req.body.payment.category, 
        importance: req.body.payment.importance
    });
    //save to database
    payment.save( function (error, payment) {
        if (error) {
            console.log ("Couldn't save payment to db" + error);
        } else {
            console.log ("Added payment to db" + payment);
            res.redirect("/finance");
        }
    });
});

//finance SHOW
app.get ("/finance/:id", function (req, res) {
    Payment.findById (req.params.id, function (error, payment) {
        if (error) {
            console.log ("Couldn't show payment page " + error);
        } else {
            console.log ("Showing payment page " + req.params.id);
            res.render("show", { payment : payment });
        }
    });
});

//finance EDIT
app.get("/finance/:id/edit", function (req, res) {
    Payment.findById (req.params.id, function (error, payment) {
        if (error) {
            console.log ("Couldn't show edit form " + error);
        } else {
            console.log ("Edit " + payment);
            res.render ("edit", { payment : payment, Payment : Payment });
        }
    });
});

//finance UPDATE
app.put("/finance/:id", function (req, res) {
    console.log("Starting update");
    
    //Stage 1, updating amounts and dates array values
    for (var i=0; i<req.body.amountDate.length; i++) {
        Payment.update({
            'amountDate._id': req.body.amountDate[i].id, 
            '_id' : req.params.id
        }, {'$set': {
            'amountDate.$.amount': req.body.amountDate[i].amount,
            'amountDate.$.date': req.body.amountDate[i].date
        }}, function( error ) {
            if (error) {
                console.log ("Couldn't update stage 1 " + error);
            } else {
                console.log ("Update stage 1 complete");
            }
        });
    }
    
    //Stage 2, add new amount and date, if any
    
    //Stage 3, update rest of edit fields
    Payment.findByIdAndUpdate(req.params.id, req.body.payment, function (error, payment) {
        if (error) {
            console.log("Couldn't find and update " + error);
        } else {
            //update database entry
            console.log("Update blog entry " + req.params.id);
            res.redirect("/finance/" + req.params.id);
        }
    });
});

//finance DESTROY
app.delete ("/finance/:id", function (req, res) {
    Payment.findByIdAndRemove (req.params.id, function (error) {
        if (error) {
            console.log ("Couldn't delete " + error);
        } else {
            console.log ("Delete payment " + req.params.id);
            res.redirect ("/finance");
        }
    });
});

//listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log("listr server is listening");
});