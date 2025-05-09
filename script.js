// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, set, update } from "firebase/database";

// Your Firebase config (use your actual config)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Fetch shark facts and likes
function loadSharkFact() {
    const factRef = ref(db, 'facts');
    const likesRef = ref(db, 'likes');

    // Get data from Firebase
    get(factRef).then((factSnapshot) => {
        get(likesRef).then((likesSnapshot) => {
            if (factSnapshot.exists() && likesSnapshot.exists()) {
                const facts = factSnapshot.val();
                const likes = likesSnapshot.val();

                const factIndex = getFactOfTheDayIndex(facts);
                const factData = facts[factIndex];
                const likeCount = likes[factIndex];

                // Update the content
                document.getElementById('fact-text').innerText = factData.fact;
                const sharkImg = document.getElementById('shark-img');
                sharkImg.src = `images/${factData.image}`;
                sharkImg.alt = factData.fact;
                sharkImg.style.display = 'block'; // Show the image
                document.getElementById('like-count').innerText = likeCount;

                // Update the like button state
                const likeButton = document.getElementById('like-btn');
                likeButton.disabled = false; // Enable like button
                likeButton.onclick = () => handleLike(factIndex, likes);
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });
}

// Helper function to get the fact of the day index
function getFactOfTheDayIndex(facts) {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dayOfYear % Object.keys(facts).length;
}

// Handle like button click
function handleLike(factIndex, likes) {
    const newLikes = likes[factIndex] + 1; // Increment like count
    const likesRef = ref(db, 'likes/' + factIndex);

    // Update likes in Firebase
    update(likesRef, newLikes).then(() => {
        document.getElementById('like-count').innerText = newLikes;
        document.getElementById('like-btn').classList.add('gold'); // Change button to gold after like
    }).catch((error) => {
        console.error("Error updating likes:", error);
    });
}

// Load the shark fact when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSharkFact();
});
