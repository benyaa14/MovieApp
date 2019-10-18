var express = require("express");
var router = express.Router();
var User = require("../models/users");
var passport = require("passport"); 
var request = require("request");
var RatedMovie = require("../models/rateMovie");

router.get("/", function(req,res){
	res.render("search");
});


//		AUTH ROUTS
//		------------
	
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Wellcome to FMDb");
            res.redirect("/"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    
{
        
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged You Out");
   res.redirect("/");
});

//USER PROFILE
router.get("/profiles/:id", function(req,res){
    RatedMovie.find({},function(err,allRatedMovies){
		if(err){
			console.log(err);
		}else{
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("/");
		}
			res.render("show", {user: foundUser,ratedMovies:allRatedMovies});
		
		
    })}})
    
})
//  DESTROY RATED MOVIE

router.delete("/user/:id", function(req,res){
   RatedMovie.findByIdAndRemove(req.params.id,function(err){
       if (err){
          res.redirect("/"); 
       }else{

        res.redirect("/");
       }
   })
})

router.delete("/profile/:id/:_id", function(req,res){
    RatedMovie.findByIdAndRemove(req.params._id,function(err){
        if (err){
           res.redirect("/"); 
        }else{
        req.flash("success", "Rated Movie Removed");
         res.redirect("/");
        }
    })
 })


 // ALL USERS
router.get("/users" , function(req,res){
    
       User.find({},function(err,users){
           if(err){
               console.log(err);
               res.redirect("/")
           }
           res.render("users",{users})
        })
})
    
     



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First")
    res.redirect("/login");
}


module.exports = router;