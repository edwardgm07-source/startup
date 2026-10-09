import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Home } from './home/home.jsx';
import { Play } from './play/play.jsx';
import { Scores } from './scores/scores.jsx';
import { About } from './about/about.jsx';


export function App() {
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
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
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