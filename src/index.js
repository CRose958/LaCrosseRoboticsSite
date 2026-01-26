// --- Simple Session Auth (Phase 2 foundation) ---
const SESSION_SECRET = 'changeme'; // TODO: Use env var or secret
function getSessionUser(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  // In production, verify session token in DB or JWT
  // For demo, accept any non-empty session
  return match[1] ? { username: 'admin', id: 1 } : null;
}

import { getUserByUsername, createUser } from './users.js';
import { listFiles, getFileContent, saveFile, listFileVersions, logAudit } from './admin_api.js';

// Helper to add CORS headers
function withCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return withCORS(new Response(null, { status: 204 }));
    }
    if (url.pathname === '/api/register' && request.method === 'POST') {
      const { username, password, email } = await request.json();
      if (!username || !password || !email) {
        return withCORS(new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 }));
      }
      // Simple hash (for demo only, use a real hash in production)
      const password_hash = await hashPassword(password);
      try {
        const user = await createUser(env, username, password_hash, email);
        return withCORS(new Response(JSON.stringify({ id: user.id, username: user.username, email: user.email }), { status: 201 }));
      } catch (e) {
        return withCORS(new Response(JSON.stringify({ error: 'User exists or DB error' }), { status: 400 }));
      }
    }
    if (url.pathname === '/api/user' && request.method === 'GET') {
      const username = url.searchParams.get('username');
      if (!username) {
        return withCORS(new Response(JSON.stringify({ error: 'Missing username' }), { status: 400 }));
      }
      const user = await getUserByUsername(env, username);
      if (!user) {
        return withCORS(new Response(JSON.stringify({ error: 'User not found' }), { status: 404 }));
      }
      // Expose password_hash for login (demo only)
      return withCORS(new Response(JSON.stringify({ id: user.id, username: user.username, email: user.email, password_hash: user.password_hash }), { status: 200 }));
    }

    // Admin API: List files
    if (url.pathname === '/api/admin/files' && request.method === 'GET') {
      const user = getSessionUser(request);
      if (!user) return withCORS(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
      const files = await listFiles(env);
      return withCORS(new Response(JSON.stringify(files), { status: 200 }));
    }

    // Admin API: Get file content
    if (url.pathname === '/api/admin/file' && request.method === 'GET') {
      const user = getSessionUser(request);
      if (!user) return withCORS(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
      const filename = url.searchParams.get('filename');
      if (!filename) return withCORS(new Response(JSON.stringify({ error: 'Missing filename' }), { status: 400 }));
      const content = await getFileContent(env, filename);
      if (content === null) return withCORS(new Response(JSON.stringify({ error: 'File not found' }), { status: 404 }));
      return withCORS(new Response(JSON.stringify({ filename, content }), { status: 200 }));
    }

    // Admin API: Save file (create new version)
    if (url.pathname === '/api/admin/file' && request.method === 'POST') {
      const user = getSessionUser(request);
      if (!user) return withCORS(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
      const { filename, content } = await request.json();
      if (!filename || !content) return withCORS(new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 }));
      await saveFile(env, filename, content, user.id);
      await logAudit(env, user.id, 'save_file', filename);
      return withCORS(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    }

    // Admin API: List file versions
    if (url.pathname === '/api/admin/file_versions' && request.method === 'GET') {
      const user = getSessionUser(request);
      if (!user) return withCORS(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
      const filename = url.searchParams.get('filename');
      if (!filename) return withCORS(new Response(JSON.stringify({ error: 'Missing filename' }), { status: 400 }));
      const versions = await listFileVersions(env, filename);
      return withCORS(new Response(JSON.stringify(versions), { status: 200 }));
    }
    return withCORS(new Response('Hello from La Crosse Robotics Cloudflare Worker!'));
  }
}

// Simple password hash (for demo only, use a secure hash in production)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
