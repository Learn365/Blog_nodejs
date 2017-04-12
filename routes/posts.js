var express = require("express");
var router = express.Router();

var PostModel = require("../models/posts");
var CommentModel = require("../models/comments");
var checkLogin = require("../middlewares/check").checkLogin;

// Get /posts the articals of all users
// Get /posts?author=xxx the articals of the given user

router.get("/", function(req, res, next) {
    var author = req.query.author;

    PostModel.getPosts(author)
        .then(function(result) {
            res.render("posts", { posts: result && result.length > 0 ? result[0] : [] });
        })
        .catch(next);
});

// Get /posts/create show post create page
router.get("/create", checkLogin, function(req, res, next) {
    res.render("create");
});

// POST /posts submit a post
router.post("/", checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    // validate fields
    try {
        if (!title.length) {
            throw new Error("Title is required");
        }
        if (!content.length) {
            throw new Error("Content cannot be empty.")
        }
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("back");
    }

    var post = {

        author: author,
        title: title,
        content: content,
        pv: 0
    };

    PostModel.create(post)
        .then(function(result) {
            // the post here is retrived from db where the _id is ready
            post = result.ops[0];
            req.flash("success", "Post successfully");
            // redirect to the post view
            res.redirect(`/posts/${post._id}`);
        })
        .catch(next);
});

// Get /posts/:postId post view
router.get("/:postId", function(req, res, next) {
    var postId = req.params.postId;

    Promise.all([
            PostModel.getPostById(postId), //get a post
            CommentModel.getComments(postId), // get all of the comments of the post
            PostModel.incPv(postId) // pv increase of 1
        ])
        .then(function(result) {
            var post = result[0];
            var comments = result[1];
            if (!post) {
                throw new Error("the post dosen't exist");
            }

            res.render("post", {
                post: post,
                comments: comments
            });
        })
        .catch(next);
});

// GET /posts/:postId/edit post edit view
router.get("/:postId/edit", checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error("The post dosen't exist");
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error("The access limited");
            }
            res.render("edit", {
                post: post
            });
        })
        .catch(next);
});

// POST /posts/:postId/edit save post
router.post("/:postId/edit", checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    PostModel.updatePostById(postId, author, { title: title, content: content })
        .then(function() {
            req.flash("success", "Updated successfully");
            // redirect to the last page
            res.redirect(`/posts/${postId}`);
        })
        .catch(next);
});

// GET /posts/:postId/remove delete a post
router.get("/:postId/remove", function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.delPostById(postId, author)
        .then(function() {
            req.flash("success", "Deleted Successfully");
            // redirect to the home page
            res.redirect("/posts");
        }).catch(next);
});

// POST /posts/:postId/comment submit a comment
router.post("/:postId/comment", checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var postId = req.params.postId;
    var content = req.fields.content;
    var comment = {
        author: author,
        postId: postId,
        content: content
    };

    CommentModel.create(comment)
        .then(function() {
            req.flash("success", "Commented");
            // redirect to back when commented
            res.redirect("back");
        })
        .catch(next);
});

// GET /posts/:postId/comment/:commentId/remove delete a comment
router.get("/:postId/comment/:commentId/remove", checkLogin, function(req, res, next) {
    var commentId = req.params.commentId;
    var author = req.session.user._id;

    CommentModel.delCommentById(commentId, author)
        .then(function() {
            req.flash("success", "Removed the comment");
            // redirect to back when removed the comment
            res.redirect("back");
        })
        .catch(next);
});

module.exports = router;