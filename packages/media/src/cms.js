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

    async createArticle(data) {
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
          const result = await db.collection('articles').insertOne(article);
          console.log('Article created:', result.insertedId);
          return { id: result.insertedId, ...article };
        } catch (error) {
          console.error('Error in createArticle:', error);
          throw error;
        }
      }

      async getArticle(id) {
        try {
          const db = getDB();
          console.log('Fetching article from DB with id:', id);
          const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });
          console.log('Article from DB:', article);
          return article;
        } catch (error) {
          console.error('Error in getArticle:', error);
          throw error;
        }
      }

    async updateArticle(id, data) {
        try {
            const db = getDB();
            const result = await db.collection('articles').updateOne(
                { _id: new ObjectId(id) },
                { $set: { ...this.sanitizeArticleData(data), updatedAt: new Date() } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    }

    async deleteArticle(id) {
        try {
            const db = getDB();
            const result = await db.collection('articles').deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
        }
    }

    async getAllArticles(page = 1, limit = 10) {
        try {
          const db = getDB();
          console.log('Getting DB connection'); // デバッグログ
          const skip = (page - 1) * limit;
          const articles = await db.collection('articles')
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
          console.log('Articles found:', articles); // デバッグログ
          return articles;
        } catch (error) {
          console.error('Error getting all articles:', error);
          throw error;
        }
      }

    async getArticlesByCategory(category, page = 1, limit = 10) {
        try {
            const db = getDB();
            const skip = (page - 1) * limit;
            return await db.collection('articles')
                .find({ category: this.sanitizeInput(category) })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error getting articles by category:', error);
            throw error;
        }
    }

    async updateSeoMetadata(id, seoData) {
        return this.updateArticle(id, this.sanitizeArticleData(seoData));
    }

    async getArticleSeoScore(id) {
        try {
            const article = await this.getArticle(id);
            return article ? this.calculateSeoScore(article) : 0;
        } catch (error) {
            console.error('Error getting article SEO score:', error);
            throw error;
        }
    }

    calculateSeoScore(article) {
        let score = 0;
        if (article.metaTitle && article.metaTitle.length <= 60) score += 20;
        if (article.metaDescription && article.metaDescription.length <= 160) score += 20;
        if (article.slug) score += 20;
        if (article.canonicalUrl) score += 20;
        if (article.content.includes(article.focusKeyword)) score += 20;
        return score;
    }

    async getSeoRecommendations(id) {
        try {
            const article = await this.getArticle(id);
            if (!article) return [];

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
        } catch (error) {
            console.error('Error getting SEO recommendations:', error);
            throw error;
        }
    }

    async generateWebPage(id) {
        try {
            const article = await this.getArticle(id);
            if (!article) return null;

            const template = await fs.readFile(path.join(__dirname, '../templates/article.ejs'), 'utf-8');
            const html = ejs.render(template, article);

            const publicDir = path.join(__dirname, '../public');
            const outputPath = path.join(publicDir, `${article.slug}.html`);

            await fs.mkdir(publicDir, { recursive: true });
            await fs.writeFile(outputPath, html);

            return outputPath;
        } catch (error) {
            console.error('Error generating web page:', error);
            throw error;
        }
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

    async getTotalArticlesCount() {
        try {
            const db = getDB();
            return await db.collection('articles').countDocuments();
        } catch (error) {
            console.error('Error getting total articles count:', error);
            throw error;
        }
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