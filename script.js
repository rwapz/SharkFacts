// Fetch facts from JSON and display the current day's fact
fetch('facts.json')
    .then(response => response.json())
    .then(data => {
        const day = new Date().getDate();  // Get the current day of the month
        const sharkFact = data.find(fact => fact.day === day);
        if (sharkFact) {
            displayFact(sharkFact);
        } else {
            displayFact(data[0]);  // Fallback to the first fact
        }
    });

function displayFact(fact) {
    const factText = document.getElementById('fact-text');
    const sharkImg = document.getElementById('shark-img');
    const likeButton = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');

    factText.textContent = fact.fact;
    sharkImg.src = `images/${fact.image}`;
    sharkImg.alt = fact.image;

    checkUserLike();

    // Initialize like button functionality
    likeButton.addEventListener('click', () => {
        let currentLikes = parseInt(likeCount.textContent) || 0;
        currentLikes++;
        likeCount.textContent = `${currentLikes} Likes`;
        localStorage.setItem('likedDay', new Date().getDate());  // Store user's like status
        likeButton.disabled = true;  // Disable button after click
    });
}

function checkUserLike() {
    let likedToday = localStorage.getItem('likedDay');
    if (likedToday == new Date().getDate()) {
        document.getElementById('like-btn').disabled = true;  // Disable if liked today
    }
}