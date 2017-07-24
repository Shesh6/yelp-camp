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
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Sign up successful! Nice to meet you, " + user.username + "!");
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
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;