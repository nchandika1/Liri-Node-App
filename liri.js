//  For importing keys stored in key.js file
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

function logOutput(str) {
	var fileName = "log.txt";
	// Take the input string and append it to log.txt file
	// Also add an additional line in between different logs (style)
	fs.appendFile(fileName, str + "--------\n", function(err) {
		if (err) {
			console.log("Log to file failed! - " + err);
		}
	});
}

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
			logOutput("Error: " + error + "\n");
			return;
		}

		var logStr = ""; // Save the output to this string and display it on console and append to log.txt

		for (var i=0; i< tweets.statuses.length; i++) {
			logStr = logStr+tweets.statuses[i].created_at+'\n';
			logStr = logStr+tweets.statuses[i].text+'\n';
		}
		console.log(logStr);
		logOutput(logStr);
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
	    	console.log('Error occurred: ' + err);
	    	logOutput('Error occurred: ' + err + '\n');
	    	return;
	  	}

		for (var i = 0; i<data.tracks.items.length; i++) {
			var logStr = ""; // Save the output to this string and display it on console and append to log.txt

			var songItem = data.tracks.items[i];
			logStr = logStr+"Song: " + songItem.name+'\n';
			logStr = logStr+"Album: " + songItem.album.name+'\n';
			var len = songItem.album.artists.length;
			var artists = "";
			for (var j=0; j < len; j++) {
				artists = artists + songItem.album.artists[j].name + ' ';
			}
			logStr = logStr+"Artist(s): " + artists.trim()+'\n';
			logStr = logStr+"Preview Link: " + songItem.preview_url+'\n';
			
			console.log(logStr);
			logOutput(logStr);
		}
	});
}

function movieThis(movie) {
	var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
	request(queryURL, function(err, response, body){
		if (err) {
			console.log("OMDB Error: " + err);
			logOutput("OMDB Error: " + err+'\n');
			return;
		}
		if (response.statusCode != 200) {
			console.log("Failed - OMDb Response Code: " + response.statusCode);
			logOutput("Failed - OMDb Response Code: " + response.statusCode+'\n');
			return;
		}

		var logStr = ""; // Save the output to this string and display it on console and append to log.txt
		var result = JSON.parse(body);
		logStr = logStr+"Title: " + result.Title+'\n';
		logStr = logStr+"Year: " + result.Year+'\n';

		if (result.Ratings.length == 0) {
			logStr = logStr+"Internet Movie Database Rating: Not Available"+'\n';
			logStr = logStr+"Rotten Tomatoes Rating: Not Available"+'\n';
		}

		if (result.Ratings.length == 1) {
			logStr = logStr+"Internet Movie Database Rating: " + result.Ratings[0].Value+'\n';
			logStr = logStr+"Rotten Tomatoes Rating: Not Available"+'\n';	
		}

		if (result.Ratings.length == 2) {
			logStr = logStr+"Internet Movie Database Rating: " + result.Ratings[0].Value+'\n';
			logStr = logStr+"Rotten Tomatoes Rating: " + result.Ratings[1].Value+'\n';
		}
		
		logStr = logStr+"Country: " + result.Country+'\n';
		logStr = logStr+"Language: " + result.Language+'\n';
		logStr = logStr+"Plot: " + result.Plot+'\n';
		logStr = logStr+"Actors: " + result.Actors+'\n';
		console.log(logStr);
		logOutput(logStr);
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