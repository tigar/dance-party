const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config()
require('dotenv').config();
var SpotifyWebApi = require('spotify-web-api-node');

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

var clientId = process.env.API_KEY,
  clientSecret = process.env.API_SECRET;

// Make an API object
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});



app.get('/api', function(request, response) {
  var playlist_data;
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The token is ' + data.body['access_token']);
  
      // Save the token
      spotifyApi.setAccessToken(data.body['access_token']);
  
      // Get info about the playlist and log it
    spotifyApi.getPlaylist(process.env.PLAYLIST_ID, { offset:20, limit: 10 })
    .then(function(data) {
      console.log("this");
      // console.log('Here is the playlist:', JSON.stringify(data.body));
      const fs = require('fs');
      fs.writeFileSync("test.txt", JSON.stringify(data.body, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
      response.json(data.body);
    }, function(err) {
      console.log('Something went wrong fetching the playlist!', err);
    });
    },
    function(err) {
      console.log('Error: Could not get access token', err);
    }
  );
  console.log("I am at the end of the line");
});

// app.get('/api', async function(request, response) {
//   let credentials;
//   try {
//     credentials = await spotifyApi.clientCredentialsGrant();
//   } catch (e) {
//     console.log('Error: Could not get access token');
//   }

//   try {
//     spotifyApi.setAccessToken(credentials.body['access_token']);
//     let data = await spotifyApi.getPlaylist(process.env.PLAYLIST_ID);
//   } catch (e) {
//     console.log('something went wrong fetching the playlist!');
//   }

//   console.log('Here is the playlist:', data.body['expires_in']);
//   response.json(data.body);
  
// });