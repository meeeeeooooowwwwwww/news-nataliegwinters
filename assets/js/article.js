function generateSlug(title) {
    console.log('Generating slug for title:', title);
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    console.log('Generated slug:', slug);
    return slug;
}

function getArticleId() {
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.log('Current hostname:', window.location.hostname);

    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');
    if (queryId) {
        console.log('Query ID found:', queryId);
        return decodeURIComponent(queryId);
    }

    const pathname = window.location.pathname;
    console.log('Attempting to match pathname:', pathname);
    const match = pathname.match(/\/(warroom-articles|article)\/(.+)/);
    if (match) {
        console.log('Matched path parts:', match);
        console.log('Using slug from URL:', match[2]);
        return decodeURIComponent(match[2]);
    }

    console.log('No slug found in URL');
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('=== Article.js Started ===');
        console.log('Document location:', document.location.href);
        
        const articleId = getArticleId();
        console.log('Article ID:', articleId);
        if (!articleId) throw new Error('No article ID found in URL');

        console.log('Fetching articles JSON...');
        const response = await fetch('/warroom-feed.json');
        console.log('Fetch response:', response);
        console.log('Fetch status:', response.status);
        if (!response.ok) throw new Error('Failed to load articles data');
        
        const articles = await response.json();
        console.log('Articles loaded:', articles.length);

        const article = articles.find(a => {
            const articleSlug = generateSlug(a.title);
            console.log('Comparing slugs:', articleSlug, articleId);
            return articleSlug === articleId;
        });
        console.log('Found article:', article ? article.title : 'none');
        if (!article) throw new Error(`Article not found for slug: ${articleId}`);

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
        console.log('Rendering article to element:', articleContent ? 'found' : 'not found');
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
        console.log('Article rendered successfully');

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Error stack:', error.stack);
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