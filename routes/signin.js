var sha1 = require("sha1");
var express = require("express");
var router = express.Router();

var UserModel = require("../models/users");
var checkNotLogin = require("../middlewares/check").checkNotLogin;

// Get /signin login view
router.get("/", checkNotLogin, function(req, res, next) {
    res.render("signin");
});

// POST /signin login
router.post("/", checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;

    UserModel.getUserByName(name)
        .then(function(user) {
            if (!user) {
                req.flash("error", "The user name dosen't exist");
                return res.redirect("back");
            }

            // validate if the password is matched
            if (sha1(password) !== user.password) {
                req.flash("error", "Invalid user name or password");
                return res.redirect("back");
            }

            req.flash("success", "Welcome Back! " + user.name);
            // cache user into session
            delete user.password
            req.session.user = user;
            // redirect to home page
            res.redirect("/posts");

        })
        .catch(next);
});

module.exports = router;