const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config()
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

//Spin up a server
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

var SpotifyWebApi = require('spotify-web-api-node');

var clientId = process.env.API_KEY,
  clientSecret = process.env.API_SECRET;

// Make an API object
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Get the token using the credentials
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The token is ' + data.body['access_token']);

    // Save the token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Get info about the playlist and log it
    spotifyApi.getPlaylist(process.env.PLAYLIST_ID)
  .then(function(data) {
    console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong fetching the playlist!', err);
  });
  },
  function(err) {
    console.log('Error: Could not get access token', err);
  }
);



app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);

  const api_key = process.env.API_KEY;
  const api_secret = process.env.API_SECRET;

  const spotify_url = `https://api.spotify.com/v1/${api_key}/`;
  const spotify_response = await fetch(spotify_url);
  const spotify_data = await spotify_response.json();

  const data = {
    air_quality: spotify_data
  };
  response.json(data);
});
