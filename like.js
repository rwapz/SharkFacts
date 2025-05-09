import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config.js"; // Optional if config is in a separate file

// Initialize Firebase (only if not already initialized elsewhere)
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function initializeLikeButton(factIndex) {
    const likeButton = document.getElementById('like-btn');
    const likeCountDisplay = document.getElementById('like-count');
    const factId = `fact-${factIndex}`; // Unique identifier for the fact
    const likeRef = ref(database, `likes/${factId}`);

    // Fetch current like count from the database
    onValue(likeRef, (snapshot) => {
        const currentLikeCount = snapshot.val() || 0;
        likeCountDisplay.innerText = `${currentLikeCount} ${currentLikeCount === 1 ? 'Like' : 'Likes'}`;
    });

    // Handle like button click
    likeButton.addEventListener('click', () => {
        runTransaction(likeRef, (currentCount) => {
            return (currentCount || 0) + 1;
        });
    });
}

export { initializeLikeButton };
