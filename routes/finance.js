var express = require ("express"),
    router  = express.Router();

var Payment = require ("../models/payment"),
    Amounts = require ("../models/amounts");

//======================
// Finance routes
//======================

// finance INDEX
router.get("/", function (req, res) {
   //get all the payments from the database
   Payment.find({}).populate("amounts").exec(function (error, payments) {
       if (error) {
            console.log("Something went wrong listing payments " + error);
       } else {
           res.render("finance/index", {payments : payments});
       }
   });
});

// finance NEW
router.get("/new", function (req, res) {
    res.render("finance/new", {Payment : Payment});
});

// finance CREATE
router.post("/", function (req, res) {
    //create new payment 
    var payment = new Payment ({
        source: req.body.payment.source, 
        frequency: req.body.payment.frequency, 
        endDate: req.body.payment.endDate,
        category: req.body.payment.category, 
        importance: req.body.payment.importance
    });
    // save to database
    payment.save( function (error, payment) {
        if (error) {
            console.log ("Couldn't save payment to db" + error);
        } else {
            Amounts.create(req.body.amounts, function (error, amount) {
                if (error) {
                    console.log ("Couldn't create amount " + error);
                } else {
                    payment.amounts.push(amount._id);
                    payment.save( function (error, payment) {
                        if (error) {
                            console.log("Couldn't save amount " + error);
                        } else {
                            res.redirect("/finance");
                        }
                    });
                }
            });
        }
    });
});

// finance SHOW
router.get ("/:id", function (req, res) {
    Payment.findById (req.params.id).populate("amounts").exec (function (error, payment) {
        if (error) {
            console.log ("Couldn't show payment page " + error);
        } else {
            res.render("finance/show", { payment : payment });
        }
    });
});

// finance EDIT
router.get("/:id/edit", function (req, res) {
    Payment.findById (req.params.id).populate("amounts").exec (function (error, payment) {
        if (error) {
            console.log ("Couldn't show edit form " + error);
        } else {
            res.render ("finance/edit", { payment : payment, Payment : Payment });
        }
    });
});

// finance UPDATE
router.put("/:id", function (req, res) {
    Payment.findByIdAndUpdate(req.params.id, req.body.payment, function (error, payment) {
        if (error) {
            console.log("Couldn't find and update " + error);
        } else {
            //update database entry
            res.redirect("/finance");
        }
    });
});

// finance DESTROY
router.delete ("/:id", function (req, res) {
    
    // delete all associated amounts
    Payment.findById (req.params.id).populate("amounts").exec (function (error, payment) {
        if (error) {
            console.log ("Couldn't show payment page " + error);
        } else {
            payment.amounts.forEach (function (amount) {
                Amounts.findByIdAndRemove(amount._id, function (error) {
                    if (error) {
                        console.log ("Couldn't delete amount " + amount._id + error);
                    } else {
                        console.log ("Deleted " + amount._id);
                    }
                });
            });
        }
    });
   
    Payment.findByIdAndRemove (req.params.id, function (error, payment) {
        if (error) {
            console.log ("Couldn't delete " + error);
        } else {
            res.redirect ("/finance");
        }
    });
});

module.exports = router;