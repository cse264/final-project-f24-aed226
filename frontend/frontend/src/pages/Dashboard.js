import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [mood, setMood] = useState('happy');
    const [size, setSize] = useState(10);
    //const [authTokens, setAuthTokens] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');

        if (accessToken && refreshToken){
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        }
    }, []);

    const generatePlaylist = async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
            console.error('Access token or refresh token is missing');
            return;
        }

        setLoading(true);

        try{
            const response = await fetch('http://localhost:5000/playlists/generate-playlist', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({mood, size}),
            });
            const data = await response.json();
            console.log(data.tracks);

            if (response.ok){
                setPlaylist(data.tracks);
            } else {
            setError('Failed to generate a playlist');
            }
        } catch (error){
            setError('An error occurred while generating the playlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2x1 font-bold"> Generate a playlist</h1>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="energetic">Energetic</option>
            </select>
            <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="ml-2 border-gray-300 rounded"
            />
            <button onClick={generatePlaylist} className="px-4 py-2 ml-2 text-white bg-blue-600 rounded">
                Generate
            </button>

            {loading && <p>Loading...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {playlist && (
                <div className ="mt-4">
                    <h2 className="text-xl font-semibold">Generated Playlist:</h2>
                    <ul>
                        {playlist.map((track, index) => (
                            <li key={index} className="mt-2">
                                <p>{track.name} by {track.artist}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;