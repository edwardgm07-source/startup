import { useState } from 'react';

export function Play() {
  const [direction, setDirection] = useState('left');
  const [shots, setShots] = useState(0);
  const [goals, setGoals] = useState(0);
  const [message, setMessage] = useState(
    'Waiting for an opponent to connect...'
  );

  function takeShot() {
    const scored = Math.random() >= 0.5;

    setShots((currentShots) => currentShots + 1);

    if (scored) {
      setGoals((currentGoals) => currentGoals + 1);
      setMessage(`Goal! Edward scored to the ${direction}.`);
    } else {
      setMessage(`Saved! The goalkeeper blocked the ${direction} shot.`);
    }
  }

  function playAgain() {
    setDirection('left');
    setShots(0);
    setGoals(0);
    setMessage('Waiting for an opponent to connect...');
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Five-round challenge</p>
        <h2>Penalty Shootout</h2>
        <p>Choose your direction, take your shot, and defeat your opponent.</p>
      </section>

      <div className="play-grid">
        <section className="game-card">
          <span className="status-badge">Waiting for opponent</span>
          <h3>Match</h3>

          <p>
            <strong>Player:</strong> Edward
          </p>
          <p>
            <strong>Opponent:</strong> Waiting for another player...
          </p>
          <p>
            <strong>Round:</strong> {Math.min(shots + 1, 5)} of 5
          </p>
        </section>

        <section className="game-card">
          <h3>Score</h3>

          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Goals</th>
                <th>Shots</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Edward</td>
                <td>{goals}</td>
                <td>{shots}</td>
              </tr>
              <tr>
                <td>Opponent</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section className="game-card">
        <h3>Take Your Shot</h3>

        <label htmlFor="shot-direction">Choose a direction:</label>
        <select
          id="shot-direction"
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
          disabled={shots >= 5}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>

        <button type="button" onClick={takeShot} disabled={shots >= 5}>
          Kick!
        </button>
      </section>

      <section className="game-card">
        <h3>Live Match Updates</h3>
        <p>{message}</p>
      </section>

      <section className="game-card">
        <h3>Game Result</h3>
        <p>
          {shots >= 5
            ? `Match complete! Edward scored ${goals} goals.`
            : 'The result will appear after five shots.'}
        </p>
        <button type="button" onClick={playAgain}>
          Play Again
        </button>
      </section>
    </>
  );
}