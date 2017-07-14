var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment");

//COMMENTS - NEW - Go to comment form
router.get("/new", isLoggedIn ,function(req, res){
    Campground.findById(req.params.id,function(err,campground){
       if(err){
        console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }   
    });
});

//COMMENTS - CREATE - Add new comment
router.post("/", isLoggedIn, function(req,res){
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

module.exports = router;

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");   
    }
}