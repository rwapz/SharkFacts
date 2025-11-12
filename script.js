const FACTS_URL = './facts.json';
const factEl = document.getElementById('fact');
const imgEl = document.getElementById('shark-image');
const dateEl = document.getElementById('fact-date');
const nextBtn = document.getElementById('next-fact');
const randomBtn = document.getElementById('random-fact');
const addFavoriteBtn = document.getElementById('add-favorite');
const shareBtn = document.getElementById('share-fact');
const viewFavoritesBtn = document.getElementById('view-favorites');

// Modal elements
const favoritesModal = document.getElementById('favorites-modal');
const modalFavoriteList = document.getElementById('modal-favorite-list');
const modalClose = document.getElementById('modal-close');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalClear = document.getElementById('modal-clear');

let facts = [];
let currentIndex = 0;
let favorites = [];

function placeholderDataURI() {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <defs>
        <linearGradient id='bgGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:%231e3c72;stop-opacity:1' />
          <stop offset='100%' style='stop-color:%237e8ba3;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='800' height='450' fill='url(%23bgGrad)'/>
      <g fill='%23ffffff' font-family='Arial, sans-serif' font-weight='700' font-size='52' text-anchor='middle' opacity='0.9'>
        <text x='400' y='180'>🦈</text>
        <text x='400' y='280' font-size='28'>No image available</text>
      </g>
      <circle cx='100' cy='80' r='40' fill='%234facfe' opacity='0.15'/>
      <circle cx='700' cy='350' r='60' fill='%2300f2fe' opacity='0.1'/>
    </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const PLACEHOLDER_SRC = placeholderDataURI();

function todayKey() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000);
  return Math.floor(diff / 86400000);
}

function saveState(index) {
  const state = { index, date: todayKey() };
  try {
    localStorage.setItem('sharkFactState', JSON.stringify(state));
  } catch (e) {
    console.error('Storage error:', e);
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

function saveFavorites() {
  try {
    localStorage.setItem('sharkFavorites', JSON.stringify(favorites));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem('sharkFavorites');
    favorites = raw ? JSON.parse(raw) : [];
  } catch {
    favorites = [];
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
  updateFavoriteButton();
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

function shareFact() {
  const f = facts[currentIndex];
  const text = `🦈 ${f.fact}\n\nDaily Shark Facts: ${window.location.origin}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Daily Shark Fact',
      text: text
    }).catch(err => console.error('Share failed:', err));
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Fact copied to clipboard!');
    }).catch(() => {
      alert(`Fact: ${f.fact}`);
    });
  }
}

function addToFavorites() {
  const f = facts[currentIndex];
  const exists = favorites.some(fav => fav.fact === f.fact);
  
  if (!exists) {
    favorites.push({ ...f });
    saveFavorites();
    renderModalFavorites();
    updateFavoriteButton();
    addFavoriteBtn.style.transform = 'scale(1.15)';
    setTimeout(() => addFavoriteBtn.style.transform = 'scale(1)', 300);
  } else {
    // Remove if already favorited
    favorites = favorites.filter(fav => fav.fact !== f.fact);
    saveFavorites();
    renderModalFavorites();
    updateFavoriteButton();
  }
}

function removeFromFavorites(idx) {
  favorites.splice(idx, 1);
  saveFavorites();
  renderModalFavorites();
  updateFavoriteButton();
}

function updateFavoriteButton() {
  const f = facts[currentIndex];
  const isFavorited = favorites.some(fav => fav.fact === f.fact);
  
  if (isFavorited) {
    addFavoriteBtn.classList.add('btn-favorited');
    addFavoriteBtn.innerHTML = '<span>⭐</span> Favorited';
    addFavoriteBtn.setAttribute('aria-label', 'Remove from favorites');
  } else {
    addFavoriteBtn.classList.remove('btn-favorited');
    addFavoriteBtn.innerHTML = '<span>☆</span> Favorite';
    addFavoriteBtn.setAttribute('aria-label', 'Add to favorites');
  }
}

function renderModalFavorites() {
  modalFavoriteList.innerHTML = '';
  
  if (favorites.length === 0) {
    modalFavoriteList.classList.add('empty');
    const li = document.createElement('li');
    li.textContent = 'No favorites yet! Start adding your favorite facts 🦈';
    li.style.padding = '30px 20px';
    modalFavoriteList.appendChild(li);
    return;
  }

  modalFavoriteList.classList.remove('empty');
  favorites.forEach((fav, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${fav.fact}</span>
      <button class="remove-fav" data-idx="${idx}" title="Remove">✕</button>
    `;
    li.addEventListener('click', (e) => {
      if (!e.target.classList.contains('remove-fav')) {
        const matchIdx = facts.findIndex(f => f.fact === fav.fact);
        if (matchIdx !== -1) {
          showFact(matchIdx);
          closeModal();
        }
      }
    });
    modalFavoriteList.appendChild(li);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'));
      removeFromFavorites(idx);
    });
  });
}

function openModal() {
  favoritesModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  favoritesModal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

function clearAllFavorites() {
  if (favorites.length === 0) return;
  if (confirm('🗑️ Clear all favorites?')) {
    favorites = [];
    saveFavorites();
    renderModalFavorites();
    updateFavoriteButton();
  }
}

// Load favorites on page start
loadFavorites();

fetch(FACTS_URL)
  .then(resp => {
    console.log('Fetch response status:', resp.status);
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    return resp.json();
  })
  .then(data => {
    console.log('Facts loaded:', data.length);
    facts = Array.isArray(data) ? data : [];
    
    if (facts.length === 0) {
      factEl.textContent = 'No facts available.';
      imgEl.src = PLACEHOLDER_SRC;
      imgEl.alt = 'No image available';
      return;
    }

    renderModalFavorites();

    const state = loadState();
    const key = todayKey();

    if (state && state.date === key && typeof state.index === 'number') {
      showFact(state.index % facts.length);
    } else {
      const today = new Date();
      const idx = dayOfYear(today) % facts.length;
      showFact(idx);
    }
  })
  .catch(err => {
    console.error('Error loading facts:', err);
    factEl.textContent = 'Sorry — could not load facts right now.';
    factEl.style.color = '#e53e3e';
    dateEl.textContent = `Error: ${err.message}`;
    imgEl.src = PLACEHOLDER_SRC;
    imgEl.alt = 'No image available';
  });

// Event listeners
nextBtn.addEventListener('click', nextFact);
randomBtn.addEventListener('click', randomFact);
addFavoriteBtn.addEventListener('click', addToFavorites);
shareBtn.addEventListener('click', shareFact);
viewFavoritesBtn.addEventListener('click', openModal);
modalClear.addEventListener('click', clearAllFavorites);

// Modal close handlers
modalClose.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);

// Close modal on background click
favoritesModal.addEventListener('click', (e) => {
  if (e.target === favoritesModal) {
    closeModal();
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextFact();
  if (e.key === 'ArrowLeft') randomFact();
  if (e.key === 'Escape') closeModal();
});