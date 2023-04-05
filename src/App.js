import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`;
    const locationUrl = 'http://ip-api.com/csv/?fields=city';

    useEffect(() => {
        getCurrentLocationWeather();
    }, []);

    const getCurrentLocationWeather = () => {
        axios.get(locationUrl).then((response) => {
            getWeather(response.data);
        })
    }

    function getWeather (locationW) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${locationW}&appid=a39680dbbd4ddb6588211bfd2960858a&units=metric`).then((response) => {
                setData(response.data);
            })
    }

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            axios.get(url).then((response) => {
                setData(response.data);
                console.log(response.data);
            })
        }
    }

    return (
        <div className="app">
            <div className="search">
                <input value={location} onChange={event => setLocation(event.target.value)} onKeyPress={searchLocation}
                       type="text" placeholder='Enter Location' spellCheck="false"/>
                <div className="forecast_choice">
                    <button onClick={() => getWeather(location)} id='btn'>Current</button>
                    <button>24 hours</button>
                    <button>7 days</button>
                </div>
            </div>
            <div className="container">
                <div className="top">
                    <div className="location">
                        <p>{data.name}</p>
                    </div>
                    <div className="temp">
                        {data.main ? <h1>{Math.round(data.main.temp)}°C</h1> : null}
                    </div>
                    <div className="description">
                        {data.weather ? <p>{data.weather[0].main}</p> : null}
                    </div>
                </div>

                {data.name !== undefined &&
                    <div className="bottom">
                        <div className="feels">
                            {data.main ? <p>{Math.round(data.main.feels_like)} °C</p> : null}
                            <p>Feels Like</p>
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
