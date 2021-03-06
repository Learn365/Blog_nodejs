var User = require("../lib/mongo").User;

module.exports = {

    // add a user
    create: function create(user) {
        return User.create(user).exec();
    },

    // get a user
    getUserByName: function getUserByName(name) {
        return User
            .findOne({ name: name })
            .addCreatedAt()
            .exec();
    }
};