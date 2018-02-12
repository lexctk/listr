var mongoose = require("mongoose");

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
    category: {type: String, enum: ['Bills', 'Food', 'Savings', 'Credit',  'Household',  'Luxury',  'Clothing', 'Transport', 'Income']},
    importance: {type: String, enum: ['Required', 'Optional'] }
});

module.exports = mongoose.model ("Payment", paymentSchema);