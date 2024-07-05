var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const { ObjectId } = require('mongodb');
const { getDB } = require('./db');
class CMS {
    constructor() {
        this.categories = [
            '多読のコツと方法',
            '多読の効果',
            '多読入門',
            '多読の教材'
        ];
    }
    createArticle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating article with data:', data);
            try {
                const db = getDB();
                // データのバリデーションを追加
                if (!data.title || !data.content || !data.author || !data.category) {
                    throw new Error('Missing required fields');
                }
                const article = {
                    title: this.sanitizeInput(data.title),
                    content: this.sanitizeInput(data.content),
                    author: this.sanitizeInput(data.author),
                    category: this.sanitizeInput(data.category),
                    image: this.sanitizeInput(data.image),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    slug: this.generateSlug(data.title)
                };
                const result = yield db.collection('articles').insertOne(article);
                console.log('Article created:', result.insertedId);
                return Object.assign({ id: result.insertedId }, article);
            }
            catch (error) {
                console.error('Error in createArticle:', error);
                throw error;
            }
        });
    }
    getArticle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = getDB();
                console.log('Fetching article from DB with id:', id);
                const article = yield db.collection('articles').findOne({ _id: new ObjectId(id) });
                console.log('Article from DB:', article);
                return article;
            }
            catch (error) {
                console.error('Error in getArticle:', error);
                throw error;
            }
        });
    }
    updateArticle(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = getDB();
                const result = yield db.collection('articles').updateOne({ _id: new ObjectId(id) }, { $set: Object.assign(Object.assign({}, this.sanitizeArticleData(data)), { updatedAt: new Date() }) });
                return result.modifiedCount > 0;
            }
            catch (error) {
                console.error('Error updating article:', error);
                throw error;
            }
        });
    }
    deleteArticle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = getDB();
                const result = yield db.collection('articles').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount > 0;
            }
            catch (error) {
                console.error('Error deleting article:', error);
                throw error;
            }
        });
    }
    getAllArticles() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const db = getDB();
                console.log('Getting DB connection'); // デバッグログ
                const skip = (page - 1) * limit;
                const articles = yield db.collection('articles')
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray();
                console.log('Articles found:', articles); // デバッグログ
                return articles;
            }
            catch (error) {
                console.error('Error getting all articles:', error);
                throw error;
            }
        });
    }
    getArticlesByCategory(category_1) {
        return __awaiter(this, arguments, void 0, function* (category, page = 1, limit = 10) {
            try {
                const db = getDB();
                const skip = (page - 1) * limit;
                return yield db.collection('articles')
                    .find({ category: this.sanitizeInput(category) })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray();
            }
            catch (error) {
                console.error('Error getting articles by category:', error);
                throw error;
            }
        });
    }
    updateSeoMetadata(id, seoData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateArticle(id, this.sanitizeArticleData(seoData));
        });
    }
    getArticleSeoScore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.getArticle(id);
                return article ? this.calculateSeoScore(article) : 0;
            }
            catch (error) {
                console.error('Error getting article SEO score:', error);
                throw error;
            }
        });
    }
    calculateSeoScore(article) {
        let score = 0;
        if (article.metaTitle && article.metaTitle.length <= 60)
            score += 20;
        if (article.metaDescription && article.metaDescription.length <= 160)
            score += 20;
        if (article.slug)
            score += 20;
        if (article.canonicalUrl)
            score += 20;
        if (article.content.includes(article.focusKeyword))
            score += 20;
        return score;
    }
    getSeoRecommendations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.getArticle(id);
                if (!article)
                    return [];
                const recommendations = [];
                if (!article.metaTitle || article.metaTitle.length > 60) {
                    recommendations.push('メタタイトルを60文字以内で設定してください。');
                }
                if (!article.metaDescription || article.metaDescription.length > 160) {
                    recommendations.push('メタディスクリプションを160文字以内で設定してください。');
                }
                if (!article.slug) {
                    recommendations.push('URLスラッグを設定してください。');
                }
                if (!article.canonicalUrl) {
                    recommendations.push('正規URLを設定してください。');
                }
                if (!article.content.includes(article.focusKeyword)) {
                    recommendations.push('本文内に注目キーワードを含めてください。');
                }
                return recommendations;
            }
            catch (error) {
                console.error('Error getting SEO recommendations:', error);
                throw error;
            }
        });
    }
    generateWebPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.getArticle(id);
                if (!article)
                    return null;
                const template = yield fs.readFile(path.join(__dirname, '../templates/article.ejs'), 'utf-8');
                const html = ejs.render(template, article);
                const publicDir = path.join(__dirname, '../public');
                const outputPath = path.join(publicDir, `${article.slug}.html`);
                yield fs.mkdir(publicDir, { recursive: true });
                yield fs.writeFile(outputPath, html);
                return outputPath;
            }
            catch (error) {
                console.error('Error generating web page:', error);
                throw error;
            }
        });
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    getAllCategories() {
        return this.categories;
    }
    getTotalArticlesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = getDB();
                return yield db.collection('articles').countDocuments();
            }
            catch (error) {
                console.error('Error getting total articles count:', error);
                throw error;
            }
        });
    }
    sanitizeInput(input) {
        // 簡単なサニタイズの例。実際のプロジェクトではより堅牢な実装が必要です。
        return input.replace(/[<>]/g, '');
    }
    sanitizeArticleData(data) {
        const sanitizedData = {};
        for (const [key, value] of Object.entries(data)) {
            sanitizedData[key] = this.sanitizeInput(value);
        }
        return sanitizedData;
    }
}
module.exports = CMS;
