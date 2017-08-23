
// Load npm packages
var request = require('request');
var fs = require('fs');
var moment = require('moment-timezone');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var exec = require('child_process').exec;
 
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});
 
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

	//parameters for get request
	var params = {screen_name: 'zzang_minsoo', count: 20}

	//parameters for moment
	var dateFormat = 'dddd MMM D hh:mm:ss';
	var region = 'America/Los_Angeles';

	// get recent 20 tweets in my timeline
	client.get('statuses/user_timeline', params, function(error, tweets, response) {

		// If there is no error
		if (!error) {

			var cmd = '\n' +'======================================================================' +  '\n' + 'Command:  my-tweets' + '\n';
			logText(cmd);
			
			for(var i=0; i<tweets.length; i++) {

				// twitter data object
				var tweet = tweets[i];

				// Change to javascript date
				var jsDate = new Date(tweet.created_at);

				// change twitter time to our timezone
				var tweetTime = moment(jsDate).format(dateFormat);

				var counter = i+1;

				// Display Tweets
				console.log(' ');
				console.log('#' + counter + '\n' + tweet.user.name + ' @' + tweet.user.screen_name + ' | ' + tweetTime);
				console.log(tweet.text);
				console.log(' ');

				var log = '\n' + '#' + counter + '\n'+ tweet.user.name + ' @' + tweet.user.screen_name + ' | ' + tweetTime + '\n' + tweet.text + '\n';

				// Save into file
				logText(log);

			}
		}
	});
}

function spotifyThis() {

	var songTitle = title;

	// If no song is provided
	if (songTitle === undefined) {

		//By Default, "The Sign" by Ace of Base
		spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
		.then (function (data) {

			var cmd = '\n' +'======================================================================' +  '\n' + 'Command:  spotify-this-song' + '\n';
			logText(cmd);

			var artist = data.artists[0].name;
			var title = data.name;
			var album = data.album.name;
			var previewLink = data.preview_url;

			console.log(' ');
			console.log('*  Artist(s):  ' + artist);
			console.log('*  Title:  ' + title);
			console.log('*  Preview URL:  ' + previewLink);
			console.log('*  Album:  ' + album);
			console.log(' ');

			var log = '\n' + '*  Artist(s):  ' + artist + '\n' + '*  Title:  ' + title + '\n' + '*  Preview URL:  ' + previewLink + '\n' + '*  Album:  ' + album + '\n';
			logText(log);

		})
		.catch (function (err) {
			console.error('Error occurred: ' + err); 
		});

	} else {

		var cmd = '\n' +'======================================================================' + '\n' + 'Command:  spotify-this-song ' + songTitle + '\n';
		logText(cmd);

		var params = { type: 'track', query: songTitle, limit: 10 };
		spotify.search( params, function (err, data) {

			// check error.
			if (err) {
				console.log('Error occurred: ' + err );
				return;
			}

			var trackData = data.tracks.items;

			for ( var i=0; i<trackData.length; i++ ) {

				var artists = '';
				var previewURL = '';
				var extendedURL = '';

				// Concatenates to artists string
				for ( var j=0; j<trackData[i].artists.length; j++ ) {
					artists = artists + ', ' + trackData[i].artists[j].name
				}

				// Some data doesn't have previewURL...	
				if (trackData[i].preview_url === null) {
					previewURL = 'Not Available';
				} else {
					previewURL = trackData[i].preview_url;
				}

				// console.log(trackData[i])
				console.log(' ');
				// remove first two ', ' from artists
				console.log('*  Artist(s):  ' + artists.substr(2));
				console.log("*  Title:  " + trackData[i].name);
				console.log('*  Preview URL:  ' + previewURL);
				console.log('*  Album:  ' + trackData[i].album.name);
				console.log(' ');

				var log = '\n' + '*  Artist(s):  ' + artists.substr(2) + '\n' + '*  Title:  ' + trackData[i].name + '\n' + '*  Preview URL:  ' + previewURL + '\n' + '*  Album:  ' + trackData[i].album.name + '\n';
				logText(log);

			}
		})
	}
}

