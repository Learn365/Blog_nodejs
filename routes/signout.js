var express = require("express");
var router = express.Router();

var checkLogin = require("../middlewares/check").checkLogin;

// GET /signout sign out
router.get("/", checkLogin, function(req, res, next) {

    // clean out user in the session
    req.session.user = null;
    req.flash("success", "Have a good day");
    // direct to home page
    res.redirect("/posts");
});

module.exports = router;