var marked = require("marked");
var Post = require("../lib/mongo").Post;

Post.plugin("contentToHtml", {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return posts;
        });
    },
    afterFindOne: function(post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

module.exports = {

    // add a post
    create: function create(post) {
        return Post.create(post).exec();
    },

    // get a post
    getPostById: function getPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: "author", model: "User" })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // get all posts of the given user in desc order of created time
    getPosts: function getPosts(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({ path: "author", model: "User" })
            .sort({ _id: -1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // increate pv with 1 by post
    incPv: function incPv(postId) {
        return Post
            .update({ _id: postId }, { $inc: { pv: 1 } })
            .exec();
    },

    // get the raw content by post id
    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: "author", model: "User" })
            .exec();
    },
    // Update a post by user Id and post Id
    updatePostById: function updatePostById(postId, author, data) {
        return Post.update({ author: author, _id: postId }, { $set: data }).exec();
    },

    // Delete a post by user Id and postId
    delPostById: function delPostById(postId, author) {
        return Post.remove({ author: author, _id: postId }).exec();
    }
};