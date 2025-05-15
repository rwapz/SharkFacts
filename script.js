const facts = [
  {
    date: "15th May",
    fact: "The whale shark is the largest fish in the world, growing up to 40 feet long!",
    image: "images/whale-shark-1.jpg"
  },
  {
    date: "16th May",
    fact: "Sharks have been around for over 400 million years, long before dinosaurs existed!",
    image: "images/shark.jpg"
  },
  {
    date: "17th May",
    fact: "Great white sharks can swim at speeds of up to 25 miles per hour!",
    image: "images/great-white-shark.jpg"
  },
  {
    date: "18th May",
    fact: "Hammerhead sharks have 360-degree vision, allowing them to see in almost every direction at once!",
    image: "images/hammerhead-shark.jpg"
  },
  {
    date: "19th May",
    fact: "The shortest shark in the world is the dwarf lanternshark, measuring only about 7.9 inches long!",
    image: "images/dwarf-lantern-shark.jpg"
  },
  {
    date: "20th May",
    fact: "Sharks don’t have bones; their skeletons are made of cartilage, which is lighter and more flexible.",
    image: "images/shark-skeleton.jpg"
  },
  {
    date: "21st May",
    fact: "Mako sharks are the fastest sharks, reaching speeds of 60 miles per hour!",
    image: "images/mako-shark.jpg"
  },
  {
    date: "22nd May",
    fact: "Sharks can sense an electrical field emitted by their prey, helping them detect animals hiding in the sand!",
    image: "images/shark-sensing.jpg"
  },
  {
    date: "23rd May",
    fact: "Sharks can go weeks or even months without eating, depending on the species and their environment!",
    image: "images/shark-hunting.jpg"
  }
];

const randomFacts = [
  "Sharks have multiple rows of teeth and can lose thousands in their lifetime.",
  "Some sharks glow in the dark using biofluorescence.",
  "The Greenland shark can live up to 400 years!"
];

const likeSound = document.getElementById('like-sound');
const modal = document.getElementById('random-fact-modal');
const modalText = document.getElementById('random-fact-text');
const modalCloseBtn = document.getElementById('modal-close-btn');
const likeBtn = document.getElementById('like-btn');
const randomBtn = document.getElementById('random-btn');

let currentFactIndex = 0;
let likeCount = 0;
let lastRandomIndex = -1;

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

function getTodayFactIndex() {
  const todayStr = getTodayFormattedDate();
  const idx = facts.findIndex(f => f.date === todayStr);
  return idx !== -1 ? idx : 0;
}

function displayFact(index) {
  const fact = facts[index];
  document.getElementById('fact-title').textContent = `Shark Fact for ${fact.date}`;
  document.getElementById('fact-text').textContent = fact.fact;
  document.getElementById('shark-img').src = fact.image;
  document.getElementById('shark-img').alt = fact.fact;

  likeBtn.disabled = !!localStorage.getItem(`sharkfact-liked-${index}`);
  currentFactIndex = index;

  // Reset image sizing
  document.getElementById('shark-img').style.width = "100%";
  document.getElementById('shark-img').style.height = "auto";
}

function createBubble(parent) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.style.left = `${Math.random() * (parent.clientWidth - 10) + 5}px`;
  parent.appendChild(bubble);
  bubble.addEventListener('animationend', () => bubble.remove());
}

function handleLikeButton() {
  const key = `sharkfact-liked-${currentFactIndex}`;
  if (localStorage.getItem(key)) return;

  localStorage.setItem(key, 'true');
  likeCount++;
  document.getElementById('like-count').textContent = `Likes: ${likeCount}`;

  likeBtn.classList.add('liked-animation');
  likeBtn.disabled = true;

  for (let i = 0; i < 5; i++) createBubble(likeBtn);

  if (likeSound) {
    likeSound.currentTime = 0;
    likeSound.play();
  }

  setTimeout(() => likeBtn.classList.remove('liked-animation'), 500);
}

function openRandomFactModal() {
  let idx;
  do {
    idx = Math.floor(Math.random() * randomFacts.length);
  } while (idx === lastRandomIndex && randomFacts.length > 1);
  lastRandomIndex = idx;

  modalText.textContent = randomFacts[idx];
  modal.classList.remove('hidden');
}

function closeRandomFactModal() {
  modal.classList.add('hidden');
}

// Event Listeners
likeBtn.addEventListener('click', handleLikeButton);
randomBtn.addEventListener('click', openRandomFactModal);
modalCloseBtn.addEventListener('click', closeRandomFactModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeRandomFactModal();
});

// Initialize with today's fact
displayFact(getTodayFactIndex());

// Console helper to test fact by date
window.testFactByDate = (dateString) => {
  const idx = facts.findIndex(f => f.date === dateString.trim());
  if (idx !== -1) {
    displayFact(idx);
    console.log(`✅ Showing fact for ${dateString}`);
  } else {
    console.warn(`⚠️ No fact found for '${dateString}'`);
  }
};

console.log("🦈 Use testFactByDate('15th May') in console to test facts by date.");
console.log("ℹ️ Click the 'Random Fact' button to see a popup with a random fact.");
