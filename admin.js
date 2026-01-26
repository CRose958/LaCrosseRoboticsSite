// Media Manager Modal (UI only, backend to follow)
document.getElementById('admin-media-btn').onclick = async function() {
  // TODO: Fetch media list from backend
  const mediaList = document.getElementById('media-list');
  mediaList.innerHTML = '';
  // Placeholder: show static Images/ folder images (if any)
  const images = [
    // Example: 'Images/example1.jpg', 'Images/example2.png'
  ];
  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '120px';
    img.style.maxHeight = '120px';
    img.style.border = '1px solid #444';
    img.style.borderRadius = '4px';
    mediaList.appendChild(img);
  });
  document.getElementById('admin-media-modal').style.display = 'flex';
};

document.getElementById('media-upload-btn').onclick = async function() {
  const input = document.getElementById('media-upload-input');
  if (!input.files.length) return alert('Select images to upload.');
  // TODO: Upload images to backend
  alert('Upload not yet implemented.');
};
// User Management Modal
document.getElementById('admin-users-btn').onclick = async function() {
  const res = await fetch(`${API.replace('/admin','/admin')}/users`, { credentials: 'include' });
  const users = await res.json();
  const list = document.getElementById('users-list');
  list.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${u.username}</b> (${u.email}) <button>Remove</button>`;
    li.querySelector('button').onclick = async () => {
      if (confirm('Remove user ' + u.username + '?')) {
        await fetch(`${API.replace('/admin','/admin')}/users`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username: u.username })
        });
        document.getElementById('admin-users-btn').onclick();
      }
    };
    list.appendChild(li);
  });
  document.getElementById('admin-users-modal').style.display = 'flex';
};

document.getElementById('add-user-btn').onclick = async function() {
  const username = document.getElementById('new-user-username').value;
  const email = document.getElementById('new-user-email').value;
  const password = document.getElementById('new-user-password').value;
  if (!username || !email || !password) return alert('Fill all fields');
  await fetch(`${API.replace('/admin','/admin')}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, email, password })
  });
  document.getElementById('new-user-username').value = '';
  document.getElementById('new-user-email').value = '';
  document.getElementById('new-user-password').value = '';
  document.getElementById('admin-users-btn').onclick();
};

// Audit Log Modal
document.getElementById('admin-audit-btn').onclick = async function() {
  const res = await fetch(`${API.replace('/admin','/admin')}/audit`, { credentials: 'include' });
  const logs = await res.json();
  const list = document.getElementById('audit-list');
  list.innerHTML = '';
  logs.forEach(l => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${l.created_at}</b> [user ${l.user_id || 'unknown'}] <i>${l.action}</i> ${l.details || ''}`;
    list.appendChild(li);
  });
  document.getElementById('admin-audit-modal').style.display = 'flex';
};
// Admin Suite JS: File browser, editor, save, preview, history (Phase 1: basic CRUD)
const API = 'https://lacrosse-robotics-backend.christianrosework.workers.dev/api/admin';
let currentFile = null;
let currentContent = '';

// DEMO: Set a session cookie for admin (in production, set after login)
document.cookie = 'session=demo_admin_token; path=/;';

async function fetchFiles() {
  const res = await fetch(`${API}/files`, { credentials: 'include' });
  const files = await res.json();
  const list = document.getElementById('admin-file-list');
  list.innerHTML = '';
  files.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.filename;
    li.onclick = () => loadFile(f.filename);
    if (f.filename === currentFile) li.classList.add('selected');
    list.appendChild(li);
  });
}

async function loadFile(filename) {
  document.getElementById('admin-status').textContent = 'Loading...';
  const res = await fetch(`${API}/file?filename=${encodeURIComponent(filename)}`, { credentials: 'include' });
  if (!res.ok) {
    document.getElementById('admin-status').textContent = 'Failed to load file.';
    return;
  }
  const data = await res.json();
  currentFile = filename;
  currentContent = data.content;
  document.getElementById('admin-filename').textContent = filename;
  const editor = document.getElementById('admin-editor');
  editor.value = data.content;
  editor.disabled = false;
  document.getElementById('admin-save').disabled = false;
  document.getElementById('admin-preview').disabled = false;
  document.getElementById('admin-history').disabled = false;
  document.getElementById('admin-push').disabled = false;

  // Push to GitHub logic
  document.getElementById('admin-push').onclick = async function() {
    if (!currentFile) return;
    const content = document.getElementById('admin-editor').value;
    document.getElementById('admin-status').textContent = 'Pushing to GitHub...';
    const res = await fetch(`${API}/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ filename: currentFile, content })
    });
    if (res.ok) {
      document.getElementById('admin-status').textContent = 'Pushed to GitHub!';
    } else {
      const data = await res.json();
      document.getElementById('admin-status').textContent = 'Push failed: ' + (data.error || 'Unknown error');
    }
  };

  // Preview logic
  document.getElementById('admin-preview').onclick = function() {
    if (!currentFile) return;
    document.getElementById('preview-filename').textContent = currentFile;
    const content = document.getElementById('admin-editor').value;
    const iframe = document.getElementById('preview-iframe');
    iframe.srcdoc = content;
    document.getElementById('admin-preview-modal').style.display = 'flex';
  };

  // Version history logic
  document.getElementById('admin-history').onclick = async function() {
    if (!currentFile) return;
    document.getElementById('history-filename').textContent = currentFile;
    const res = await fetch(`${API}/file_versions?filename=${encodeURIComponent(currentFile)}`, { credentials: 'include' });
    const versions = await res.json();
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    versions.forEach(v => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${v.created_at}</b> by user ${v.author_id || 'unknown'} <button>Restore</button>`;
      li.querySelector('button').onclick = async () => {
        if (confirm('Restore this version?')) {
          await fetch(`${API}/file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ filename: currentFile, content: v.content })
          });
          loadFile(currentFile);
          document.getElementById('admin-history-modal').style.display = 'none';
        }
      };
      list.appendChild(li);
    });
    document.getElementById('admin-history-modal').style.display = 'flex';
  };
  document.getElementById('admin-status').textContent = '';
  highlightSelectedFile();
}

function highlightSelectedFile() {
  document.querySelectorAll('.admin-file-list li').forEach(li => {
    li.classList.toggle('selected', li.textContent === currentFile);
  });
}

document.getElementById('admin-save').onclick = async function() {
  const content = document.getElementById('admin-editor').value;
  if (!currentFile) return;
  document.getElementById('admin-status').textContent = 'Saving...';
  const res = await fetch(`${API}/file`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ filename: currentFile, content })
  });
  if (res.ok) {
    document.getElementById('admin-status').textContent = 'Saved!';
    currentContent = content;
    fetchFiles();
  } else {
    document.getElementById('admin-status').textContent = 'Save failed.';
  }
};

document.getElementById('admin-new-file').onclick = async function() {
  const filename = prompt('Enter new filename (e.g. newpage.html):');
  if (!filename) return;
  const res = await fetch(`${API}/file`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ filename, content: '' })
  });
  if (res.ok) {
    fetchFiles();
    loadFile(filename);
  } else {
    alert('Failed to create file.');
  }
};

document.getElementById('admin-logout').onclick = function() {
  // TODO: Clear session/cookie
  window.location = 'index.html';
};

window.onload = fetchFiles;
