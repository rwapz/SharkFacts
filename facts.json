fetch('json/facts.json')
  .then(response => response.json())
  .then(data => {
    const today = new Date();
    const dayNumber = (today.getDate() % data.length) || 1;
    const factToday = data.find(item => item.day === dayNumber);

    document.getElementById("fact-text").textContent = factToday.fact;
    document.getElementById("fact-image").src = `images/${factToday.image}`;

    // Like button setup
    const likeButton = document.getElementById("like-button");
    const likeCount = document.getElementById("like-count");
    let count = localStorage.getItem(`likes-${today.getDate()}`) || 0;
    likeCount.textContent = count;

    likeButton.addEventListener("click", () => {
      if (localStorage.getItem(`liked-${today.getDate()}`)) return;
      count++;
      likeCount.textContent = count;
      localStorage.setItem(`likes-${today.getDate()}`, count);
      localStorage.setItem(`liked-${today.getDate()}`, true);
      likeButton.style.color = "gold";
    });

  })
  .catch(error => {
    document.getElementById("fact-text").textContent = "Couldn't load today's shark fact. Please try again later!";
    console.error("Error loading facts:", error);
  });