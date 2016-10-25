var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    router.get("/", function(req, res) {
        console.log("Chegou na raiz!");
        res.redirect("/books");
    });

    /* Handle Logout */
	router.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});
	
	router.use("/books", require("./books")());
	router.use("/book", require("./book")());
	router.use("/register", require("./register")(passport));
    router.use("/yourbooks", require("./yourbooks")(passport));
    router.use("/trades", require("./trades")(passport));
    router.use("/login", require("./login")(passport));
    router.use("/profile", require("./profile")(passport));
    
    /*
    router.use("/register", require("./register")(passport));
    router.use("/poll", require("./poll")());
    router.use("/answer", require("./answer")());
    */
    return router;
}
