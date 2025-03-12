document.addEventListener('DOMContentLoaded', function() {
    // Load and display articles from warroom-articles.json
    fetch('warroom-articles.json')
        .then(response => response.json())
        .then(articles => {
            // Display articles logic here
        })
        .catch(error => console.error('Error loading articles:', error));
});
