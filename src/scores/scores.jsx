import { useEffect, useState } from 'react';

import { getMatches, getScores } from '../data/api.js';

const emptyStats = {
  games: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

export function Scores({ user }) {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadScoreData() {
      try {
        const [scoreData, matchData] = await Promise.all([
          getScores(),
          getMatches(),
        ]);

        if (active) {
          setPlayers(scoreData);
          setMatches(matchData);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadScoreData();

    return () => {
      active = false;
    };
  }, []);

  const currentStats =
    players.find((player) => player.name === user?.name) ?? emptyStats;

  const winRate =
    currentStats.games === 0
      ? 0
      : Math.round((currentStats.wins / currentStats.games) * 100);

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Top competitors</p>
        <h2>Leaderboard</h2>
        <p>
          Player statistics and recent matches are loaded from the Penalty Duel
          service.
        </p>
      </section>

      <section className="game-card">
        <h3>Top Players</h3>

        {loading ? (
          <p role="status">Loading leaderboard...</p>
        ) : error ? (
          <p role="alert">Could not load scores: {error}</p>
        ) : players.length === 0 ? (
          <p>No completed matches yet. Play a match to join the leaderboard.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Games</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Draws</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player, index) => (
                  <tr key={player.name}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.games}</td>
                    <td>{player.wins}</td>
                    <td>{player.losses}</td>
                    <td>{player.draws}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="game-card">
        <h3>Your Statistics</h3>

        {user ? (
          <>
            <p>
              <strong>Player:</strong> {user.name}
            </p>

            <p>
              <strong>Matches played:</strong> {currentStats.games}
            </p>

            <p>
              <strong>Matches won:</strong> {currentStats.wins}
            </p>

            <p>
              <strong>Matches lost:</strong> {currentStats.losses}
            </p>

            <p>
              <strong>Draws:</strong> {currentStats.draws}
            </p>

            <p>
              <strong>Win rate:</strong> {winRate}%
            </p>
          </>
        ) : (
          <p>Log in to view your personal statistics.</p>
        )}
      </section>

      <section className="game-card">
        <h3>Recent Matches</h3>

        {loading ? (
          <p role="status">Loading recent matches...</p>
        ) : error ? (
          <p role="alert">Could not load matches: {error}</p>
        ) : matches.length === 0 ? (
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
                    <td>{new Date(match.playedAt).toLocaleString()}</td>
                    <td>{match.player}</td>
                    <td>Alex</td>
                    <td>
                      {match.playerScore}-{match.opponentScore}
                    </td>
                    <td>
                      {match.result.charAt(0).toUpperCase() +
                        match.result.slice(1)}
                    </td>
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