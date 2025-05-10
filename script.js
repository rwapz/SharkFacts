import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD9DHeQ_oegXfg_doCUDT2ASd2xkJrti48",
  authDomain: "shark-facts.firebaseapp.com",
  databaseURL: "https://shark-facts-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shark-facts",
  storageBucket: "shark-facts.appspot.com",
  messagingSenderId: "252033399358",
  appId: "1:252033399358:web:17e7265cc8be27456aaf6f",
  measurementId: "G-N0FHSQL3XF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const factText = document.getElementById("fact-text");
const sharkImg = document.getElementById("shark-img");
const likeBtn = document.getElementById("like-btn");
const likeCount = document.getElementById("like-count");

// Fetch facts
fetch("facts.json")
  .then(res => res.json())
  .then(facts => {
    const today = new Date();
    const dayIndex = today.getDate() % facts.length;
    const fact = facts[dayIndex];
    const factId = fact.id;

    factText.textContent = fact.text;
    sharkImg.src = fact.image;
    sharkImg.alt = "Image of a shark";

    const likeRef = ref(db, `likes/${factId}`);

    // Display current likes
    onValue(likeRef, snapshot => {
      likeCount.textContent = `${snapshot.val() || 0} Likes`;
    });

    likeBtn.addEventListener("click", () => {
      // Like logic (adds 1 like if allowed by rules)
      get(likeRef).then(snapshot => {
        const current = snapshot.val() || 0;
        const newCount = current + 1;
        set(likeRef, newCount);
        likeBtn.classList.add("liked-animation");
        setTimeout(() => likeBtn.classList.remove("liked-animation"), 500);
      });
    });
  })
  .catch(err => {
    factText.textContent = "Failed to load shark fact.";
    console.error(err);
  });
