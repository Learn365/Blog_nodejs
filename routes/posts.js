var express = require("express");
var router = express.Router();

var checkLogin = require("../middlewares/check").checkLogin;

// Get /posts the articals of all users
// Get /posts?author=xxx the articals of the given user

router.get("/", function(req, res) {

    res.send(req.flash());
});

// POST /posts submit a post
router.post("/", checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/create post edit view
router.post("/create", checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// Get /posts/:postId post view
router.get("/:postId", function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/edit post edit view
router.get("/:postId/edit", checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/edit save post
router.post("/:postId/edit", checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/remove delete a post
router.get("/:postId/remove", function(req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/comment submit a comment
router.post("/:postId/comment", checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/remove delete a comment
router.get("/:postId/comment/:commentId/remove", checkLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;