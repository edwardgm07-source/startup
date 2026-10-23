import { useEffect, useState } from 'react';

const mockWeatherConditions = [
  {
    temperature: 72,
    conditions: 'Clear',
    wind: '6 mph',
  },
  {
    temperature: 68,
    conditions: 'Partly cloudy',
    wind: '9 mph',
  },
  {
    temperature: 64,
    conditions: 'Light rain',
    wind: '12 mph',
  },
];

export function About() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherRequest, setWeatherRequest] = useState(0);

  useEffect(() => {
    setLoading(true);

    const weatherTimer = setTimeout(() => {
      const conditionIndex =
        weatherRequest % mockWeatherConditions.length;

      setWeather(mockWeatherConditions[conditionIndex]);
      setLoading(false);
    }, 700);

    return () => clearTimeout(weatherTimer);
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
          Penalty Duel is an online soccer game where two players compete in a
          five-round penalty shootout. Each player chooses where to shoot while
          the opponent chooses where the goalkeeper will dive.
        </p>
      </section>

      <section className="game-card">
        <h3>How to Play</h3>

        <ol>
          <li>Create an account or log in.</li>
          <li>Wait for another player to join the match.</li>
          <li>Choose the direction of your penalty kick.</li>
          <li>Try to score more goals than your opponent.</li>
          <li>Check the leaderboard to compare your results.</li>
        </ol>
      </section>

      <section className="game-card weather-card">
        <h3>Stadium Conditions</h3>

        <p>
          This data simulates information that will eventually come from a
          third-party weather service.
        </p>

        {loading ? (
          <p role="status">Loading stadium conditions...</p>
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
                <strong>Wind:</strong> {weather.wind}
              </li>
            </ul>

            <button
              className="btn btn-warning"
              type="button"
              onClick={refreshWeather}
            >
              Refresh Conditions
            </button>
          </>
        )}
      </section>

      <section className="game-card">
        <h3>Future Technology</h3>

        <ul>
          <li>User authentication for player accounts</li>
          <li>Database storage for scores and statistics</li>
          <li>WebSocket communication for live matches</li>
          <li>Third-party service for stadium weather</li>
        </ul>
      </section>
    </>
  );
}