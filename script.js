// Example fact + image data
const facts = [
  { fact: "Whale sharks are the largest sharks and can grow up to 18 meters long!", image: "images/1_whale_shark.jpg" },
  { fact: "Greenland sharks can live over 400 years, making them the longest-living vertebrates.", image: "images/2_greenland_shark.jpg" },
  { fact: "Hammerhead sharks use their wide heads to improve their vision and pin down stingrays.", image: "images/3_hammerhead.jpg" }
];

// Pick a fact by day number
const today = new Date();
const index = today.getDate() % facts.length;
const factToday = facts[index];

// Load fact and image
document.getElementById("fact-text").textContent = factToday.fact;
document.getElementById("fact-image").src = factToday.image;

// Like button count (localStorage demo)
const likeButton = document.getElementById("like-button");
const likeCount = document.getElementById("like-count");
let count = localStorage.getItem(`likes-${today.getDate()}`) || 0;
likeCount.textContent = count;

likeButton.addEventListener("click", () => {
  if (localStorage.getItem(`liked-${today.getDate()}`)) return; // Only like once per day
  count++;
  likeCount.textContent = count;
  localStorage.setItem(`likes-${today.getDate()}`, count);
  localStorage.setItem(`liked-${today.getDate()}`, true);
  likeButton.style.color = "gold";
});