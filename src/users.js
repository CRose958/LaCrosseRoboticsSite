// Cloudflare Worker handler for user database (D1)
export async function getUserByUsername(env, username) {
  const stmt = env.DB.prepare('SELECT * FROM users WHERE username = ?');
  const user = await stmt.bind(username).first();
  return user;
}

export async function createUser(env, username, password_hash, email) {
  const stmt = env.DB.prepare('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)');
  await stmt.bind(username, password_hash, email).run();
  return await getUserByUsername(env, username);
}
