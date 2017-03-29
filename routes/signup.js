var express = require("express");
var router = express.Router();

var checkNotLogin = require("../middlewares/check").checkNotLogin;

// GET /signup signup view
router.get("/", checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /sigup signup
router.post("/", checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;