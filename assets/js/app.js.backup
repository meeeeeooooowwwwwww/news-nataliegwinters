const router = new Navigo('/', { hash: false });

function renderArticleList(articles) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>War Room Articles</h1>
        <div id="articles-list" class="grid"></div>
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

function renderHomepage() {
    document.getElementById('content').innerHTML = `
        <h1>Welcome to Natalie Winters</h1>
        <p><a href="/warroom-articles">View War Room Articles</a></p>
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
        '/': () => renderHomepage(),
        '/warroom-articles': async () => {
            try {
                const articles = await loadArticles();
                renderArticleList(articles);
            } catch (error) {
                render404();
            }
        },
        '/article/:id': async ({ data }) => {
            try {
                const articles = await loadArticles();
                const article = articles.find(a => a.id === data.id);
                article ? renderArticle(article) : render404();
            } catch (error) {
                render404();
            }
        },
        '/warroom-articles/:slug': async ({ data }) => {
            try {
                const articles = await loadArticles();
                const article = articles.find(a => {
                    const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return slug === data.slug;
                });
                if (article) {
                    router.navigate(`/article/${article.id}`);
                } else {
                    render404();
                }
            } catch (error) {
                render404();
            }
        },
        '*': () => render404()
    })
    .resolve();

document.getElementById('loading').style.display = 'none';