import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const LAST_CITY_KEY = "weather-dashboard:last-city";

// Maps OpenWeatherMap's "main" condition to an emoji + a background gradient class.
// Keeping this as a lookup table (not a chain of if/else) makes it trivial to extend later.
const CONDITION_STYLES = {
  Clear: { icon: "☀️", gradient: "gradient-clear" },
  Clouds: { icon: "☁️", gradient: "gradient-clouds" },
  Rain: { icon: "🌧️", gradient: "gradient-rain" },
  Drizzle: { icon: "🌦️", gradient: "gradient-rain" },
  Thunderstorm: { icon: "⛈️", gradient: "gradient-storm" },
  Snow: { icon: "❄️", gradient: "gradient-snow" },
  Mist: { icon: "🌫️", gradient: "gradient-mist" },
  Fog: { icon: "🌫️", gradient: "gradient-mist" },
  Haze: { icon: "🌫️", gradient: "gradient-mist" },
};
const DEFAULT_STYLE = { icon: "🌡️", gradient: "gradient-clear" };

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null); // null = nothing loaded yet
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "error" | "success"
  const [errorMessage, setErrorMessage] = useState("");

  // Core fetch logic, shared by both the form submit and the "load last city" effect below.
  async function fetchWeather(cityName) {
    if (!cityName.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&units=metric&appid=${API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Couldn't find a city called "${cityName}". Check the spelling and try again.`);
        }
        if (response.status === 401) {
          throw new Error("Weather API key is missing or invalid — check your .env file.");
        }
        throw new Error("Something went wrong fetching the weather. Please try again.");
      }

      const data = await response.json();
      setWeather(data);
      setCity(data.name); // Update to show actual city name from API
      setStatus("success");
      localStorage.setItem(LAST_CITY_KEY, data.name);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  }

  // On first load only: if the user searched before, load that city automatically
  // so the app feels alive instead of showing a blank search box every time.
  useEffect(() => {
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastCity) {
      setCity(lastCity);
      fetchWeather(lastCity);
    }
  }, []);

  // Keep the browser tab title in sync with whatever is currently on screen.
  useEffect(() => {
    document.title = weather
      ? `${Math.round(weather.main.temp)}°C in ${weather.name} — Weather Dashboard`
      : "Weather Dashboard";
  }, [weather]);

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  }

  const conditionMain = weather?.weather?.[0]?.main;
  const style = CONDITION_STYLES[conditionMain] || DEFAULT_STYLE;

  return (
    <div className={`app ${status === "success" ? style.gradient : "gradient-default"}`}>
      <div className="card">
        <h1 className="title">Weather Dashboard</h1>
        <p className="subtitle">Check current conditions for any city, instantly.</p>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Try Coimbatore, Chennai, Tokyo…"
            className="search-input"
            aria-label="City name"
          />
          <button type="submit" className="search-button" disabled={status === "loading"}>
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Conditional rendering: this block is the whole reason useState/status exists */}
        {status === "idle" && (
          <p className="hint">Enter a city above to see the current weather.</p>
        )}

        {status === "loading" && (
          <div className="state-block">
            <div className="spinner" aria-hidden="true" />
            <p>Fetching weather…</p>
          </div>
        )}

        {status === "error" && (
          <div className="state-block error">
            <p>⚠️ {errorMessage}</p>
          </div>
        )}

        {status === "success" && weather && (
          <div className="weather-result">
            <div className="weather-icon">{style.icon}</div>
            <div className="temp">{Math.round(weather.main.temp)}°C</div>
            <div className="location">
              {weather.name}, {weather.sys.country}
            </div>
            <div className="condition">{weather.weather[0].description}</div>

            <div className="stats-grid">
              <div className="stat">
                <span className="stat-label">Feels like</span>
                <span className="stat-value">{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="stat">
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{weather.main.humidity}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Wind</span>
                <span className="stat-value">{weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">Built with React · Data from OpenWeatherMap</footer>
    </div>
  );
}

export default App;
