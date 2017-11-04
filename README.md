# Liri-Node-App

Also known as 'LIRI Bot'

### Overview

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

### Packages used
Twitter (https://www.npmjs.com/package/twitter)
   
Spotify (https://www.npmjs.com/package/node-spotify-api)
   
Request(https://www.npmjs.com/package/request)

FS (File System included in the basic NPM package)

### Text File: 'random.txt'
Contains default command and strings in case user gives 'do-what-it-says' command

### Functionality

Make it so liri.js can take in one of the following commands:

1. `node liri.js my-tweets`

   * This will show the last 20 tweets and when they were created at in the terminal/bash window.

   * If no tweeter name is provided then the program defaults to 'Barack Obama'

2. `node liri.js spotify-this-song '<song name here>'`

	 * This will show the following information about the song in your terminal/bash window
     
     * Artist(s)
     
     * The song's name
     
     * A preview link of the song from Spotify
     
     * The album that the song is from

     * If no song is provided then your program defaults to "The Sign" by Ace of Base.

3. `node liri.js movie-this '<movie name here>'`

   * This will output the following information to the terminal/bash window:

     ```
       * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
     ```

   * If the user doesn't type a movie in, the program outputs data for the movie 'Mr. Nobody.'

4. `node liri.js do-what-it-says`
   
   * LIRI takes the text inside of random.txt and then use it to call one of LIRI's commands.
     
     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
     
     * Feel free to change the text in that document to test out the feature for other commands.

5. `node liri.js [help]`

	* If no command is proided or if 'help' is given then display the format for the liri command.

### Additions

* Everytime a command is run, the output is logged to `log.txt` file.

## Copyright

Coding Boot Camp (C) 2016. All Rights Reserved.
