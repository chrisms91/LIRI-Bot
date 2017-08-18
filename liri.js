// Load keys
var KEYS = require('./keys.js');

// Initialize spotify api
// https://www.npmjs.com/package/node-spotify-api
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: KEYS.spotifyKeys.id,
  secret: KEYS.spotifyKeys.secret
});

// Initialize twitter api
// https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: KEYS.twitterKeys.consumer_key,
  consumer_secret: KEYS.twitterKeys.consumer_secret,
  access_token_key: KEYS.twitterKeys.access_token_key,
  access_token_secret: KEYS.twitterKeys.access_token_secret
});