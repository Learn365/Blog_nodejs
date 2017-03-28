var express = require("express");
var path = require("path");
var app = express();
var indexRouter = require("./routes/index");
var usersRoutor = require("./routes/users");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/users", usersRoutor);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("500: Internal Error, " + err.message);

});

app.listen(3000);