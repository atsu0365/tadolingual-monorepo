var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { generateSitemap } = require('./utils/sitemap');
function setupRoutes(app, cms) {
    app.get('/', (req, res) => {
        res.render('index', { title: '英語多読マスター' });
    });
    app.get('/articles', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const articles = yield cms.getAllArticles();
            res.render('articles', { articles });
        }
        catch (error) {
            res.status(500).send('Error fetching articles');
        }
    }));
    app.get('/article/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const article = yield cms.getArticle(req.params.id);
            if (!article) {
                return res.status(404).send('Article not found');
            }
            res.render('article', { article });
        }
        catch (error) {
            res.status(500).send('Error fetching article');
        }
    }));
    app.get('/sitemap.xml', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const sitemap = yield generateSitemap(cms);
            res.header('Content-Type', 'application/xml');
            res.send(sitemap);
        }
        catch (error) {
            res.status(500).send('Error generating sitemap');
        }
    }));
    // 管理用ルート
    app.post('/admin/article', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newArticle = yield cms.createArticle(req.body);
            res.status(201).json(newArticle);
        }
        catch (error) {
            res.status(500).json({ error: 'Error creating article' });
        }
    }));
}
module.exports = setupRoutes;
