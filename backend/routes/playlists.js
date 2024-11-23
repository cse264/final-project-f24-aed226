const express = require('express');
const pool = require('../config/db');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const router = express.Router();
const spotifyApi = new SpotifyWebApi();

router.post('/generate-playlist', async (req, res) => {
    const {mood, size, accessToken } = req.body;

    spotifyApi.setAccessToken(accessToken);

    try {
        const recommendations = await spotifyApi.getRecommendations({
            seed_genres: [mood],
            limit: size,
        });

        const tracks = recommendations.body.tracks.map((track) => track.uri);
        res.json({tracks});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to generate playlist'});
    }
});

router.post('/save-playlist', async (req, res) => {
    const {userId, playlistName, tracks} = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO playlists (user_id, name, date_created, mood, tracks) VALUES ($1, $2, NOW(), $3, $4) RETURNING *',
            [userId, playlistName, mood, JSON.stringify(tracks)]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save playlist'});
    }
});

module.exports = router;