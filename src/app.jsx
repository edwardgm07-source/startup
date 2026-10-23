import { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Home } from './home/home.jsx';
import { Play } from './play/play.jsx';
import { Scores } from './scores/scores.jsx';
import { About } from './about/about.jsx';
import { clearUser, loadUser } from './data/storage.js';

export function App() {
  const [user, setUser] = useState(() => loadUser());

  function handleLogout() {
    clearUser();
    setUser(null);
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>⚽ Penalty Duel</h1>

          <nav>
            <menu>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/play">Play</NavLink>
              </li>
              <li>
                <NavLink to="/scores">Scores</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
            </menu>
          </nav>

          <div className="user-session">
            {user ? (
              <>
                <span>Player: {user.name}</span>

                <NavLink to="/" onClick={handleLogout}>
                  Logout
                </NavLink>
              </>
            ) : (
              <span>Guest player</span>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={<Home user={user} onLogin={setUser} />}
            />
            <Route path="/play" element={<Play user={user} />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={<Home user={user} onLogin={setUser} />}
            />
          </Routes>
        </main>

        <footer>
          <span>Created by Edward Gómez</span>

          <a href="https://github.com/edwardgm07-source/startup">
            GitHub
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}