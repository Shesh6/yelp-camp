var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/",function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err, allcampgrounds){
    if(err){
        console.log(err);
    } else{
        res.render("index",{campgrounds: allcampgrounds}); 
    } 
    });
});

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

app.get("/campgrounds/new", function(req, res) {
    res.render("new"); 
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
        console.log(err);
    } else{
        res.render("show", {campground: foundCampground});
    } 
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});