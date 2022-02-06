require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req,res) => {
    spotifyApi.searchArtists(req.query.artistName).then((data) => {
        res.render('artist-search-results', { artists: data.body.artist});
    })
    .catch((err) => {
        console.log('Ups sorry!', err)
    });
});

app.get('/albums/:id', (req, res) => {
   spotifyApi.getAlbumTracks(req.params.id).then((data) => {
       res.render('albums', {albums:data.body});
   }); 
});

app.get("/tracks/:id", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id).then((data) => {
        res.render('view-tracks', {tracks:data.body});
    });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
