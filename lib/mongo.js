var config = require("config-lite");
var Mongolass = require("mongolass");
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model("User", {
    name: { type: "string" },
    password: { type: "string" },
    avatar: { type: "string" },
    gender: { type: "string", enum: ["m", "f", "x"] },
    bio: { type: "string" }
});

exports.User.index({ name: 1 }, { unique: true }).exec();

exports.Post = mongolass.model("Post", {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: "string" },
    content: { type: "string" },
    pv: { type: "number" }
});

exports.Post.index({ author: 1, _id: -1 }).exec(); // list posts in desc order of created time

exports.Comment = mongolass.model("Comment", {
    author: { type: Mongolass.Types.ObjectId },
    content: { type: "string" },
    postId: { type: Mongolass.Types.ObjectId }
});

exports.Comment.index({ postId: 1, _id: 1 }).exec(); // lists all comments by a post Id in the acs order of created time
exports.Comment.index({ author: 1, _id: 1 }).exec(); // deletes a comment by a author id and the comment id


var moment = require("moment");
var objectIdToTimestamp = require("objectid-to-timestamp");

// build created_at with _id
mongolass.plugin("addCreatedAt", {
    afterFind: function(results) {
        results.forEach(function(item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format("YYYY-MM-DD HH:mm");
        });

        return results;
    },
    afterFindOne: function(result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format("YYYY-MM-DD HH:mm");
        }

        return result;
    }
});