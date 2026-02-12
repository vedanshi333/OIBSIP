const API = 'http://127.0.0.1:8000'

const form = document.getElementById('lmsForm')
const statusEl = document.getElementById('status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  statusEl.textContent = ''

  const payload = {
    to: document.getElementById('to').value,
    course: document.getElementById('course').value,
    event_type: document.getElementById('event_type').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    priority: document.getElementById('priority').value
  }

  try {
    const res = await fetch(API + '/lms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(await res.text())

    const data = await res.json()
    statusEl.textContent = '✅ LMS event sent! id: ' + data.id
    statusEl.className = 'mini'
    form.reset()

  } catch (err) {
    statusEl.textContent = '⚠️ Error: ' + err.message
    statusEl.className = ''
  }
})
