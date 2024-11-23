const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// redirect users to spotify login
router.get('/login', (req, res) => {
    const scopes = ['playlist-modify-public', 'playlist-modify-private', 'user-read-email'];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

// callback after spotify login
router.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    try{
        const data = await spotifyApi.authorizationCodeGrant(code);
        console.log('Spotify API response:', data);
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);

        console.log('Redirecting with tokens: ', data.body['access_token'], data.body['refresh_token']);

        const redirectUrl = `http://localhost:3000/dashboard?access_token=${data.body['access_token']}&refresh_token=${data.body['refresh_token']}`;
        console.log('Redirecting to:', redirectUrl);

        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to authenticate'});
    }
});

module.exports = router;