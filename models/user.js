var mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    username: String,
    state: String,
    city: String,
    password: String
});