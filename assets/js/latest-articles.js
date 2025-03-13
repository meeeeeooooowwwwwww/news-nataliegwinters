function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load the articles JSON
        const response = await fetch('/warroom-feed.json');
        const articles = await response.json();
        
        // Sort articles by date (newest first) and take the latest 9
        const latestArticles = articles
            .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
            .slice(0, 9);

        // Get the container
        const container = document.getElementById('latest-articles');
        
        if (latestArticles.length === 0) {
            container.innerHTML = '<div class="no-articles">No articles found</div>';
            return;
        }

        // Clear loading message
        container.innerHTML = '';

        // Render each article
        latestArticles.forEach(article => {
            const date = new Date(article.publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const excerpt = article.excerpt || article.content.substring(0, 150) + '...';
            const slug = generateSlug(article.title);
            const articleUrl = `/warroom-articles/${slug}`;

            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.innerHTML = `
                <h3><a href="${articleUrl}">${article.title}</a></h3>
                <div class="date">${date}</div>
                <div class="excerpt">${excerpt}</div>
                <a href="${articleUrl}" class="read-more">Read More <em>→</em></a>
            `;

            container.appendChild(articleCard);
        });

    } catch (error) {
        console.error('Error loading articles:', error);
        const container = document.getElementById('latest-articles');
        container.innerHTML = `
            <div class="error">
                <p>Sorry, we couldn't load the latest articles.</p>
                <p>Please try again later.</p>
            </div>
        `;
    }
}); 