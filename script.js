fetch('facts.json')
  .then(response => response.json())
  .then(data => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 86400000
    );
    const factIndex = (dayOfYear - 1) % data.length;
    const fact = data[factIndex];

    document.getElementById('fact-text').textContent = fact.fact;
    document.getElementById('fact-image').src = `images/${fact.image}`;

    const likeIcon = document.getElementById('like-icon');
    const likeCount = document.getElementById('like-count');
    const storageKey = `likes-day-${dayOfYear}`;

    // Load previous like count
    let count = localStorage.getItem(storageKey) || 0;
    likeCount.textContent = count;

    // Like button
    likeIcon.addEventListener('click', () => {
      if (localStorage.getItem(`liked-${dayOfYear}`)) return;

      count++;
      likeCount.textContent = count;
      localStorage.setItem(storageKey, count);
      localStorage.setItem(`liked-${dayOfYear}`, 'true');

      likeIcon.style.filter = 'hue-rotate(180deg)'; // shark turns goldish
    });
  })
  .catch(error => {
    console.error('Error loading facts:', error);
    document.getElementById('fact-text').textContent = "Couldn't load today's shark fact.";
  });