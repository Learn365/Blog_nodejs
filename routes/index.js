var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// add blog
router.get("/new", function(req, res, next) {
    res.render("new");
});

// blog list view

// remove blog

// update blog

// blog details view

// blog edit view

// save blog
router.post("/create", function(req, res, next) {
    res.send(req.body);
});


module.exports = router;