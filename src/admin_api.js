// Admin API for file CRUD, versioning, and audit log
export async function listFiles(env) {
  const stmt = env.DB.prepare('SELECT * FROM files ORDER BY filename');
  return await stmt.all();
}

export async function getFile(env, filename) {
  const stmt = env.DB.prepare('SELECT * FROM files WHERE filename = ?');
  return await stmt.bind(filename).first();
}

export async function getFileContent(env, filename) {
  const file = await getFile(env, filename);
  if (!file) return null;
  const stmt = env.DB.prepare('SELECT * FROM file_versions WHERE file_id = ? ORDER BY created_at DESC LIMIT 1');
  const version = await stmt.bind(file.id).first();
  return version ? version.content : null;
}

export async function saveFile(env, filename, content, author_id) {
  let file = await getFile(env, filename);
  if (!file) {
    // Insert new file
    const insert = env.DB.prepare('INSERT INTO files (filename, type) VALUES (?, ?)');
    await insert.bind(filename, filename.split('.').pop()).run();
    file = await getFile(env, filename);
  }
  // Insert new version
  const insertVer = env.DB.prepare('INSERT INTO file_versions (file_id, content, author_id) VALUES (?, ?, ?)');
  await insertVer.bind(file.id, content, author_id).run();
  // Update file updated_at
  const update = env.DB.prepare('UPDATE files SET updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  await update.bind(file.id).run();
  return file;
}

export async function listFileVersions(env, filename) {
  const file = await getFile(env, filename);
  if (!file) return [];
  const stmt = env.DB.prepare('SELECT * FROM file_versions WHERE file_id = ? ORDER BY created_at DESC');
  return await stmt.bind(file.id).all();
}

export async function logAudit(env, user_id, action, details) {
  const stmt = env.DB.prepare('INSERT INTO audit_log (user_id, action, details) VALUES (?, ?, ?)');
  await stmt.bind(user_id, action, details).run();
}
