var express = require("express");
var app = express();
var indexRouter = require("./routes/index");
var usersRoutor = require("./routes/users");

app.use("/", indexRouter);
app.use("/users", usersRoutor);

app.listen(3000);