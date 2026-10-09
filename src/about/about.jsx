export function About() {
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

      <section className="game-card">
        <h3>Stadium Conditions</h3>
        <p>
          Current weather information from a third-party weather service will
          appear here.
        </p>

        <ul>
          <li>Location: Provo, Utah</li>
          <li>Temperature: 72°F</li>
          <li>Conditions: Clear</li>
        </ul>
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