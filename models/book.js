var mongoose = require("mongoose");

module.exports = mongoose.model("Book", {
    imageUrl: String,
    title: String,
    author: String,
    publisher: String,
    isbn: String,
    pages: String,
    description: String,
    owner: String
});