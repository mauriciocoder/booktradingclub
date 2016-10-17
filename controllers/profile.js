var express = require("express");
var router = express.Router();
var User = require("../models/user");

module.exports = function(passport) {
    /* Handle profile POST */
    router.post("/", function(req, res) {
        var city = req.body.city;
        var state = req.body.state;
        if (!state || !city) {
            req.flash("message", "All fields are required!");
            res.redirect("/profile");
        } else {
            User.findOneAndUpdate({ username: req.user.username}, { $set: { "city": city, "state": state }}, function(err, doc) {
            if (!err) {
                req.flash("message", "User updated");
                res.redirect("/profile");
            }
        });
        }
    });
    
    /* Handle profile GET */
    router.get("/", function(req, res) {
        var resContent = { user: req.user, authenticated: req.isAuthenticated() };
        resContent.message = req.flash("message");
        // Display the Profile page with any flash message, if any
        res.render("profile", resContent);
    });
    
    return router;
};
