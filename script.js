// Helper function to get today's date as a string in format YYYY-MM-DD
function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// Helper function to get the fact of the day index
function getFactOfTheDayIndex(data) {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dayOfYear % data.length;
}

// Load shark fact for today
function loadSharkFact() {
    fetch('facts.json')
        .then(response => response.json())
        .then(data => {
            const factIndex = getFactOfTheDayIndex(data);
            const factData = data[factIndex];

            // Update the content
            document.getElementById('fact-text').innerText = factData.fact;
            document.getElementById('shark-img').src = `images/${factData.image}`;
            document.getElementById('shark-img').alt = factData.fact;
            
            // Initialize like button state
            initializeLikeButton(factIndex);
        })
        .catch(error => {
            console.log('Error loading the shark facts:', error);
            document.getElementById('fact-text').innerText = 'Could not load shark fact. Please try again later.';
        });
}

// Initialize like button state
function initializeLikeButton(factIndex) {
    const likeButton = document.getElementById('like-btn');
    const likeCountDisplay = document.getElementById('like-count');
    
    // Generate a unique key for today's fact
    const todayKey = `shark-fact-like-${getTodayDateString()}-fact-${factIndex}`;
    
    // Check if user has already liked today's fact
    const hasUserLikedToday = localStorage.getItem(todayKey) === 'true';
    
    // Get the current like count from local storage or default to 0
    let currentLikeCount = parseInt(localStorage.getItem(`${todayKey}-count`) || '0');
    
    // Update the like count display
    likeCountDisplay.innerText = `${currentLikeCount} ${currentLikeCount === 1 ? 'Like' : 'Likes'}`;
    
    // Apply visual state if already liked
    if (hasUserLikedToday) {
        likeButton.classList.add('gold');
        likeButton.disabled = true;
    } else {
        likeButton.classList.remove('gold');
        likeButton.disabled = false;
    }
    
    // Handle like button click
    likeButton.addEventListener('click', () => {
        if (!hasUserLikedToday) {
            // Mark as liked in local storage
            localStorage.setItem(todayKey, 'true');
            
            // Increment the like count
            currentLikeCount++;
            localStorage.setItem(`${todayKey}-count`, currentLikeCount);
            
            // Update UI
            likeCountDisplay.innerText = `${currentLikeCount} ${currentLikeCount === 1 ? 'Like' : 'Likes'}`;
            likeButton.classList.add('gold');
            likeButton.disabled = true;
            
            // Send to server (simulation)
            console.log(`Like registered for fact #${factIndex} on ${getTodayDateString()}`);
            
            // Animation effect
            likeButton.classList.add('liked-animation');
            setTimeout(() => {
                likeButton.classList.remove('liked-animation');
            }, 500);
            
            // For real server implementation:
            // This would be where you'd make an API call to your backend
            // to store the like in a database
            /* 
            fetch('https://your-backend-api.com/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    factIndex: factIndex,
                    date: getTodayDateString()
                })
            })
            .then(response => response.json())
            .then(data => {
                // Update with server data if needed
                likeCountDisplay.innerText = `${data.likeCount} ${data.likeCount === 1 ? 'Like' : 'Likes'}`;
            })
            .catch(error => console.log('Error updating like count:', error));
            */
        }
    });
}

// Handle page load
document.addEventListener('DOMContentLoaded', () => {
    loadSharkFact();
    
    // Add animation class to styles
    const style = document.createElement('style');
    style.textContent = `
        .liked-animation {
            animation: pulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});