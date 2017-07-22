var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req,res){
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//EDIT - Show edit page
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            res.render("campgrounds/edit", {campground: campground}); 
        }   
    });    
});

//UPDATE - Submit edit
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id); 
        }   
    });
});

//DESTROY - Delete campground
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/campgrounds");   
    });
});

module.exports = router;