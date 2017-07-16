var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground");

//INDEX - List all campgrounds
router.get("/",function(req,res){
    Campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds: allcampgrounds, currentUser: req.user}); 
        } 
    });
});

//CREATE - Add new campground
router.post("/", isLoggedIn, function(req,res){
    Campground.create(
    {
       name: req.body.name,
       image: req.body.image,
       description: req.body.description,
       author:{
           id: req.user._id,
           username: req.user.username
       }
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
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
});

//SHOW - Show campground page
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
        console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        } 
    });
});

module.exports = router;

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");   
    }
}