document.addEventListener('DOMContentLoaded', function() {
    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (articleId) {
        // Load and display article content
        fetch(`articles/${articleId}.html`)
            .then(response => response.text())
            .then(content => {
                document.querySelector('#main').innerHTML = content;
            })
            .catch(error => console.error('Error loading article:', error));
    }
});
