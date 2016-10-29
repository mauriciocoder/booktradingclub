var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Trade = require("../models/trade");
var mongoose = require("mongoose");
var Utils = require("../utils/util");

module.exports = function(passport) {
    router.get("/", function(req, res) {
        Book.find({ owner: { $eq: req.user.username } }, handleBooksView.bind(null, req, res));
    });
    
    router.get("/delete/:BOOK_ID", function(req, res) {
        var bookId = mongoose.Types.ObjectId(req.params.BOOK_ID);
        Trade.remove({
            "$and": [
                {"status" : "PENDING"},
                {
                    "$or": [
                        {"desiredBook" : bookId},
                        {"offeredBook" : bookId}
                           ]
                }
                    ]
        }, function(err) {
            console.log("Removeu as trades do livro " + bookId);
            Book.remove({_id: bookId}, function(err){
                console.log("Removeu o livro " + bookId);
                req.flash("message", "Book removed with success");
                res.redirect("/yourbooks");
            });
        });
    });

    router.post("/add", function(req, res) {
        var title = req.body.title;
        var publisher = req.body.publisher;
        var description = req.body.description;
        var isbn = req.body.isbn;
        var pages = req.body.pages;
        var imageUrl = req.body.imageUrl;
        var author = req.body.author;
        var book = new Book();
        book.title = title;
        book.publisher = publisher;
        book.description = description;
        book.isbn = isbn;
        book.pages = pages;
        book.imageUrl = imageUrl;
        book.author = author;
        book.owner = req.user.username;
        book.save(function(err) {
            req.flash("message", "Book Added");
            res.redirect("/yourbooks");
        });
    });
    
    return router;
};

function handleBooksView(req, res, err, books) {
    if (err) {
        throw err;
    }
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    Utils.setBooksPosition(books);
    Utils.truncateDescription(books);
    resContent.books = books;
    resContent.message = req.flash("message");
    res.render("yourbooks", resContent);
}
