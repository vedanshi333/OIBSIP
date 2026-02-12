const API = 'http://127.0.0.1:8000'
const POLL_INTERVAL = 5000

const alertsList = document.getElementById('alertsList')
const checkNowBtn = document.getElementById('checkNow')
const autoCheckEl = document.getElementById('autocheck')

function getSeen() {
  try { return JSON.parse(localStorage.getItem('crm_seen') || '[]') } catch (e) { return [] }
}
function setSeen(arr) { localStorage.setItem('crm_seen', JSON.stringify(arr)) }

async function checkAlerts() {
  try {
    const res = await fetch(API + '/crm/alerts')
    if (!res.ok) throw new Error('status ' + res.status)
    const list = await res.json()
    const seen = getSeen()
    const newAlerts = list.filter(a => !seen.includes(a.id))

    if (newAlerts.length > 0) {
      for (const a of newAlerts) {
        // Popup per requirement
        const label = (a.keyword === 'urgent') ? 'URGENT' : 'NORMAL'
        try {
          alert(`${label}: ${a.subject}\nTo: ${a.to}\n${(a.body || '').slice(0, 200)}`)
        } catch (e) {
          console.log('Popup failed', e)
        }
      }
      // add to seen
      const ids = list.map(x => x.id)
      const merged = Array.from(new Set(seen.concat(ids)))
      setSeen(merged)
    }

    // Render list (reverse chronological if timestamps available)
    alertsList.innerHTML = ''
    for (const a of list.slice().reverse()) {
      const li = document.createElement('li')
      li.innerHTML = `<strong>${a.subject}</strong> <span class="mini">${a.keyword} • ${new Date(a.timestamp).toLocaleString()}</span><div>${a.body}</div>`
      alertsList.appendChild(li)
    }

  } catch (err) {
    console.error('Check failed', err)
  }
}

checkNowBtn.addEventListener('click', checkAlerts)

let timer = null
function startPolling() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => { if (autoCheckEl.checked) checkAlerts() }, POLL_INTERVAL)
}

startPolling()
// initial check
checkAlerts()