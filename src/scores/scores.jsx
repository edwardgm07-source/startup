import { useEffect, useState } from 'react';

import {
  loadMatches,
  loadStats,
  loadUser,
} from '../data/storage.js';

const mockPlayers = [
  {
    name: 'GoalMaster',
    matches: 15,
    wins: 12,
    goals: 48,
  },
  {
    name: 'StrikeQueen',
    matches: 13,
    wins: 10,
    goals: 42,
  },
  {
    name: 'SuperKeeper',
    matches: 10,
    wins: 7,
    goals: 31,
  },
];

export function Scores() {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState(() => loadStats());
  const [matches, setMatches] = useState(() => loadMatches());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const databaseTimer = setTimeout(() => {
      const savedUser = loadUser();
      const savedStats = loadStats();
      const savedMatches = loadMatches();

      const currentPlayer = {
        name: savedUser?.name ?? 'Guest',
        matches: savedStats.matches,
        wins: savedStats.wins,
        goals: savedStats.goals,
      };

      const leaderboard = [...mockPlayers, currentPlayer].sort(
        (firstPlayer, secondPlayer) =>
          secondPlayer.wins - firstPlayer.wins ||
          secondPlayer.goals - firstPlayer.goals
      );

      setPlayers(leaderboard);
      setStats(savedStats);
      setMatches(savedMatches);
      setLoading(false);
    }, 600);

    return () => clearTimeout(databaseTimer);
  }, []);

  const winRate =
    stats.matches === 0
      ? 0
      : Math.round((stats.wins / stats.matches) * 100);

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Top competitors</p>
        <h2>Leaderboard</h2>
        <p>
          Leaderboard data is currently simulated while your statistics
          and match history are saved in this browser.
        </p>
      </section>

      <section className="game-card">
        <h3>Top Players</h3>

        {loading ? (
          <p role="status">Loading leaderboard...</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Matches</th>
                  <th>Wins</th>
                  <th>Goals</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player, index) => (
                  <tr key={`${player.name}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.matches}</td>
                    <td>{player.wins}</td>
                    <td>{player.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="game-card">
        <h3>Your Statistics</h3>

        <p>
          <strong>Matches played:</strong> {stats.matches}
        </p>

        <p>
          <strong>Matches won:</strong> {stats.wins}
        </p>

        <p>
          <strong>Total goals:</strong> {stats.goals}
        </p>

        <p>
          <strong>Current winning streak:</strong> {stats.streak}
        </p>

        <p>
          <strong>Win rate:</strong> {winRate}%
        </p>
      </section>

      <section className="game-card">
        <h3>Recent Matches</h3>

        {matches.length === 0 ? (
          <p>No completed matches yet. Play a match to create history.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Player</th>
                  <th>Opponent</th>
                  <th>Score</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.date}</td>
                    <td>{match.player}</td>
                    <td>{match.opponent}</td>
                    <td>
                      {match.playerGoals}-{match.opponentGoals}
                    </td>
                    <td>{match.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}