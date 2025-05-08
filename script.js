// Fetch the current day's shark fact from the facts.json file
fetch('facts.json')
    .then(response => response.json())
    .then(data => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24); // Calculate day of the year
        const factIndex = dayOfYear % data.length; // Cycle through facts
        const factData = data[factIndex]; // Get the fact for today

        // Update the content
        document.getElementById('fact-text').innerText = factData.fact;
        document.getElementById('shark-img').src = `images/${factData.image}`;
        document.getElementById('shark-img').alt = factData.fact; // Alt text for accessibility
    })
    .catch(error => console.log('Error loading the shark facts:', error));

// Like button functionality
const likeButton = document.getElementById('like-btn');
const likeCountDisplay = document.getElementById('like-count');

// Fetch the global like count from the server
fetch('https://example.com/api/likeCount')
    .then(response => response.json())
    .then(data => {
        likeCountDisplay.innerText = `${data.likeCount} Likes`;
    })
    .catch(error => console.log('Error fetching like count:', error));

// Handle like button click
likeButton.addEventListener('click', () => {
    likeButton.classList.add('gold'); // Turn the button gold
    likeButton.disabled = true; // Disable the button after liking

    // Send the like to the server
    fetch('https://example.com/api/likeCount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: 1 })
    })
        .then(response => response.json())
        .then(data => {
            likeCountDisplay.innerText = `${data.likeCount} Likes`; // Update the global like count
        })
        .catch(error => console.log('Error updating like count:', error));
});