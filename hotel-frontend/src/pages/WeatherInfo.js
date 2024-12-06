// WeatherInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // library for making HTTP requests

// display weather info
const WeatherInfo = () => {
    // state to store weather data and error messages
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    // useEffect runs after component mounts to fetch weather data
    useEffect(() => {
        // asynchronous function to fetch weather data
        const fetchWeather = async () => {
            try {
                const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
                // API request to OpenWeatherMap using Mobile, AL as an example
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Mobile&appid=${apiKey}`);
                setWeather(response.data); // save fetched data in the 'weather' state
            }   catch (err) {
                setError('Error fetching weather data');
            }
        };

        fetchWeather(); // call function to fetch weather data
    }, []); // runs only once after component mounts

    return (
        <div>
            <h2 className='weather title'>Weather and Area Information</h2>
            {weather ? (
                <div className='weather-details'>
                    <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                </div>
            ) : (
                <p className='weather-error'>{error || 'Loading weather data...'}</p>
            )}
            <div className='area-info'>
                <h3>About the area</h3>
                <p>Welcome! Nearby attractions include...</p>
                {/* insert image here... */}
            </div>
        </div>
    );
};

export default WeatherInfo;