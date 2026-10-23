const USER_KEY = 'penalty-duel-user';
const STATS_KEY = 'penalty-duel-stats';
const MATCHES_KEY = 'penalty-duel-matches';

const defaultStats = {
  matches: 0,
  wins: 0,
  goals: 0,
  streak: 0,
};

export function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function loadStats() {
  try {
    const savedStats = JSON.parse(localStorage.getItem(STATS_KEY));
    return savedStats ?? defaultStats;
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadMatches() {
  try {
    return JSON.parse(localStorage.getItem(MATCHES_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveMatch(match) {
  const matches = loadMatches();
  const updatedMatches = [match, ...matches].slice(0, 10);

  localStorage.setItem(MATCHES_KEY, JSON.stringify(updatedMatches));
}