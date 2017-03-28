var express = require("express");
var router = express.Router();

router.get("/users/:name", function(req, res) {

    res.send("Hello, " + req.params.name);
});

module.exports = router;