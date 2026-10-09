const players = [
  {
    rank: 1,
    name: 'GoalMaster',
    matches: 15,
    wins: 12,
    goals: 48,
  },
  {
    rank: 2,
    name: 'Edward',
    matches: 12,
    wins: 9,
    goals: 39,
  },
  {
    rank: 3,
    name: 'SuperKeeper',
    matches: 10,
    wins: 7,
    goals: 31,
  },
];

export function Scores() {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Top competitors</p>
        <h2>Leaderboard</h2>
        <p>
          These scores will eventually be retrieved from the Penalty Duel
          database.
        </p>
      </section>

      <section className="game-card">
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
              {players.map((player) => (
                <tr key={player.name}>
                  <td>{player.rank}</td>
                  <td>{player.name}</td>
                  <td>{player.matches}</td>
                  <td>{player.wins}</td>
                  <td>{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="game-card">
        <h3>Your Statistics</h3>
        <p>Matches played: 12</p>
        <p>Matches won: 9</p>
        <p>Total goals: 39</p>
        <p>Win rate: 75%</p>
      </section>
    </>
  );
}