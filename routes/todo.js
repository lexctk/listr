var express = require ("express"),
    router  = express ();
    
var Todo    = require ("../models/todo");

//======================
// Todo routes
//======================

// INDEX
router.get("/", function (req, res) {
    Todo.find({}, function (error, todos){
        if (error) {
            console.log("Something went wrong listing to do" + error);
        } else {
            res.render("index", {todos : todos});
        }
    });
});

// CREATE
router.post("/", function (req, res) {
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
            console.log("Added to database");
            res.redirect ("/todo");
        }
    });
});

// UPDATE
router.put("/:id", function (req, res) {
    
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

// DESTROY
router.delete ("/:id", function (req, res){
    Todo.findByIdAndRemove (req.params.id, function (error) {
        if (error) {
            console.log("Couldn't delete " + error);
        } else {
            console.log("Deleted to do item " + req.params.id);
        }
        res.redirect("/todo");
    });
});

module.exports = router;