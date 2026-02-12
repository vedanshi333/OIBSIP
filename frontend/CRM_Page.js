const API = 'http://127.0.0.1:5000'
const POLL_INTERVAL = 5000

const alertsList = document.getElementById('alertsList')
const checkNowBtn = document.getElementById('checkNow')
const autoCheckEl = document.getElementById('autocheck')

// ---------------- Seen-state helpers ----------------
function getSeen() {
  try {
    return JSON.parse(localStorage.getItem('crm_seen') || '[]')
  } catch {
    return []
  }
}

function setSeen(arr) {
  localStorage.setItem('crm_seen', JSON.stringify(arr))
}

// ---------------- Core logic ----------------
async function checkAlerts() {
  try {
    const res = await fetch(`${API}/crm/alerts`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const alerts = await res.json()
    const seen = getSeen()

    // --- NEW alerts only ---
    const newAlerts = alerts.filter(a => !seen.includes(a.id))

    // --- Popup / notification ---
    for (const a of newAlerts) {
      const label = a.keyword === 'urgent' ? 'URGENT' : 'NORMAL'

      const title =
        a.type === 'gchat'
          ? (a.message || '(no message)')
          : (a.subject || '(no subject)')

      const snippet =
        a.type === 'gchat'
          ? (a.message || '').slice(0, 200)
          : (a.body || '').slice(0, 200)

      alert(
        `${label} (${a.type.toUpperCase()})\n` +
        `${title}\n` +
        `To: ${a.to}\n\n` +
        `${snippet}`
      )
    }

    // --- Mark all fetched as seen ---
    const merged = Array.from(new Set([...seen, ...alerts.map(a => a.id)]))
    setSeen(merged)

    // ---------------- Render list ----------------
    alertsList.innerHTML = ''

    alerts.slice().reverse().forEach(a => {
      const title =
        a.type === 'gchat'
          ? (a.message || '(no message)')
          : (a.subject || '(no subject)')

      const body =
        a.type === 'gchat'
          ? (a.message || '')
          : (a.body || '')

      const li = document.createElement('li')
      li.innerHTML = `
        <strong>${title}</strong>
        <div class="mini">
          ${a.type} • ${a.keyword} • ${new Date(a.timestamp).toLocaleString()}
        </div>
        <div>${body}</div>
      `
      alertsList.appendChild(li)
    })

  } catch (err) {
    console.error('Alert check failed:', err)
  }
}

// ---------------- Events ----------------
checkNowBtn.addEventListener('click', checkAlerts)

let timer = null
function startPolling() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (autoCheckEl.checked) checkAlerts()
  }, POLL_INTERVAL)
}

// ---------------- Init ----------------
startPolling()
checkAlerts()
