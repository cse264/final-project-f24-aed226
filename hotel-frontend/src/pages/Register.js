// Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                email,
                password,
            });
            setMessage(response.data.message);
        }   catch (err) {
            setMessage(err.response?.data?.message || 'Error registering user');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2 className='register-title'>Create an account</h2>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: '10px', marginRight: '10px' }}
                required
            />
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: '10px', marginRight: '10px' }}
                required
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: '30px', marginRight: '50px' }}
                required
            />
            <Button type="submit">Register</Button>
            {message && <p>{message}</p>}
            <p className='register-redirect'>
                Already have an account? <Link to="/login">Login here</Link>.
            </p>
        </form>
    );
};

export default Register;