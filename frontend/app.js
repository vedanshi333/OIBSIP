const API = 'http://127.0.0.1:8000';

const form = document.getElementById('mailForm');
const statusEl = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';

  const payload = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    subject: document.getElementById('subject').value,
    body: document.getElementById('body').value
  };

  try {
    const res = await fetch(API + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    statusEl.textContent = '✅ Sent! ID: ' + data.id;
    form.reset();
  } catch (err) {
    statusEl.textContent = '⚠️ Error: ' + err.message;
  }
});