function movieThis() {

	console.log(' ');
	var movieTitle = title;
	var queryUrl = '';

	// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
	if (movieTitle === undefined) {

		var movieTitle = 'Mr Nobody'

		// parse it to use in search query
		var movieTitleParsed = movieTitle.split(" ").join("+").toLowerCase();

		// build query URL
		queryUrl = "http://www.omdbapi.com/?t=" + movieTitleParsed + "&y=&plot=short&apikey=" + process.env.OMDB_API_KEY;
		console.log('Query URL:  ' + queryUrl);

	// Else search for user input
	} else {

		// store console input in variable
		movieTitle = title;

		// parse it to use in search query
		var movieTitleParsed = movieTitle.split(" ").join("+").toLowerCase();

		// build query URL
		queryUrl = "http://www.omdbapi.com/?t=" + movieTitleParsed + "&y=&plot=short&apikey=" + process.env.OMDB_API_KEY;
		console.log('Query URL:  ' + queryUrl);

	}

	request(queryUrl, function (err, response, body) {

		// If the request is successful
		if (!err && response.statusCode === 200) {

			// Movie data object
			var movieData = JSON.parse(body);
			var consoleWidth = process.stdout.columns;
			var chunkSize = consoleWidth-31;
			var imdbRating = movieData.Ratings.find( x => x.Source === 'Internet Movie Database').Value;
			var rottenRating = movieData.Ratings.find( x => x.Source === 'Rotten Tomatoes').Value;

			
			var plot = dividePlot(movieData.Plot, chunkSize);

			// Display movie info
			console.log(' ')
			console.log('*  Movie Title:              ' + movieData.Title);
			console.log('*  Released:                 ' + movieData.Released);
			console.log('*  IMDB Rating:              ' + imdbRating);
			console.log('*  Rotten Tomatoes Rating:   ' + rottenRating);
			console.log('*  Country:                  ' + movieData.Country);
			console.log('*  Laguage:                  ' + movieData.Laguage);
			console.log('*  Plot:                     ' + plot);
			console.log('*  Actors:                   ' + movieData.Actors);
			console.log(' ');

			var cmd = 'Command:  movie-this ' + '"' + title + '"';
			
			var log = '\n' +'======================================================================' +  '  \n' + cmd + '\n' + '*  Movie Title:              ' + movieData.Title + '\n' + '*  Released:                 ' + movieData.Released + '\n' + '*  IMDB Rating:              ' + imdbRating + '\n' + '*  Rotten Tomatoes Rating:   ' + rottenRating + '\n' + '*  Country:                  ' + movieData.Country + '\n' + '*  Laguage:                  ' + movieData.Laguage + '\n' + '*  Plot:                     ' + movieData.Plot + '\n' + '*  Actors:                   ' + movieData.Actors + '\n' + ' ';

			// Save into file
			logText(log);

		} 
	});
}

// Divide Plot depends on console width and display in new line.
// So it displays plot with clean structure in small console size.
function dividePlot (plot, size) {

	var numChunks = Math.ceil( plot.length / size);
	var plotArray = [];
	var newline = '                               ';
	for (var i=0, o=0; i<numChunks; i++, o += size) {
		plotArray[i] = plot.substr(o, size);
	}

	var display = plotArray.join(newline);

	return display;
}

// Execute cmd read from random.txt
function randomThing() {

	fs.readFile('random.txt', 'utf8', function(err, data) {

		if (err) {
			console.log('Error occurred: ' + err );
			return;
		}

		var cmd = 'node liri ' + data;

		console.log(' ');
		console.log('Execeuted Command:  ' + cmd);
		console.log(' ');

		// Execute child process
		var child = exec(cmd, function (err, stdout, stderr) {

			var log ='\n' +'======================================================================' +  '\n' + cmd + '\n' +stdout;
			console.log('stdout: ' + stdout);
    		console.log('stderr: ' + stderr);

    		logText(log);

    		if (err !== null) {
    			console.log('exec error: ' + err);
    		}


		});
	});
}

function logText(str) {

	fs.appendFile('log.txt', str, (err) => {
		if(err) throw err;
	})
}