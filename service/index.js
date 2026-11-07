const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/health', (_req, res) => {
  res.send({ status: 'ok' });
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

app.listen(port, () => {
  console.log(`Penalty Duel service listening on port ${port}`);
});