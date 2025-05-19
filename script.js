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

    if (hasLikedToday(index)) {
      likeBtn.disabled = true;
      likeBtn.setAttribute('aria-pressed', 'true');
      likeBtn.classList.add('gold');
    } else {
      likeBtn.disabled = false;
      likeBtn.setAttribute('aria-pressed', 'false');
      likeBtn.classList.remove('gold');
    }

    const likes = getLikesCount(index);
    if (likes > 0) {
      likeCountSpan.textContent = `Likes: ${likes}`;
      likeCountSpan.style.display = 'inline';
    } else {
      likeCountSpan.style.display = 'none';
    }
  }

  let todayIndex = facts.findIndex(f => f.date === getTodayFormattedDate());
  if (todayIndex < 0) todayIndex = 0;
  displayFact(todayIndex);

  likeBtn.addEventListener('click', () => {
    if (hasLikedToday(todayIndex)) return;
    markLikedToday(todayIndex);
    let likes = getLikesCount(todayIndex);
    likes++;
    setLikesCount(todayIndex, likes);
    likeBtn.classList.add('gold');
    likeBtn.disabled = true;
    likeBtn.setAttribute('aria-pressed', 'true');
    likeCountSpan.textContent = `Likes: ${likes}`;
    likeCountSpan.style.display = 'inline';
    if (likeSound) {
      likeSound.currentTime = 0;
      likeSound.play();
    }
  });
});