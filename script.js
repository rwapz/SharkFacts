const FACTS_URL = 'facts.json';
const factEl = document.getElementById('fact');
const imgEl = document.getElementById('shark-image');
const dateEl = document.getElementById('fact-date');
const nextBtn = document.getElementById('next-fact');
const randomBtn = document.getElementById('random-fact');

let facts = [];
let currentIndex = 0;

function placeholderDataURI() {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <rect width='100%' height='100%' fill='#145b7a'/>
      <g fill='#cfe9ff' font-family='Arial, sans-serif' font-weight='600' font-size='36' text-anchor='middle'>
        <text x='50%' y='45%'>🦈</text>
        <text x='50%' y='65%'>No image available</text>
      </g>
    </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const PLACEHOLDER_SRC = placeholderDataURI();

function todayKey() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function saveState(index) {
  const state = { index, date: todayKey() };
  try {
    localStorage.setItem('sharkFactState', JSON.stringify(state));
  } catch (e) {
    // ignore storage errors
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem('sharkFactState');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function renderImage(src, alt) {
  if (!src) {
    imgEl.onerror = null;
    imgEl.src = PLACEHOLDER_SRC;
    imgEl.alt = alt || 'No image available';
    return;
  }

  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = PLACEHOLDER_SRC;
    imgEl.alt = alt || 'No image available';
  };
  imgEl.src = src;
  imgEl.alt = alt || 'Shark image';
}

function showFact(i) {
  if (!facts || facts.length === 0) return;
  const idx = ((i % facts.length) + facts.length) % facts.length;
  const f = facts[idx];
  currentIndex = idx;
  factEl.textContent = f.fact || '—';
  dateEl.textContent = `Fact #${idx + 1} • ${todayKey()}`;
  renderImage(f.image, f.alt);
  saveState(idx);
}

function nextFact() {
  if (!facts.length) return;
  showFact(currentIndex + 1);
}

function randomFact() {
  if (!facts.length) return;
  const idx = Math.floor(Math.random() * facts.length);
  showFact(idx);
}

fetch(FACTS_URL)
  .then(resp => {
    if (!resp.ok) throw new Error('Network response not ok');
    return resp.json();
  })
  .then(data => {
    facts = Array.isArray(data) ? data : [];
    if (facts.length === 0) {
      factEl.textContent = 'No facts available.';
      imgEl.src = PLACEHOLDER_SRC;
      imgEl.alt = 'No image available';
      return;
    }

    const state = loadState();
    const key = todayKey();

    if (state && state.date === key && typeof state.index === 'number') {
      showFact(state.index % facts.length);
    } else {
      const today = new Date();
      const idx = today.getDate() % facts.length;
      showFact(idx);
    }
  })
  .catch(err => {
    console.error('Could not load shark facts:', err);
    factEl.textContent = 'Sorry — could not load facts right now.';
    dateEl.textContent = '';
    imgEl.src = PLACEHOLDER_SRC;
    imgEl.alt = 'No image available';
  });

nextBtn.addEventListener('click', nextFact);
randomBtn.addEventListener('click', randomFact);