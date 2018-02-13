var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require ("mongoose"),
    methodOverride      = require ("method-override"),
    expressSanitizer    = require ("express-sanitizer"),
    moment              = require('moment'),
    
    // models
    Todo                = require ("./models/todo"),
    Payment             = require ("./models/payment"),
    Amounts             = require ("./models/amounts"),
    
    // routes
    financeRoutes       = require ("./routes/finance"),
    todoRoutes          = require ("./routes/todo"),
    amountsRoutes       = require ("./routes/amounts");

mongoose.connect("mongodb://localhost/listr");

app.use (express.static(__dirname + "/public"));
app.use (bodyParser.urlencoded( { extended : true } ));
app.use (methodOverride("_method"));
app.use (expressSanitizer());

// use routes
app.use ("/todo", todoRoutes);
app.use ("/finance", financeRoutes);
app.use ("/finance/:id/amounts", amountsRoutes);

app.set ("view engine", "ejs");

app.locals.moment = moment;
app.locals.dateFormat = "ll";

//ROOT route
app.get ("/", function (req, res){
    res.redirect("/todo");
});

//listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log("listr server is listening");
});