var express = require("express");
var router = express.Router();
var Book = require("../models/book");

module.exports = function() {
    /* Handle books GET */
    router.get("/", function(req, res) {
        console.log("chegou no books");
        Book.find({}, handleBooksView.bind(null, req, res));
    });
    return router;
};

function handleBooksView(req, res, err, books) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    // Did not find a better way to control index conditionals!! :(
    for (var i = 0; i < books.length; i++) {
        if (i % 3 == 0) {
            books[i]["startsRow"] = true;
            if (i > 0) {
                books[i]["endRow"] = true;
            }
        }
        if (i == books.length - 1) {
            books[i]["endRow"] = true;
        }
    }
    resContent.books = books;
    resContent.message = req.flash("message");
    res.render("home", resContent);
}
