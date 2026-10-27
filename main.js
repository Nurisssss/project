import './style.css'

const NOW = 9 * 60
const EXISTING_BOOKINGS = [{ start: 10 * 60, end: 11 * 60 }]

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-mark" aria-hidden="true">SC</div>
      <div class="brand-copy">
        <p class="eyebrow">Smart Campus</p>
        <h1>Room availability</h1>
      </div>
      <div class="status-pill"><span class="status-dot"></span>Open now</div>
    </header>

    <main class="page-content">
      <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow accent">Campus spaces</p>
        <h2 id="page-title">Find a room for your next session.</h2>
        <p class="intro-copy">Check the latest schedule before you head across campus.</p>
      </section>

      <section class="room-card" aria-labelledby="room-title">
        <div class="room-card-header">
          <div>
            <p class="section-label">Selected room</p>
            <h3 id="room-title">B-204 <span>(Seminar room)</span></h3>
          </div>
          <div class="room-icon" aria-hidden="true">B</div>
        </div>
        <div class="room-meta">
          <div class="now-chip"><span class="live-indicator"></span><span>Now</span><strong>09:00</strong></div>
          <div class="booking-block">
            <span class="section-label">Booked today</span>
            <div class="booking-chip"><span class="calendar-mark" aria-hidden="true"></span>10:00 <span class="dash">–</span> 11:00</div>
          </div>
        </div>
        <label class="blocked-toggle" for="blocked">
          <input id="blocked" type="checkbox" />
          <span class="checkbox-ui" aria-hidden="true"></span>
          <span>Room is blocked</span>
        </label>
      </section>

      <section class="check-section" aria-labelledby="check-title">
        <div class="section-heading">
          <p class="section-label">Plan your visit</p>
          <h3 id="check-title">Check availability</h3>
          <p>Choose a start and end time after 09:00.</p>
        </div>
        <form id="availability-form" novalidate>
          <div class="time-grid">
            <label class="field-label" for="start-time">Start time
              <span class="time-input-wrap"><span class="clock-mark" aria-hidden="true"></span><input id="start-time" type="time" value="11:00" step="60" required /></span>
            </label>
            <label class="field-label" for="end-time">End time
              <span class="time-input-wrap"><span class="clock-mark" aria-hidden="true"></span><input id="end-time" type="time" value="12:00" step="60" required /></span>
            </label>
          </div>
          <button class="check-button" type="submit">Check availability <span aria-hidden="true">→</span></button>
        </form>
        <div id="result" class="result result-available" role="status" aria-live="polite">
          <span class="result-icon" aria-hidden="true">✓</span>
          <div><strong>Available</strong><span id="result-detail">This room is free for your selected time.</span></div>
        </div>
      </section>

      <p class="quiet-note"><span aria-hidden="true">i</span> Availability is based on today's posted schedule.</p>
    </main>
    <footer>Smart Campus <span>•</span> Facilities</footer>
  </div>
`

const form = document.querySelector('#availability-form')
const startInput = document.querySelector('#start-time')
const endInput = document.querySelector('#end-time')
const blockedInput = document.querySelector('#blocked')
const result = document.querySelector('#result')
const resultDetail = document.querySelector('#result-detail')

function timeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0')
  const mins = (minutes % 60).toString().padStart(2, '0')
  return `${hours}:${mins}`
}

function showResult(available, detail) {
  result.className = `result ${available ? 'result-available' : 'result-unavailable'}`
  result.querySelector('.result-icon').textContent = available ? '✓' : '!'
  result.querySelector('strong').textContent = available ? 'Available' : 'Unavailable'
  resultDetail.textContent = detail
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const start = timeToMinutes(startInput.value)
  const end = timeToMinutes(endInput.value)

  if (!startInput.value || !endInput.value) {
    showResult(false, 'Enter both a start time and an end time.')
    return
  }
  if (start <= NOW) {
    showResult(false, 'Start time must be after the current time of 09:00.')
    return
  }
  if (start >= end) {
    showResult(false, 'End time must be later than the start time.')
    return
  }
  if (end > 1440) {
    showResult(false, 'End time must be no later than 24:00.')
    return
  }
  if (end - start > 120) {
    showResult(false, 'Bookings can be no longer than 120 minutes.')
    return
  }
  if (blockedInput.checked) {
    showResult(false, 'This room is currently blocked.')
    return
  }
  if (EXISTING_BOOKINGS.some((booking) => start < booking.end && end > booking.start)) {
    showResult(false, 'That time overlaps with the 10:00–11:00 booking.')
    return
  }

  showResult(true, `${formatTime(start)}–${formatTime(end)} is free to use.`)
})
