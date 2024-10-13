import { useEffect, useState } from "react";
import axios from "axios";
import cloudy from "../assets/images/cloudy.png";
import loading from "../assets/images/loading.gif";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import sunny from "../assets/images/sunny.png";
import { API_KEY } from "../apiKey";
import "./weatherApp.css";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const weatherImages = {
  Clear: sunny,
  Clouds: cloudy,
  Rain: rainy,
  Snow: snowy,
  Haze: cloudy,
  Mist: cloudy,
};

const backgroundImages = {
  Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',  // Orange for clear weather
  Clouds: 'linear-gradient(to right, #57d6d4, #f71eec)', // Light blue and pink for clouds
  Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',   // Cool blue for rain
  Snow: 'linear-gradient(to right, #aff2ff, #fff)',      // Light cold gradient for snow
  Haze: 'linear-gradient(to right, #a3d3f3, #d6e6f2)',   // Light blue for haze
  Mist: 'linear-gradient(to right, #ddd, #eee)',         // Light neutral gradient for mist
};

const cities = [
  { name: "New York", timezone: "America/New_York" },
  { name: "London", timezone: "Europe/London" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Paris", timezone: "Europe/Paris" },
  { name: "Mumbai", timezone: "Asia/Kolkata" },
  { name: "Moscow", timezone: "Europe/Moscow" },
  { name: "Cape Town", timezone: "Africa/Johannesburg" },
];

const WeatherApp = function () {
  const [city, setCity] = useState("Mumbai");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [times, setTimes] = useState({});
  const [background, setBackground] = useState(backgroundImages.Clear);
  const [cityWeather, setCityWeather] = useState({});

  useEffect(() => {
    fetchResult();
    fetchTimes();
    fetchCityWeather();
  }, [city]);

  const fetchResult = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { q: city, appid: API_KEY, units: "metric" },
      });
      setData(response.data);
      const weatherCondition = response.data?.weather?.[0]?.main;
      if (weatherCondition) {
        setBackground(backgroundImages[weatherCondition] || backgroundImages.Clear);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCityWeather = async () => {
    const weatherData = {};
    for (let city of cities) {
      try {
        const response = await axios.get(API_URL, {
          params: { q: city.name, appid: API_KEY, units: "metric" },
        });
        weatherData[city.name] = {
          main: response.data.weather[0].main,
          temp: response.data.main.temp,
        };
      } catch (error) {
        console.error(`Error fetching weather data for ${city.name}:`, error);
      }
    }
    setCityWeather(weatherData);
  };

  const fetchTimes = () => {
    const currentTimes = {};
    cities.forEach((city) => {
      const time = new Date().toLocaleString("en-US", {
        timeZone: city.timezone,
        hour: "2-digit",
        minute: "2-digit",
      });
      currentTimes[city.name] = time;
    });
    setTimes(currentTimes);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    if (value) {
      setCity(value);
    }
  };

  return (
    <div className="container" style={{ backgroundImage: background }}>
      {/* Header Section */}
      <div className="header">
        <h1 className="header-title">Weather Application with API</h1>
        <input
          type="text"
          className="city-input"
          onChange={handleInputChange}
          placeholder="Enter city name to get the temprature"
        />
      </div>

      {/* Middle Section for Weather Information */}
      <div className="weather-details">
        {isLoading ? (
          <img src={loading} alt="Loading" />
        ) : (
          data?.weather?.[0]?.main && (
            <div className="weather-info">
              <h2>{city}</h2>
              <p>{data.weather[0].main}</p>
              <p>Temperature: {data.main?.temp}°C</p>
              <img
                src={weatherImages[data.weather[0].main]}
                alt={data.weather[0].main}
                className="weather-icon"
              />
            </div>
          )
        )}
      </div>

      {/* Footer Section for Other Cities */}
      <div className="footer">
        {cities.map((city) => (
          <div
            key={city.name}
            className="city-tile"
            style={{
              backgroundImage: backgroundImages[cityWeather[city.name]?.main || "Clear"],
            }}
          >
            <div className="city-info">
              <h3>{city.name}</h3>
              <p>{times[city.name]}</p>
              <p>{cityWeather[city.name]?.main} | {cityWeather[city.name]?.temp}°C</p>
            </div>
            <div className="city-image">
              <img
                src={weatherImages[cityWeather[city.name]?.main || "Clear"]}
                alt={city.name}
                className="city-weather-icon"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
