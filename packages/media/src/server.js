var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config(); // 環境変数の読み込み
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { connectDB } = require('./db');
const CMS = require('./cms');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const app = express();
const cms = new CMS();
app.use(helmet()); // セキュリティヘッダーの追加
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
// グローバルメタデータ
app.use((req, res, next) => {
    res.locals.siteName = process.env.SITE_NAME || '英語多読マスター';
    res.locals.siteDescription = process.env.SITE_DESCRIPTION || '英語多読の効果的な方法と教材を紹介するサイト';
    res.locals.siteUrl = process.env.SITE_URL || 'https://your-domain.com/';
    next();
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectDB();
            console.log('Connected to MongoDB');
            // ホームページ
            app.get('/', (req, res) => {
                res.sendFile(path.join(__dirname, '../public/index.html'));
            });
            // 記事一覧のAPI
            app.get('/articles', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const articles = yield cms.getAllArticles();
                    if (req.headers.accept && req.headers.accept.includes('application/json')) {
                        return res.json(articles);
                    }
                    const html = `
          <!DOCTYPE html>
          <html lang="ja">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>記事一覧 - ${res.locals.siteName}</title>
              <link rel="stylesheet" href="/articles-styles.css">
          </head>
          <body>
              <div class="container">
                  <h1>記事一覧</h1>
                  <div class="article-list">
                  ${articles.map(article => `
                      <div class="article-card">
                          <h2 class="article-title">
                          <a href="/article/${article._id.toString()}">${article.title}</a>
                          </h2>
                          <div class="article-meta">
                              <span>著者: ${article.author}</span>
                              <span>カテゴリー: ${article.category}</span>
                          </div>
                          <div class="article-preview">
                              ${article.content.substring(0, 100)}...
                          </div>
                      </div>
                  `).join('')}
                  </div>
              </div>
          </body>
          </html>
        `;
                    res.send(html);
                }
                catch (error) {
                    next(error);
                }
            }));
            // カテゴリーページ
            app.get('/category/:categoryName', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const categoryName = req.params.categoryName;
                    const articles = yield cms.getArticlesByCategory(categoryName);
                    res.send(`カテゴリー: ${categoryName} の記事一覧`);
                }
                catch (error) {
                    next(error);
                }
            }));
            // 個別記事ページ
            app.get('/article/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const article = yield cms.getArticle(req.params.id);
                    if (!article) {
                        return res.status(404).send('記事が見つかりません');
                    }
                    if (req.headers.accept && req.headers.accept.includes('application/json')) {
                        return res.json(article);
                    }
                    const metaDescription = article.content.substring(0, 160).replace(/\n/g, ' ');
                    const ogImage = article.image || `${res.locals.siteUrl}default-og-image.jpg`;
                    const structuredData = {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": article.title,
                        "author": {
                            "@type": "Person",
                            "name": article.author
                        },
                        "datePublished": article.createdAt,
                        "dateModified": article.updatedAt,
                        "description": metaDescription,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `${res.locals.siteUrl}article/${article._id}`
                        }
                    };
                    const html = `
          <!DOCTYPE html>
          <html lang="ja">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${article.title} | ${res.locals.siteName}</title>
              <meta name="description" content="${metaDescription}">
              
              <!-- Open Graph / Facebook -->
              <meta property="og:type" content="article">
              <meta property="og:url" content="${res.locals.siteUrl}article/${article._id}">
              <meta property="og:title" content="${article.title} | ${res.locals.siteName}">
              <meta property="og:description" content="${metaDescription}">
              <meta property="og:image" content="${ogImage}">
    
              <!-- Twitter -->
              <meta property="twitter:card" content="summary_large_image">
              <meta property="twitter:url" content="${res.locals.siteUrl}article/${article._id}">
              <meta property="twitter:title" content="${article.title} | ${res.locals.siteName}">
              <meta property="twitter:description" content="${metaDescription}">
              <meta property="twitter:image" content="${ogImage}">
    
              <link rel="canonical" href="${res.locals.siteUrl}article/${article._id}">
              <link rel="stylesheet" href="/article-styles.css">
              <script type="application/ld+json">
                ${JSON.stringify(structuredData)}
              </script>
          </head>
          <body>
              <article>
                  <h1>${article.title}</h1>
                  <p>著者: ${article.author}</p>
                  <p>カテゴリー: ${article.category}</p>
                  <div>${article.content}</div>
              </article>
          </body>
          </html>
        `;
                    res.send(html);
                }
                catch (error) {
                    next(error);
                }
            }));
            app.get('/sitemap.xml', (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.header('Content-Type', 'application/xml');
                res.header('Content-Encoding', 'gzip');
                try {
                    const smStream = new SitemapStream({ hostname: res.locals.siteUrl });
                    const pipeline = smStream.pipe(createGzip());
                    smStream.write({ url: '/', changefreq: 'daily', priority: 0.7 });
                    smStream.write({ url: '/articles', changefreq: 'daily', priority: 0.7 });
                    const articles = yield cms.getAllArticles();
                    for (const article of articles) {
                        smStream.write({ url: `/article/${article._id}`, changefreq: 'weekly', priority: 0.5 });
                    }
                    smStream.end();
                    const sitemap = yield streamToPromise(pipeline);
                    res.send(sitemap);
                }
                catch (error) {
                    console.error(error);
                    res.status(500).end();
                }
            }));
            // 記事の更新（管理用）
            app.get('/update/:id', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const id = req.params.id;
                    const filePath = yield cms.generateWebPage(id);
                    res.send(`Page updated: ${filePath}`);
                }
                catch (error) {
                    next(error);
                }
            }));
            // 新規記事の作成（管理用）
            app.post('/article', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const newArticle = yield cms.createArticle(req.body);
                    res.status(201).json(newArticle);
                }
                catch (error) {
                    next(error);
                }
            }));
            // ファビコン
            app.get('/favicon.ico', (req, res) => res.status(204));
            // グローバルエラーハンドリング
            app.use((err, req, res, next) => {
                console.error('Unhandled error:', err);
                if (req.headers.accept && req.headers.accept.includes('application/json')) {
                    res.status(500).json({ error: 'Internal Server Error', message: err.message });
                }
                else {
                    res.status(500).send('Something went wrong!');
                }
            });
            const PORT = process.env.PORT || 3000;
            const server = app.listen(PORT, () => {
                const address = server.address();
                const port = typeof address === 'string' ? address : address === null || address === void 0 ? void 0 : address.port;
                console.log(`Server running on port ${port}`);
            });
        }
        catch (error) {
            console.error("Failed to start the server:", error);
            process.exit(1);
        }
    });
}
startServer().catch(error => {
    console.error("Unhandled error during server startup:", error);
    process.exit(1);
});
