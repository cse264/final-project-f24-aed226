// WeatherInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherInfo = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`);
                setWeather(response.data);
            }   catch (err) {
                setError('Error fetching weather data');
            }
        };

        fetchWeather();
    }, []);

    return (
        <div>
            <h2>Weather and Area Information</h2>
            {weather ? (
                <div>
                    <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                </div>
            ) : (
                <p>{error || 'Loading weather data...'}</p>
            )}
            <div>
                <h3>About the area</h3>
                <p>Welcome! Nearby attractions include...</p>
                {/* insert image here... */}
            </div>
        </div>
    );
};

export default WeatherInfo;