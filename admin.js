// Admin Suite JS: File browser, editor, save, preview, history (Phase 1: basic CRUD)
const API = 'https://lacrosse-robotics-backend.christianrosework.workers.dev/api/admin';
let currentFile = null;
let currentContent = '';

async function fetchFiles() {
  const res = await fetch(`${API}/files`);
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
  const res = await fetch(`${API}/file?filename=${encodeURIComponent(filename)}`);
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
