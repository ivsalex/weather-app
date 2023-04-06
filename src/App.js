import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState();
    const [town, setTown] = useState('');
    const [currentForecast, setCurrentForecast] = useState('');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`;
    const locationUrl = 'http://ip-api.com/csv/?fields=city';

    useEffect(() => {
        getCurrentLocationWeather();
        // eslint-disable-next-line
    }, []);

    const getCurrentLocationWeather = () => {
        axios.get(locationUrl).then((response) => {
            setLocation(response.data);
            getWeather(response.data);
        })
    }

    function getWeather(location) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`).then((response) => {
            setData(response.data);
            setCurrentForecast('current');
            setTown(response.data.name);
        });
    }

    function getWeeklyWeather(location) {
        axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&cnt=7&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`).then((response) => {
            setData(response.data);
            setCurrentForecast('weekly');
            setWeatherData(response.data.list);
            setTown(response.data.city.name);
        });
    }

    function getHourlyWeather(location) {
        axios.get(`https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${location}&cnt=24&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`).then((response) => {
            setData(response.data);
            setCurrentForecast('hourly');
            setWeatherData(response.data.list);
            setTown(response.data.city.name);
        });
    }

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            axios.get(url).then((response) => {
                setData(response.data);
                setTown(response.data.name);
                getWeather(response.data.name);
            })
        }
    }

    return (
        <div className="app">
            <div className="search">
                <input onChange={event => setLocation(event.target.value)}
                       onKeyPress={searchLocation}
                       type="text" placeholder='Enter Location' spellCheck="false"/>
                <div className="forecast_choice">
                    <button onClick={() => getWeather(location)}>Current</button>
                    <button onClick={() => getHourlyWeather(location)}>Daily</button>
                    <button onClick={() => getWeeklyWeather(location)}>Weekly</button>
                </div>
            </div>
            <div className="container">
                <div className="location">
                    <p>{town}</p>
                </div>
                <div className="top">
                    {currentForecast === 'current' && <div className="current">
                        <div className="temp">
                            {data.main ? <h1>{Math.round(data.main.temp)}°C</h1> : null}
                        </div>
                        <div className="description">
                            {data.weather ? <p>{data.weather[0].main}</p> : null}
                        </div>
                    </div>}
                    {currentForecast === 'weekly' && <div className="detailed_forecast">
                        {weatherData.map((day) => {
                            return <div className="currentDay">
                                <div className="day">
                                    <p>{new Date(day.dt * 1000).toLocaleString("ro-RO", {day: "numeric", month: "numeric", year: "numeric"})}</p>
                                </div>
                                <div className="week_temp">
                                    <p>Temperature</p>
                                    <p>{Math.round(day.temp.min)}°C / {Math.round(day.temp.max)}°C</p>
                                </div>
                                <div className="week_wind">
                                    <p>Wind</p>
                                    <p>{Math.round(day.speed)} km/h</p>
                                </div>
                                <div className="week_humidity">
                                    <p>Humidity</p>
                                    <p>{day.humidity}%</p>
                                </div>
                                <div className="week_feels_like">
                                    <p>Feels Like</p>
                                    <p>{Math.round(day.feels_like.night)}°C
                                        / {Math.round(day.feels_like.day)}°C</p>
                                </div>
                            </div>
                        })
                        }
                    </div>}
                    {currentForecast === 'hourly' && <div className="detailed_forecast">
                        {weatherData.map((day) => {
                            return <div className="currentDay">
                                <div className="day">
                                    <p>{new Date(day.dt * 1000).toLocaleString("ro-RO")}</p>
                                </div>
                                <div className="week_temp">
                                    <p>Temperature</p>
                                    <i className="fa-solid fa-droplet-percent"/>
                                    <p>{(day.main.temp_min).toFixed()}°C / {(day.main.temp_max).toFixed()}°C</p>
                                </div>
                                <div className="week_wind">
                                    <p>Wind</p>
                                    <p>{(day.wind.speed).toFixed()}km/h</p>
                                </div>
                                <div className="week_humidity">
                                    <p>Humidity</p>
                                    <p>{(day.main.humidity)}%</p>
                                </div>
                                <div className="week_feels_like">
                                    <p>Feels Like</p>
                                    <p>{(day.main.feels_like).toFixed()}°C</p>
                                </div>
                            </div>
                        })
                        }
                    </div>}
                </div>
                {data.name !== undefined && currentForecast === 'current' &&
                    <div className="bottom">
                        <div className="feels">
                            {data.main ? <p>{Math.round(data.main.feels_like)} °C</p> : null}
                            <p>Feels like</p>
                        </div>
                        <div className="humidity">
                            {data.main ? <p>{data.main.humidity} %</p> : null}
                            <p>Humidity</p>
                        </div>
                        <div className="wind">
                            {data.main ? <p>{data.wind.speed.toFixed()} km/h</p> : null}
                            <p>Wind</p>
                        </div>
                    </div>}
            </div>
        </div>
    );
}

export default App;
