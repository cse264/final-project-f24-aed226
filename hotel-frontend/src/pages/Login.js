// Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post('http://localhost:5000/api/login', { email, password });
            console.log("Login response:", data);
            if (data.token) {
                localStorage.setItem("authToken", data.token); // store token
                onLogin(data.role); // update authentication state
                navigate('/dashboard');
            }
        }   catch (error) {
            console.error("Login error:", error);
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ marginBottom: '15px', marginRight: '15px' }} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ marginBottom: '30px', marginRight: '90px' }} />
            <Button type="submit">Login</Button>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>.
            </p>
        </form>
    );
};

export default Login;