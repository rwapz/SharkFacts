console.log('🦈 Welcome to Shark Facts! Sharks are FIN-tastic!');

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

  let randomFacts = [
    "Some sharks glow in the dark! 🌟",
    "Sharks have a sixth sense that detects electricity!",
    "A group of sharks is called a shiver. 🦈🦈🦈",
    "Sharks lose thousands of teeth in their lifetime.",
    "Some sharks can live to be over 100 years old!",
    "Sharks have been around longer than trees.",
    "The smallest shark is only 8 inches long!",
    "Sharks can replace a lost tooth in a week.",
    "Sharks are important for healthy oceans!"
  ];
  let randomOrder = [];
  let randomIndex = 0;

  const likeBtn = document.getElementById('like-btn');
  const likeCountSpan = document.getElementById('like-count');
  const likeSound = document.getElementById('like-sound');
  const randomBtn = document.getElementById('random-btn');
  const archiveBtn = document.getElementById('archive-btn');
  const messageBtn = document.getElementById('message-btn');
  const toast = document.getElementById('toast');
  const archiveReturnBtn = document.getElementById('archive-return-btn');
  const archiveReturnBtns = document.getElementById('archive-return-btns');
  const sharkFinAnim = document.getElementById('shark-fin-animation');

  let todayIndex = getTodayFactIndex();
  let showingRandom = false;
  let showingArchive = false;
  let archiveIndex = null;

  function getTodayFormattedDate() {
    const d = new Date();
    const day = d.getDate();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const month = monthNames[d.getMonth()];
    const suffix = (n) => (n > 3 && n < 21) ? "th" : ["st","nd","rd"][n % 10 - 1] || "th";
    return `${day}${suffix(day)} ${month}`;
  }
  function getTodayFactIndex() {
    const today = getTodayFormattedDate();
    let idx = facts.findIndex(f => f.date === today);
    return idx < 0 ? 0 : idx;
  }

  function getLikeStorageKey(factIndex, isRandom) {
    return isRandom ? `sharkfact-liked-random-${factIndex}` : `sharkfact-liked-${factIndex}`;
  }
  function hasLikedToday(factIndex, isRandom) {
    const key = getLikeStorageKey(factIndex, isRandom);
    const storedDate = localStorage.getItem(key);
    const today = new Date().toISOString().slice(0,10);
    return storedDate === today;
  }
  function markLikedToday(factIndex, isRandom) {
    const key = getLikeStorageKey(factIndex, isRandom);
    const today = new Date().toISOString().slice(0,10);
    localStorage.setItem(key, today);
  }
  function getLikesCount(factIndex, isRandom) {
    return parseInt(localStorage.getItem(isRandom ? `sharkfact-likes-random-${factIndex}` : `sharkfact-likes-${factIndex}`)) || 0;
  }
  function setLikesCount(factIndex, count, isRandom) {
    localStorage.setItem(isRandom ? `sharkfact-likes-random-${factIndex}` : `sharkfact-likes-${factIndex}`, count);
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 1400);
  }

  function playSharkFinAnimation() {
    sharkFinAnim.innerHTML = '<div class="fin"><div class="fin-shape"></div></div>';
    sharkFinAnim.classList.remove('animate');
    void sharkFinAnim.offsetWidth;
    sharkFinAnim.classList.add('animate');
    setTimeout(() => {
      sharkFinAnim.classList.remove('animate');
      sharkFinAnim.innerHTML = '';
    }, 1200);
  }

  function displayFact(index) {
    showingRandom = false;
    showingArchive = false;
    archiveIndex = null;
    archiveReturnBtns.style.display = "none";
    document.getElementById('fact-title').textContent = `Shark Fact for ${facts[index].date}`;
    document.getElementById('fact-text').innerHTML = `<span class="did-you-know">Did you know?</span> ${facts[index].fact}`;
    const img = document.getElementById('shark-img');
    img.src = facts[index].image;
    img.alt = facts[index].fact;

    if (hasLikedToday(index, false)) {
      likeBtn.setAttribute('aria-pressed', 'true');
      likeBtn.classList.add('gold');
    } else {
      likeBtn.setAttribute('aria-pressed', 'false');
      likeBtn.classList.remove('gold');
    }
    likeBtn.disabled = false;
    likeBtn.style.cursor = "pointer";
    likeCountSpan.textContent = `Likes: ${getLikesCount(index, false)}`;
    messageBtn.disabled = false;
    messageBtn.style.cursor = "pointer";
    randomBtn.textContent = "View Random Fact";
  }

  function displayRandomFact(index) {
    showingRandom = true;
    showingArchive = false;
    archiveIndex = null;
    archiveReturnBtns.style.display = "flex";
    document.getElementById('fact-title').textContent = `Random Shark Fact`;
    document.getElementById('fact-text').innerHTML = `<span class="did-you-know">Did you know?</span> ${randomFacts[randomOrder[index]]}`;
    const img = document.getElementById('shark-img');
    img.src = "images/random.jpg";
    img.alt = randomFacts[randomOrder[index]];

    if (hasLikedToday(randomOrder[index], true)) {
      likeBtn.setAttribute('aria-pressed', 'true');
      likeBtn.classList.add('gold');
    } else {
      likeBtn.setAttribute('aria-pressed', 'false');
      likeBtn.classList.remove('gold');
    }
    likeBtn.disabled = false;
    likeBtn.style.cursor = "pointer";
    likeCountSpan.textContent = `Likes: ${getLikesCount(randomOrder[index], true)}`;
    messageBtn.disabled = false;
    messageBtn.style.cursor = "pointer";
    randomBtn.textContent = "Next Random Fact";
  }

  function displayArchiveFact(index) {
    showingRandom = false;
    showingArchive = true;
    archiveIndex = index;
    archiveReturnBtns.style.display = "flex";
    document.getElementById('fact-title').textContent = `Shark Fact for ${facts[index].date}`;
    document.getElementById('fact-text').innerHTML = `<span class="did-you-know">Did you know?</span> ${facts[index].fact}`;
    const img = document.getElementById('shark-img');
    img.src = facts[index].image;
    img.alt = facts[index].fact;

    likeBtn.disabled = true;
    likeBtn.setAttribute('aria-pressed', 'false');
    likeBtn.classList.remove('gold');
    likeBtn.style.cursor = "not-allowed";
    likeCountSpan.textContent = `Likes: ${getLikesCount(index, false)}`;
    messageBtn.disabled = true;
    messageBtn.style.cursor = "not-allowed";
    randomBtn.textContent = "View Random Fact";
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Initial display
  randomOrder = shuffleArray([...Array(randomFacts.length).keys()]);
  displayFact(todayIndex);

  likeBtn.addEventListener('click', () => {
    if (showingArchive) return;

    if (showingRandom) {
      const idx = randomOrder[randomIndex];
      if (hasLikedToday(idx, true)) {
        showToast("You already liked this random fact today!");
        return;
      }
      markLikedToday(idx, true);
      let likes = getLikesCount(idx, true);
      likes++;
      setLikesCount(idx, likes, true);
      likeBtn.classList.add('gold');
      likeBtn.setAttribute('aria-pressed', 'true');
      likeCountSpan.textContent = `Likes: ${likes}`;
      playSharkFinAnimation();
    } else if (!showingArchive) {
      if (hasLikedToday(todayIndex, false)) {
        showToast("You already liked today's fact!");
        return;
      }
      markLikedToday(todayIndex, false);
      let likes = getLikesCount(todayIndex, false);
      likes++;
      setLikesCount(todayIndex, likes, false);
      likeBtn.classList.add('gold');
      likeBtn.setAttribute('aria-pressed', 'true');
      likeCountSpan.textContent = `Likes: ${likes}`;
      playSharkFinAnimation();
    }
    if (likeSound) {
      likeSound.currentTime = 0;
      likeSound.play();
    }
  });

  randomBtn.addEventListener('click', () => {
    if (!showingRandom) {
      randomIndex = 0;
      displayRandomFact(randomIndex);
      return;
    }
    randomIndex++;
    if (randomIndex >= randomOrder.length) {
      showToast("You've seen all the random facts! Reshuffling...");
      randomOrder = shuffleArray([...Array(randomFacts.length).keys()]);
      randomIndex = 0;
    }
    displayRandomFact(randomIndex);
  });

  archiveBtn.addEventListener('click', () => {
    const todayIdx = getTodayFactIndex();
    let html = `<div id="archive-modal-content"><h2>Fact Archive</h2><ul id="archive-list">`;
    facts.forEach((f, i) => {
      const isPast = i < todayIdx;
      html += `<li>
        <span><strong>${f.date}:</strong> ${f.fact}</span>
        <button ${isPast ? '' : 'disabled'} data-archive-idx="${i}">View</button>
      </li>`;
    });
    html += `</ul><button id="close-archive">Close</button></div>`;
    const modal = document.createElement('div');
    modal.id = 'archive-modal';
    modal.innerHTML = html;
    document.body.appendChild(modal);

    modal.querySelectorAll('button[data-archive-idx]').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(btn.getAttribute('data-archive-idx'));
        displayArchiveFact(idx);
        document.body.removeChild(modal);
      };
    });
    modal.querySelector('#close-archive').onclick = () => document.body.removeChild(modal);
    modal.addEventListener('click', e => {
      if (e.target === modal) document.body.removeChild(modal);
    });
  });

  archiveReturnBtn.addEventListener('click', () => {
    displayFact(getTodayFactIndex());
  });

  messageBtn.addEventListener('click', () => {
    if (messageBtn.disabled) return;
    const factText = document.getElementById('fact-text').textContent;
    if (navigator.share) {
      navigator.share({
        title: "Shark Fact",
        text: factText,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(factText).then(() => {
        showToast("Copied to clipboard!");
      });
    } else {
      alert("Copy this fact:\n\n" + factText);
    }
  });
});