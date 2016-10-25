var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Trade = require("../models/trade");
var mongoose = require("mongoose");

module.exports = function(passport) {
    router.get("/:BOOKID", function(req, res) {
        var bookId = req.params.BOOKID;
        console.log("chegou no book - bookId = " + bookId);
        Book.find({"_id": bookId}, handleBookView.bind(null, req, res));
    });
    
    router.post("/offerTrade", function(req, res) {
        var offeredBook = mongoose.Types.ObjectId(req.body.offeredBook);
        var desiredBook = mongoose.Types.ObjectId(req.body.desiredBook);
        var trade = new Trade();
        trade.offeredBook = offeredBook;
        trade.desiredBook = desiredBook;
        trade.status = "PENDING";
        trade.save( function(err) {
            req.flash("message", "Trade Offered with success. Wait for owner approval");
            res.redirect("/book/" + req.body.desiredBook);
        });
    });
    return router;
};

function handleBookView(req, res, err, book) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    resContent.book = book;
    resContent.message = req.flash("message");
    if (req.isAuthenticated()) {
        // TODO: Check if book was offered for a trade
        Book.find({"owner": req.user.username}, function(err, books) {
            resContent.userBooks = books;
            resContent.hasUserBooks = (books && books.length > 0);
            if (resContent.hasUserBooks) {
                resContent.userBooks[0].firstBook = true;
            }
            console.log("Chegou no render!!! 1");
            res.render("book", resContent);
        });
    } else {
        console.log("Chegou no render!!! 2");
        res.render("book", resContent);
    }
}
