var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Trade = require("../models/trade");

module.exports = function(passport) {
    /* Handle trades GET */
    router.get("/", function(req, res) {
        Book.aggregate([ 
        	{ $match : { "owner" : req.user.username } },
        	{ $lookup: {
        		"localField": "_id",
        		"from": "trades",
        		"foreignField": "offeredBook",
        		"as": "trade"
        	} },
        	{ "$unwind": "$trade" },
        	{ $lookup: {
        		"localField": "trade.desiredBook",
        		"from": "books",
        		"foreignField": "_id",
        		"as": "desiredBook"
        	} },
        	{ "$unwind": "$desiredBook" },
        	{ "$project": {
        	  "desiredBook.title": 1,
        	  "desiredBook.owner": 1,
        	  "desiredBook._id": 1,
        	  "title": 1,
        	  "trade._id": 1,
        	  "trade.status": 1,
        	  "isPending": { $eq: [ "$trade.status", "PENDING" ] }
        	} }
        ], handleYourOffersView.bind(null, req, res));
    });
    
    /* Handle trades Cancel */
    router.get("/cancel/:TRADE_ID", function(req, res) {
        updateStatus(req, res, "CANCELED");
    });
    
    /* Handle trades Accept */
    router.get("/accept/:TRADE_ID", function(req, res) {
        updateStatus(req, res, "ACCEPTED");
    });
    
    /* Handle trades Accept */
    router.get("/reject/:TRADE_ID", function(req, res) {
        updateStatus(req, res, "REJECTED");
    });
    
    return router;
};

function updateStatus(req, res, newStatus) {
    var tradeID = req.params.TRADE_ID;
    Trade.update({_id: tradeID}, { $set: { status: newStatus }}, function(err, doc) {
        req.flash("message", "Trade " + newStatus.toLowerCase() + "!");
        res.redirect("/trades");
    });
}

function handleYourOffersView(req, res, err, yourOffers) {
    // TODO: Handle errors
    Book.aggregate([ 
        	{ $match : { "owner" : req.user.username } },
        	{ $lookup: {
        		"localField": "_id",
        		"from": "trades",
        		"foreignField": "desiredBook",
        		"as": "trade"
        	} },
        	{ "$unwind": "$trade" },
        	{ $lookup: {
        		"localField": "trade.offeredBook",
        		"from": "books",
        		"foreignField": "_id",
        		"as": "offeredBook"
        	} },
        	{ "$unwind": "$offeredBook" },
        	{ "$project": {
        	  "offeredBook.title": 1,
        	  "offeredBook.owner": 1,
        	  "offeredBook._id": 1,
        	  "title": 1,
        	  "trade._id": 1,
        	  "trade.status": 1,
        	  "isPending": { $eq: [ "$trade.status", "PENDING" ] }
        	} }
        ], handleOfferedYouView.bind(null, req, res, yourOffers));
}

function handleOfferedYouView(req, res, yourOffers, err, offeredYou) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    resContent.yourOffers = yourOffers;
    resContent.offeredYou = offeredYou;
    resContent.message = req.flash("message");
    res.render("trades", resContent);
}
var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Trade = require("../models/trade");

module.exports = function() {
    /* Handle trades GET */
    router.get("/", function(req, res) {
        Book.aggregate([ 
        	{ $match : { "owner" : req.user.username } },
        	{ $lookup: {
        		"localField": "_id",
        		"from": "trades",
        		"foreignField": "offeredBook",
        		"as": "trade"
        	} },
        	{ "$unwind": "$trade" },
        	{ $lookup: {
        		"localField": "trade.desiredBook",
        		"from": "books",
        		"foreignField": "_id",
        		"as": "desiredBook"
        	} },
        	{ "$unwind": "$desiredBook" },
        	{ "$project": {
        	  "desiredBook.title": 1,
        	  "desiredBook.owner": 1,
        	  "desiredBook._id": 1,
        	  "title": 1,
        	  "trade._id": 1,
        	  "trade.status": 1,
        	  "isPending": { $eq: [ "$trade.status", "PENDING" ] }
        	} }
        ], handleYourOffersView.bind(null, req, res));
    });
    
    /* Handle trades Cancel */
    router.get("/cancel/:TRADE_ID", function(req, res) {
        updateStatus(req, res, "CANCELED");
    });
    
    /* Handle trades Accept */
    router.get("/accept/:TRADE_ID", function(req, res) {
        updateStatus(req, res, "ACCEPTED");
    });
    
    /* Handle trades Accept */
    router.get("/reject/:TRADE_ID", function(req, res) {
        updateStatus(req, res, "REJECTED");
    });
    
    return router;
};

function updateStatus(req, res, newStatus) {
    var tradeID = req.params.TRADE_ID;
    Trade.update({_id: tradeID}, { $set: { status: newStatus }}, function(err, doc) {
        req.flash("message", "Trade " + newStatus.toLowerCase() + "!");
        res.redirect("/trades");
    });
}

function handleYourOffersView(req, res, err, yourOffers) {
    // TODO: Handle errors
    Book.aggregate([ 
        	{ $match : { "owner" : req.user.username } },
        	{ $lookup: {
        		"localField": "_id",
        		"from": "trades",
        		"foreignField": "desiredBook",
        		"as": "trade"
        	} },
        	{ "$unwind": "$trade" },
        	{ $lookup: {
        		"localField": "trade.offeredBook",
        		"from": "books",
        		"foreignField": "_id",
        		"as": "offeredBook"
        	} },
        	{ "$unwind": "$offeredBook" },
        	{ "$project": {
        	  "offeredBook.title": 1,
        	  "offeredBook.owner": 1,
        	  "offeredBook._id": 1,
        	  "title": 1,
        	  "trade._id": 1,
        	  "trade.status": 1,
        	  "isPending": { $eq: [ "$trade.status", "PENDING" ] }
        	} }
        ], handleOfferedYouView.bind(null, req, res, yourOffers));
}

function handleOfferedYouView(req, res, yourOffers, err, offeredYou) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated() };
    resContent.yourOffers = yourOffers;
    resContent.offeredYou = offeredYou;
    resContent.message = req.flash("message");
    res.render("trades", resContent);
}
