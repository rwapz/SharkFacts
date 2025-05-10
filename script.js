// Sample facts array with images stored in "images/" folder
const facts = [
    {
        "fact": "The whale shark is the largest fish in the world, growing up to 40 feet long!",
        "image": "images/whale-shark-1.jpg"
    },
    {
        "fact": "Sharks have been around for over 400 million years, long before dinosaurs existed!",
        "image": "images/shark.jpg"
    },
    {
        "fact": "Great white sharks can swim at speeds of up to 25 miles per hour!",
        "image": "images/great-white-shark.jpg"
    },
    {
        "fact": "Hammerhead sharks have 360-degree vision, allowing them to see in almost every direction at once!",
        "image": "images/hammerhead-shark.jpg"
    },
    {
        "fact": "The shortest shark in the world is the dwarf lanternshark, measuring only about 7.9 inches long!",
        "image": "images/dwarf-lantern-shark.jpg"
    },
    {
        "fact": "Sharks don’t have bones; their skeletons are made of cartilage, which is lighter and more flexible.",
        "image": "images/shark-skeleton.jpg"
    },
    {
        "fact": "Mako sharks are the fastest sharks, reaching speeds of 60 miles per hour!",
        "image": "images/mako-shark.jpg"
    },
    {
        "fact": "Sharks can sense an electrical field emitted by their prey, helping them detect animals hiding in the sand!",
        "image": "images/shark-sensing.jpg"
    },
    {
        "fact": "Sharks can go weeks or even months without eating, depending on the species and their environment!",
        "image": "images/shark-hunting.jpg"
    }
];

let currentFactIndex = 0; // Start with the first fact
let likeCount = 0; // Initialize like count

// Function to update the displayed fact and image
function displayFact(index) {
    const factText = document.getElementById('fact-text');
    const sharkImage = document.getElementById('shark-img');
    const factTitle = document.getElementById('fact-title');
    
    // Update the fact text and title
    factText.textContent = facts[index].fact;
    factTitle.textContent = `Shark Fact of the Day`;

    // Update the shark image (with path corrected to the images folder)
    sharkImage.src = facts[index].image;
    sharkImage.style.display = 'block'; // Ensure the image is visible
}

// Function to handle the like button
function handleLikeButton() {
    likeCount++; // Increment the like count
    document.getElementById('like-count').textContent = `Likes: ${likeCount}`; // Update like count on the page
}

// Initial display of the first fact
displayFact(currentFactIndex);

// Event listener for the like button
document.getElementById('like-btn').addEventListener('click', handleLikeButton);

// Next button functionality (testing)
document.getElementById('next-btn').addEventListener('click', () => {
    currentFactIndex = (currentFactIndex + 1) % facts.length; // Cycle through facts
    displayFact(currentFactIndex);
});
