const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Temporary memory storage. A database will replace this later.
const users = [];
const matches = [];

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/health', (_req, res) => {
  res.send({ status: 'ok' });
});

// Create a new account.
apiRouter.post('/auth/create', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password ?? '';

  if (!email.includes('@') || password.length < 4) {
    res.status(400).send({
      msg: 'Enter a valid email and a password with at least 4 characters.',
    });
    return;
  }

  if (findUser('email', email)) {
    res.status(409).send({
      msg: 'An account with this email already exists.',
    });
    return;
  }

  const user = await createUser(email, password);

  setAuthCookie(res, user.token);
  res.status(201).send(publicUser(user));
});

// Log in to an existing account.
apiRouter.post('/auth/login', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password ?? '';
  const user = findUser('email', email);

  if (user && (await bcrypt.compare(password, user.password))) {
    user.token = randomUUID();
    setAuthCookie(res, user.token);
    res.send(publicUser(user));
    return;
  }

  res.status(401).send({ msg: 'Invalid email or password.' });
});

// Log out of the current account.
apiRouter.delete('/auth/logout', (req, res) => {
  const user = findUser('token', req.cookies[authCookieName]);

  if (user) {
    delete user.token;
  }

  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Verify authentication before allowing protected requests.
function verifyAuth(req, res, next) {
  const user = findUser('token', req.cookies[authCookieName]);

  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  req.user = user;
  next();
}

// Return the currently authenticated player.
apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send(publicUser(req.user));
});

// Save a completed match for the authenticated player.
apiRouter.post('/matches', verifyAuth, (req, res) => {
  const playerScore = Number(req.body.playerScore);
  const opponentScore = Number(req.body.opponentScore);

  if (
    !Number.isInteger(playerScore) ||
    !Number.isInteger(opponentScore) ||
    playerScore < 0 ||
    opponentScore < 0 ||
    playerScore > 5 ||
    opponentScore > 5
  ) {
    res.status(400).send({
      msg: 'Scores must be integers from 0 to 5.',
    });
    return;
  }

  let result = 'draw';

  if (playerScore > opponentScore) {
    result = 'win';
  } else if (playerScore < opponentScore) {
    result = 'loss';
  }

  const match = {
    id: randomUUID(),
    player: req.user.name,
    email: req.user.email,
    playerScore,
    opponentScore,
    result,
    playedAt: new Date().toISOString(),
  };

  matches.unshift(match);
  res.status(201).send(publicMatch(match));
});

// Return the 20 most recent matches.
apiRouter.get('/matches', (_req, res) => {
  res.send(matches.slice(0, 20).map(publicMatch));
});

// Build and return the leaderboard.
apiRouter.get('/scores', (_req, res) => {
  const leaderboard = users
    .map((user) => {
      const userMatches = matches.filter(
        (match) => match.email === user.email,
      );

      return {
        name: user.name,
        games: userMatches.length,
        wins: userMatches.filter((match) => match.result === 'win').length,
        losses: userMatches.filter((match) => match.result === 'loss').length,
        draws: userMatches.filter((match) => match.result === 'draw').length,
      };
    })
    .filter((player) => player.games > 0)
    .sort(
      (playerA, playerB) =>
        playerB.wins - playerA.wins ||
        playerA.losses - playerB.losses ||
        playerB.games - playerA.games,
    );

  res.send(leaderboard);
});

apiRouter.use((_req, res) => {
  res.status(404).send({ msg: 'API endpoint not found.' });
});

app.use(function (err, _req, res, _next) {
  console.error(err);
  res.status(500).send({
    type: err.name,
    message: err.message,
  });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

async function createUser(email, password) {
  const user = {
    email,
    name: email.split('@')[0],
    password: await bcrypt.hash(password, 10),
    token: randomUUID(),
  };

  users.push(user);
  return user;
}

function findUser(field, value) {
  if (!value) {
    return null;
  }

  return users.find((user) => user[field] === value) ?? null;
}

function publicUser(user) {
  return {
    email: user.email,
    name: user.name,
  };
}

function publicMatch(match) {
  return {
    id: match.id,
    player: match.player,
    playerScore: match.playerScore,
    opponentScore: match.opponentScore,
    result: match.result,
    playedAt: match.playedAt,
  };
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Penalty Duel service listening on port ${port}`);
});