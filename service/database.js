const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const userName = encodeURIComponent(config.userName);
const password = encodeURIComponent(config.password);
const connectionString =
  `mongodb+srv://${userName}:${password}@${config.hostname}`;

const client = new MongoClient(connectionString);
const database = client.db('penaltyDuel');
const userCollection = database.collection('user');
const matchCollection = database.collection('match');

async function connect() {
  await client.connect();
  await ping();

  await userCollection.createIndex({ email: 1 }, { unique: true });
  await userCollection.createIndex({ token: 1 }, { sparse: true });
  await matchCollection.createIndex({ playedAt: -1 });
  await matchCollection.createIndex({ email: 1 });

  console.log('Connected to MongoDB');
}

async function ping() {
  await database.command({ ping: 1 });
}

async function getUserByEmail(email) {
  return userCollection.findOne({ email });
}

async function getUserByToken(token) {
  if (!token) {
    return null;
  }

  return userCollection.findOne({ token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
  return user;
}

async function updateUserToken(email, token) {
  await userCollection.updateOne(
    { email },
    { $set: { token } },
  );
}

async function clearUserToken(token) {
  if (token) {
    await userCollection.updateOne(
      { token },
      { $unset: { token: '' } },
    );
  }
}

async function addMatch(match) {
  await matchCollection.insertOne(match);
  return match;
}

async function getRecentMatches() {
  return matchCollection
    .find({})
    .sort({ playedAt: -1 })
    .limit(20)
    .toArray();
}

async function getLeaderboard() {
  return matchCollection
    .aggregate([
      {
        $group: {
          _id: '$email',
          name: { $first: '$player' },
          games: { $sum: 1 },
          wins: {
            $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] },
          },
          losses: {
            $sum: { $cond: [{ $eq: ['$result', 'loss'] }, 1, 0] },
          },
          draws: {
            $sum: { $cond: [{ $eq: ['$result', 'draw'] }, 1, 0] },
          },
        },
      },
      { $sort: { wins: -1, losses: 1, games: -1 } },
      {
        $project: {
          _id: 0,
          name: 1,
          games: 1,
          wins: 1,
          losses: 1,
          draws: 1,
        },
      },
    ])
    .toArray();
}

module.exports = {
  connect,
  ping,
  getUserByEmail,
  getUserByToken,
  addUser,
  updateUserToken,
  clearUserToken,
  addMatch,
  getRecentMatches,
  getLeaderboard,
};