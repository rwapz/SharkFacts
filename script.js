const facts = [
  {
    fact: "The whale shark is the largest fish in the world, growing up to 40 feet long!",
    image: "images/whale-shark-1.jpg"
  },
  {
    fact: "Sharks have been around for over 400 million years, long before dinosaurs existed!",
    image: "images/shark.jpg"
  },
  {
    fact: "Great white sharks can swim at speeds of up to 25 miles per hour!",
    image: "images/great-white-shark.jpg"
  },
  {
    fact: "Hammerhead sharks have 360-degree vision, allowing them to see in almost every direction at once!",
    image: "images/hammerhead-shark.jpg"
  },
  {
    fact: "The shortest shark in the world is the dwarf lanternshark, measuring only about 7.9 inches long!",
    image: "images/dwarf-lantern-shark.jpg"
  },
  {
    fact: "Sharks don’t have bones; their skeletons are made of cartilage, which is lighter and more flexible.",
    image: "images/shark-skeleton.jpg"
  },
  {
    fact: "Mako sharks are the fastest sharks, reaching speeds of 60 miles per hour!",
    image: "images/mako-shark.jpg"
  },
  {
    fact: "Sharks can sense an electrical field emitted by their prey, helping them detect animals hiding in the sand!",
    image: "images/shark-sensing.jpg"
  },
  {
    fact: "Sharks can go weeks or even months without eating, depending on the species and their environment!",
    image: "images/shark-hunting.jpg"
  }
];

let currentFactIndex = 0;
let likeCount = 0;

function displayFact(index) {
  const factText = document.getElementById('fact-text');
  const sharkImage = document.getElementById('shark-img');
  const factTitle = document.getElementById('fact-title');
  const likeBtn = document.getElementById('like-btn');

  const fact = facts[index];

  factText.textContent = fact.fact;
  factTitle.textContent = `Shark Fact ${index + 1} of ${facts.length}`;
  sharkImage.src = fact.image;
  sharkImage.alt = fact.fact;

  // Reset like state
  const factKey = `sharkfact-liked-${index}`;
  likeCount = 0;
  document.getElementById('like-count').textContent = `Likes: ${likeCount}`;

  if (localStorage.getItem(factKey)) {
    likeBtn.disabled = true;
  } else {
    likeBtn.disabled = false;
  }
}

function handleLikeButton() {
  const factKey = `sharkfact-liked-${currentFactIndex}`;
  if (localStorage.getItem(factKey)) return;

  likeCount++;
  localStorage.setItem(factKey, 'true');

  const likeBtn = document.getElementById('like-btn');
  likeBtn.classList.add('liked-animation');
  likeBtn.disabled = true;

  document.getElementById('like-count').textContent = `Likes: ${likeCount}`;

  // Remove animation class after it runs
  setTimeout(() => {
    likeBtn.classList.remove('liked-animation');
  }, 500);
}

document.getElementById('like-btn').addEventListener('click', handleLikeButton);

document.getElementById('next-btn').addEventListener('click', () => {
  currentFactIndex = (currentFactIndex + 1) % facts.length;
  displayFact(currentFactIndex);
});

displayFact(currentFactIndex);
