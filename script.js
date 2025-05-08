// Shark Fact of the Day
let facts = [
  "Did you know that whale sharks are the largest shark species, growing up to 18 meters (59 feet)?",
  "Sharks have been around for over 400 million years, even before the dinosaurs!",
  "Hammerhead sharks have unique head shapes that help them pin down stingrays.",
  "The Greenland shark is the longest-living vertebrate, living up to 500 years!",
  "Some sharks, like the epaulette shark, can walk on land for short distances in shallow water."
];

let likes = 0;

// Function to show a random shark fact
function showRandomFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  const fact = facts[randomIndex];
  document.getElementById("sharkFact").textContent = fact;
}

// Initializing Shark Fact of the Day
document.getElementById("sharkFact").textContent = facts[0];

// Shark Button Functionality
const sharkButton = document.getElementById('sharkButton');
const counter = document.getElementById('counter');

// Check if the user has already liked the fact
if (localStorage.getItem('sharkLiked') === 'true') {
  sharkButton.classList.add('liked');
}

// Click Event for Shark Button
sharkButton.addEventListener('click', () => {
  likes++;
  counter.textContent = likes;

  // Change button to gold
  sharkButton.classList.add('liked');

  // Store the fact that the user liked it (in localStorage for now)
  localStorage.setItem('sharkLiked', 'true');
});

// Surprise Me Button
const randomFactButton = document.getElementById("randomFactButton");
randomFactButton.addEventListener("click", showRandomFact);

// Social Share Button
const shareButton = document.getElementById("shareButton");
shareButton.addEventListener("click", () => {
  const factToShare = document.getElementById("sharkFact").textContent;
  const shareText = `Check out this cool shark fact: ${factToShare} #SharkFact #Sharks`;
  const shareURL = encodeURIComponent(window.location.href);
  
  window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareURL}`, '_blank');
});
