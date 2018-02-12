var mongoose = require ("mongoose");

//mongoose model config, todo list
var todoSchema = new mongoose.Schema ({
    action: String, 
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model("Todo", todoSchema);