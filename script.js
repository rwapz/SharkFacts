fetch('facts.json')
  .then(response => response.json())
  .then(data => {
    const today = new Date();
    const index = today.getDate() % data.length;
    const factData = data[index];

    document.getElementById('fact').textContent = factData.fact;

    if (factData.image) {
      const img = document.getElementById('shark-image');
      img.src = factData.image;
      img.style.display = 'block';
    }
  })
  .catch(error => console.error('Could not load shark facts:', error));
