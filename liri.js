// Load npm request packages
var request = require('request');

// Load npm moment packages
var moment = require('moment-timezone');

// Initialize spotify api
// https://www.npmjs.com/package/node-spotify-api
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// Initialize twitter api
// https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Grab command line
var command = process.argv[2].toLowerCase();
var title = process.argv[3];

// Main switch function to handle different commands
switch (command) {

	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		spotifyThis();
		break;

	case 'movie-this':
		movieThis();
		break;

	case 'do-what-it-says':
		randomThing();
		break;

	default:
		console.log('LIRI ONLY takes one of the following commands:: my-tweets, spotify-this-song, movie-this, do-what-it-says');
		console.log('Please try again:)');
		break;
}

// display my last 20 tweets
function myTweets() {

	var params = {screen_name: 'zzang_minsoo', count: 20}
	var dateFormat = 'dddd MMM D hh:mm:ss';
	var region = 'America/Los_Angeles';

	// get r
	client.get('statuses/user_timeline', params, function(error, tweets, response) {

		if (!error) {
			
			for(var i=0; i<tweets.length; i++) {

				var tweet = tweets[i];
				var timezoneParsed = moment.tz(tweet.created_at, dateFormat, region);

				console.log(' ');
				console.log(tweet.user.name + ' @' + tweet.user.screen_name + ' | ' + timezoneParsed);
				console.log(tweet.text);
				console.log(' ');

			}
		}
	});
}

function spotifyThis() {
	console.log('spotify-this-song');
}

function movieThis() {

	console.log(' ');

	// store console input in variable
	var movieTitle = title;

	// parse it to use in search query
	var movieTitleParsed = movieTitle.split(" ").join("+").toLowerCase();

	// build query URL
	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitleParsed + "&y=&plot=short&apikey=" + KEYS.omdbKey.api_key;

	console.log('Movie Title: ' + movieTitle);
	console.log('Query URL: ' + queryUrl);

	request(queryUrl, function (err, response, body) {

		// If the request is successful
		if (!err && response.statusCode === 200) {

			var movieData = JSON.parse(body);

			console.log('======================================= OMDB ============================================');
			console.log(' ')
			console.log('*  Movie Title:              ' + movieData.Title);
			console.log('*  Released:                 ' + movieData.Released);
			console.log('*  IMDB Rating:              ' + movieData.Ratings.find( x => x.Source === 'Internet Movie Database').Value);
			console.log('*  Rotten Tomatoes Rating:   ' + movieData.Ratings.find( x => x.Source === 'Rotten Tomatoes').Value);
			console.log('*  Country:                  ' + movieData.Country);
			console.log('*  Laguage:                  ' + movieData.Laguage);
			console.log('*  Plot:                     ' + movieData.Plot);
			console.log('*  Actors:                   ' + movieData.Actors);
			console.log(' ');
			console.log('==========================================================================================');
			console.log(' ')
		
		} 

	});
}

function randomThing() {
	console.log('do-what-it-says');
}