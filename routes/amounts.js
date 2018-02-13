var express = require ("express"),
    router  = express.Router ({mergeParams: true});
    
var Payment = require ("../models/payment"),
    Amounts = require ("../models/amounts");
    
//======================
// Amounts routes
//======================


// CREATE
router.post ("/", function (req, res) {
    //find payment
    Payment.findById(req.params.id, function(error, payment) {
        if (error) {
            console.log ("Couldn't find corresponding payment " + error);
        } else {
            Amounts.create(req.body.newAmount, function (error, amount) {
                if (error) {
                    console.log ("Couldn't create amount " + error);
                } else {
                    payment.amounts.push(amount._id);
                    payment.save( function (error, payment) {
                        if (error) {
                            console.log("Couldn't save comment " + error);
                        } else {
                            res.redirect ("/finance/" + payment._id + "/edit");
                        }
                    });
                }
            });
        }
    });        
});

// UPDATE
router.put ("/:idAmount", function (req, res) {
    Payment.findById(req.params.id, function (error, payment) {
        if (error) {
            console.log("Couldn't find payment to update " + error);
        } else {
            Amounts.findByIdAndUpdate(req.params.idAmount, req.body.amount, function (error, amount) {
                if (error) {
                    console.log("Couldn't find and update amount " + error);
                } else {
                    res.redirect("/finance/" + payment._id + "/edit");
                }
            });
        }
    });
});

// DESTROY
router.delete ("/:idAmount", function (req, res) {
    Amounts.findByIdAndRemove (req.params.idAmount, function (error, amount) {
        if (error) {
            console.log ("Couldn't delete " + error);
        } else {
            // also deleting reference from Payment
            Payment.update (
                { "amounts" : req.params.idAmount },
                { "$pull" : { "amounts" : req.params.idAmount } },
                function (error, payment) {
                    if (error) {
                        console.log ("Couldn't update payment to remove deleted amount");
                    } else {
                        res.redirect("/finance/" + req.params.id + "/edit");
                    }
                }
            );
        }
    });
});

module.exports = router;