var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
 //   Campground       = require("./models/campground"),
//    Comment          = require("./models/comment"),
    User             = require("./models/user");
 //   seedDB           = require("./seeds");
    
    
var commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds");
    
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://top:4185@ds163060.mlab.com:63060/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
//seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "top top top",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});