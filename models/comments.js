var marked = require("marked");
var Comment = require("../lib/mongo").Comment;

// Convert the content from markdown to html
Comment.plugin("contentToHtml", {
    afterFind: function(comments) {
        return comments.map(function(comment) {
            comment.content = marked(comment.content);
            return comment;
        })
    }
});

module.exports = {
    // create a comment
    create: function create(comment) {
        return Comment.create(comment).exec();
    },

    // removes a comment by author id and post id
    delCommentById: function delCommentById(commentId, author) {
        return Comment.remove({ author: author, _id: commentId }).exec();
    },

    // remove all of the comments of a post by post Id
    delCommentsByPostId: function delCommentsByPostId(postId) {
        return Comment.remove({ postId: postId }).exec();
    },

    // lists all of comments of a post in acs order of created time
    getComments: function getComments(postId) {
        return Comment.find({ postId: postId })
            .populate({ path: "author", model: "User" })
            .sort({ _id: 1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // count the number of comments of a post
    getCommentsCount: function getcommentsCount(postId) {
        return Comment.count({ postId: postId }).exec();
    }
};