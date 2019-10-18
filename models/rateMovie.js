var mongoose = require("mongoose")
var ratedMovieSchema = new mongoose.Schema({
	img:String,
	title:String,
	year:String,
	id:String,
	rating: Number,
	userRating: {
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	username:String
} 
});

//var RatedMovie = mongoose.model("RatedMovie",ratedMovieSchema);
module.exports = mongoose.model("RatedMovie", ratedMovieSchema);