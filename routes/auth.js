var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

router.get("/",function(req,res){
   res.render("landing"); 
});

//show register form
router.get("/register",function(req, res) {
    res.render("register");
});

//signup logic
router.post("/register",function(req, res) {
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
router.get("/login",function(req, res) {
    res.render("login");
});

//login logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}));

//logout logic
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;