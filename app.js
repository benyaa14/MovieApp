var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Users = require("./models/users");
var RatedMovie = require("./models/rateMovie");



var userRoutes = require("./routes/user");
var indexRoutes = require("./routes/index");



// mongoose.connect("mongodb+srv://benyaa14:12345@cluster0-s0d5e.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect("mongodb://benyaa14:benyaa14@ds137008.mlab.com:37008/movie_app")

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");

// 	PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"The best app",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error =  req.flash("error");
   res.locals.success =  req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(userRoutes);







app.listen(3000, function(){
    console.log("Movie App has started!!!");
});