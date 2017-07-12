var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

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
        res.render("campgrounds/index",{campgrounds: allcampgrounds}); 
    } 
    });
});

//CREATE - Add new campground
app.post("/campgrounds", function(req,res){
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
app.get("/campgrounds/new", function(req, res){
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
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id,function(err,campground){
       if(err){
        console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }   
    });
});

//COMMENTS - CREATE - Add new comment
app.post("/campgrounds/:id/comments", function(req,res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});