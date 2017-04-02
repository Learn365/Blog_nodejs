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
    }
};