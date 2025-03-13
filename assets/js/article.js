function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function getArticleId() {
    // Check for query parameter first (development)
    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');
    if (queryId) {
        console.log('Found article ID from query parameter:', queryId);
        return decodeURIComponent(queryId);
    }

    // Check for clean URL format (production)
    const pathname = window.location.pathname;
    console.log('Current pathname:', pathname);
    
    // Match /warroom-articles/[slug] or /article/[slug]
    const match = pathname.match(/\/(warroom-articles|article)\/(.+)/);
    if (match) {
        console.log('Found article ID from URL:', match[2]);
        return decodeURIComponent(match[2]);
    }

    // Fallback: If only /article, log and return null
    if (pathname === '/article') {
        console.log('URL is /article with no slug, likely a redirect issue');
        return null;
    }
    
    console.log('No article ID found in URL or query parameters');
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const articleId = getArticleId();
        console.log('Extracted articleId:', articleId);
        
        if (!articleId) {
            throw new Error('Article not found - no valid ID extracted');
        }

        // Load the articles JSON
        const response = await fetch('/warroom-articles.json');
        console.log('JSON fetch status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to load articles data');
        }
        
        const articles = await response.json();
        console.log('Loaded articles count:', articles.length);

        // Find the article by matching its slug with the URL slug
        const article = articles.find(a => generateSlug(a.title) === articleId);
        console.log('Matched article:', article ? article.title : 'none');
        
        if (!article) {
            throw new Error(`Article not found for slug: ${articleId}`);
        }

        // Format the date
        const date = new Date(article.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update the page title
        document.title = `${article.title} - Natalie Winters`;
        
        // Update the meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = article.excerpt || article.content.substring(0, 150);
        }

        // Render the article
        const articleContent = document.getElementById('article-content');
        articleContent.innerHTML = `
            <div class="article-header">
                <h2>${article.title}</h2>
                <div class="article-date">${date}</div>
            </div>
            <div class="article-body">
                ${article.content}
            </div>
            <a href="/warroom-articles.html" class="back-to-articles"><em>→</em> Back to Articles</a>
        `;

    } catch (error) {
        console.error('Error loading article:', error.message);
        const articleContent = document.getElementById('article-content');
        articleContent.innerHTML = `
            <div class="error">
                <h2>Article Not Found</h2>
                <p>${error.message}</p>
                <a href="/warroom-articles.html" class="back-to-articles"><em>→</em> Back to Articles</a>
            </div>
        `;
    }
}); 