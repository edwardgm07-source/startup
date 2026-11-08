async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.msg || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getCurrentUser() {
  return request('/api/auth/me');
}

export function createAccount(email, password) {
  return request('/api/auth/create', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return request('/api/auth/logout', {
    method: 'DELETE',
  });
}

export function saveMatch(playerScore, opponentScore) {
  return request('/api/matches', {
    method: 'POST',
    body: JSON.stringify({
      playerScore,
      opponentScore,
    }),
  });
}

export function getMatches() {
  return request('/api/matches');
}

export function getScores() {
  return request('/api/scores');
}