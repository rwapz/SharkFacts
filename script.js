document.addEventListener("DOMContentLoaded", () => {
  const facts = [
    { date: "15th May", fact: "The whale shark is the largest fish in the world, growing up to 40 feet long!", image: "images/whale-shark-1.jpg" },
    { date: "16th May", fact: "Sharks have been around for over 400 million years, long before dinosaurs existed!", image: "images/shark.jpg" },
    { date: "17th May", fact: "Great white sharks can swim at speeds of up to 25 miles per hour!", image: "images/great-white-shark.jpg" },
    { date: "18th May", fact: "Hammerhead sharks have 360-degree vision, allowing them to see in almost every direction at once!", image: "images/hammerhead-shark.jpg" },
    { date: "19th May", fact: "The shortest shark in the world is the dwarf lanternshark, measuring only about 7.9 inches long!", image: "images/dwarf-lantern-shark.jpg" },
    { date: "20th May", fact: "Sharks don’t have bones; their skeletons are made of cartilage, which is lighter and more flexible.", image: "images/shark-skeleton.jpg" },
    { date: "21st May", fact: "Mako sharks are the fastest sharks, reaching speeds of 60 miles per hour!", image: "images/mako-shark.jpg" },
    { date: "22nd May", fact: "Sharks can sense an electrical field emitted by their prey, helping them detect animals hiding in the sand!", image: "images/shark-sensing.jpg" },
    { date: "23rd May", fact: "Sharks can go weeks or even months without eating, depending on the species and their environment!", image: "images/shark-hunting.jpg" }
  ];

  const likeBtn = document.getElementById('like-btn');
  const likeCountSpan = document.getElementById('like-count');
  const likeSound = document.getElementById('like-sound');

  const randomBtn = document.getElementById('random-btn');
  const modal = document.getElementById('random-fact-modal');
  const modalText = document.getElementById('random-fact-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const showAnotherBtn = document.getElementById('show-another-btn');

  let currentFactIndex = 0;
  let randomFacts = [];

  function getTodayFormattedDate() {
    const d = new Date();
    const day = d.getDate();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const month = monthNames[d.getMonth()];
    const suffix = (n) => (n > 3 && n < 21) ? "th" : ["st","nd","rd"][n % 10 - 1] || "th";
    return `${day}${suffix(day)} ${month}`;
  }

  function getLikeStorageKey(factIndex) {
    return `sharkfact-liked-${factIndex}`;
  }

  function hasLikedToday(factIndex) {
    const key = getLikeStorageKey(factIndex);
    const storedDate = localStorage.getItem(key);
    const today = new Date().toISOString().slice(0,10);
    return storedDate === today;
  }

  function markLikedToday(factIndex) {
    const key = getLikeStorageKey(factIndex);
    const today = new Date().toISOString().slice(0,10);
    localStorage.setItem(key, today);
  }

  function getLikesCount(factIndex) {
    return parseInt(localStorage.getItem(`sharkfact-likes-${factIndex}`)) || 0;
  }

  function setLikesCount(factIndex, count) {
    localStorage.setItem(`sharkfact-likes-${factIndex}`, count);
  }

  function displayFact(index) {
    const fact = facts[index];
    document.getElementById('fact-title').textContent = `Shark Fact for ${fact.date}`;
    document.getElementById('fact-text').textContent = fact.fact;
    const img = document.getElementById('shark-img');
    img.src = fact.image;
    img.alt = fact.fact;

    currentFactIndex = index;

    if (hasLikedToday(index)) {
      likeBtn.disabled = true;
      likeBtn.setAttribute('aria-pressed', 'true');
    } else {
      likeBtn.disabled = false;
      likeBtn.setAttribute('aria-pressed', 'false');
    }

    const likes = getLikesCount(index);
    if (likes > 0) {
      likeCountSpan.textContent = `Likes: ${likes}`;
      likeCountSpan.style.display = 'inline';
    } else {
      likeCountSpan.style.display = 'none';
    }
  }

  function createBubble(parent) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = `${Math.random() * parent.offsetWidth}px`;
    parent.appendChild(bubble);
    bubble.addEventListener('animationend', () => bubble.remove());
  }

  function handleLikeButton() {
    if (hasLikedToday(currentFactIndex)) return;

    markLikedToday(currentFactIndex);

    let likes = getLikesCount(currentFactIndex);
    likes++;
    setLikesCount(currentFactIndex, likes);

    likeCountSpan.textContent = `Likes: ${likes}`;
    likeCountSpan.style.display = 'inline';
    likeBtn.disabled = true;
    likeBtn.setAttribute('aria-pressed', 'true');
    likeBtn.classList.add('liked-animation');
    for(let i=0; i<5; i++) createBubble(likeBtn);
    if(likeSound) {
      likeSound.currentTime = 0;
      likeSound.play();
    }
    setTimeout(() => likeBtn.classList.remove('liked-animation'), 500);
  }

  likeBtn.addEventListener('click', handleLikeButton);

  // Show today's fact on page load
  const todayIndex = facts.findIndex(f => f.date === getTodayFormattedDate());
  displayFact(todayIndex >= 0 ? todayIndex : 0);

  // Load random facts but do NOT show modal automatically
  fetch('random_facts.json')
    .then(response => response.json())
    .then(data => {
      randomFacts = data;
    })
    .catch(err => {
      console.error('Failed to load random facts:', err);
      randomFacts = ["Failed to load random facts. Try again later!"];
    });

  function showRandomFact() {
    if(randomFacts.length === 0) {
      modalText.textContent = "Loading random facts...";
      return;
    }
    const idx = Math.floor(Math.random() * randomFacts.length);
    modalText.textContent = randomFacts[idx];
  }

  randomBtn.addEventListener('click', () => {
    showRandomFact();
    modal.classList.remove('hidden');  // Show modal only on button click
    modalCloseBtn.focus();
  });

  modalCloseBtn.addEventListener('click', () => {
    modal.classList.add('hidden');      // Hide modal on close
    randomBtn.focus();
  });

  showAnotherBtn.addEventListener('click', () => {
    showRandomFact();
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.add('hidden');
      randomBtn.focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      randomBtn.focus();
    }
  });

});
