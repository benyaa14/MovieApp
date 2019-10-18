var express = require("express");
var router = express.Router();
var passport = require("passport");
var RatedMovie = require("../models/rateMovie");
var request = require("request");
var Users = require("../models/users");


router.get("/user",isLoggedIn,function(req,res){
	
	RatedMovie.find({},function(err,allRatedMovies){
		if(err){
			console.log(err);
		}else{
			res.render("user",{ratedMovies:allRatedMovies});
		}
	});
});



//	RATE A NEW MOVIE AND POST TO EXACT USER PAGE			
router.post("/user",isLoggedIn,function(req,res){
	//get data(rating and id) from results and add to user movieId array
	var rating = req.body.rating;
	var id = req.body.id;
	var title = req.body.title;
	var year = req.body.year;
	var img = req.body.img;
	var userRating={
		  userId: req.user._id,
		  username: req.user.username
	  }
		
	var newMovieRated = {img:img,title:title,year:year,id:id, rating:rating, userRating:userRating }
	
	RatedMovie.create(newMovieRated, function(err,newlyRated){
	if(err){
		console.log(err);
	} else{
		req.flash("success", "You Rated Movie")
		console.log(newlyRated);
		res.redirect('profiles/'+userRating.userId);
		
	}	
	});
	
});

// //	GET THE EXACT USER PAGE
// router.get("/user/:id",function(req,res){
// 	//find the movies of specific user rated
// 	Users.findById(req.params.id,function(err,foundUser){
// 		if(err){
// 			console.log(err);
// 		}else{
			
// 		}
// 	})
// 	//render the movies in his page
	
// 	res.send("user page");
// });


router.get("/results",function(req,res){
var query = req.query.search
var url = "http://www.omdbapi.com/?s="+query+"&apikey=thewdb"
request(url,function(error,response,body){
			if(!error && response.statusCode == 200){
		var data =	JSON.parse(body)	
			res.render("results",{data:data,query:query});
			}
		});
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
	}
	req.flash("error","Please Login First")
    res.redirect("/login");
}

module.exports = router;
