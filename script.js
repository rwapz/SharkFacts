// Replace this with fetch if you want to load from file asynchronously
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

// Get today's date in "15th May" format
function getTodayFormattedDate() {
  const d = new Date();
  const day = d.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[d.getMonth()];

  function ordinalSuffix(n) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  return `${day}${ordinalSuffix(day)} ${month}`;
}

// Find today's fact index by matching date string
function getTodayFactIndex() {
  const todayStr = getTodayFormattedDate();
  const idx = facts.findIndex(f => f.date === todayStr);
  if (idx !== -1) return idx;

  // fallback to first fact if no match
  return 0;
}

// Fix min heights to avoid flicker
function fixContainerSize() {
  const imgContainer = document.querySelector('.image-container');
  const factText = document.getElementById('fact-text');

  const maxHeight = Math.max(imgContainer.clientHeight, factText.clientHeight);
  imgContainer.style.minHeight = maxHeight + 'px';
  factText.style.minHeight = maxHeight + 'px';
}

let currentFactIndex = 0;
let likeCount = 0;

function displayFact(index) {
  const factText = document.getElementById('fact-text');
  const sharkImage = document.getElementById('shark-img');
  const factTitle = document.getElementById('fact-title');
  const likeBtn = document.getElementById('like-btn');

  factText.classList.add('fade-out');
  sharkImage.classList.add('fade-out');

  setTimeout(() => {
    const fact = facts[index];
    factText.textContent = fact.fact;
    factTitle.textContent = `Shark Fact for ${fact.date}`;
    sharkImage.src = fact.image;
    sharkImage.alt = fact.fact;

    const factKey = `sharkfact-liked-${index}`;
    likeBtn.disabled = !!localStorage.getItem(factKey);

    fixContainerSize();

    factText.classList.remove('fade-out');
    sharkImage.classList.remove('fade-out');

    currentFactIndex = index;
  }, 400);
}

function handleLikeButton() {
  const factKey = `sharkfact-liked-${currentFactIndex}`;
  if (localStorage.getItem(factKey)) return;

  localStorage.setItem(factKey, 'true');
  document.getElementById('like-count').textContent = `Likes: ${++likeCount}`;

  const likeBtn = document.getElementById('like-btn');
  likeBtn.classList.add('liked-animation');
  likeBtn.disabled = true;

  setTimeout(() => likeBtn.classList.remove('liked-animation'), 500);
}

// Initialize fact on page load
currentFactIndex = getTodayFactIndex();
displayFact(currentFactIndex);

document.getElementById('like-btn').addEventListener('click', handleLikeButton);

// Console command to go to next fact
window.nextFact = function() {
  const nextIndex = (currentFactIndex + 1) % facts.length;
  displayFact(nextIndex);
  console.log(`Displayed fact for ${facts[nextIndex].date}`);
};
