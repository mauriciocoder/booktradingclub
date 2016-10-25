var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Trade = require("../models/trade");
var mongoose = require("mongoose");

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
    
    return router;
};

function handleBooksView(req, res, err, books) {
    if (err) {
        throw err;
    }
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
    console.log("yourbooks = " + JSON.stringify(books));
    resContent.message = req.flash("message");
    res.render("yourbooks", resContent);
}
