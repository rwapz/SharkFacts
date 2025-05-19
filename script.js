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

  let randomFacts = [];
  let randomOrder = [];
  let randomIndex = 0;
  let randomFactsLoaded = false;

  const likeBtn = document.getElementById('like-btn');
  const likeCountSpan = document.getElementById('like-count');
  const likeSound = document.getElementById('like-sound');
  const randomBtn = document.getElementById('random-btn');
  const backBtn = document.getElementById('back-btn');
  const messageBtn = document.getElementById('message-btn');
  const toast = document.getElementById('toast');

  function getTodayFormattedDate() {
    const d = new Date();
    const day = d.getDate();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const month = monthNames[d.getMonth()];
    const suffix = (n) => (n > 3 && n < 21) ? "th" : ["st","nd","rd"][n % 10 - 1] || "th";
    return `${day}${suffix(day)} ${month}`;
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

  function displayFact(index) {
    const fact = facts[index];
    document.getElementById('fact-title').textContent = `Shark Fact for ${fact.date}`;
    document.getElementById('fact-text').textContent = fact.fact;
    const img = document.getElementById('shark-img');
    img.src = fact.image;
    img.alt = fact.fact;

    if (hasLikedToday(index, false)) {
      likeBtn.disabled = true;
      likeBtn.setAttribute('aria-pressed', 'true');
      likeBtn.classList.add('gold');
    } else {
      likeBtn.disabled = false;
      likeBtn.setAttribute('aria-pressed', 'false');
      likeBtn.classList.remove('gold');
    }

    const likes = getLikesCount(index, false);
    likeCountSpan.textContent = `Likes: ${likes}`;
    if (likes > 0) {
      likeCountSpan.classList.remove('invisible');
    } else {
      likeCountSpan.classList.add('invisible');
    }

    messageBtn.disabled = true;
  }

  function displayRandomFact(index) {
    const factText = randomFacts[randomOrder[index]];
    document.getElementById('fact-title').textContent = `Random Shark Fact`;
    document.getElementById('fact-text').textContent = factText;
    const img = document.getElementById('shark-img');
    img.src = "images/random.jpg";
    img.alt = factText;

    if (hasLikedToday(randomOrder[index], true)) {
      likeBtn.disabled = true;
      likeBtn.setAttribute('aria-pressed', 'true');
      likeBtn.classList.add('gold');
    } else {
      likeBtn.disabled = false;
      likeBtn.setAttribute('aria-pressed', 'false');
      likeBtn.classList.remove('gold');
    }

    const likes = getLikesCount(randomOrder[index], true);
    likeCountSpan.textContent = `Likes: ${likes}`;
    if (likes > 0) {
      likeCountSpan.classList.remove('invisible');
    } else {
      likeCountSpan.classList.add('invisible');
    }

    messageBtn.disabled = false;
  }

  // Fisher-Yates shuffle
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let todayIndex = facts.findIndex(f => f.date === getTodayFormattedDate());
  if (todayIndex < 0) todayIndex = 0;
  let currentIndex = todayIndex;
  let showingRandom = false;

  displayFact(todayIndex);

  likeBtn.addEventListener('click', () => {
    if (showingRandom) {
      const idx = randomOrder[randomIndex];
      if (hasLikedToday(idx, true)) return;
      markLikedToday(idx, true);
      let likes = getLikesCount(idx, true);
      likes++;
      setLikesCount(idx, likes, true);
      likeBtn.classList.add('gold');
      likeBtn.disabled = true;
      likeBtn.setAttribute('aria-pressed', 'true');
      likeCountSpan.textContent = `Likes: ${likes}`;
      likeCountSpan.classList.remove('invisible');
    } else {
      if (hasLikedToday(currentIndex, false)) return;
      markLikedToday(currentIndex, false);
      let likes = getLikesCount(currentIndex, false);
      likes++;
      setLikesCount(currentIndex, likes, false);
      likeBtn.classList.add('gold');
      likeBtn.disabled = true;
      likeBtn.setAttribute('aria-pressed', 'true');
      likeCountSpan.textContent = `Likes: ${likes}`;
      likeCountSpan.classList.remove('invisible');
    }
    if (likeSound) {
      likeSound.currentTime = 0;
      likeSound.play();
    }
  });

  randomBtn.addEventListener('click', () => {
    if (!randomFactsLoaded) {
      fetch('random_fact.json')
        .then(res => res.json())
        .then(data => {
          randomFacts = data;
          randomOrder = shuffleArray([...Array(randomFacts.length).keys()]);
          randomIndex = 0;
          randomFactsLoaded = true;
          showingRandom = true;
          displayRandomFact(randomIndex);
          backBtn.style.display = 'inline-block';
          randomBtn.textContent = "Next Random Fact";
        })
        .catch(() => {
          alert("Couldn't load random facts.");
        });
    } else {
      randomIndex++;
      if (randomIndex >= randomOrder.length) {
        showToast("You've seen all the random facts! Reshuffling...");
        randomOrder = shuffleArray([...Array(randomFacts.length).keys()]);
        randomIndex = 0;
      }
      showingRandom = true;
      displayRandomFact(randomIndex);
      backBtn.style.display = 'inline-block';
      randomBtn.textContent = "Next Random Fact";
    }
  });

  backBtn.addEventListener('click', () => {
    showingRandom = false;
    displayFact(todayIndex);
    backBtn.style.display = 'none';
    randomBtn.textContent = "🎲 Random Fact";
  });

  // Share/copy for message button
  messageBtn.addEventListener('click', () => {
    if (messageBtn.disabled) return;
    const factText = document.getElementById('fact-text').textContent;
    if (navigator.share) {
      navigator.share({
        title: "Random Shark Fact",
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