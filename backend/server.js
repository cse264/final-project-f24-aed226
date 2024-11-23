require('dotenv').config(); // load env variables
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse json bodies

// routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('backend server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});