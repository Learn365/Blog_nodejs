var fs = require("fs");
var path = require("path");
var sha1 = require("sha1");
var express = require("express");
var router = express.Router();

var UserModel = require("../models/users");
var checkNotLogin = require("../middlewares/check").checkNotLogin;

// GET /signup signup view
router.get("/", checkNotLogin, function(req, res, next) {
    res.render("signup");
});

// POST /signup signup
router.post("/", checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    var avatar = req.files.avatar.path.split(path.sep).pop();
    var password = req.fields.password;
    var confirm = req.fields.confirm;

    // fields validation
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error("the name must be 1-10 characters.")
        }
        if (["m", "f", "x"].indexOf(gender) === -1) {
            throw new Error("the available gender must be m, f, or x");
        }

        if (!req.files.avatar.name) {
            throw new Error("Miss avatar");
        }

        if (password.length < 6) {
            throw new Error("the password must be 6 characters at least");
        }

        if (password !== confirm) {
            throw new Error("the confirmed password dosen't match to the password");
        }
    } catch (e) {
        fs.unlink(req.files.avatar.path);
        req.flash("error", e.message);
        return res.redirect("/signup");
    }

    password = sha1(password);

    var user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    };

    UserModel.create(user)
        .then(function(result) {
            // the user is retrieved from db and _id is available
            user = result.ops[0];
            // cache user into session
            delete user.password;
            req.session.user = user;
            // shows flash
            req.flash("success", "Sign up successully");
            // direct to home page
            res.redirect("/posts");
        })
        .catch(function(e) {
            // failed
            fs.unlink(req.files.avatar.path);
            // redirect to signup page if the name in used by the other
            if (e.message.match("E11000 duplicate key")) {
                req.flash("error", "The name has been in used");
                return res.redirect("/signup");
            }

            next(e);
        });
});

module.exports = router;