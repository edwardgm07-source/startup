import { useEffect, useRef, useState } from 'react';

import {
  loadStats,
  saveMatch,
  saveStats,
} from '../data/storage.js';

export function Play({ user }) {
  const [direction, setDirection] = useState('left');
  const [shots, setShots] = useState(0);
  const [goals, setGoals] = useState(0);
  const [opponentShots, setOpponentShots] = useState(0);
  const [opponentGoals, setOpponentGoals] = useState(0);
  const [message, setMessage] = useState(
    'Your opponent is ready. Take the first shot!'
  );

  const savedMatch = useRef(false);

  const playerName = user?.name ?? 'Guest';
  const opponentName = 'Alex';
  const matchComplete = shots === 5 && opponentShots === 5;
  const waitingForOpponent = opponentShots < shots;

  useEffect(() => {
    if (!waitingForOpponent || opponentShots >= 5) {
      return undefined;
    }

    const opponentTimer = setInterval(() => {
      const opponentScored = Math.random() >= 0.5;

      setOpponentShots((currentShots) => currentShots + 1);

      if (opponentScored) {
        setOpponentGoals((currentGoals) => currentGoals + 1);
        setMessage(`${opponentName} scored.`);
      } else {
        setMessage(`${opponentName} missed the shot.`);
      }
    }, 1500);

    return () => clearInterval(opponentTimer);
  }, [waitingForOpponent, opponentShots]);

  useEffect(() => {
    if (!matchComplete || savedMatch.current) {
      return;
    }

    savedMatch.current = true;

    const won = goals > opponentGoals;
    const draw = goals === opponentGoals;
    const result = won ? 'Win' : draw ? 'Draw' : 'Loss';

    const currentStats = loadStats();

    const updatedStats = {
      matches: currentStats.matches + 1,
      wins: currentStats.wins + (won ? 1 : 0),
      goals: currentStats.goals + goals,
      streak: won ? currentStats.streak + 1 : 0,
    };

    saveStats(updatedStats);

    saveMatch({
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      player: playerName,
      opponent: opponentName,
      playerGoals: goals,
      opponentGoals,
      result,
    });

    if (won) {
      setMessage(`You won ${goals}-${opponentGoals}!`);
    } else if (draw) {
      setMessage(`The match ended in a ${goals}-${opponentGoals} draw.`);
    } else {
      setMessage(`You lost ${goals}-${opponentGoals}. Try again!`);
    }
  }, [
    matchComplete,
    goals,
    opponentGoals,
    playerName,
  ]);

  function takeShot() {
    if (shots >= 5 || waitingForOpponent) {
      return;
    }

    const scored = Math.random() >= 0.5;

    setShots((currentShots) => currentShots + 1);

    if (scored) {
      setGoals((currentGoals) => currentGoals + 1);
      setMessage(`Goal! ${playerName} scored to the ${direction}.`);
    } else {
      setMessage(
        `Saved! The goalkeeper blocked the ${direction} shot.`
      );
    }
  }

  function playAgain() {
    savedMatch.current = false;
    setDirection('left');
    setShots(0);
    setGoals(0);
    setOpponentShots(0);
    setOpponentGoals(0);
    setMessage('Your opponent is ready. Take the first shot!');
  }

  function getResultMessage() {
    if (!matchComplete) {
      return 'The result will appear after both players take five shots.';
    }

    if (goals > opponentGoals) {
      return `${playerName} wins ${goals}-${opponentGoals}!`;
    }

    if (goals === opponentGoals) {
      return `Draw: ${goals}-${opponentGoals}.`;
    }

    return `${opponentName} wins ${opponentGoals}-${goals}.`;
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Five-round challenge</p>
        <h2>Penalty Shootout</h2>
        <p>
          Choose your direction, take your shot, and defeat your opponent.
        </p>
      </section>

      <div className="play-grid">
        <section className="game-card">
          <span className="status-badge">
            {matchComplete ? 'Match complete' : 'Opponent connected'}
          </span>

          <h3>Match</h3>

          <p>
            <strong>Player:</strong> {playerName}
          </p>

          <p>
            <strong>Opponent:</strong> {opponentName}
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
                <td>{playerName}</td>
                <td>{goals}</td>
                <td>{shots}</td>
              </tr>

              <tr>
                <td>{opponentName}</td>
                <td>{opponentGoals}</td>
                <td>{opponentShots}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section className="game-card">
        <h3>Take Your Shot</h3>

        <label htmlFor="shot-direction">
          Choose a direction:
        </label>

        <select
          id="shot-direction"
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
          disabled={shots >= 5 || waitingForOpponent}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>

        <button
          type="button"
          onClick={takeShot}
          disabled={shots >= 5 || waitingForOpponent}
        >
          {waitingForOpponent ? 'Opponent shooting...' : 'Kick!'}
        </button>
      </section>

      <section className="game-card">
        <h3>Live Match Updates</h3>
        <p role="status">{message}</p>
      </section>

      <section className="game-card">
        <h3>Game Result</h3>
        <p>{getResultMessage()}</p>

        <button
          type="button"
          onClick={playAgain}
          disabled={!matchComplete}
        >
          Play Again
        </button>
      </section>
    </>
  );
}