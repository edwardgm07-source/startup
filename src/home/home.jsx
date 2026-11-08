import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAccount, login } from '../data/api.js';

export function Home({ user, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setMessage('');
    }
  }, [user]);

  async function authenticate(mode) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes('@') || password.length < 4) {
      setMessage(
        'Enter a valid email and a password with at least 4 characters.',
      );
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const player =
        mode === 'create'
          ? await createAccount(normalizedEmail, password)
          : await login(normalizedEmail, password);

      onLogin(player);
      setEmail('');
      setPassword('');

      setMessage(
        mode === 'create'
          ? 'Account created successfully!'
          : 'Login successful!',
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    authenticate('login');
  }

  function handleCreateAccount() {
    authenticate('create');
  }

  function handleStartPlaying() {
    if (user) {
      navigate('/play');
    } else {
      setMessage('Please login or create an account before playing.');
    }
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Five rounds. One winner.</p>
          <h2>Welcome to Penalty Duel</h2>

          <p className="hero-description">
            Face another player in an exciting penalty shootout and prove who is
            the best from the penalty spot.
          </p>

          <button type="button" onClick={handleStartPlaying}>
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
        {user ? (
          <>
            <h3>Welcome, {user.name}!</h3>
            <p>Your player session is secured by the service.</p>

            {message && <p role="status">{message}</p>}

            <button type="button" onClick={() => navigate('/play')}>
              Continue to Match
            </button>
          </>
        ) : (
          <>
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
                  disabled={busy}
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
                  disabled={busy}
                  required
                />
              </div>

              {message && <p role="status">{message}</p>}

              <div className="form-actions">
                <button type="submit" disabled={busy}>
                  {busy ? 'Please wait...' : 'Login'}
                </button>

                <button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={busy}
                >
                  Create Account
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </>
  );
}