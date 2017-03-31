var express = require("express");
var path = require("path");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var flash = require("connect-flash");
var config = require("config-lite");
var routes = require("./routes");
var pkg = require("./package");

var app = express();

// config template dir
app.set("views", path.join(__dirname, "views"));
// config template engine as ejs
app.set("view engine", "ejs");

// config static dir
app.use(express.static(path.join(__dirname, "public")));

// config session middlewares
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new mongoStore({
        url: config.mongodb
    })
}));

// config error middlewares
// app.use(function(err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).send("500: Internal Error, " + err.message);
// });

// config flash middlewares
app.use(flash());

// config global variables
app.locals.blog = {

    title: pkg.name,
    description: pkg.description
};

// config required variables into templates
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash("success").toString();
    res.locals.error = req.flash("error").toString();
    next();
});

// config router
routes(app);

app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`);
});