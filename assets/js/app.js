const router = new Navigo('/', { hash: false });

function renderArticleList(articles) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>War Room Articles</h1>
        <div id="articles-list"></div>
    `;
    const list = document.getElementById('articles-list');
    articles.slice(0, 9).forEach(article => {
        list.innerHTML += `
            <div class="article-card">
                <h3><a href="/article/${article.id}">${article.title}</a></h3>
                <div class="date">${article.date}</div>
                <p>${article.content.substring(0, 150)}...</p>
                <a href="/article/${article.id}" class="read-more">read more →</a>
            </div>
        `;
    });
}

function renderArticle(article) {
    document.getElementById('content').innerHTML = `
        <article id="main">
            <h1>${article.title}</h1>
            <div class="date">${article.date}</div>
            <p>${article.content}</p>
            <a href="/warroom-articles">Back to Articles</a>
        </article>
    `;
}

function render404() {
    document.getElementById('content').innerHTML = `
        <h2>404 - Not Found</h2>
        <p>The requested page or article could not be found.</p>
        <a href="/warroom-articles">Back to Articles</a>
    `;
}

let articlesData = null;

async function loadArticles() {
    if (!articlesData) {
        const response = await fetch('/warroom-feed.json');
        if (!response.ok) throw new Error('Failed to load articles');
        articlesData = await response.json();
    }
    return articlesData;
}

router
    .on({
        '/warroom-articles': async () => {
            const articles = await loadArticles();
            renderArticleList(articles);
        },
        '/article/:id': async ({ data }) => {
            const articles = await loadArticles();
            const article = articles.find(a => a.id === data.id);
            if (article) {
                renderArticle(article);
            } else {
                render404();
            }
        },
        '*': () => {
            // Default route (e.g., homepage)
            document.getElementById('content').innerHTML = '<h1>Welcome</h1><p><a href="/warroom-articles">View Articles</a></p>';
        }
    })
    .resolve(); 