document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('register-message');
  messageDiv.textContent = 'Registering...';
  try {
    const res = await fetch('https://lacrosse-robotics-backend.christianrosework.workers.dev/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      messageDiv.textContent = 'Registration successful!';
      messageDiv.style.color = 'green';
    } else {
      messageDiv.textContent = data.error || 'Registration failed.';
      messageDiv.style.color = 'red';
    }
  } catch (err) {
    messageDiv.textContent = 'Network error.';
    messageDiv.style.color = 'red';
  }
});
