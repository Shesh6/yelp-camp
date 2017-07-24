var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

//COMMENTS - NEW - Go to comment form
router.get("/new", middleware.isLoggedIn ,function(req, res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");
        } else{
            res.render("comments/new", {campground: campground});
        }   
    });
});

//COMMENTS - CREATE - Add new comment
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");
            res.redirect("/campgrounds");
        } else{
             Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    req.flash("error","Something went wrong!");
                } else{
                    req.flash("success", "Successfully added comment!");
                    console.log("Created Comment:");
                    console.log(comment);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });    
        }         
    });
});
//COMMENTS - EDIT - Show edit page
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");
            res.redirect("back");
        } else {
            res.render("comments/edit",{campground_id: req.params.id, comment: comment});    
        }
    });
});

//COMMENTS - UPDATE - Submit edit
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");
            res.redirect("back");
        } else{
            req.flash("success", "Successfully edited comment!");
            res.redirect("/campgrounds/" + req.params.id); 
        }   
    });
});

//COMMENTS - DESTROY - Delete campground
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Something went wrong!");
            console.log(err);
        }
        req.flash("success", "Successfully deleted comment!");
        res.redirect("/campgrounds/" + req.params.id);   
    });
});

module.exports = router;