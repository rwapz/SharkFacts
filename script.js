// Fetch the current day's shark fact from the facts.json file
fetch('facts.json')
    .then(response => response.json())
    .then(data => {
        const today = new Date().getDate(); // Get today's date (day of the month)
        const factData = data.find(fact => fact.day === today); // Find today's fact

        // Populate the fact and image
        if (factData) {
            document.getElementById('fact-text').innerText = factData.fact;
            document.getElementById('shark-img').src = `images/${factData.image}`;
        }
    })
    .catch(error => console.log('Error loading the shark facts:', error));

// Set up the like button and counter
const likeButton = document.getElementById('like-btn');
const likeCountDisplay = document.getElementById('like-count');

// Retrieve the like count from localStorage, or set it to 0 if not available
let likeCount = localStorage.getItem('likeCount') ? parseInt(localStorage.getItem('likeCount')) : 0;
likeCountDisplay.innerText = `${likeCount} Likes`;

// Check if the user has already liked today, using localStorage to store the like state
const userLiked = localStorage.getItem('userLikedToday');

if (userLiked) {
    likeButton.disabled = true;
    likeButton.classList.add('gold'); // Make the button gold
} else {
    likeButton.addEventListener('click', () => {
        likeButton.classList.add('gold'); // Turn the button gold
        likeButton.disabled = true; // Disable the button after liking

        // Increment the like count and update the display
        likeCount++;
        likeCountDisplay.innerText = `${likeCount} Likes`;

        // Save the new like count to localStorage
        localStorage.setItem('likeCount', likeCount);

        // Mark the user as having liked today (to prevent them from liking again)
        localStorage.setItem('userLikedToday', 'true');
    });
}