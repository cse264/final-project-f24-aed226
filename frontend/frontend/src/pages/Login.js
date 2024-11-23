import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [authTokens, setAuthTokens] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // check if the access and refresh tokens exist
        const query = new URLSearchParams(window.location.search);
        const accessToken = query.get('access_token');
        const refreshToken = query.get('refresh_token');
        console.log('URL Parameters:', query.toString());

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        if (accessToken && refreshToken) {
            // if tokens exist, store them in localStorage
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('refresh_token', refreshToken);

            setAuthTokens({ accessToken, refreshToken });
            console.log('Tokens found and stored:', accessToken, refreshToken);

            navigate('/dashboard');
        } else {
            console.log('No tokens found in URL. Please log in.')
        }
    }, [navigate]);

    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/login';
    };

    return (
        <div className = "flex items-center justify-center h-screen bg-gray-100">
            <button
                className="px-6 py-3 text-white bg-green-600 rounded hover:bg-green-500"
                onClick={handleLogin}
            >
                Log in with Spotify
            </button>
        </div>
    );
};

export default Login;