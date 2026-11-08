import { useEffect, useState } from 'react';

const weatherUrl =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=40.2338' +
  '&longitude=-111.6585' +
  '&current=temperature_2m,weather_code,wind_speed_10m' +
  '&temperature_unit=fahrenheit' +
  '&wind_speed_unit=mph' +
  '&timezone=America%2FDenver';

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Light rain showers',
    81: 'Moderate rain showers',
    82: 'Heavy rain showers',
    95: 'Thunderstorm',
  };

  return descriptions[code] ?? 'Unknown conditions';
}

export function About() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weatherRequest, setWeatherRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(weatherUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Weather request failed (${response.status})`);
        }

        const data = await response.json();

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          conditions: getWeatherDescription(data.current.weather_code),
          wind: Math.round(data.current.wind_speed_10m),
          updatedAt: data.current.time,
        });
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [weatherRequest]);

  function refreshWeather() {
    setWeatherRequest((currentRequest) => currentRequest + 1);
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">The game behind the challenge</p>
        <h2>About Penalty Duel</h2>
      </section>

      <section className="game-card">
        <h3>Game Description</h3>

        <p>
          Penalty Duel is an online soccer game where players compete in a
          five-round penalty shootout. Choose where to shoot and try to score
          more goals than your opponent.
        </p>
      </section>

      <section className="game-card">
        <h3>How to Play</h3>

        <ol>
          <li>Create an account or log in.</li>
          <li>Open the Play page.</li>
          <li>Choose the direction of your penalty kick.</li>
          <li>Try to score more goals than your opponent.</li>
          <li>Check the leaderboard to compare your results.</li>
        </ol>
      </section>

      <section className="game-card weather-card">
        <h3>Stadium Conditions</h3>

        <p>
          Current outdoor conditions in Provo are provided by the Open-Meteo
          weather service.
        </p>

        {loading ? (
          <p role="status">Loading stadium conditions...</p>
        ) : error ? (
          <>
            <p role="alert">Could not load weather: {error}</p>

            <button
              className="btn btn-warning"
              type="button"
              onClick={refreshWeather}
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <ul className="weather-list">
              <li>
                <strong>Location:</strong> Provo, Utah
              </li>

              <li>
                <strong>Temperature:</strong> {weather.temperature}°F
              </li>

              <li>
                <strong>Conditions:</strong> {weather.conditions}
              </li>

              <li>
                <strong>Wind:</strong> {weather.wind} mph
              </li>

              <li>
                <strong>Last updated:</strong>{' '}
                {new Date(weather.updatedAt).toLocaleString()}
              </li>
            </ul>

            <button
              className="btn btn-warning"
              type="button"
              onClick={refreshWeather}
            >
              Refresh Conditions
            </button>

            <p>
              Weather data by{' '}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noreferrer"
              >
                Open-Meteo
              </a>
            </p>
          </>
        )}
      </section>

      <section className="game-card">
        <h3>Technology</h3>

        <ul>
          <li>Secure authentication for player accounts</li>
          <li>Service endpoints for scores and match history</li>
          <li>Third-party weather data from Open-Meteo</li>
          <li>Future database storage and WebSocket communication</li>
        </ul>
      </section>
    </>
  );
}