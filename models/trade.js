var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Trade", {
    offeredBook: Schema.Types.ObjectId,
    desiredBook: Schema.Types.ObjectId,
    status: String
});