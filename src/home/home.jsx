import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/play');
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Five rounds. One winner.</p>
          <h2>Welcome to Penalty Duel</h2>

          <p className="hero-description">
            Face another player in an exciting penalty shootout and prove who
            is the best from the penalty spot.
          </p>

          <button type="button" onClick={() => navigate('/play')}>
            Start Playing
          </button>
        </div>

        <img
          className="hero-image"
          src="/placeholder.png"
          alt="Penalty Duel game placeholder"
          width="450"
        />
      </section>

      <section className="login-card">
        <h3>Login or create an account</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">Login</button>
            <button type="submit">Create Account</button>
          </div>
        </form>
      </section>
    </>
  );
}