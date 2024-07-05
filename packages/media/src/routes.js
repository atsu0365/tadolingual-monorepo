const { generateSitemap } = require('./utils/sitemap');

function setupRoutes(app, cms) {
  app.get('/', (req, res) => {
    res.render('index', { title: '英語多読マスター' });
  });

  app.get('/articles', async (req, res) => {
    try {
      const articles = await cms.getAllArticles();
      res.render('articles', { articles });
    } catch (error) {
      res.status(500).send('Error fetching articles');
    }
  });

  app.get('/article/:id', async (req, res) => {
    try {
      const article = await cms.getArticle(req.params.id);
      if (!article) {
        return res.status(404).send('Article not found');
      }
      res.render('article', { article });
    } catch (error) {
      res.status(500).send('Error fetching article');
    }
  });

  app.get('/sitemap.xml', async (req, res) => {
    try {
      const sitemap = await generateSitemap(cms);
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).send('Error generating sitemap');
    }
  });

  // 管理用ルート
  app.post('/admin/article', async (req, res) => {
    try {
      const newArticle = await cms.createArticle(req.body);
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(500).json({ error: 'Error creating article' });
    }
  });
}

module.exports = setupRoutes;