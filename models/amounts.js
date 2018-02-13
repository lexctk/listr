var mongoose = require ("mongoose");

var amountsSchema = new mongoose.Schema({
    value: Number,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Amounts", amountsSchema);