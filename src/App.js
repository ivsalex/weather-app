import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState();
    const [town, setTown] = useState('');
    const [favoriteTowns, setFavoriteTowns] = useState([]);
    const [showFavoriteTowns, setShowFavoriteTowns] = useState(false);
    const [currentForecast, setCurrentForecast] = useState('');
    const [invalidInput, setInvalidInput] = useState(false);
    const [weather, setWeather] = useState('');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`;
    const locationUrl = 'http://ip-api.com/csv/?fields=city';

    let image;
    switch (weather) {
        case 'Clouds':
            image = 'https://i.imgur.com/HibL0f3.jpg';
            break;
        case 'Snow':
            image = 'https://i.imgur.com/MITY8pC.jpg';
            break;
        case 'Rain':
            image = 'https://i.imgur.com/5QWgbOZ.jpg';
            break;
        case 'Clear':
            image = 'https://i.imgur.com/ERqASoA.jpg';
            break;
        case 'Fog':
            image = 'https://i.imgur.com/7qc9r5r.jpg';
            break;
        case 'Mist':
            image = 'https://i.imgur.com/Bo7yQKC.jpg';
            break;
        default:
            image = 'https://i.imgur.com/H1v1yn5.jpg'
    }

    useEffect(() => {
        setFavoriteTowns(JSON.parse(localStorage.getItem('towns')) || []);
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
            setWeather(response.data.weather[0].main);
        });
    }

    function getDetailedWeather(currentForecast, location) {
        let currentUrl;
        if (currentForecast === 'hourly')
            currentUrl = `https://pro.openweathermap.org/data/2.5/forecast/${currentForecast}?q=${location}&cnt=24&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`;
        else if (currentForecast === 'daily')
            currentUrl = `https://api.openweathermap.org/data/2.5/forecast/${currentForecast}?q=${location}&cnt=7&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`;
        else
            currentUrl = url;
        axios.get(currentUrl).then((response) => {
            setData(response.data);
            setCurrentForecast(currentForecast);
            setWeatherData(response.data.list);
            setTown(response.data.city.name);
        });
    }

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            axios.get(url).then((response) => {
                setInvalidInput(false);
                setData(response.data);
                setTown(response.data.name);
                getWeather(response.data.name);
            }).catch((error) => {
                if (error.response.status) {
                    if (error.response.status === 404) {
                        setInvalidInput(true);
                    }
                }
            })
            event.currentTarget.value = '';
        }
    }

    const addToFavorite = (town) => {
        if (favoriteTowns.includes(town)) {
            console.log('Town already added!');
        } else {
            setFavoriteTowns(favoriteTowns => [...favoriteTowns, town]);
            const newTowns = [...favoriteTowns, town];
            localStorage.setItem('towns', JSON.stringify(newTowns));
            console.log(town + ' marked as favorite!');
        }
    }

    const savedTowns = JSON.parse(localStorage.getItem("towns")) || [];


    return (
        <div className="app" style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.4)'

        }}>
            <div className="search">
                <div className="inputFavorite">
                    <input
                        onChange={event => setLocation(event.target.value.match(/^[A-Za-z]+/) ? event.target.value : null)}
                        onKeyPress={searchLocation} type="text"
                        placeholder={invalidInput ? "Try again!" : "Enter Location"} spellCheck="false"
                        pattern="[a-zA-Z]+" id={invalidInput ? "invalidInput" : ""}/>
                    <div className="show"
                         onClick={() => setShowFavoriteTowns(showFavoriteTowns !== true)}>
                        {favoriteTowns.length >= 1 && <p>★</p>}
                    </div>
                </div>
                {showFavoriteTowns && favoriteTowns.length >= 1 && <div className="nav">
                    <ul>
                        <li>
                            {savedTowns.map((town) => {
                                return favoriteTowns.length >= 1 && <div className="town">
                                    <button onClick={() => {
                                        getWeather(town);
                                        setLocation(town);
                                    }}>{town}</button>
                                    <button id="delete" onClick={() => {
                                        const newStorage = JSON.parse(localStorage.getItem("towns"))
                                            .filter(function (current) {
                                                return current !== town
                                            })
                                        localStorage.setItem("towns", JSON.stringify(newStorage));
                                        setFavoriteTowns(newStorage);
                                    }}>&#10005;
                                    </button>
                                </div>
                            })}
                        </li>
                    </ul>
                </div>}
                <div className=" forecast_choice">
                    <button onClick={() => getWeather(location)}>Current</button>
                    <button onClick={() => getDetailedWeather('hourly', location)}>Daily</button>
                    <button onClick={() => getDetailedWeather('daily', location)}>Weekly</button>
                </div>
            </div>
            <div className="container">
                <div className="location">
                    <div className="locationButton">
                        <p>{town}</p>
                        <button className={savedTowns.includes(town) ? "btn_active" : ""}
                                onClick={() => addToFavorite(town)}>★
                        </button>
                    </div>
                </div>
                <div className="top">
                    {currentForecast === 'current' && <div className=" current">
                        <div className="temp">
                            {data.main ? <h1>{Math.round(data.main.temp)}°C</h1> : null}
                        </div>
                        <div className="description">
                            {data.weather ? <p>{data.weather[0].main}</p> : null}
                        </div>
                    </div>}
                    {currentForecast === 'hourly' && <div className="detailed_forecast">
                        {weatherData.map((day) => {
                            return <div className="currentDay">
                                <div className="fullView">
                                    <div className="day">
                                        <p>{new Date(day.dt * 1000).toLocaleString('en-US', {weekday: "long"})}</p>
                                        <p>{new Date(day.dt * 1000).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="week_temp">
                                        <p>Temperature</p>
                                        <p>{Math.round(day.main.temp_max)}°C</p>
                                    </div>
                                    <div className="week_wind">
                                        <p>Wind</p>
                                        <p>{Math.round(day.wind.speed)} km/h</p>
                                    </div>
                                    <div className="week_humidity">
                                        <p>Humidity</p>
                                        <p>{day.main.humidity}%</p>
                                    </div>
                                    <div className="week_feels_like">
                                        <p>Feels Like</p>
                                        <p>{Math.round(day.main.feels_like)}°C</p>
                                    </div>
                                </div>
                                <div className="mobileView">
                                    <div className="day">
                                        <p>{new Date(day.dt * 1000).toLocaleString('en-US', {weekday: "long"})}</p>
                                        <p>{new Date(day.dt * 1000).toLocaleTimeString()}</p>
                                    </div>
                                    <div>
                                        <p>Temp: {Math.round(day.main.temp_max)}°C</p>
                                        <p>Wind: {Math.round(day.wind.speed)} km/h</p>
                                        <p>Humidity: {day.main.humidity}%</p>
                                        <p>Feels Like: {Math.round(day.main.feels_like)}°C</p>
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </div>}
                    {currentForecast === 'daily' && <div className="detailed_forecast">
                        {weatherData.map((day) => {
                            return <div className="currentDay">
                                <div className="fullView">
                                    <div className="day">
                                        <p>{new Date(day.dt * 1000).toLocaleString('ro-RO', {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric"
                                        })}</p>
                                    </div>
                                    <div className="week_temp">
                                        <p>Temperature</p>
                                        <p>{(day.temp.min).toFixed()}°C / {(day.temp.max).toFixed()}°C</p>
                                    </div>
                                    <div className="week_wind">
                                        <p>Wind</p>
                                        <p>{(day.speed).toFixed()}km/h</p>
                                    </div>
                                    <div className="week_humidity">
                                        <p>Humidity</p>
                                        <p>{(day.humidity)}%</p>
                                    </div>
                                    <div className="week_feels_like">
                                        <p>Feels Like</p>
                                        <p>{(day.feels_like.day).toFixed()}°C</p>
                                    </div>
                                </div>
                                <div className="mobileView">
                                    <div className="day">
                                        <p>{new Date(day.dt * 1000).toLocaleString('ro-RO', {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric"
                                        })}</p>
                                    </div>
                                    <div className="weatherInfo">
                                        <p>Temp: {(day.temp.min).toFixed()}°C / {(day.temp.max).toFixed()}°C</p>
                                        <p>Wind: {(day.speed).toFixed()}km/h</p>
                                        <p>Humidity: {(day.humidity)}%</p>
                                        <p>Feels Like: {(day.feels_like.day).toFixed()}°C</p>
                                    </div>
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