const API = 'http://127.0.0.1:8000'

const form = document.getElementById('chatForm')
const statusEl = document.getElementById('status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  statusEl.textContent = ''
  const payload = {
    to: document.getElementById('to').value,
    from: document.getElementById('from').value,
    message: document.getElementById('message').value,
  }

  try {
    const res = await fetch(API + '/gchat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    statusEl.textContent = '✅ Chat sent! id: ' + data.id
    statusEl.className = 'mini'
    form.reset()
  } catch (err) {
    statusEl.textContent = '⚠️ Error: ' + err.message
    statusEl.className = ''
  }
})