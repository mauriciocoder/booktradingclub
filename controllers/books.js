var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Utils = require("../utils/util");

module.exports = function(passport) {
    /* Handle books GET */
    router.get("/", function(req, res) {
        console.log("chegou no books");
        Book.find({}, handleBooksView.bind(null, req, res));
    });
    return router;
};

function handleBooksView(req, res, err, books) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    Utils.setBooksPosition(books);
    Utils.truncateDescription(books);
    resContent.books = books;
    resContent.message = req.flash("message");
    res.render("home", resContent);
}
