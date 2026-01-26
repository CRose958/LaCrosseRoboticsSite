import { getUserByUsername, createUser } from './users.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/register' && request.method === 'POST') {
      const { username, password, email } = await request.json();
      if (!username || !password || !email) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
      // Simple hash (for demo only, use a real hash in production)
      const password_hash = await hashPassword(password);
      try {
        const user = await createUser(env, username, password_hash, email);
        return new Response(JSON.stringify({ id: user.id, username: user.username, email: user.email }), { status: 201 });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'User exists or DB error' }), { status: 400 });
      }
    }
    if (url.pathname === '/api/user' && request.method === 'GET') {
      const username = url.searchParams.get('username');
      if (!username) {
        return new Response(JSON.stringify({ error: 'Missing username' }), { status: 400 });
      }
      const user = await getUserByUsername(env, username);
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }
      // Expose password_hash for login (demo only)
      return new Response(JSON.stringify({ id: user.id, username: user.username, email: user.email, password_hash: user.password_hash }), { status: 200 });
    }
    return new Response('Hello from La Crosse Robotics Cloudflare Worker!');
  }
}

// Simple password hash (for demo only, use a secure hash in production)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
