// Hidden login: reveal form with ?admin=1
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') === '1') {
    document.querySelector('h1').style.display = '';
    document.getElementById('login-form').style.display = '';
  }
})();

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('login-message');
  messageDiv.textContent = 'Logging in...';
  try {
    const res = await fetch('https://lacrosse-robotics-backend.christianrosework.workers.dev/api/user?username=' + encodeURIComponent(username));
    const data = await res.json();
    if (!res.ok) {
      messageDiv.textContent = data.error || 'Login failed.';
      messageDiv.style.color = 'red';
      return;
    }
    // Hash password client-side to match backend (demo only)
    const hash = await hashPassword(password);
    if (hash === data.password_hash) {
      messageDiv.textContent = 'Login successful!';
      messageDiv.style.color = 'green';
      // You can set a cookie or localStorage here for session
    } else {
      messageDiv.textContent = 'Incorrect password.';
      messageDiv.style.color = 'red';
    }
  } catch (err) {
    messageDiv.textContent = 'Network error.';
    messageDiv.style.color = 'red';
  }
});

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
