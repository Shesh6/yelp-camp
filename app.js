var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Shhhhhhhhh!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");   
    }
}

//ROUTES

//LANDING
app.get("/",function(req,res){
   res.render("landing"); 
});

//INDEX - List all campgrounds
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds: allcampgrounds, currentUser: req.user}); 
        } 
    });
});

//CREATE - Add new campground
app.post("/campgrounds", isLoggedIn, function(req,res){
    Campground.create(
    {
       name: req.body.name,
       image: req.body.image,
       description: req.body.description
    }, function(err, campground){
        if(err){
            console.log(err);
        } else{
            console.log("Created Campground:");
            console.log(campground);
        }
    });
    res.redirect("campgrounds");
});

//NEW - Go to campground form
app.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
});

//SHOW - Show campground page
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
        console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        } 
    });
});

//COMMENTS - NEW - Go to comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
    Campground.findById(req.params.id,function(err,campground){
       if(err){
        console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }   
    });
});

//COMMENTS - CREATE - Add new comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
             Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    console.log("Created Comment:");
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });    
        }         
    });
});

//AUTHORIZATION ROUTES

//show register form
app.get("/register",function(req, res) {
    res.render("register");
});

//signup logic
app.post("/register",function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

//show login form
app.get("/login",function(req, res) {
    res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}));

//logout logic
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});