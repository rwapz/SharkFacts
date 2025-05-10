// Import Firebase (ESM style)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get, set, increment, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elements
const factText = document.getElementById("fact-text");
const sharkImg = document.getElementById("shark-img");
const likeBtn = document.getElementById("like-btn");
const likeCount = document.getElementById("like-count");

// Current fact key (you can change this dynamically later)
const factKey = "whale-shark-1";

// Load fact and image
async function loadFact() {
  const factRef = ref(database, `facts/${factKey}`);
  const snapshot = await get(factRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    factText.textContent = data.text;
    sharkImg.src = "images/" + data.image;
    sharkImg.alt = "Image of shark: " + factKey;
  } else {
    factText.textContent = "No fact available.";
  }

  // Show real-time like count
  const likeRef = ref(database, `likes/${factKey}`);
  onValue(likeRef, (snapshot) => {
    const count = snapshot.val() ?? 0;
    likeCount.textContent = count;
  });
}

// Handle like button click
likeBtn.addEventListener("click", async () => {
  const likeRef = ref(database, `likes/${factKey}`);
  await set(likeRef, increment(1));
  likeBtn.classList.add("liked-animation");
  setTimeout(() => likeBtn.classList.remove("liked-animation"), 500);
});

// Start app
loadFact();
