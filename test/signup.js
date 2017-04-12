var path = require("path");
var assert = require("assert");
var request = require("supertest");
var app = require("../index");
var User = require("../lib/mongo").User;

var testName1 = "test1";
var testName2 = "test2";

describe("signup", function() {
    describe("POST /signup", function() {
        var agent = request.agent(app); //persist cookie when redirect
        beforeEach(function(done) {
            // create a user
            User.create({
                    name: testName1,
                    password: "1234556",
                    avator: "",
                    gender: "m",
                    bio: ""
                })
                .exec()
                .then(function() {
                    done();
                })
                .catch(done);
        });

        afterEach(function(done) {
            // remove testing users
            User.remove({ name: { $in: [testName1, testName2] } })
                .exec()
                .then(function() {
                    done();
                })
                .catch(done);
        });

        //wrong user name
        it("wrong name", function(done) {
            agent
                .post("/signup")
                .type("form")
                .attach("avatar", path.join(__dirname, "avatar.png"))
                .field({ name: "" })
                .redirects()
                .end(function(err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/the name must be 1-10 characters/));
                    done();
                })
        });

        // wrong gender
        it("wrong gender", function(done) {
            agent
                .post("/signup")
                .type("form")
                .attach("avatar", path.join(__dirname, "avatar.png"))
                .field({ name: testName2, gender: "a" })
                .redirects()
                .end(function(err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/the available gender must be m, f, or x/));
                    done();
                });
        });

        // other testing
        // existing user name
        it("duplicate name", function(done) {
            agent
                .post("/signup")
                .type("form")
                .attach("avatar", path.join(__dirname, "avatar.png"))
                .field({ name: testName1, gender: "m", bio: "noder", password: "123456", confirm: "123456" })
                .redirects()
                .end(function(err, res) {
                    if (err) return done(err);
                    assert(res.text.match(/The name has been in used/));
                    done();
                });

            it("success", function(done) {
                agent
                    .post("/signup")
                    .type("form")
                    .attach("avatar", path.join(__dirname, "avatar.png"))
                    .field({ name: testName2, gender: "m", bio: "noder", password: "123456", confirm: "123456" })
                    .redirects()
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert(res.text.match(/Sign up successully/));
                        done();
                    });
            });
        });
    });


})