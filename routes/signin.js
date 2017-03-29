var express = require("express");
var router = express.Router();

var checkNotLogin = require("../middlewares/check").checkNotLogin;

// Get /signin login view
router.get("/", checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /signin login
router.post("/", checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;