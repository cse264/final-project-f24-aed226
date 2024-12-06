// index.js backend
const express = require('express');
const bcrypt = require('bcryptjs'); // hashing passwords
const jwt = require('jsonwebtoken'); // generating and verifying JSON web tokens
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db'); // database connection

dotenv.config(); // load env variables

// initialize express application
const app = express();
const PORT = process.env.PORT || 5000;

// middleware configuration
app.use(cors());
app.use(express.json()); // parsing JSON data

// helper function to validate registration inputs
const validateRegistrationInput = (username, email, password) => {
    if (!username || !email || !password) return false;
    if (password.length < 6) return false;
    return true;
}

// route: user registration
app.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // validate input
    if (!validateRegistrationInput(username, email, password)) {
        return res.status(400).json({ message: 'Invalid input'});
    }

    try {
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert into database
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id', [username, email, hashedPassword, role]
        );
        const userId = result.rows[0].id; // get newly created user's ID
        res.json({ message: 'User registered successfully', userId});
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error registering user'});
    }
});

// route: user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // fetch user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // validate user and password
        if (user && await bcrypt.compare(password, user.password)) {
            // generate a JWT token with user ID and role
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h'});
            res.json({ message: 'Logged in successfully', token, role: user.role });
        } else {
            res.status(400).json({ message: 'Invalid credentials'});
        }
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error logging in'});
    }
});

// route: add comment
app.post('/api/comments', async (req, res) => {
    console.log("Request body:", req.body);
    const { text, guestId } = req.body;
    const timestamp = new Date();
    
    // validate comment text
    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }
    try {
        // insert comment into database
        await pool.query('INSERT INTO comments (guest_id, comment, timestamp) VALUES ($1, $2, $3)', [guestId, text, timestamp]);
        res.json({ message: 'Comment added successfully' });
    }   catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// route: add guest
app.post('/api/guests', async (req, res) => {
    const { user_id, check_in_date, check_out_date, room_type } = req.body;
    try {
        //check if guest already exists
        const existingGuest = await pool.query(
            'SELECT * FROM guests WHERE user_id = $1 AND check_in_date = $2 AND check_out_date = $3 AND room_type = $4',
            [user_id, check_in_date, check_out_date, room_type]
        );

        if (existingGuest.rows.length > 0) {
            return res.status(409).json({ message: 'Guest already exists' });
        }

        // insert new guest if they don't already exist
        const result = await pool.query(
            'INSERT INTO guests (user_id, check_in_date, check_out_date, room_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, check_in_date, check_out_date, room_type]
        );
        res.json(result.rows[0]);
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error adding guest" });
    }
});

// route: fetch all comments
app.get('/api/comments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments'); // query all comments
        res.json(result.rows);
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching comments'});
    }
});

// route: fetch all guests
app.get('/api/guests', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, user_id, check_in_date, check_out_date, room_type FROM guests');
        res.json(result.rows);
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching guest data' });
    }
});

// route: fetch a single user by ID
app.get('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// route: update guest details
app.put('/api/guests/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, check_in_date, check_out_date, room_type } = req.body;
    try {
        // update guest info in database
        const result = await pool.query(
            'UPDATE guests SET user_id = $1, check_in_date = $2, check_out_date = $3, room_type = $4 WHERE id = $5 RETURNING *',
            [user_id, check_in_date, check_out_date, room_type, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        res.json(result.rows[0]);
    }   catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error updating guest' });
    }
});

// start express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

