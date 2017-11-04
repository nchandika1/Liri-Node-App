//  For importing keys stored in key.js file
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

function myTweets(tweet) {
	var twitterKeys = keys.twitterKeys;
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	var params = {
		q: tweet,
		result_type: 'recent',
		count: 20
	}

	client.get('search/tweets', params, function(error, tweets, response) {
		if (error) {
			console.log("Error: " + error);
			return;
		}
		if (response.successCode != 200) {
			console.log("Failled - Twitter Response Code: " + response.successCode);
		}

		for (var i=0; i< tweets.statuses.length; i++) {
			console.log(tweets.statuses[i].created_at);
			console.log(tweets.statuses[i].text);
			console.log();
		}
	});
}

function spotifyThisSong(song) {
	var spotifyKeys = keys.spotifyKeys;
	var spotify = new Spotify({
  		id: spotifyKeys.client_id,
	  	secret: spotifyKeys.client_secret
	});

	var params = {
		type: 'track', 
		query: "\""+song+"\"", 
		limit: '1'
	}

	spotify.search(params, function(err, data) {
	  	if (err) {
	    	return console.log('Error occurred: ' + err);
	  	}

		for (var i = 0; i<data.tracks.items.length; i++) {
			var songItem = data.tracks.items[i];
			console.log("Song: " + songItem.name);
			console.log("Album: " + songItem.album.name);
			var len = songItem.album.artists.length;
			var artists = "";
			for (var j=0; j < len; j++) {
				artists = artists + songItem.album.artists[j].name + ' ';
			}
			console.log("Artist(s): " + artists.trim());
			console.log("Preview Link: " + songItem.preview_url);
			console.log();
		}
	});
}

function movieThis(movie) {
	var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
	request(queryURL, function(err, response, body){
		if (err) {
			console.log("OMDB Error: " + err);
			return;
		}
		if (response.statusCode != 200) {
			console.log("Failed - OMDb Response Code: " + response.statusCode);
			return;
		}

		var result = JSON.parse(body);
		console.log("Title: " + result.Title);
		console.log("Year: " + result.Year);
		if (result.Ratings.length == 0) {
			console.log("Internet Movie Database Rating: Not Available");
			console.log("Rotten Tomatoes Rating: Not Available");	
		}

		if (result.Ratings.length == 1) {
			console.log("Internet Movie Database Rating: " + result.Ratings[0].Value);
			console.log("Rotten Tomatoes Rating: Not Available");	
		}

		if (result.Ratings.length == 2) {
			console.log("Internet Movie Database Rating: " + result.Ratings[1].Value);
			console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);	
		}
		
		console.log("Country: " + result.Country);
		console.log("Language: " + result.Language);
		console.log("Plot: " + result.Plot);
		console.log("Actors: " + result.Actors);
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err, data){
		if (err) {
			console.log("Error: " + err);
			return;
		}
		var strArray = data.split(',');
		var commandStr  = strArray[0];
		var str = strArray[1];

		runCommand(commandStr, str);
	});
}

function runCommand(command, str) {
	switch (command) {
	 	case 'my-tweets':
	 		var tweet = str;
	 		if (!tweet) {tweet = 'BarackObama';}
	 		myTweets(tweet);
	 		break;
		case 'spotify-this-song':
			var song = str;
			if (!song) {song = 'The Sign';}
			spotifyThisSong(song);
			break;
		case 'movie-this':
			var movie = str;
			if (!movie) {movie = 'Mr. NoBody';}
			movieThis(movie);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		case 'help':
		default:
			console.log();
			console.log("node liri.js <my-tweets> | <spotify-this-song> | <movie-this> | <do-what-it-says> | <help> [--log]");
			console.log();
			console.log("--> my-tweets: display tweets");
			console.log("--> spotify-this-song: get the song information from Spotify");
			console.log("--> movie-this: get movie information from OMDb");
			console.log("--> do-what-it-says: get random text and do what it says");
			console.log("--> help: display help information");
			console.log("--> --log: log output to log.txt file")
			console.log();
			break;
	}
}

// Get the arguments to execute the appropriate command with the string provided
var command = process.argv[2];
var inputStr = '';

for (var i = 3; i < process.argv.length; i++) {
	inputStr = inputStr + ' ' + process.argv[i];
}

// Main function to run the LIRI command
runCommand(command, inputStr.trim());